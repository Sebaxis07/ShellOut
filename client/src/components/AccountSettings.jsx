import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, ShieldAlert, Mail, Send, Award, User, Sparkles, 
  MapPin, CreditCard, ShoppingBag, Eye, Edit3, Trash2, Calendar, Phone, Globe, Plus 
} from 'lucide-react';

const INITIAL_ADDRESSES = [];

const INITIAL_CARDS = [];

export default function AccountSettings() {
  const { user, updateUser, sendVerificationEmail, verifyCode } = useAuth();
  
  const [activeSubTab, setActiveSubTab] = useState('profile'); // profile, orders, addresses, payments, loyalty_history
  
  // Local storage lists
  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('so_user_addresses');
    return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
  });

  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('so_user_cards');
    return saved ? JSON.parse(saved) : INITIAL_CARDS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('so_user_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('so_user_cards', JSON.stringify(cards));
  }, [cards]);

  // Profile Form States
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [birthdate, setBirthdate] = useState(user?.birthdate || '');
  const [language, setLanguage] = useState(user?.language || 'Español');

  // Address Form States
  const [addrAlias, setAddrAlias] = useState('');
  const [addrName, setAddrName] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  
  // Payment Form States
  const [cardNum, setCardNum] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Verification Code Flow States
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Order Details Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Sync state if user context loads late
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.birthdate) setBirthdate(user.birthdate);
      if (user.language) setLanguage(user.language);
    }
  }, [user]);

  if (!user) {
    return (
      <section className="section">
        <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ color: 'var(--text-muted)' }}>Por favor, inicia sesión para ver la configuración de tu cuenta.</p>
        </div>
      </section>
    );
  }

  // Update profile details
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateUser({
      name,
      email,
      phone,
      birthdate,
      language
    });
    setSuccessMsg('Perfil actualizado correctamente.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Add Address Handler
  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!addrAlias || !addrName || !addrStreet || !addrCity) return;
    
    const newAddr = {
      id: `addr-${Date.now()}`,
      alias: addrAlias,
      name: addrName,
      address: addrStreet,
      city: addrCity,
      isDefault: addresses.length === 0
    };

    setAddresses(prev => [...prev, newAddr]);
    setAddrAlias('');
    setAddrName('');
    setAddrStreet('');
    setAddrCity('');
    setSuccessMsg('Dirección agregada con éxito.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Delete Address Handler
  const handleDeleteAddress = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  // Set default Address
  const setDefaultAddress = (id) => {
    setAddresses(prev => prev.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
  };

  // Add Card Handler
  const handleAddCard = (e) => {
    e.preventDefault();
    if (!cardNum || !cardHolder || !cardExp) return;

    const brand = cardNum.startsWith('4') ? 'Visa' : 'Mastercard';
    const newCard = {
      id: `card-${Date.now()}`,
      brand,
      last4: cardNum.slice(-4),
      holder: cardHolder.toUpperCase(),
      exp: cardExp
    };

    setCards(prev => [...prev, newCard]);
    setCardNum('');
    setCardHolder('');
    setCardExp('');
    setCardCvv('');
    setSuccessMsg('Tarjeta registrada correctamente.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Delete Card Handler
  const handleDeleteCard = (id) => {
    setCards(prev => prev.filter(c => c.id !== id));
  };

  // Verification code triggers
  const handleSendEmail = async () => {
    setErrorMsg('');
    setLoading(true);
    const result = await sendVerificationEmail();
    setLoading(false);
    if (result.success) {
      setCodeSent(true);
    } else {
      setErrorMsg(result.error || 'Error al enviar el código.');
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!code) return;
    setErrorMsg('');
    setLoading(true);
    const result = await verifyCode(code);
    setLoading(false);
    if (!result.success) {
      setErrorMsg(result.error || 'Código de verificación incorrecto.');
    } else {
      setCodeSent(false);
      setCode('');
    }
  };

  // Simulated orders specifically for the logged in user
  const userOrders = [];

  // ShellPoints History
  const pointsHistory = [];

  return (
    <section className="section" style={{ borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge" style={{ marginBottom: '12px' }}>Ajustes del Perfil</span>
          <h2 className="section-title">Mi Cuenta</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Gestiona tus datos personales, direcciones de despacho, métodos de pago y visualiza tus ShellPoints.
          </p>
        </div>

        {/* Form Feedback message */}
        {successMsg && (
          <div style={{
            padding: '12px 20px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-dark)',
            fontWeight: 700,
            fontSize: '0.85rem',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            <CheckCircle2 size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} /> {successMsg}
          </div>
        )}

        <div className="account-settings-grid">
          
          {/* Left Side: Profile Navigation Menu */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            border: '1px solid var(--border-light)',
            padding: '16px',
            backgroundColor: 'var(--bg-secondary)',
            textAlign: 'left'
          }}>
            <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '14px', marginBottom: '14px', textAlign: 'center' }}>
              <div className="flex-center" style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-primary)',
                border: '2px solid var(--border-dark)',
                fontSize: '1.4rem',
                fontWeight: 900,
                margin: '0 auto 10px'
              }}>
                {name ? name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0, 2) : 'SO'}
              </div>
              <h4 style={{ fontWeight: 800, margin: 0, fontSize: '1.05rem' }}>{name}</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>{email}</p>
            </div>

            <button 
              onClick={() => setActiveSubTab('profile')}
              style={{
                width: '100%',
                padding: '12px 16px',
                textAlign: 'left',
                border: 'none',
                backgroundColor: activeSubTab === 'profile' ? 'var(--bg-primary)' : 'transparent',
                fontWeight: activeSubTab === 'profile' ? 800 : 600,
                color: activeSubTab === 'profile' ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <User size={16} /> Perfil y Seguridad
            </button>

            <button 
              onClick={() => setActiveSubTab('orders')}
              style={{
                width: '100%',
                padding: '12px 16px',
                textAlign: 'left',
                border: 'none',
                backgroundColor: activeSubTab === 'orders' ? 'var(--bg-primary)' : 'transparent',
                fontWeight: activeSubTab === 'orders' ? 800 : 600,
                color: activeSubTab === 'orders' ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <ShoppingBag size={16} /> Mis Pedidos
            </button>

            <button 
              onClick={() => setActiveSubTab('addresses')}
              style={{
                width: '100%',
                padding: '12px 16px',
                textAlign: 'left',
                border: 'none',
                backgroundColor: activeSubTab === 'addresses' ? 'var(--bg-primary)' : 'transparent',
                fontWeight: activeSubTab === 'addresses' ? 800 : 600,
                color: activeSubTab === 'addresses' ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <MapPin size={16} /> Direcciones
            </button>

            <button 
              onClick={() => setActiveSubTab('payments')}
              style={{
                width: '100%',
                padding: '12px 16px',
                textAlign: 'left',
                border: 'none',
                backgroundColor: activeSubTab === 'payments' ? 'var(--bg-primary)' : 'transparent',
                fontWeight: activeSubTab === 'payments' ? 800 : 600,
                color: activeSubTab === 'payments' ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <CreditCard size={16} /> Métodos de Pago
            </button>

            <button 
              onClick={() => setActiveSubTab('loyalty_history')}
              style={{
                width: '100%',
                padding: '12px 16px',
                textAlign: 'left',
                border: 'none',
                backgroundColor: activeSubTab === 'loyalty_history' ? 'var(--bg-primary)' : 'transparent',
                fontWeight: activeSubTab === 'loyalty_history' ? 800 : 600,
                color: activeSubTab === 'loyalty_history' ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <Award size={16} /> Historial ShellPoints
            </button>
          </div>

          {/* Right Side: Tab Contents Panel */}
          <div style={{ textAlign: 'left' }}>
            
            {/* SUBTAB 1: PROFILE & ACCOUNT SECURITY */}
            {activeSubTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ border: '2px solid var(--border-dark)', padding: '32px', backgroundColor: 'var(--bg-primary)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '24px' }}>
                    Información de Perfil
                  </h3>
                  
                  <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="grid-cols-2" style={{ gap: '20px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>NOMBRE COMPLETO</label>
                        <div style={{ position: 'relative' }}>
                          <input 
                            type="text" 
                            required 
                            className="form-input" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                          <User size={16} style={{ position: 'absolute', right: '12px', top: '15px', color: 'var(--text-muted)' }} />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>EMAIL</label>
                        <div style={{ position: 'relative' }}>
                          <input 
                            type="email" 
                            required 
                            className="form-input" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <Mail size={16} style={{ position: 'absolute', right: '12px', top: '15px', color: 'var(--text-muted)' }} />
                        </div>
                      </div>
                    </div>

                    <div className="grid-cols-2" style={{ gap: '20px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>TELÉFONO</label>
                        <div style={{ position: 'relative' }}>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                          <Phone size={16} style={{ position: 'absolute', right: '12px', top: '15px', color: 'var(--text-muted)' }} />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>FECHA DE NACIMIENTO</label>
                        <div style={{ position: 'relative' }}>
                          <input 
                            type="date" 
                            className="form-input" 
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                          />
                          <Calendar size={16} style={{ position: 'absolute', right: '12px', top: '15px', color: 'var(--text-muted)' }} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>IDIOMA PREFERIDO</label>
                      <div style={{ position: 'relative' }}>
                        <select 
                          className="form-input"
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          style={{ height: '46px', padding: '0 12px' }}
                        >
                          <option value="Español">Español</option>
                          <option value="English">English</option>
                        </select>
                        <Globe size={16} style={{ position: 'absolute', right: '12px', top: '15px', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                      </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '8px', padding: '12px 24px', width: '200px', justifyContent: 'center' }}>
                      Guardar Cambios
                    </button>
                  </form>
                </div>

                {/* Email Verification Section */}
                <div style={{ border: '1px solid var(--border-light)', padding: '32px', backgroundColor: 'var(--bg-secondary)' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>
                    Verificación de Identidad
                  </h4>

                  {user.isVerified ? (
                    <div style={{
                      padding: '20px',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px'
                    }}>
                      <ShieldCheck size={28} style={{ color: 'green', flexShrink: 0 }} />
                      <div>
                        <h5 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 4px', color: 'green', textTransform: 'uppercase' }}>
                          Identidad Verificada
                        </h5>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                          Tu dirección de correo electrónico ha sido confirmada correctamente. Tienes todos los beneficios de seguridad y canje de ShellPoints desbloqueados.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{
                        padding: '20px',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-light)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px'
                      }}>
                        <ShieldAlert size={28} style={{ color: 'var(--text-primary)', flexShrink: 0 }} />
                        <div>
                          <h5 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 4px', textTransform: 'uppercase' }}>
                            Verificación Pendiente
                          </h5>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                            Por favor verifica tu cuenta para canjear ShellPoints por cupones de descuento válidos.
                          </p>
                        </div>
                      </div>

                      {errorMsg && <p style={{ color: '#d9534f', fontSize: '0.8rem', fontWeight: 700, margin: 0 }}>⚠️ {errorMsg}</p>}

                      {!codeSent ? (
                        <button
                          onClick={handleSendEmail}
                          disabled={loading}
                          className="btn-primary"
                          style={{ width: '100%', justifyContent: 'center' }}
                        >
                          <Send size={16} /> {loading ? 'Enviando...' : 'Enviar Código a mi Correo'}
                        </button>
                      ) : (
                        <form onSubmit={handleVerifySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>CÓDIGO DE 6 DÍGITOS</label>
                            <input
                              type="text"
                              required
                              maxLength={6}
                              placeholder="Ej. 123456"
                              className="form-input"
                              value={code}
                              onChange={(e) => setCode(e.target.value)}
                              style={{ letterSpacing: '0.15em', fontWeight: 700, textAlign: 'center' }}
                            />
                          </div>
                          
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="button" onClick={() => setCodeSent(false)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                              Atrás
                            </button>
                            <button type="submit" className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                              Verificar Código
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SUBTAB 2: ORDER HISTORY */}
            {activeSubTab === 'orders' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px' }}>
                  Mis Compras Realizadas
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {userOrders.map(order => (
                    <div 
                      key={order.id} 
                      style={{
                        padding: '24px',
                        border: '1px solid var(--border-light)',
                        backgroundColor: 'var(--bg-secondary)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                        <div>
                          <span style={{ fontWeight: 800, fontSize: '1rem' }}>#{order.id}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '12px' }}>{order.date}</span>
                        </div>
                        <span style={{
                          padding: '3px 8px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: order.status === 'Entregado' ? '#e2f0d9' : '#fff2cc',
                          color: order.status === 'Entregado' ? '#385723' : '#7f6000',
                          borderRadius: '2px',
                          textTransform: 'uppercase'
                        }}>{order.status}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>{order.items}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>Modelo: {order.details.caseModel}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>${order.total.toLocaleString('es-CL')}</span>
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="btn-secondary"
                            style={{ display: 'block', marginTop: '6px', padding: '6px 12px', fontSize: '0.7rem' }}
                          >
                            <Eye size={12} style={{ marginRight: '4px' }} /> Ver Recibo
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Simulated Receipt Modal */}
                {selectedOrder && (
                  <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 99999
                  }}>
                    <div style={{
                      backgroundColor: 'var(--bg-primary)',
                      border: '2px solid var(--border-dark)',
                      padding: '32px',
                      maxWidth: '440px',
                      width: '100%',
                      margin: '20px',
                      textAlign: 'left'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--border-dark)', paddingBottom: '12px', marginBottom: '20px' }}>
                        <h4 style={{ fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>RECIBO OFICIAL</h4>
                        <span style={{ fontWeight: 700 }}>#{selectedOrder.id}</span>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', marginBottom: '20px' }}>
                        <div><strong>Fecha de Compra:</strong> {selectedOrder.date}</div>
                        <div><strong>Productos:</strong> {selectedOrder.items}</div>
                        <div><strong>Compatibilidad:</strong> {selectedOrder.details.caseModel}</div>
                        <div><strong>Número de Seguimiento:</strong> {selectedOrder.details.tracking}</div>
                        <div><strong>Dirección de Envío:</strong> {selectedOrder.details.shippingTo}</div>
                        <div><strong>Método de Pago:</strong> {selectedOrder.details.payment}</div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 900, borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginBottom: '24px' }}>
                        <span>TOTAL CANCELADO:</span>
                        <span>${selectedOrder.total.toLocaleString('es-CL')} CLP</span>
                      </div>

                      <button 
                        onClick={() => setSelectedOrder(null)}
                        className="btn-primary" 
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        Cerrar Detalle
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBTAB 3: SHIPPING ADDRESSES */}
            {activeSubTab === 'addresses' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>
                    Direcciones de Despacho
                  </h3>

                  {addresses.map(a => (
                    <div 
                      key={a.id}
                      style={{
                        padding: '20px',
                        border: a.isDefault ? '2px solid var(--border-dark)' : '1px solid var(--border-light)',
                        backgroundColor: 'var(--bg-secondary)',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h4 style={{ fontWeight: 800, margin: 0, fontSize: '0.95rem' }}>{a.alias}</h4>
                          {a.isDefault && (
                            <span style={{ fontSize: '0.65rem', padding: '2px 6px', backgroundColor: '#000', color: '#fff', fontWeight: 800, textTransform: 'uppercase' }}>
                              Por defecto
                            </span>
                          )}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {!a.isDefault && (
                            <button 
                              onClick={() => setDefaultAddress(a.id)}
                              style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline', fontWeight: 700 }}
                            >
                              Establecer por defecto
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteAddress(a.id)}
                            style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#d9534f' }}
                            title="Eliminar dirección"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.85rem', margin: 0, fontWeight: 600 }}>{a.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>{a.address}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>{a.city}</p>
                    </div>
                  ))}
                </div>

                {/* Add Address Form */}
                <div style={{ border: '2px solid var(--border-dark)', padding: '24px', backgroundColor: 'var(--bg-primary)' }}>
                  <h4 style={{ fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>Agregar Nueva Dirección</h4>
                  
                  <form onSubmit={handleAddAddress} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="grid-cols-2" style={{ gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: '4px' }}>ALIAS DIRECCIÓN</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="Ej. Casa Playa" 
                          className="form-input"
                          value={addrAlias}
                          onChange={(e) => setAddrAlias(e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: '4px' }}>NOMBRE RECEPTOR</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="Ej. Sebastián V." 
                          className="form-input"
                          value={addrName}
                          onChange={(e) => setAddrName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid-cols-2" style={{ gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: '4px' }}>CALLE Y NÚMERO</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="Ej. Av. Providencia 1234" 
                          className="form-input"
                          value={addrStreet}
                          onChange={(e) => setAddrStreet(e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: '4px' }}>CIUDAD / COMUNA</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="Ej. Av. Grecia, Antofagasta" 
                          className="form-input"
                          value={addrCity}
                          onChange={(e) => setAddrCity(e.target.value)}
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}>
                      <Plus size={16} /> Registrar Dirección
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* SUBTAB 4: PAYMENT METHODS */}
            {activeSubTab === 'payments' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>
                    Métodos de Pago Registrados
                  </h3>

                  {cards.map(c => (
                    <div 
                      key={c.id}
                      style={{
                        padding: '20px',
                        border: '1px solid var(--border-light)',
                        backgroundColor: 'var(--bg-secondary)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="flex-center" style={{
                          width: '56px',
                          height: '36px',
                          backgroundColor: '#000',
                          color: '#fff',
                          fontWeight: 900,
                          fontSize: '0.8rem',
                          borderRadius: '4px',
                          letterSpacing: '0.05em'
                        }}>
                          {c.brand.toUpperCase()}
                        </div>
                        <div>
                          <h4 style={{ fontWeight: 800, margin: 0, fontSize: '0.95rem' }}>{c.brand} terminada en **** {c.last4}</h4>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>Titular: {c.holder} — Vence: {c.exp}</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleDeleteCard(c.id)}
                        style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#d9534f' }}
                        title="Eliminar tarjeta"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Payment Form */}
                <div style={{ border: '2px solid var(--border-dark)', padding: '24px', backgroundColor: 'var(--bg-primary)' }}>
                  <h4 style={{ fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>Agregar Nueva Tarjeta</h4>
                  
                  <form onSubmit={handleAddCard} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: '4px' }}>NÚMERO DE TARJETA</label>
                      <input 
                        type="text" 
                        required 
                        maxLength={16}
                        placeholder="4557 0000 0000 0000" 
                        className="form-input"
                        value={cardNum}
                        onChange={(e) => setCardNum(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: '4px' }}>TITULAR DE LA TARJETA</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Nombre completo impreso en la tarjeta" 
                        className="form-input"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                      />
                    </div>

                    <div className="grid-cols-2" style={{ gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: '4px' }}>FECHA DE VENCIMIENTO</label>
                        <input 
                          type="text" 
                          required 
                          maxLength={5}
                          placeholder="MM/AA" 
                          className="form-input"
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: '4px' }}>CVV / CÓDIGO SEGURIDAD</label>
                        <input 
                          type="password" 
                          required 
                          maxLength={3}
                          placeholder="123" 
                          className="form-input"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}>
                      <Plus size={16} /> Registrar Tarjeta
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* SUBTAB 5: LOYALTY SHELLPOINTS HISTORY */}
            {activeSubTab === 'loyalty_history' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>
                    Historial de ShellPoints
                  </h3>
                  <div style={{
                    padding: '8px 16px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    fontWeight: 900,
                    fontSize: '1.2rem'
                  }}>
                    {user.points || 0} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PTS</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}>
                  {pointsHistory.map((h, index) => (
                    <div 
                      key={h.id}
                      style={{
                        padding: '16px 20px',
                        borderBottom: index === pointsHistory.length - 1 ? 'none' : '1px solid var(--border-light)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <h4 style={{ fontWeight: 700, margin: 0, fontSize: '0.9rem' }}>{h.desc}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{h.date}</span>
                      </div>
                      <span style={{
                        fontWeight: 900,
                        fontSize: '1.05rem',
                        color: h.amount.startsWith('+') ? 'green' : '#d9534f'
                      }}>{h.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
