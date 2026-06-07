import React from 'react';
import { Truck, RotateCcw, Package, AlertCircle } from 'lucide-react';

export default function Shipping() {
  return (
    <section className="section" style={{ borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="badge" style={{ marginBottom: '12px' }}>Políticas</span>
          <h2 className="section-title">Envíos y Devoluciones</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Información transparente sobre plazos de entrega, tarifas y proceso de devolución.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', textAlign: 'left' }}>
          
          {/* Section 1: Envíos */}
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '2px solid var(--border-dark)', paddingBottom: '10px' }}>
              <Truck size={22} /> Política de Envío
            </h3>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Operamos con despachos diarios a todo Chile a través de Starken, Chilexpress y Blue Express. Cada pedido cuenta con un código de seguimiento único que te llegará a tu correo una vez despachado el paquete.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              marginBottom: '24px'
            }}>
              <div style={{ padding: '20px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '6px' }}>Región de Antofagasta</h4>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, margin: '8px 0' }}>$2.990 CLP</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Plazo de entrega: 1 a 2 días hábiles.</p>
              </div>

              <div style={{ padding: '20px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '6px' }}>Otras Regiones (Santiago, Centro y Sur)</h4>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, margin: '8px 0' }}>$3.990 CLP</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Plazo de entrega: 2 a 4 días hábiles.</p>
              </div>

              <div style={{ padding: '20px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '6px' }}>Zonas Extremas</h4>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, margin: '8px 0' }}>$4.990 CLP</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Plazo de entrega: 4 a 7 días hábiles.</p>
              </div>
            </div>

            <div style={{
              padding: '16px',
              backgroundColor: 'var(--bg-secondary)',
              borderLeft: '4px solid var(--border-dark)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Package size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong>Envío gratis:</strong> Por compras superiores a $35.000 CLP o utilizando cupones de fidelización en compras elegibles.
              </div>
            </div>
          </div>

          {/* Section 2: Devoluciones */}
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '2px solid var(--border-dark)', paddingBottom: '10px' }}>
              <RotateCcw size={22} /> Garantía y Devoluciones
            </h3>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Queremos que ames tu funda Shell Out. Si por alguna razón no estás satisfecho con tu compra, tienes 30 días seguidos desde la fecha de recepción para iniciar una devolución o cambio.
            </p>

            <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '12px' }}>¿Cómo realizar un cambio o devolución?</h4>
            
            <ol style={{ paddingLeft: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              <li>
                <strong>Ponte en contacto:</strong> Escríbenos a través de nuestro formulario de contacto o envía un correo a soporte@shellout.com indicando tu número de pedido (#SO-XXXXX).
              </li>
              <li>
                <strong>Prepara el paquete:</strong> Introduce la funda en su empaque original. Debe estar sin uso y en las mismas condiciones en que la recibiste.
              </li>
              <li>
                <strong>Envío de retorno:</strong> Te proporcionaremos una etiqueta de envío prepagada para entregar en la sucursal Starken más cercana.
              </li>
              <li>
                <strong>Reembolso o Reemplazo:</strong> Una vez recibido e inspeccionado el producto en nuestro taller, procesaremos tu reembolso completo a tu cuenta bancaria o enviaremos el producto de reemplazo en un plazo de 3 días hábiles.
              </li>
            </ol>

            <div style={{
              padding: '16px',
              backgroundColor: 'var(--bg-secondary)',
              borderLeft: '4px solid var(--border-dark)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Importante:</strong> Las fundas personalizadas diseñadas por el usuario están excluidas del reembolso por arrepentimiento de compra. Sin embargo, conservan la garantía completa de 30 días ante cualquier falla de material, rotura o error de fabricación.
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
