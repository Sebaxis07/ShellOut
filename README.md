# Shell Out 📱

Plataforma de comercio electrónico prémium y personalizador interactivo de fundas y carcasas para teléfonos móviles, localizada y adaptada para **Antofagasta, Chile**.

Este proyecto está estructurado como un monorepositorio que integra un frontend interactivo moderno en **React + Vite** y un backend robusto en **Node.js + Express** con soporte para **MongoDB Atlas** (y base de datos en memoria para modo demo).

---

## 🎨 Filosofía de Diseño: Monochrome & High-Contrast

Shell Out sigue un lenguaje estético de diseño minimalista de alto contraste (blanco y negro), con tipografías prémium (`Outfit` para encabezados e `Inter` para cuerpo de texto) y micro-animaciones fluidas diseñadas para ofrecer una experiencia de usuario extremadamente premium.

---

## ✨ Características Principales

### 👤 Módulo del Cliente / Comprador
- **Personalizador en Tiempo Real**: Elige el modelo de tu teléfono, selecciona materiales de acabado (Charcoal Matte Black, Pearl White, o Ultra Clear MagSafe) y visualiza el diseño de forma dinámica e interactiva.
- **Carrito de Compra Dinámico**: Gestión fluida de ítems, cálculo de subtotales y aplicación de cupones de descuento válidos.
- **Club de Fidelización (ShellPoints)**: Acumula 10 puntos por cada $1.000 gastados. Canjea tus puntos por cupones de descuento exclusivos (`$3.000` y `$5.000` CLP).
- **Verificación de Cuenta**: Sistema de seguridad que requiere verificar tu correo electrónico para poder canjear puntos de fidelidad.
- **Historial de Pedidos Realista**: Consulta el historial de compras y sigue en tiempo real el estado de producción de tus carcasas mediante WebSockets.

### 🛡️ Panel de Administración (Admin Dashboard)
- **Métricas Financieras en Tiempo Real**: Cálculo dinámico de ventas totales, promedio de órdenes y volumen transaccionado sin datos simulados.
- **Gráfico de Tendencia de Ventas**: Renderización interactiva del rendimiento diario de ventas a partir de los datos reales del sistema.
- **Gestión de Inventario y Catálogo**: Añade nuevos diseños y patrones CSS, edita precios, descripciones y categorías en producción.
- **Gestión de Pedidos**: Control de estados de despacho (Recibido, En producción, Despachado, Entregado) con actualizaciones en tiempo real.
- **Control de Fidelidad de Usuarios**: Agrega o descuenta puntos de fidelización a los clientes directamente desde el panel y gestiona roles administrativos de forma segura.

---

## 🛠️ Tecnologías Utilizadas

### Frontend (`/client`)
- **React 19**
- **Vite** (Compilador ultra rápido)
- **Lucide React** (Paquete de iconos minimalistas)
- **Canvas Confetti** (Efectos de celebración premium al realizar compras)
- **Vanilla CSS Custom Variables** (Sistema de temas Claro/Oscuro dinámico)

### Backend (`/server`)
- **Node.js** & **Express**
- **MongoDB** / **Mongoose** (Persistencia de datos)
- **Socket.io** (Actualizaciones de despacho en tiempo real)
- **JWT (JSON Web Tokens)** & **Bcryptjs** (Autenticación y cifrado de contraseñas)
- **Nodemailer** (Notificaciones SMTP de registro y verificación)

---

## 🚀 Instalación y Desarrollo Local

### Requisitos Previos
- Node.js (v18 o superior recomendado)
- MongoDB (Opcional, se usa base de datos en memoria por defecto si no se configura)

### 1. Servidor (Backend)
1. Navega al directorio del servidor:
   ```bash
   cd server
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Copia el archivo de variables de entorno y configúralo:
   ```bash
   cp .env.example .env
   ```
4. Inicia el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

El backend se iniciará en `http://localhost:5000`.

### 2. Cliente (Frontend)
1. Navega al directorio del cliente:
   ```bash
   cd ../client
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo local:
   ```bash
   npm run dev
   ```

El frontend se iniciará en `http://localhost:5173`.

---

## ☁️ Despliegue en Producción (Vercel)

El proyecto incluye la configuración monorepositorio optimizada en el archivo `vercel.json` en la raíz. Para realizar el despliegue a producción de forma automática mediante la consola de Vercel, consulta los detalles y variables de entorno requeridas en la guía:
👉 **[Guía de Despliegue (DEPLOY.md)](./DEPLOY.md)**
