import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, Smartphone, Layers, Plus, Minus, Star, Heart } from 'lucide-react';

const PHONE_MODELS = [
  { id: 'iphone-15', name: 'iPhone 15 Pro Max', brand: 'Apple' },
  { id: 'iphone-14', name: 'iPhone 14 Pro', brand: 'Apple' },
  { id: 'galaxy-s24', name: 'Galaxy S24 Ultra', brand: 'Samsung' },
  { id: 'xiaomi-14', name: 'Xiaomi 14 Ultra', brand: 'Xiaomi' }
];

const MATERIALS = [
  { id: 'matte-black', name: 'Matte Charcoal Black', color: '#1a1a1a', priceAdd: 0 },
  { id: 'glass-white', name: 'Glass Pearl White', color: '#f3f3f3', priceAdd: 3000 },
  { id: 'magsafe-clear', name: 'Ultra Clear MagSafe', color: 'transparent', priceAdd: 5000 }
];

export default function ProductDetails({ product, onAddToCart, onBack }) {
  if (!product) return null;

  const [selectedModel, setSelectedModel] = useState(PHONE_MODELS[0]);
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS[0]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const basePrice = product.price;
  const unitPrice = basePrice + selectedMaterial.priceAdd;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    const item = {
      id: `${product.id}-${selectedModel.id}-${selectedMaterial.id}`,
      name: `${product.name} - ${selectedModel.name}`,
      specs: `${selectedMaterial.name}`,
      price: unitPrice,
      qty: quantity,
      image: 'preset',
      isCustom: false
    };

    onAddToCart(item);
  };

  return (
    <section className="section" style={{ borderTop: '1px solid var(--border-light)' }}>
      <div className="container">
        
        {/* Back Button */}
        <button 
          onClick={onBack} 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '40px',
            cursor: 'pointer',
            padding: '8px 12px',
            border: '1px solid var(--border-light)',
            transition: 'all var(--transition-fast)'
          }}
          className="btn-secondary"
        >
          <ArrowLeft size={16} /> Volver al Catálogo
        </button>

        <div className="grid-cols-2">
          {/* Left Column: Product Visual Mockup */}
          <div className="customizer-workspace">
            {/* Phone Frame */}
            <div className="phone-mockup-wrapper" style={{ width: '260px', height: '490px' }}>
              <div className="phone-camera-island"></div>
              
              {/* Phone Case Body with Pattern */}
              <div 
                className="case-body" 
                style={{ 
                  backgroundColor: selectedMaterial.color === 'transparent' ? '#ffffff' : selectedMaterial.color,
                  border: selectedMaterial.id === 'magsafe-clear' ? '4px solid #eaeaea' : 'none'
                }}
              >
                {/* Embedded Design Pattern overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: selectedMaterial.id === 'matte-black' ? 0.8 : 0.95,
                  mixBlendMode: selectedMaterial.id === 'matte-black' ? 'screen' : 'multiply',
                  ...product.pattern
                }} />

                {/* MagSafe Circle Overlay for MagSafe Clear Case */}
                {selectedMaterial.id === 'magsafe-clear' && (
                  <div style={{
                    position: 'absolute',
                    top: '45%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '110px',
                    height: '110px',
                    border: '4px solid rgba(0, 0, 0, 0.15)',
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 11
                  }}>
                    <div style={{
                      width: '4px',
                      height: '40px',
                      backgroundColor: 'rgba(0, 0, 0, 0.15)',
                      position: 'absolute',
                      bottom: '-40px'
                    }}></div>
                  </div>
                )}

                {/* Reflection Highlight */}
                <div className="case-texture-overlay"></div>
              </div>
            </div>
          </div>

          {/* Right Column: Customization & Purchase Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', textAlign: 'left' }}>
            
            {/* Header info */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge">{product.category}</span>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="var(--text-primary)" stroke="var(--text-primary)" />
                  ))}
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, marginLeft: '6px', color: 'var(--text-secondary)' }}>
                    (12 reseñas)
                  </span>
                </div>
              </div>
              
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px' }}>
                {product.name}
              </h2>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                  ${unitPrice.toLocaleString('es-CL')}
                </span>
                {selectedMaterial.priceAdd > 0 && (
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    (incluye +${selectedMaterial.priceAdd.toLocaleString('es-CL')} por acabado premium)
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {product.description} Fabricada con policarbonato reforzado de alta durabilidad para absorber impactos extremos. Los bordes elevados alrededor de la cámara y pantalla previenen arañazos directos sobre superficies planas. Totalmente compatible con carga inalámbrica.
            </p>

            {/* 1. Model Selection */}
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase' }}>
                <Smartphone size={18} /> 1. Modelo compatible
              </h3>
              <select 
                value={selectedModel.id} 
                onChange={(e) => setSelectedModel(PHONE_MODELS.find(m => m.id === e.target.value))}
                className="form-input"
                style={{ padding: '12px', fontWeight: 600 }}
              >
                {PHONE_MODELS.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.brand} - {model.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Material Selection */}
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase' }}>
                <Layers size={18} /> 2. Material / Acabado
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {MATERIALS.map(material => (
                  <button
                    key={material.id}
                    onClick={() => setSelectedMaterial(material)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      border: selectedMaterial.id === material.id ? '2px solid var(--border-dark)' : '1px solid var(--border-light)',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      width: '100%',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexGrow: 1 }}>
                      <span style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: material.color === 'transparent' ? '#fff' : material.color,
                        border: '1px solid #aaa',
                        display: 'inline-block'
                      }} />
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{material.name}</span>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                      {material.priceAdd > 0 ? `+$${material.priceAdd.toLocaleString('es-CL')}` : 'Base'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Quantity & Buy Actions */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              borderTop: '1px solid var(--border-light)',
              paddingTop: '24px',
              marginTop: '12px'
            }}>
              {/* Qty Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cantidad</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-dark)', height: '48px' }}>
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    style={{ width: '40px', height: '100%', cursor: 'pointer' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ padding: '0 12px', fontSize: '1rem', fontWeight: 700, minWidth: '32px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    style={{ width: '40px', height: '100%', cursor: 'pointer' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Add to Cart button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Subtotal</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={handleAddToCart}
                    className="btn-primary" 
                    style={{ flexGrow: 1, height: '48px', justifyContent: 'center', padding: '0 24px' }}
                  >
                    Añadir al Carrito <ShoppingBag size={18} />
                  </button>

                  <button 
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="btn-secondary" 
                    style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                  >
                    <Heart size={18} fill={isFavorite ? 'var(--text-primary)' : 'none'} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
