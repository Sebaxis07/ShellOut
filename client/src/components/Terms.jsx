import React from 'react';
import { Scale, FileText, CheckCircle } from 'lucide-react';

export default function Terms() {
  return (
    <section className="section" style={{ borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '800px', textAlign: 'left' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="badge" style={{ marginBottom: '12px' }}>Legal</span>
          <h2 className="section-title">Términos de Servicio</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Última actualización: 7 de junio de 2026. Por favor lee detalladamente antes de comprar.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7' }}>
          
          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
            <Scale size={28} style={{ flexShrink: 0, color: 'var(--text-primary)' }} />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                1. Aceptación de los Términos
              </h3>
              <p>
                Al acceder y realizar compras en el sitio web de <strong>Shell Out</strong>, garantizas que eres mayor de edad según la legislación chilena y que aceptas sin reservas las condiciones descritas en este documento. Si no estás de acuerdo con alguna cláusula, te solicitamos abstenerte de utilizar nuestro sitio.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
            <FileText size={28} style={{ flexShrink: 0, color: 'var(--text-primary)' }} />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                2. Propiedad Intelectual y Diseños
              </h3>
              <p>
                Todos los contenidos, imágenes, marcas comerciales, logotipos y diseños geométricos expuestos en esta web son propiedad exclusiva de Shell Out. Se prohíbe terminantemente su copia, distribución o reproducción sin consentimiento previo por escrito.
              </p>
              <p style={{ marginTop: '8px' }}>
                Para el caso del módulo de personalización, el cliente se compromete a no cargar imágenes protegidas por derechos de autor o que infrinjan leyes de propiedad intelectual de terceros. Shell Out se reserva el derecho de rechazar impresiones con contenido abusivo o ilegal.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
            <CheckCircle size={28} style={{ flexShrink: 0, color: 'var(--text-primary)' }} />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                3. Precios y Transacciones
              </h3>
              <p>
                Los precios mostrados en el catálogo están expresados en pesos chilenos ($ CLP) e incluyen el Impuesto al Valor Agregado (IVA). Nos reservamos el derecho de modificar los precios o suspender promociones sin previo aviso.
              </p>
              <p style={{ marginTop: '8px' }}>
                El procesamiento de pagos se realiza bajo estándares seguros. Al ingresar tus datos de pago, autorizas la transacción correspondiente por el monto total del carrito, incluidos impuestos y gastos de despacho informados.
              </p>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '12px' }}>
              4. Limitación de Responsabilidad
            </h3>
            <p>
              Shell Out no se responsabiliza por daños indirectos derivados del mal uso de las fundas o de caídas que superen los límites de resistencia física informados. Nuestras fundas amortiguan impactos cotidianos, pero no garantizan la indestructibilidad total de los dispositivos electrónicos en condiciones extremas.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
