import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Hero({ onGoToCatalog }) {
  return (
    <section className="hero-section">
      <div className="container hero-grid">
        {/* Left Side: Brand Statement */}
        <div style={{ paddingRight: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div className="badge" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={12} /> Colección Monocromática 2026
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            textTransform: 'uppercase',
            marginBottom: '24px'
          }}>
            Viste tu móvil.<br />
            Sin colores.<br />
            Solo estilo.
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: '36px',
            maxWidth: '520px'
          }}>
            Fundas de teléfono ultra resistentes con diseños geométricos, texturas en relieve y acabados mate. Explora nuestra colección exclusiva y elige tu favorita.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={onGoToCatalog}>
              Ver Catálogo <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Side: Graphical Abstract Phone Case Showcase */}
        <div className="flex-center" style={{ position: 'relative', height: '100%', minHeight: '400px' }}>
          {/* Custom CSS Floating Abstract Case Art */}
          <div style={{
            position: 'relative',
            width: '240px',
            height: '460px',
            backgroundColor: 'var(--text-primary)',
            borderRadius: '44px',
            border: '8px solid var(--border-medium)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            transform: 'rotate(-6deg) translateY(-20px)',
            transition: 'transform var(--transition-slow)'
          }}>
            {/* Phone Camera Module Mockup */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              width: '80px',
              height: '80px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '24px',
              border: '2px solid var(--border-medium)',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '6px',
              padding: '8px',
              boxSizing: 'border-box'
            }}>
              <div style={{ borderRadius: '50%', backgroundColor: 'var(--text-primary)' }}></div>
              <div style={{ borderRadius: '50%', backgroundColor: 'var(--text-primary)' }}></div>
              <div style={{ borderRadius: '50%', backgroundColor: 'var(--text-primary)' }}></div>
              <div style={{ borderRadius: '50%', backgroundColor: 'var(--text-muted)' }}></div>
            </div>

            {/* Abstract B&W Line Art */}
            <div style={{
              position: 'absolute',
              bottom: '40px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '0 24px'
            }}>
              <div style={{ height: '4px', backgroundColor: 'var(--bg-primary)', width: '70%' }}></div>
              <div style={{ height: '4px', backgroundColor: 'var(--bg-primary)', width: '100%' }}></div>
              <div style={{ height: '4px', backgroundColor: 'var(--bg-primary)', width: '40%' }}></div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--bg-primary)',
                fontSize: '2rem',
                fontWeight: 900,
                marginTop: '16px',
                lineHeight: 0.9
              }}>
                SHELL<br />OUT.
              </div>
            </div>
          </div>

          {/* Floating Second Case (Offset Overlay) */}
          <div style={{
            position: 'absolute',
            width: '200px',
            height: '380px',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '32px',
            border: '6px solid var(--text-primary)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            transform: 'rotate(8deg) translate(80px, 40px)',
            zIndex: 5
          }}>
            {/* Minimalist Stripe Pattern */}
            <div style={{
              width: '100%',
              height: '100%',
              background: 'repeating-linear-gradient(45deg, var(--bg-primary), var(--bg-primary) 10px, var(--text-primary) 10px, var(--text-primary) 20px)'
            }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
