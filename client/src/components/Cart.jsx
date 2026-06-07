import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShieldCheck, CheckCircle2, Ticket, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export default function Cart({ isOpen, onClose, cartItems, onUpdateQty, onRemoveItem, couponDiscount, onClearCart }) {
  const { user } = useAuth();
  
  const [checkoutStep, setCheckoutStep] = useState('cart'); // cart, checkout, success
  const [formData, setFormData] = useState({ name: '', email: '', address: '', card: '' });
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [customDiscount, setCustomDiscount] = useState(0);
  const [lastOrderId, setLastOrderId] = useState('SO-59384');

  // Autofill form data if user is logged in
  useEffect(() => {
    if (isOpen && user) {
      const savedAddresses = localStorage.getItem('so_user_addresses');
      const addrList = savedAddresses ? JSON.parse(savedAddresses) : [];
      const defaultAddr = addrList.find(a => a.isDefault) || addrList[0];

      const savedCards = localStorage.getItem('so_user_cards');
      const cardList = savedCards ? JSON.parse(savedCards) : [];
      const defaultCard = cardList[0];

      setFormData({
        name: user.name || '',
        email: user.email || '',
        address: defaultAddr ? `${defaultAddr.address}, ${defaultAddr.city}` : '',
        card: defaultCard ? `**** **** **** ${defaultCard.last4}` : ''
      });
    }
  }, [isOpen, user]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  const discount = couponDiscount > 0 ? couponDiscount : customDiscount;
  const total = Math.max(0, subtotal - discount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const inputCode = couponInput.toUpperCase().trim();
    
    // Load dynamically from admin coupons in localStorage
    const savedCoupons = localStorage.getItem('so_admin_coupons');
    const couponList = savedCoupons ? JSON.parse(savedCoupons) : [
      { code: 'SHELL5K', value: 5000, type: 'Fijo' },
      { code: 'SHELL3K', value: 3000, type: 'Fijo' },
      { code: 'FREESHIP', value: 2000, type: 'Envío' }
    ];

    const matched = couponList.find(c => c.code === inputCode);

    if (matched) {
      setCustomDiscount(matched.value);
      setAppliedCoupon(`${matched.code} ($${matched.value.toLocaleString('es-CL')})`);
    } else {
      alert('Código de cupón no válido.');
    }
    setCouponInput('');
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    
    // Generate realistic order ID
    const newId = `SO-${Math.floor(10000 + Math.random() * 90000)}`;
    setLastOrderId(newId);
    
    // Save order details to admin panel list
    try {
      const savedOrders = localStorage.getItem('so_admin_orders');
      const ordersList = savedOrders ? JSON.parse(savedOrders) : [
        { id: 'SO-98741', name: 'Sebas Comprador', email: 'sebas@buyer.com', date: '2026-06-05', total: 19990, status: 'Entregado', items: 'Minimal Grid (x1)' },
        { id: 'SO-98742', name: 'Laura Gomez', email: 'laura@buyer.com', date: '2026-06-06', total: 22990, status: 'Despachado', items: 'Raw Marble (x1)' },
        { id: 'SO-98743', name: 'Diego Torres', email: 'diego@buyer.com', date: '2026-06-07', total: 39980, status: 'En producción', items: 'Cyber Stripes (x2)' },
        { id: 'SO-98744', name: 'Valentina Soto', email: 'vale@buyer.com', date: '2026-06-07', total: 21990, status: 'Recibido', items: 'Dots Pattern (x1)' }
      ];
      
      const itemsSummary = cartItems.map(item => `${item.name} (x${item.qty || 1})`).join(', ');
      const today = new Date().toISOString().split('T')[0];
      
      const newOrder = {
        id: newId,
        name: formData.name,
        email: formData.email,
        date: today,
        total: total,
        status: 'Recibido',
        items: itemsSummary
      };
      
      ordersList.unshift(newOrder);
      localStorage.setItem('so_admin_orders', JSON.stringify(ordersList));
    } catch (err) {
      console.error('Error saving order details:', err);
    }
    
    setCheckoutStep('success');
    
    // Trigger Canvas Confetti for high-end feel!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#000000', '#ffffff', '#888888', '#cccccc']
    });

    // Clear cart globally after a short delay
    setTimeout(() => {
      onClearCart();
    }, 100);
  };

  const handleClose = () => {
    if (checkoutStep === 'success') {
      setCheckoutStep('cart');
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop blur overlay */}
      {isOpen && <div className="cart-backdrop" onClick={handleClose} />}

      {/* Cart Drawer */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        
        {/* Drawer Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.25rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {checkoutStep === 'cart' && 'Tu Carrito'}
            {checkoutStep === 'checkout' && 'Finalizar Compra'}
            {checkoutStep === 'success' && '¡Pedido Recibido!'}
          </h3>
          <button onClick={handleClose} className="btn-icon flex-center" style={{ width: '32px', height: '32px', border: 'none' }}>
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '24px' }}>
          
          {/* STEP 1: CART LIST */}
          {checkoutStep === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="flex-center" style={{ flexDirection: 'column', height: '80%', gap: '16px', color: 'var(--text-muted)' }}>
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p style={{ fontWeight: 600 }}>Tu carrito está vacío.</p>
                  <button className="btn-primary" onClick={handleClose} style={{ padding: '10px 20px', fontSize: '0.8rem' }}>
                    Ir a comprar
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {cartItems.map(item => (
                    <div 
                      key={item.id} 
                      style={{
                        display: 'flex',
                        gap: '16px',
                        paddingBottom: '20px',
                        borderBottom: '1px solid var(--border-light)'
                      }}
                    >
                      {/* B&W Silhouette Thumbnail */}
                      <div style={{
                        width: '60px',
                        height: '90px',
                        backgroundColor: 'var(--bg-tertiary)',
                        borderRadius: '6px',
                        border: '1px solid var(--border-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        {item.isCustom && item.image && item.image !== 'placeholder' ? (
                          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{
                            width: '30px',
                            height: '60px',
                            borderRadius: '6px',
                            border: '2px solid #000',
                            background: item.isCustom ? '#1a1a1a' : 'linear-gradient(45deg, #000 50%, #fff 50%)'
                          }} />
                        )}
                      </div>

                      {/* Item Info */}
                      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, textAlign: 'left' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>{item.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                          {item.specs}
                        </span>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                          {/* Qty selectors */}
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)' }}>
                            <button 
                              onClick={() => onUpdateQty(item.id, (item.qty || 1) - 1)}
                              style={{ padding: '4px 8px', cursor: 'pointer' }}
                            >
                              <Minus size={12} />
                            </button>
                            <span style={{ padding: '0 8px', fontSize: '0.85rem', fontWeight: 600 }}>{item.qty || 1}</span>
                            <button 
                              onClick={() => onUpdateQty(item.id, (item.qty || 1) + 1)}
                              style={{ padding: '4px 8px', cursor: 'pointer' }}
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                              ${(item.price * (item.qty || 1)).toLocaleString('es-CL')}
                            </span>
                            <button 
                              onClick={() => onRemoveItem(item.id)} 
                              style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
                              title="Eliminar"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                  
                  {/* Coupon Form */}
                  <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Código de descuento"
                      className="form-input"
                      style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                    />
                    <button type="submit" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.75rem' }}>
                      Aplicar
                    </button>
                  </form>
                  {appliedCoupon && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'green', fontWeight: 600 }}>
                      <Ticket size={12} /> Cupón aplicado: {appliedCoupon}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* STEP 2: CHECKOUT FORM */}
          {checkoutStep === 'checkout' && (
            <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                  NOMBRE COMPLETO
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. Juan Pérez"
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                  CORREO ELECTRÓNICO
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ejemplo@correo.com"
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                  DIRECCIÓN DE ENVÍO
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Calle, Número, Departamento, Comuna"
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                  TARJETA DE CRÉDITO (SIMULADO)
                </label>
                <input
                  type="text"
                  required
                  maxLength={19}
                  value={formData.card}
                  onChange={(e) => setFormData({ ...formData, card: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim() })}
                  placeholder="4557 0000 0000 0000"
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '8px' }}>
                <ShieldCheck size={16} /> Encriptación segura SSL activa.
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="button" className="btn-secondary" onClick={() => setCheckoutStep('cart')} style={{ flex: 1, justifyContent: 'center' }}>
                  Atrás
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1.5, justifyContent: 'center' }}>
                  Pagar ${total.toLocaleString('es-CL')}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS PANEL */}
          {checkoutStep === 'success' && (
            <div className="flex-center" style={{ flexDirection: 'column', height: '80%', gap: '16px', textAlign: 'center' }}>
              <CheckCircle2 size={56} strokeWidth={1} style={{ color: 'var(--text-primary)' }} />
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>¡Gracias por tu compra!</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '280px' }}>
                Hemos enviado un correo con el recibo de tu pedido y los detalles de producción de tu funda.
              </p>
              <div style={{
                marginTop: '16px',
                padding: '16px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                fontSize: '0.8rem',
                textAlign: 'left'
              }}>
                <strong>Nro. de Seguimiento:</strong> #{lastOrderId}-CL<br />
                <strong>Plazo de Entrega:</strong> 3 a 5 días hábiles.
              </div>
              <button className="btn-primary" onClick={handleClose} style={{ marginTop: '24px' }}>
                Seguir Navegando
              </button>
            </div>
          )}

        </div>

        {/* Drawer Footer (Sticky Summary) */}
        {checkoutStep !== 'success' && cartItems.length > 0 && (
          <div style={{
            padding: '24px',
            borderTop: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-secondary)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal:</span>
                <span>${subtotal.toLocaleString('es-CL')}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'green', fontWeight: 600 }}>
                  <span>Descuento:</span>
                  <span>-${discount.toLocaleString('es-CL')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                <span>Total:</span>
                <span>${total.toLocaleString('es-CL')}</span>
              </div>
            </div>

            {checkoutStep === 'cart' && (
              <button 
                className="btn-primary" 
                onClick={() => setCheckoutStep('checkout')}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Proceder al Pago
              </button>
            )}
          </div>
        )}

      </div>
    </>
  );
}
