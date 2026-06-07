import React from 'react';
import { ShoppingBag, Sun, Moon, Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ theme, toggleTheme, cartCount, openCart, activeTab, setActiveTab, onOpenAuth }) {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'catalog', label: 'Catálogo' },
    { id: 'reviews', label: 'Reseñas' },
    { id: 'loyalty', label: 'Fidelidad' }
  ];

  // If user is logged in, show Account tab
  if (user) {
    menuItems.push({ id: 'account', label: 'Mi Cuenta' });
  }

  // If user is an admin, inject the Admin Panel tab
  if (user && user.role === 'admin') {
    menuItems.push({ id: 'admin', label: 'Admin Panel' });
  }

  return (
    <header>
      <div className="container" style={{
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Brand Logo */}
        <a href="#" className="flex-center" style={{ gap: '10px' }} onClick={() => setActiveTab('catalog')}>
          <img src="/icon/icon.png" alt="Shell Out" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            fontWeight: 800,
            letterSpacing: '0.15em',
            textTransform: 'uppercase'
          }}>
            SHELL OUT
          </span>
        </a>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '24px' }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: activeTab === item.id ? 'var(--text-primary)' : 'var(--text-muted)',
                borderBottom: activeTab === item.id ? '2px solid var(--text-primary)' : '2px solid transparent',
                padding: '8px 0',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          {/* User Session Info / Action */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div 
                onClick={() => setActiveTab('account')} 
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 700, lineHeight: 1 }}>{user.name}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  {user.role === 'admin' ? 'Admin' : `${user.points || 0} Pts`}
                </span>
              </div>
              <button 
                onClick={logout} 
                className="btn-icon flex-center"
                style={{ width: '36px', height: '36px' }}
                title="Cerrar Sesión"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              style={{
                padding: '8px 16px',
                border: '1px solid var(--border-dark)',
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all var(--transition-fast)'
              }}
              className="btn-secondary"
            >
              Ingresar
            </button>
          )}

          {/* Theme Toggle */}
          <button 
            className="btn-icon flex-center" 
            onClick={toggleTheme} 
            title="Cambiar tema"
            style={{ width: '36px', height: '36px', border: 'none', background: 'none' }}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Cart Button */}
          <button 
            onClick={openCart} 
            className="flex-center" 
            style={{
              position: 'relative',
              padding: '8px 14px',
              border: '1px solid var(--border-dark)',
              backgroundColor: 'var(--text-primary)',
              color: 'var(--bg-primary)',
              cursor: 'pointer',
              fontWeight: 600,
              fontFamily: 'var(--font-heading)',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              transition: 'all var(--transition-fast)'
            }}
          >
            <ShoppingBag size={14} style={{ marginRight: '6px' }} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="flex-center" style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: '2px solid var(--text-primary)',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '0.65rem',
                fontWeight: 800
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
