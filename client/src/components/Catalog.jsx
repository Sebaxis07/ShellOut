import React, { useState } from 'react';
import { ShoppingBag, Eye, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = ['Todos', 'Minimalista', 'Geométrico', 'Texturas', 'Artístico'];

export const PRODUCTS = [
  {
    id: 'p1',
    name: 'Minimal Grid',
    category: 'Minimalista',
    price: 19990,
    description: 'Cuadrícula limpia e impecable sobre fondo negro mate.',
    pattern: {
      background: '#121212',
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
      backgroundSize: '20px 20px'
    }
  },
  {
    id: 'p2',
    name: 'Diagonal Wave',
    category: 'Geométrico',
    price: 21990,
    description: 'Líneas diagonales paralelas de alto impacto óptico.',
    pattern: {
      background: 'repeating-linear-gradient(45deg, #121212, #121212 10px, #ffffff 10px, #ffffff 11px)'
    }
  },
  {
    id: 'p3',
    name: 'Raw Marble',
    category: 'Texturas',
    price: 22990,
    description: 'Veteado orgánico de mármol negro con trazos profundos.',
    pattern: {
      background: 'radial-gradient(circle at 30% 20%, #2a2a2a 0%, #0d0d0d 100%)',
      boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)'
    }
  },
  {
    id: 'p4',
    name: 'Cyber Stripes',
    category: 'Artístico',
    price: 19990,
    description: 'Líneas asimétricas de inspiración cyberpunk.',
    pattern: {
      background: '#ffffff',
      backgroundImage: 'linear-gradient(90deg, #000 50%, transparent 50%), linear-gradient(90deg, #000 25%, transparent 25%)',
      backgroundSize: '40px 100%, 80px 100%'
    }
  },
  {
    id: 'p5',
    name: 'Half & Half',
    category: 'Minimalista',
    price: 19990,
    description: 'Bloque perfecto blanco y negro de corte industrial.',
    pattern: {
      background: 'linear-gradient(to right, #000000 50%, #ffffff 50%)'
    }
  },
  {
    id: 'p6',
    name: 'Dots Pattern',
    category: 'Geométrico',
    price: 21990,
    description: 'Puntos en relieve alineados simétricamente.',
    pattern: {
      background: '#121212',
      backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.25) 2px, transparent 2px)',
      backgroundSize: '16px 16px'
    }
  }
];

export default function Catalog({ products = PRODUCTS, onViewDetails }) {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredProducts = activeCategory === 'Todos'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <section className="section" id="catalog">
      <div className="container">
        
        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '24px',
          marginBottom: '48px',
          textAlign: 'left'
        }}>
          <div>
            <span className="badge" style={{ marginBottom: '12px' }}>Diseño Premium</span>
            <h2 className="section-title" style={{ margin: 0 }}>Colección Oficial</h2>
            <p className="section-subtitle" style={{ margin: '8px 0 0', maxWidth: '480px' }}>
              Diseños listos para llevar creados por nuestro equipo de artistas gráficos en blanco y negro.
            </p>
          </div>

          {/* Filter Categories */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`filter-tag ${activeCategory === category ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '30px'
        }}>
          {filteredProducts.map(product => (
            <div key={product.id} className="card-wrapper" style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '20px'
            }}>
              
              {/* Phone Case Pattern Mockup */}
              <div 
                onClick={() => onViewDetails(product)}
                style={{
                  position: 'relative',
                  height: '280px',
                  backgroundColor: 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                {/* 2D Case Silhouette Rendered via CSS */}
                <div style={{
                  position: 'relative',
                  width: '130px',
                  height: '240px',
                  borderRadius: '24px',
                  border: '4px solid #1a1a1a',
                  boxShadow: 'var(--shadow-md)',
                  overflow: 'hidden',
                  ...product.pattern
                }}>
                  {/* Camera module inside mockup */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    width: '40px',
                    height: '40px',
                    backgroundColor: product.pattern.background === '#ffffff' ? '#000000' : '#ffffff',
                    borderRadius: '10px',
                    opacity: 0.85,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    padding: '4px',
                    gap: '2px',
                    boxSizing: 'border-box'
                  }}>
                    <div style={{ borderRadius: '50%', backgroundColor: product.pattern.background === '#ffffff' ? '#fff' : '#000' }}></div>
                    <div style={{ borderRadius: '50%', backgroundColor: product.pattern.background === '#ffffff' ? '#fff' : '#000' }}></div>
                    <div style={{ borderRadius: '50%', backgroundColor: product.pattern.background === '#ffffff' ? '#fff' : '#000' }}></div>
                  </div>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.15) 100%)',
                    pointerEvents: 'none'
                  }}></div>
                </div>
              </div>

              {/* Product Info */}
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{product.name}</h3>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                    ${product.price.toLocaleString('es-CL')}
                  </span>
                </div>
                
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '20px',
                  flexGrow: 1
                }}>
                  {product.description}
                </p>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                  <button
                    className="btn-primary"
                    onClick={() => onViewDetails(product)}
                    style={{ flexGrow: 1, padding: '10px 14px', fontSize: '0.8rem', justifyContent: 'center' }}
                  >
                    <Eye size={14} style={{ marginRight: '6px' }} /> Ver Detalles
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
