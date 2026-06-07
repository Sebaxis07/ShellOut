import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_DATA = [
  {
    q: '¿Qué hace que las fundas Shell Out sean diferentes?',
    a: 'Nuestras fundas están diseñadas bajo un concepto minimalista y de alto contraste. Utilizamos policarbonato de alta densidad y TPU flexible para absorber impactos de hasta 3 metros, combinados con acabados mate antirayaduras y texturas geométricas únicas que mejoran el agarre.'
  },
  {
    q: '¿Son compatibles con carga inalámbrica y MagSafe?',
    a: 'Sí. Todos nuestros modelos están diseñados para ser 100% compatibles con cargadores inalámbricos estándar Qi. Además, ofrecemos versiones específicas con anillo magnético integrado compatible con MagSafe para una sujeción firme y carga rápida.'
  },
  {
    q: '¿Cuánto tiempo tarda la producción y el envío?',
    a: 'Cada funda se fabrica e imprime bajo demanda para reducir el desperdicio. El proceso de producción toma de 1 a 2 días hábiles. El envío demora entre 2 y 4 días hábiles adicionales según tu ubicación en Chile.'
  },
  {
    q: '¿Ofrecen garantía en caso de daños o errores de impresión?',
    a: 'Totalmente. Ofrecemos una garantía de satisfacción del 100% durante los primeros 30 días. Si tu funda presenta un defecto de fabricación, error de impresión o no se ajusta correctamente a tu teléfono, la reemplazaremos sin costo alguno para ti.'
  },
  {
    q: '¿Cómo puedo limpiar y mantener mi funda Shell Out?',
    a: 'Nuestras fundas mate son resistentes a las huellas y la grasa. Si deseas limpiarla, te recomendamos usar un paño de microfibra ligeramente húmedo con agua y jabón suave. Evita usar alcohol isopropílico o solventes fuertes para no dañar el acabado de la superficie.'
  }
];

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIndex = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="section" style={{ borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge" style={{ marginBottom: '12px' }}>Soporte</span>
          <h2 className="section-title">Preguntas Frecuentes</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Todo lo que necesitas saber sobre nuestras fundas premium y envíos.
          </p>
        </div>

        {/* FAQ List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {FAQ_DATA.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div 
                key={index} 
                style={{
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-secondary)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {/* Header (Question) */}
                <button
                  onClick={() => toggleIndex(index)}
                  style={{
                    width: '100%',
                    padding: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '1rem',
                    fontFamily: 'var(--font-heading)'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <HelpCircle size={18} style={{ color: 'var(--text-primary)', flexShrink: 0 }} />
                    {faq.q}
                  </span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {/* Body (Answer) */}
                {isOpen && (
                  <div style={{
                    padding: '0 24px 24px 54px',
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                    animation: 'fadeIn 0.2s ease-out'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
