import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'casevibe_secret_key_12345';
const MONGO_URI = process.env.MONGO_URI;

// In-Memory Fallback Databases (Demo Mode)
const inMemoryUsers = [
  { 
    id: 'admin-1', 
    name: 'Admin Shell Out', 
    email: 'admin@shellout.com', 
    password: bcrypt.hashSync('123456', 10), 
    points: 0, 
    role: 'admin', 
    isVerified: true 
  },
  { 
    id: 'buyer-1', 
    name: 'Sebas Comprador', 
    email: 'sebas@buyer.com', 
    password: bcrypt.hashSync('123456', 10), 
    points: 350, 
    role: 'buyer', 
    isVerified: true 
  }
];

const inMemoryProducts = [
  { id: 'p1', name: 'Minimal Grid', price: 19990, category: 'Minimalista' },
  { id: 'p2', name: 'Diagonal Wave', price: 21990, category: 'Geométrico' },
  { id: 'p3', name: 'Raw Marble', price: 22990, category: 'Texturas' }
];
const inMemoryOrders = [];
const inMemoryReviews = [];

// Nodemailer SMTP Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'thefilex07@gmail.com',
    pass: process.env.SMTP_PASS || 'ceto gtnz fypq dmtz'
  }
});

const SMTP_FROM = process.env.SMTP_FROM || '"InkFinance" <thefilex07@gmail.com>';

// Database Connection
let isUsingMongoDB = false;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('⚡ Conectado exitosamente a MongoDB');
      isUsingMongoDB = true;
    })
    .catch((err) => {
      console.error('⚠️ Error al conectar a MongoDB, usando almacenamiento en memoria:', err.message);
    });
} else {
  console.log('ℹ️ MONGO_URI no proporcionado. Usando base de datos en memoria (Modo de demostración).');
}

// REST Endpoints
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    database: isUsingMongoDB ? 'MongoDB Atlas' : 'In-Memory (Demo Mode)',
    port: PORT
  });
});

// Middleware de Autenticación (Buenas Prácticas)
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado, falta token' });
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Acceso denegado, se requiere rol de administrador' });
  }
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  // Check if user already exists
  const existing = inMemoryUsers.find(u => u.email === email);
  if (existing) {
    return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === 'admin' ? 'admin' : 'buyer';
    const newUser = { 
      id: `u-${Date.now()}`, 
      name, 
      email, 
      password: hashedPassword, 
      points: userRole === 'admin' ? 0 : 100, 
      role: userRole,
      isVerified: false
    };
    inMemoryUsers.push(newUser);

    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, user: { name, email, points: newUser.points, role: newUser.role, isVerified: newUser.isVerified } });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = inMemoryUsers.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { name: user.name, email: user.email, points: user.points, role: user.role, isVerified: user.isVerified || false } });
});

