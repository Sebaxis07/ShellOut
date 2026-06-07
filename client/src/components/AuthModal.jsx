import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, ShieldAlert, Key, CheckCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const { login, register, forgotPassword, resetPassword } = useAuth();
  const [activeForm, setActiveForm] = useState('login'); // login, register
  const [forgotStep, setForgotStep] = useState('none'); // none, request, reset
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [forgotEmail, setForgotEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    let result;
    if (activeForm === 'login') {
      result = await login(formData.email, formData.password);
    } else {
      result = await register(formData.name, formData.email, formData.password, formData.role);
    }

    setLoading(false);
    if (result.success) {
      setFormData({ name: '', email: '', password: '', role: 'buyer' });
      onClose();
    } else {
      setErrorMsg(result.error);
    }
  };

  const handleRequestRecovery = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    const result = await forgotPassword(forgotEmail);
    setLoading(false);
    if (result.success) {
      setForgotStep('reset');
    } else {
      setErrorMsg(result.error);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    const result = await resetPassword(forgotEmail, recoveryCode, newPassword);
    setLoading(false);
    if (result.success) {
      setSuccessMsg('Contraseña restablecida con éxito. Ya puedes iniciar sesión.');
      setForgotStep('none');
      setActiveForm('login');
      setForgotEmail('');
      setRecoveryCode('');
      setNewPassword('');
    } else {
      setErrorMsg(result.error);
    }
  };

  const handleSwitchForm = (formType) => {
    setActiveForm(formType);
    setForgotStep('none');
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <>
      {/* Backdrop */}
      <div className="cart-backdrop" onClick={onClose} style={{ zIndex: 1100 }} />

      {/* Modal Card */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: '420px',
        backgroundColor: 'var(--bg-primary)',
        border: '2px solid var(--border-dark)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 1101,
        padding: '36px',
        animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer', border: 'none' }}
          className="btn-icon flex-center"
        >
          <X size={16} />
        </button>

        {/* Form Selection Tabs */}
        {forgotStep === 'none' && (
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', marginBottom: '28px' }}>
            <button
              onClick={() => handleSwitchForm('login')}
              style={{
                flex: 1,
                paddingBottom: '12px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: activeForm === 'login' ? 'var(--text-primary)' : 'var(--text-muted)',
                borderBottom: activeForm === 'login' ? '2px solid var(--border-dark)' : '2px solid transparent',
                cursor: 'pointer'
              }}
            >
              Ingresar
            </button>
            <button
              onClick={() => handleSwitchForm('register')}
              style={{
                flex: 1,
                paddingBottom: '12px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: activeForm === 'register' ? 'var(--text-primary)' : 'var(--text-muted)',
                borderBottom: activeForm === 'register' ? '2px solid var(--border-dark)' : '2px solid transparent',
                cursor: 'pointer'
              }}
            >
              Registrarse
            </button>
          </div>
        )}

        {forgotStep !== 'none' && (
          <div style={{ marginBottom: '24px', textAlign: 'left' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              Recuperar Contraseña
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {forgotStep === 'request' ? 'Ingresa tu correo para recibir un código.' : 'Introduce el código enviado y tu nueva contraseña.'}
            </p>
          </div>
        )}

        {errorMsg && (
          <div style={{
            padding: '12px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-dark)',
            color: 'var(--text-primary)',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <ShieldAlert size={16} /> {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{
            padding: '12px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-dark)',
            color: 'green',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <CheckCircle size={16} /> {successMsg}
          </div>
        )}

        {/* STEP 0: STANDARD LOGIN/REGISTER FORMS */}
        {forgotStep === 'none' && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            
            {activeForm === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px', letterSpacing: '0.05em' }}>
                  NOMBRE COMPLETO
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Martín Vargas"
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px', letterSpacing: '0.05em' }}>
                CORREO ELECTRÓNICO
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="correo@ejemplo.com"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px', letterSpacing: '0.05em' }}>
                CONTRASEÑA
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="******"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            {activeForm === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px', letterSpacing: '0.05em' }}>
                  ROL DE USUARIO (SOLO DEMO)
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="form-input"
                  style={{ fontWeight: 600 }}
                >
                  <option value="buyer">Comprador (Cliente)</option>
                  <option value="admin">Administrador (Gestión)</option>
                </select>
              </div>
            )}

            {activeForm === 'login' && (
              <button 
                type="button" 
                onClick={() => { setForgotStep('request'); setErrorMsg(''); }}
                style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer', alignSelf: 'flex-start', marginTop: '-4px', padding: 0 }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            )}

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', marginTop: '12px', height: '48px' }}
              disabled={loading}
            >
              {loading ? 'Procesando...' : (activeForm === 'login' ? 'Iniciar Sesión' : 'Registrar Cuenta')}
            </button>
          </form>
        )}

        {/* STEP 1: REQUEST PASSWORD CODE (EMAIL) */}
        {forgotStep === 'request' && (
          <form onSubmit={handleRequestRecovery} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
                CORREO ELECTRÓNICO
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <button type="button" className="btn-secondary" onClick={() => setForgotStep('none')} style={{ flex: 1, justifyContent: 'center' }}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 1.5, justifyContent: 'center' }} disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Código'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: ENTER OTP & NEW PASSWORD */}
        {forgotStep === 'reset' && (
          <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
                CÓDIGO DE RECUPERACIÓN (6 DÍGITOS)
              </label>
              <div style={{ position: 'relative' }}>
                <Key size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                  placeholder="123456"
                  className="form-input"
                  style={{ paddingLeft: '38px', letterSpacing: '0.1em', fontWeight: 700 }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
                NUEVA CONTRASEÑA
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nueva contraseña de acceso"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <button type="button" className="btn-secondary" onClick={() => setForgotStep('request')} style={{ flex: 1, justifyContent: 'center' }}>
                Atrás
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 1.5, justifyContent: 'center' }} disabled={loading}>
                {loading ? 'Restableciendo...' : 'Restablecer'}
              </button>
            </div>
          </form>
        )}

      </div>
    </>
  );
}
