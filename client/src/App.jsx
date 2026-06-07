import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Catalog, { PRODUCTS } from './components/Catalog';
import ProductDetails from './components/ProductDetails';
import Reviews from './components/Reviews';
import Loyalty from './components/Loyalty';
import AdminDashboard from './components/AdminDashboard';
import AccountSettings from './components/AccountSettings';
import Cart from './components/Cart';
import AuthModal from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { Sparkles } from 'lucide-react';
import Faq from './components/Faq';
import Shipping from './components/Shipping';
import Contact from './components/Contact';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import './App.css';

function App() {
  const { user, toast } = useAuth();

  // Clear mock data from previous sessions for a clean slate
  useEffect(() => {
    if (!localStorage.getItem('so_clean_slate_v2')) {
      const keysToClear = [
        'so_user', 'so_token', 'so_user_addresses', 'so_user_cards',
        'so_admin_users', 'so_admin_orders', 'so_admin_coupons'
      ];
      keysToClear.forEach(k => localStorage.removeItem(k));
      localStorage.setItem('so_clean_slate_v2', 'true');
      window.location.reload();
    }
  }, []);

  const [activeTab, setActiveTab] = useState('catalog');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productsList, setProductsList] = useState(PRODUCTS);
  const [theme, setTheme] = useState(() => localStorage.getItem('so_theme') || 'light');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Initialize and switch theme HTML attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('so_theme', theme);
  }, [theme]);

  // Protect routes client-side
  useEffect(() => {
    if (!user) {
      if (activeTab === 'admin' || activeTab === 'account') {
        setActiveTab('catalog');
      }
    } else if (activeTab === 'admin' && user.role !== 'admin') {
      setActiveTab('catalog');
    }
  }, [user, activeTab]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const showLocalToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddToCart = (item) => {
    setCartItems(prevItems => {
      const existing = prevItems.find(i => i.id === item.id);
      if (existing) {
        return prevItems.map(i => i.id === existing.id ? { ...i, qty: (i.qty || 1) + item.qty } : i);
      }
      return [...prevItems, item];
    });

    showLocalToast(`"${item.name}" añadido al carrito.`);
  };

  const handleUpdateQty = (itemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, qty: newQty } : item));
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleClaimCoupon = (code, value) => {
    setCouponDiscount(value);
    showLocalToast(`Cupón "${code}" aplicado para descuento.`);
  };

  const handleAddProduct = (newProd) => {
    setProductsList(prev => [newProd, ...prev]);
  };

  const handleDeleteProduct = (id) => {
    setProductsList(prev => prev.filter(p => p.id !== id));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);

  return (
    <>
      {/* Header component */}
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        cartCount={cartCount} 
        openCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main content sections */}
      <main>
        {activeTab === 'catalog' && (
          <>
            <Hero 
              onGoToCatalog={() => {
                const catalogEl = document.getElementById('catalog');
                if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <Catalog 
              products={productsList}
              onViewDetails={(product) => {
                setSelectedProduct(product);
                setActiveTab('product-details');
              }}
            />
          </>
        )}

        {activeTab === 'product-details' && (
          <ProductDetails 
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onBack={() => setActiveTab('catalog')}
          />
        )}

        {activeTab === 'reviews' && (
          <Reviews />
        )}

        {activeTab === 'loyalty' && (
          <Loyalty onClaimCoupon={handleClaimCoupon} />
        )}

        {activeTab === 'account' && (
          <AccountSettings />
        )}

        {activeTab === 'admin' && user && user.role === 'admin' && (
          <AdminDashboard 
            products={productsList}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeTab === 'faq' && (
          <Faq />
        )}

        {activeTab === 'shipping' && (
          <Shipping />
        )}

        {activeTab === 'contact' && (
          <Contact />
        )}

        {activeTab === 'terms' && (
          <Terms />
        )}

        {activeTab === 'privacy' && (
          <Privacy />
        )}
      </main>

      {/* Slide-out Cart Sidebar */}
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        couponDiscount={couponDiscount}
        onClearCart={() => setCartItems([])}
      />

      {/* Auth Modal Overlay */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Elegant Toast Notifications (Context + Local) */}
      {(toast || toastMessage) && (
        <div className="toast">
          <Sparkles size={16} />
          <span>{toast || toastMessage}</span>
        </div>
      )}

      {/* Premium Minimal Footer */}
      <footer style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-light)',
        padding: '60px 0 32px',
        textAlign: 'left',
        marginTop: '80px',
        fontSize: '0.9rem',
        color: 'var(--text-secondary)'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          <div>
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.2rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              marginBottom: '16px'
            }}>
              SHELL OUT
            </h4>
            <p style={{ maxWidth: '240px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Estudio de fundas minimalistas monocromáticas. La belleza radica en el contraste puro.
            </p>
          </div>
          <div>
            <h5 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Explorar</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0 }}>
              <li><a href="#" onClick={() => { setActiveTab('catalog'); }}>Catálogo</a></li>
              <li><a href="#" onClick={() => { setActiveTab('reviews'); }}>Reseñas de Clientes</a></li>
              <li><a href="#" onClick={() => { setActiveTab('loyalty'); }}>Fidelidad</a></li>
            </ul>
          </div>
          <div>
            <h5 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Soporte</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0 }}>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('faq'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Preguntas Frecuentes</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('shipping'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Envíos y Devoluciones</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Contacto</a></li>
            </ul>
          </div>
          <div>
            <h5 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Legal</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0 }}>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('terms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Términos de Servicio</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Política de Privacidad</a></li>
            </ul>
          </div>
        </div>

        <div className="container" style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          color: 'var(--text-muted)',
          fontSize: '0.8rem'
        }}>
          <div>© 2026 Shell Out. Todos los derechos reservados.</div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px' }}>
            <a href="#">Instagram</a>
            <a href="#">Pinterest</a>
            <a href="#">TikTok</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
