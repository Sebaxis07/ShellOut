import React, { useState } from 'react';
import { Star, Upload, MessageSquare, CheckCircle2 } from 'lucide-react';

const INITIAL_REVIEWS = [
  {
    id: 'r1',
    userName: 'Nicolás G.',
    rating: 5,
    comment: 'La calidad de impresión de la funda mate es increíble. Las líneas se ven súper nítidas y se siente muy premium en la mano. 100% recomendado.',
    imageUrl: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=300&q=80',
    date: 'Hace 2 días'
  },
  {
    id: 'r2',
    userName: 'Sofía M.',
    rating: 4,
    comment: 'Diseñé mi propia funda con un patrón minimalista y me encantó. El envío tardó un poco más de lo esperado pero valió la pena.',
    imageUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=300&q=80',
    date: 'Hace 1 semana'
  },
  {
    id: 'r3',
    userName: 'Lucas B.',
    rating: 5,
    comment: 'Súper robusta. Ya se me cayó el iPhone un par de veces y la funda MagSafe ni se enteró. Diseño sobrio y elegante.',
    imageUrl: null,
    date: 'Hace 2 semanas'
  }
];

export default function Reviews() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newName, setNewName] = useState('');
  const [uploadedReviewImage, setUploadedReviewImage] = useState(null);
  const [hoverRating, setHoverRating] = useState(null);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleReviewImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setUploadedReviewImage(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newComment || !newName) return;

    const newReview = {
      id: `rev-${Date.now()}`,
      userName: newName,
      rating: newRating,
      comment: newComment,
      imageUrl: uploadedReviewImage,
      date: 'Reciente'
    };

    setReviews([newReview, ...reviews]);
    setNewComment('');
    setNewName('');
    setUploadedReviewImage(null);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
  };

  return (
    <section className="section" id="reviews" style={{ borderTop: '1px solid var(--border-light)' }}>
      <div className="container">
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge" style={{ marginBottom: '12px' }}>Comunidad</span>
          <h2 className="section-title">Qué dicen nuestros clientes</h2>
          <p className="section-subtitle" style={{ margin: '0 auto 40px' }}>
            Fotos reales y opiniones honestas de la comunidad Shell Out.
          </p>
        </div>

        <div className="grid-cols-2">
          
          {/* Left: Reviews Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MessageSquare size={20} /> Opiniones ({reviews.length})
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {reviews.map(review => (
                <div 
                  key={review.id}
                  style={{
                    padding: '24px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700 }}>{review.userName}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{review.date}</span>
                  </div>

                  {/* Stars */}
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        fill={i < review.rating ? 'var(--text-primary)' : 'none'} 
                        stroke="var(--text-primary)"
                      />
                    ))}
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {review.comment}
                  </p>

                  {/* Attachment image */}
                  {review.imageUrl && (
                    <div style={{
                      marginTop: '8px',
                      width: '80px',
                      height: '80px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-light)'
                    }}>
                      <img 
                        src={review.imageUrl} 
                        alt="Foto de cliente" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Submit Review Form */}
          <div style={{ textAlign: 'left' }}>
            <div style={{
              padding: '32px',
              border: '2px solid var(--border-dark)',
              backgroundColor: 'var(--bg-primary)',
              position: 'sticky',
              top: '120px'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px' }}>
                Deja tu Reseña
              </h3>

              {successMsg && (
                <div style={{
                  padding: '12px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}>
                  <CheckCircle2 size={18} /> ¡Reseña publicada con éxito! Gracias por tu feedback.
                </div>
              )}

              <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Rating selection */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>
                    CALIFICACIÓN
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map(ratingValue => (
                      <button
                        type="button"
                        key={ratingValue}
                        onClick={() => setNewRating(ratingValue)}
                        onMouseEnter={() => setHoverRating(ratingValue)}
                        onMouseLeave={() => setHoverRating(null)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Star 
                          size={24} 
                          fill={(hoverRating || newRating) >= ratingValue ? 'var(--text-primary)' : 'none'}
                          stroke="var(--text-primary)"
                          strokeWidth={2}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>
                    TU NOMBRE
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ej. Martín P."
                    className="form-input"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>
                    COMENTARIO
                  </label>
                  <textarea
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="¿Cómo se siente tu funda? ¿Qué te pareció el diseño?"
                    className="form-input"
                    rows={4}
                    style={{ resize: 'none' }}
                  />
                </div>

                {/* Photo upload */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>
                    SUBIR FOTO DE LA FUNDA (OPCIONAL)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      border: '1px solid var(--border-dark)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-heading)'
                    }}>
                      <Upload size={14} /> Seleccionar Archivo
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleReviewImageUpload}
                        style={{ display: 'none' }} 
                      />
                    </label>
                    {uploadedReviewImage && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img 
                          src={uploadedReviewImage} 
                          alt="Previsualización" 
                          style={{ width: '40px', height: '40px', objectFit: 'cover', border: '1px solid var(--border-light)' }} 
                        />
                        <button 
                          type="button" 
                          onClick={() => setUploadedReviewImage(null)}
                          style={{ fontSize: '0.75rem', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
                  Publicar Reseña
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
