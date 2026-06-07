import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    subject: 'Consulta de Producto',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API request submission
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        orderNumber: '',
        subject: 'Consulta de Producto',
        message: ''
      });
    }, 1200);
  };

  return (
    <section className="section" style={{ borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="badge" style={{ marginBottom: '12px' }}>Contacto</span>
          <h2 className="section-title">Hablemos de tu funda</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            ¿Tienes dudas sobre compatibilidad, estado de tu pedido o pedidos corporativos? Escríbenos.
          </p>
        </div>

        <div className="grid-cols-2" style={{ alignItems: 'start' }}>
          
          {/* Left Side: Contact Info */}
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '32px', paddingRight: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>
                Canales de Atención
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Nuestro equipo de soporte está disponible de lunes a viernes de 09:00 a 18:00 hrs. Respondemos todas las consultas en menos de 24 horas hábiles.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="flex-center" style={{ width: '48px', height: '48px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '50%' }}>
                  <Mail size={18} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)' }}>CORREO ELECTRÓNICO</h4>
                  <p style={{ fontWeight: 600 }}>contacto@shellout.com</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="flex-center" style={{ width: '48px', height: '48px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '50%' }}>
                  <Phone size={18} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)' }}>TELÉFONO / WHATSAPP</h4>
                  <p style={{ fontWeight: 600 }}>+56 9 8765 4321</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="flex-center" style={{ width: '48px', height: '48px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '50%' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)' }}>TALLER & SHOWROOM</h4>
                  <p style={{ fontWeight: 600 }}>Av. Angamos 1234, Antofagasta, Chile</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form / Success Card */}
          <div style={{ textAlign: 'left' }}>
            <div style={{
              padding: '32px',
              border: '2px solid var(--border-dark)',
              backgroundColor: 'var(--bg-primary)'
            }}>
              {isSubmitted ? (
                <div className="flex-center" style={{ flexDirection: 'column', padding: '40px 0', gap: '16px', textAlign: 'center' }}>
                  <CheckCircle2 size={56} style={{ color: 'var(--text-primary)' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase' }}>¡Mensaje Enviado!</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '280px', margin: '0 auto' }}>
                    Hemos recibido tus datos con éxito. Un agente de soporte te responderá al correo ingresado a la brevedad.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)} 
                    className="btn-secondary"
                    style={{ marginTop: '16px', padding: '10px 20px', fontSize: '0.8rem' }}
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                    Formulario de Contacto
                  </h3>

                  <div className="grid-cols-2" style={{ gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>NOMBRE</label>
                      <input 
                        type="text" 
                        required 
                        className="form-input" 
                        placeholder="Ej. Francisca"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>CORREO</label>
                      <input 
                        type="email" 
                        required 
                        className="form-input" 
                        placeholder="ejemplo@correo.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid-cols-2" style={{ gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>NRO. PEDIDO (OPCIONAL)</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Ej. #SO-59384"
                        value={formData.orderNumber}
                        onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>ASUNTO</label>
                      <select 
                        className="form-input"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        style={{ height: '46px', padding: '0 12px' }}
                      >
                        <option value="Consulta de Producto">Consulta de Producto</option>
                        <option value="Estado de Envío">Estado de Envío</option>
                        <option value="Garantías y Cambios">Garantías y Cambios</option>
                        <option value="Ventas Mayoristas">Ventas Mayoristas</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>MENSAJE</label>
                    <textarea 
                      required 
                      className="form-input" 
                      rows={5} 
                      placeholder="Cuéntanos cómo podemos ayudarte..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{ resize: 'none' }}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary" 
                    style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                  >
                    <Send size={16} /> {loading ? 'Enviando...' : 'Enviar Mensaje'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
