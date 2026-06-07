import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, Zap, Gift, Check, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function Loyalty({ onClaimCoupon }) {
  const { user, addPoints } = useAuth();
  const [copiedCoupon, setCopiedCoupon] = useState('');

  const handleClaim = (couponCode, pointCost, discountValue) => {
    if (!user) return;
    
    if (!user.isVerified) {
      alert('Tu cuenta no está verificada. Por favor verifica tu correo en "Mi Cuenta" para habilitar el canje.');
      return;
    }

    if ((user.points || 0) >= pointCost) {
      // Deduct points
      addPoints(-pointCost);
      // Apply discount
      onClaimCoupon(couponCode, discountValue);
      setCopiedCoupon(couponCode);
      setTimeout(() => setCopiedCoupon(''), 5000);
    } else {
      alert('No tienes suficientes ShellPoints para canjear esta recompensa.');
    }
  };

  return (
    <section className="section" id="loyalty" style={{ borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="badge" style={{ marginBottom: '12px' }}>Fidelización</span>
          <h2 className="section-title">ShellPoints Club</h2>
          <p className="section-subtitle" style={{ margin: '0 auto 40px' }}>
            Acumula puntos en cada compra y canjéalos por cupones de descuento exclusivos.
          </p>
        </div>

        {/* Info Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '56px'
        }}>
          <div style={{ padding: '32px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', textAlign: 'left' }}>
            <Zap size={32} style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>1. Gana Puntos</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Obtén 10 puntos por cada $1.000 gastados en nuestra tienda. También ganas 100 puntos de bienvenida.
            </p>
          </div>

          <div style={{ padding: '32px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', textAlign: 'left' }}>
            <Award size={32} style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>2. Deja Reseñas</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Gana 50 puntos extra al publicar una reseña, y 100 puntos si adjuntas una foto de tu funda.
            </p>
          </div>

          <div style={{ padding: '32px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', textAlign: 'left' }}>
            <Gift size={32} style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>3. Canjea Premios</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Canjea tus puntos por cupones de descuento válidos en tu carrito de compras de manera instantánea.
            </p>
          </div>
        </div>

        <div className="grid-cols-2">
          {/* Left: Point Status */}
          <div style={{
            padding: '32px',
            backgroundColor: 'var(--bg-primary)',
            border: '2px solid var(--border-dark)',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Tus ShellPoints</h3>
            
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  padding: '16px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)'
                }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>SALDO ACTUAL:</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1, margin: '6px 0' }}>
                    {user.points || 0} <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>PTS</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Asociado a: {user.email}
                  </span>
                </div>

                {/* Verification Check */}
                {user.isVerified ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'green', fontSize: '0.85rem', fontWeight: 600 }}>
                    <ShieldCheck size={18} /> Cuenta verificada. Canje de puntos habilitado.
                  </div>
                ) : (
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-dark)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    fontSize: '0.8rem',
                    color: 'var(--text-primary)'
                  }}>
                    <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>Cuenta no verificada.</strong> Debes verificar tu correo en "Mi Cuenta" para poder canjear tus puntos.
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                padding: '24px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px dashed var(--border-light)',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 16px' }}>
                  Inicia sesión para ver tu saldo y habilitar el canje de cupones.
                </p>
              </div>
            )}
          </div>

          {/* Right: Rewards redeem area */}
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Premios Disponibles</h3>
            
            {/* Reward 1 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-light)'
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Cupón $5.000 CLP desc.</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Costo: 800 ShellPoints</div>
              </div>

              <button
                disabled={!user || !user.isVerified || (user.points || 0) < 800}
                onClick={() => handleClaim('SHELL5K', 800, 5000)}
                className="btn-secondary"
                style={{
                  padding: '8px 16px',
                  fontSize: '0.75rem',
                  opacity: (!user || !user.isVerified || (user.points || 0) < 800) ? 0.4 : 1,
                  cursor: (!user || !user.isVerified || (user.points || 0) < 800) ? 'not-allowed' : 'pointer'
                }}
              >
                {copiedCoupon === 'SHELL5K' ? '¡Aplicado!' : 'Canjear'}
              </button>
            </div>

            {/* Reward 2 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-light)'
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Cupón $3.000 CLP desc.</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Costo: 500 ShellPoints</div>
              </div>

              <button
                disabled={!user || !user.isVerified || (user.points || 0) < 500}
                onClick={() => handleClaim('SHELL3K', 500, 3000)}
                className="btn-secondary"
                style={{
                  padding: '8px 16px',
                  fontSize: '0.75rem',
                  opacity: (!user || !user.isVerified || (user.points || 0) < 500) ? 0.4 : 1,
                  cursor: (!user || !user.isVerified || (user.points || 0) < 500) ? 'not-allowed' : 'pointer'
                }}
              >
                {copiedCoupon === 'SHELL3K' ? '¡Aplicado!' : 'Canjear'}
              </button>
            </div>
            
            {!user && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
                * Inicia sesión para interactuar con el club de fidelización.
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