// Send Verification Code Email
app.post('/api/auth/send-verification', protect, async (req, res) => {
  const user = inMemoryUsers.find(u => u.email === req.user.email);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  // Generate 6-digit verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  user.verificationCode = code;

  const mailOptions = {
    from: SMTP_FROM,
    to: user.email,
    subject: 'Verifica tu cuenta en Shell Out',
    html: `
      <div style="font-family: sans-serif; padding: 30px; border: 1px solid #000; max-width: 480px; margin: 0 auto; color: #000; background-color: #fff;">
        <h2 style="text-transform: uppercase; letter-spacing: 0.1em; font-weight: 900; border-bottom: 2px solid #000; padding-bottom: 12px; margin-top: 0;">SHELL OUT</h2>
        <p style="font-size: 1rem; line-height: 1.5;">Hola, <strong>${user.name}</strong>.</p>
        <p style="font-size: 0.95rem; line-height: 1.5; color: #333;">Para activar completamente tu cuenta y poder canjear tus <strong>ShellPoints</strong> por cupones de descuento, introduce el siguiente código de verificación en tu perfil:</p>
        <div style="font-size: 2.25rem; font-weight: 900; letter-spacing: 0.15em; background-color: #f7f7f7; padding: 20px; text-align: center; margin: 24px 0; border: 1px dashed #000;">
          ${code}
        </div>
        <p style="font-size: 0.8rem; color: #666; border-top: 1px solid #eee; padding-top: 15px;">Si no solicitaste este código, puedes ignorar este correo.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Código de verificación enviado al correo' });
  } catch (error) {
    console.error('Error enviando correo de verificación:', error);
    res.status(500).json({ error: 'Error al enviar el correo electrónico de verificación' });
  }
});

// Verify Code
app.post('/api/auth/verify-code', protect, async (req, res) => {
  const { code } = req.body;
  const user = inMemoryUsers.find(u => u.email === req.user.email);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  if (user.verificationCode && user.verificationCode === code) {
    user.isVerified = true;
    user.verificationCode = null;
    return res.json({ success: true, user: { name: user.name, email: user.email, points: user.points, role: user.role, isVerified: user.isVerified } });
  }

  res.status(400).json({ error: 'Código de verificación incorrecto' });
});

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = inMemoryUsers.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: 'El correo electrónico no está registrado' });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetCode = code;

  const mailOptions = {
    from: SMTP_FROM,
    to: user.email,
    subject: 'Recuperación de contraseña - Shell Out',
    html: `
      <div style="font-family: sans-serif; padding: 30px; border: 1px solid #000; max-width: 480px; margin: 0 auto; color: #000; background-color: #fff;">
        <h2 style="text-transform: uppercase; letter-spacing: 0.1em; font-weight: 900; border-bottom: 2px solid #000; padding-bottom: 12px; margin-top: 0;">SHELL OUT</h2>
        <p style="font-size: 1rem; line-height: 1.5;">Has solicitado recuperar tu contraseña de Shell Out.</p>
        <p style="font-size: 0.95rem; line-height: 1.5; color: #333;">Usa el siguiente código de recuperación temporal para ingresar una nueva contraseña:</p>
        <div style="font-size: 2.25rem; font-weight: 900; letter-spacing: 0.15em; background-color: #f7f7f7; padding: 20px; text-align: center; margin: 24px 0; border: 1px dashed #000;">
          ${code}
        </div>
        <p style="font-size: 0.8rem; color: #666; border-top: 1px solid #eee; padding-top: 15px;">Si no realizaste esta solicitud, puedes ignorar este correo de forma segura.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Código de recuperación enviado' });
  } catch (error) {
    console.error('Error enviando correo de recuperación:', error);
    res.status(500).json({ error: 'Error al enviar el correo electrónico de recuperación' });
  }
});

// Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  const user = inMemoryUsers.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  if (user.resetCode && user.resetCode === code) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetCode = null;
    return res.json({ success: true, message: 'Contraseña actualizada con éxito' });
  }

  res.status(400).json({ error: 'Código de recuperación incorrecto' });
});

// Products Routes
app.get('/api/products', (req, res) => {
  res.json(inMemoryProducts);
});

// Orders Route (Real-Time Notification Demo)
app.post('/api/orders', (req, res) => {
  const { items, totalAmount, shippingAddress } = req.body;
  const newOrder = {
    id: `ord-${Date.now()}`,
    items,
    totalAmount,
    shippingAddress,
    status: 'Recibido',
    createdAt: new Date()
  };

  inMemoryOrders.push(newOrder);

  // Emit event to all connected socket clients (real-time order alert!)
  io.emit('newOrderAlert', {
    orderId: newOrder.id,
    message: `¡Nueva compra recibida! ${items.length} fundas por un total de $${totalAmount.toLocaleString('es-CL')}`
  });

  res.status(201).json({ success: true, order: newOrder });
});

// Reviews Route
app.get('/api/reviews', (req, res) => {
  res.json(inMemoryReviews);
});

app.post('/api/reviews', (req, res) => {
  const { userName, rating, comment, imageUrl } = req.body;
  const newReview = {
    id: `rev-${Date.now()}`,
    userName,
    rating,
    comment,
    imageUrl,
    date: 'Reciente'
  };
  inMemoryReviews.push(newReview);
  res.status(201).json(newReview);
});

// Socket.io Real-time connection handler
io.on('connection', (socket) => {
  console.log(`🔌 Cliente conectado: ${socket.id}`);

  // Simulación de actualizaciones de producción de fundas (cada 30s)
  socket.on('subscribeToOrderStatus', (orderId) => {
    console.log(`🔔 Cliente suscrito al estado del pedido: ${orderId}`);
    
    // Simular fases de producción
    setTimeout(() => {
      socket.emit('orderStatusUpdate', { orderId, status: 'Imprimiendo', desc: 'Tu funda está en la máquina de impresión UV.' });
    }, 5000);

    setTimeout(() => {
      socket.emit('orderStatusUpdate', { orderId, status: 'Empaquetando', desc: 'Estamos preparando tu caja de regalo y empaque.' });
    }, 15000);

    setTimeout(() => {
      socket.emit('orderStatusUpdate', { orderId, status: 'Enviado', desc: 'Tu paquete ha sido retirado por Starken/Chilexpress.' });
    }, 25000);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Cliente desconectado: ${socket.id}`);
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 SERVIDOR CORRIENDO EN EL PUERTO: ${PORT}`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`===================================================`);
});
