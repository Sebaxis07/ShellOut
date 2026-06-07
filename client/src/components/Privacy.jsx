import React from 'react';
import { Lock, Eye, CheckCircle2 } from 'lucide-react';

export default function Privacy() {
  return (
    <section className="section" style={{ borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '800px', textAlign: 'left' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="badge" style={{ marginBottom: '12px' }}>Privacidad</span>
          <h2 className="section-title">Política de Privacidad</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Tu privacidad y la seguridad de tus datos son nuestra prioridad absoluta.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7' }}>
          
          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
            <Lock size={28} style={{ flexShrink: 0, color: 'var(--text-primary)' }} />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                1. Recopilación de Información
              </h3>
              <p>
                Recopilamos únicamente la información necesaria para gestionar tu cuenta y despachar tus pedidos: tu nombre completo, dirección de envío, correo electrónico y número de teléfono. No almacenamos datos sensibles de tarjetas de crédito o débito; todas las transacciones son gestionadas a través de pasarelas de pago seguras y encriptadas bajo protocolo SSL.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
            <Eye size={28} style={{ flexShrink: 0, color: 'var(--text-primary)' }} />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                2. Uso de los Datos
              </h3>
              <p>
                Tus datos personales se utilizarán exclusivamente para los siguientes fines:
              </p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Procesar y despachar tus fundas telefónicas adquiridas.</li>
                <li>Enviarte actualizaciones sobre el estado de producción y despacho del pedido.</li>
                <li>Gestionar tu saldo de <strong>ShellPoints</strong> y canje de cupones de descuento.</li>
                <li>Responder a tus consultas enviadas a través de nuestro formulario de contacto.</li>
              </ul>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
            <CheckCircle2 size={28} style={{ flexShrink: 0, color: 'var(--text-primary)' }} />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                3. Cookies y Seguimiento
              </h3>
              <p>
                Utilizamos cookies funcionales para recordar las sesiones iniciadas, almacenar de manera temporal los productos en tu carrito de compras y registrar tus preferencias de diseño visual (como el modo oscuro). Puedes desactivar el uso de cookies en la configuración de tu navegador, aunque esto podría afectar la experiencia de compra en nuestro sitio.
              </p>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '12px' }}>
              4. Transferencia a Terceros
            </h3>
            <p>
              Bajo ninguna circunstancia vendemos, alquilamos ni divulgamos tus datos personales a terceras empresas con fines de marketing. Tus datos de dirección e información de contacto se comparten de forma única y exclusiva con las empresas de logística encargadas de transportar tu pedido (como Starken, Chilexpress o Blue Express).
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
