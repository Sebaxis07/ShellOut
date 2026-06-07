import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

// Mock Users for Offline Demo Mode
const DEFAULT_USERS = [
  { name: 'Admin Shell Out', email: 'admin@shellout.com', role: 'admin', points: 0, isVerified: true }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Helper to trigger toast notifications
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Initialize session from LocalStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('so_token');
    const savedUser = localStorage.getItem('so_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('so_token', data.token);
        localStorage.setItem('so_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        showToast(`¡Bienvenido de nuevo, ${data.user.name}!`);
        return { success: true };
      } else {
        const errData = await response.json();
        return { success: false, error: errData.error || 'Credenciales incorrectas' };
      }
    } catch (apiError) {
      console.warn('⚠️ Servidor no disponible. Usando demo mode local.');
      const matched = DEFAULT_USERS.find(u => u.email === email);
      if (matched) {
        const mockToken = `mock-jwt-token-${Date.now()}`;
        localStorage.setItem('so_token', mockToken);
        localStorage.setItem('so_user', JSON.stringify(matched));
        setToken(mockToken);
        setUser(matched);
        showToast(`¡Conectado (Demo): ${matched.name}!`);
        return { success: true };
      }
      return { success: false, error: 'Usuario no encontrado en modo demo. Registra una cuenta nueva.' };
    }
  };

  const register = async (name, email, password, role = 'buyer') => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('so_token', data.token);
        localStorage.setItem('so_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        showToast(`Cuenta creada: ¡Bienvenido, ${data.user.name}!`);
        return { success: true };
      } else {
        const errData = await response.json();
        return { success: false, error: errData.error || 'Error al registrarse.' };
      }
    } catch (apiError) {
      console.warn('⚠️ Servidor no disponible. Registrando cuenta en demo mode local.');
      const localUser = { name, email, role, points: 100, isVerified: false };
      const mockToken = `mock-jwt-token-${Date.now()}`;
      
      localStorage.setItem('so_token', mockToken);
      localStorage.setItem('so_user', JSON.stringify(localUser));
      setToken(mockToken);
      setUser(localUser);
      showToast(`Cuenta creada (Demo): ¡Bienvenido, ${name}!`);
      return { success: true };
    }
  };

  const logout = () => {
    localStorage.removeItem('so_token');
    localStorage.removeItem('so_user');
    setToken(null);
    setUser(null);
    showToast('Sesión cerrada correctamente.');
  };

  const addPoints = (amount) => {
    if (!user) return;
    const updatedUser = { ...user, points: (user.points || 0) + amount };
    setUser(updatedUser);
    localStorage.setItem('so_user', JSON.stringify(updatedUser));
  };

  const updateUser = (updatedFields) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    localStorage.setItem('so_user', JSON.stringify(updatedUser));
  };

  const sendVerificationEmail = async () => {
    if (!token) return { success: false, error: 'Inicia sesión primero' };
    try {
      const response = await fetch(`${API_URL}/api/auth/send-verification`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        showToast('Código enviado a tu correo electrónico.');
        return { success: true };
      } else {
        const errData = await response.json();
        return { success: false, error: errData.error };
      }
    } catch (apiError) {
      console.warn('⚠️ Servidor no disponible. Enviando código mock en demo mode.');
      showToast('Código enviado al correo (Demo: introduce "123456").');
      return { success: true };
    }
  };

  const verifyCode = async (code) => {
    if (!token) return { success: false, error: 'Inicia sesión primero' };
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-code`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('so_user', JSON.stringify(data.user));
        setUser(data.user);
        showToast('¡Cuenta verificada con éxito! Ahora puedes canjear tus puntos.');
        return { success: true };
      } else {
        const errData = await response.json();
        return { success: false, error: errData.error || 'Código incorrecto.' };
      }
    } catch (apiError) {
      console.warn('⚠️ Servidor no disponible. Validando código en demo mode.');
      if (code === '123456') {
        const updatedUser = { ...user, isVerified: true };
        localStorage.setItem('so_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        showToast('¡Cuenta verificada (Demo)! Puntos desbloqueados.');
        return { success: true };
      }
      return { success: false, error: 'Código incorrecto. En modo Demo, usa "123456".' };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (response.ok) {
        showToast('Código de recuperación enviado al correo.');
        return { success: true };
      } else {
        const errData = await response.json();
        return { success: false, error: errData.error };
      }
    } catch (apiError) {
      console.warn('⚠️ Servidor no disponible. Enviando OTP mock en demo mode.');
      showToast('Código de recuperación enviado (Demo: introduce "123456").');
      return { success: true };
    }
  };

  const resetPassword = async (email, code, newPassword) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      });
      if (response.ok) {
        showToast('Contraseña restablecida con éxito. Ya puedes iniciar sesión.');
        return { success: true };
      } else {
        const errData = await response.json();
        return { success: false, error: errData.error };
      }
    } catch (apiError) {
      console.warn('⚠️ Servidor no disponible. Validando reset en demo mode.');
      if (code === '123456') {
        showToast('Contraseña actualizada (Demo). Ya puedes ingresar.');
        return { success: true };
      }
      return { success: false, error: 'Código incorrecto. En modo Demo, usa "123456".' };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      register, 
      logout, 
      addPoints, 
      updateUser,
      sendVerificationEmail, 
      verifyCode, 
      forgotPassword, 
      resetPassword,
      toast, 
      showToast 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
