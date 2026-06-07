import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Tag, TrendingUp, ShoppingCart, Users, Check, Edit2, 
  Settings, Award, RefreshCw, Layers, DollarSign, Filter, Search 
} from 'lucide-react';

const PATTERNS_PRESETS = [
  {
    name: 'Grid Fino',
    value: {
      background: '#121212',
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
      backgroundSize: '15px 15px'
    }
  },
  {
    name: 'Diagonales Gruesas',
    value: {
      background: 'repeating-linear-gradient(45deg, #000, #000 20px, #fff 20px, #fff 40px)'
    }
  },
  {
    name: 'Bloques Sólidos',
    value: {
      background: 'linear-gradient(to bottom, #000000 50%, #fafafa 50%)'
    }
  },
  {
    name: 'Círculos Concéntricos',
    value: {
      background: '#ffffff',
      backgroundImage: 'radial-gradient(#000000 20%, transparent 20%), radial-gradient(#000000 20%, transparent 20%)',
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 10px 10px'
    }
  }
];

// Initial realistic data sets
const INITIAL_USERS = [
  { id: 'u1', name: 'Admin Shell Out', email: 'admin@shellout.com', role: 'admin', points: 0 }
];

const INITIAL_ORDERS = [];

const INITIAL_COUPONS = [];

export default function AdminDashboard({ products, onAddProduct, onDeleteProduct }) {
  const [activeSubTab, setActiveSubTab] = useState('overview'); // overview, catalog, orders, users, coupons
  
  // LocalStorage state management
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('so_admin_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('so_admin_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('so_admin_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  // Sync to localstorage
  useEffect(() => {
    localStorage.setItem('so_admin_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('so_admin_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('so_admin_coupons', JSON.stringify(coupons));
  }, [coupons]);

  // Form states - New Product
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState(19990);
  const [prodCategory, setProdCategory] = useState('Minimalista');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states - New Coupon
  const [couponCode, setCouponCode] = useState('');
  const [couponVal, setCouponVal] = useState(1000);
  const [couponType, setCouponType] = useState('Fijo');

  const [toast, setToast] = useState(null);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Handler: Add new product
  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!prodName || !prodDesc) return;

    if (editingProduct) {
      // Edit existing product
      // We simulate local edit by invoking standard delete & re-add, or we just notify
      const updated = {
        ...editingProduct,
        name: prodName,
        description: prodDesc,
        price: Number(prodPrice),
        category: prodCategory,
        pattern: PATTERNS_PRESETS[selectedPresetIndex].value
      };
      onDeleteProduct(editingProduct.id);
      onAddProduct(updated);
      setEditingProduct(null);
      triggerToast('Producto editado correctamente.');
    } else {
      // Add new
      const newProduct = {
        id: `p-${Date.now()}`,
        name: prodName,
        category: prodCategory,
        price: Number(prodPrice),
        description: prodDesc,
        pattern: PATTERNS_PRESETS[selectedPresetIndex].value
      };
      onAddProduct(newProduct);
      triggerToast('Nuevo producto publicado con éxito.');
    }

    setProdName('');
    setProdDesc('');
    setProdPrice(19990);
  };

  // Handler: Set editing product form
  const startEditProduct = (p) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdDesc(p.description);
    setProdPrice(p.price);
    setProdCategory(p.category);
    // Find preset if possible
    const idx = PATTERNS_PRESETS.findIndex(preset => preset.value.background === p.pattern.background);
    if (idx !== -1) setSelectedPresetIndex(idx);
    setActiveSubTab('catalog');
  };

  // Handler: Update Order Status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    triggerToast(`Pedido #${orderId} actualizado a "${newStatus}"`);
  };

  // Handler: Modify User Points
  const adjustUserPoints = (userId, amount) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newPoints = Math.max(0, u.points + amount);
        return { ...u, points: newPoints };
      }
      return u;
    }));
    triggerToast('Puntos de usuario ajustados.');
  };

  // Handler: Toggle User Admin Role
  const toggleUserRole = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newRole = u.role === 'admin' ? 'buyer' : 'admin';
        return { ...u, role: newRole };
      }
      return u;
    }));
    triggerToast('Rol de usuario actualizado.');
  };

  // Handler: Add Coupon
  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!couponCode) return;
    const cleanCode = couponCode.toUpperCase().trim();
    if (coupons.some(c => c.code === cleanCode)) {
      alert('Este código de cupón ya existe.');
      return;
    }

    const newCoupon = {
      code: cleanCode,
      value: Number(couponVal),
      type: couponType,
      description: couponType === 'Fijo' ? `Descuento fijo de $${Number(couponVal).toLocaleString('es-CL')} CLP` : 'Envío gratis en compras elegibles'
    };

    setCoupons(prev => [...prev, newCoupon]);
    setCouponCode('');
    setCouponVal(1000);
    triggerToast('Cupón creado exitosamente.');
  };

  // Handler: Delete Coupon
  const handleDeleteCoupon = (code) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    triggerToast('Cupón eliminado.');
  };

  // Calculate gross sales
  const totalGrossSales = orders.reduce((sum, o) => sum + o.total, 0);

  // Calculate daily sales dynamically based on orders
  const getDailySales = () => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const dayTotals = { Lun: 0, Mar: 0, Mié: 0, Jue: 0, Vie: 0, Sáb: 0, Dom: 0 };
    
    orders.forEach(o => {
      if (!o.date) return;
      try {
        const dateObj = new Date(o.date + 'T00:00:00');
        const dayName = days[dateObj.getDay()];
        if (dayTotals[dayName] !== undefined) {
          dayTotals[dayName] += o.total;
        }
      } catch (e) {
        console.error(e);
      }
    });

    return [
      { day: 'Lun', val: dayTotals.Lun },
      { day: 'Mar', val: dayTotals.Mar },
      { day: 'Mié', val: dayTotals.Mié },
      { day: 'Jue', val: dayTotals.Jue },
      { day: 'Vie', val: dayTotals.Vie },
      { day: 'Sáb', val: dayTotals.Sáb },
      { day: 'Dom', val: dayTotals.Dom }
    ];
  };

  const dailySales = getDailySales();
  const maxSale = Math.max(...dailySales.map(d => d.val), 1);

  return (
    <section className="section" style={{ borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        
        {/* Toast alert */}
        {toast && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#000',
            color: '#fff',
            padding: '16px 24px',
            fontWeight: 700,
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Check size={18} style={{ color: '#fff' }} /> {toast}
          </div>
        )}

        {/* Dashboard Title Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px', textAlign: 'left' }}>
          <div>
            <span className="badge" style={{ marginBottom: '10px' }}>Dashboard Administrativo</span>
            <h2 className="section-title" style={{ margin: 0 }}>Shell Out Control Center</h2>
            <p className="section-subtitle" style={{ margin: '6px 0 0' }}>
              Gestión general y monitoreo en tiempo real de productos, órdenes, usuarios y campañas.
            </p>
          </div>
          
          <button 
            onClick={() => {
              setUsers(INITIAL_USERS);
              setOrders(INITIAL_ORDERS);
              setCoupons(INITIAL_COUPONS);
              triggerToast('Métricas y datos restablecidos de fábrica.');
            }}
            className="btn-secondary" 
            style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} /> Reestablecer Datos
          </button>
        </div>

        {/* Top-Level Admin Navigation Subtabs */}
        <div style={{
          display: 'flex',
          borderBottom: '2px solid var(--border-light)',
          gap: '24px',
          marginBottom: '40px',
          overflowX: 'auto',
          paddingBottom: '2px'
        }}>
          <button 
            onClick={() => setActiveSubTab('overview')}
            style={{
              padding: '12px 6px',
              fontWeight: 800,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: 'none',
              backgroundColor: 'transparent',
              color: activeSubTab === 'overview' ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: activeSubTab === 'overview' ? '3px solid var(--border-dark)' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <TrendingUp size={16} /> Métricas
          </button>

          <button 
            onClick={() => setActiveSubTab('catalog')}
            style={{
              padding: '12px 6px',
              fontWeight: 800,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: 'none',
              backgroundColor: 'transparent',
              color: activeSubTab === 'catalog' ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: activeSubTab === 'catalog' ? '3px solid var(--border-dark)' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Layers size={16} /> Catálogo
          </button>

          <button 
            onClick={() => setActiveSubTab('orders')}
            style={{
              padding: '12px 6px',
              fontWeight: 800,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: 'none',
              backgroundColor: 'transparent',
              color: activeSubTab === 'orders' ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: activeSubTab === 'orders' ? '3px solid var(--border-dark)' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ShoppingCart size={16} /> Pedidos ({orders.length})
          </button>

          <button 
            onClick={() => setActiveSubTab('users')}
            style={{
              padding: '12px 6px',
              fontWeight: 800,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: 'none',
              backgroundColor: 'transparent',
              color: activeSubTab === 'users' ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: activeSubTab === 'users' ? '3px solid var(--border-dark)' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Users size={16} /> Usuarios ({users.length})
          </button>

          <button 
            onClick={() => setActiveSubTab('coupons')}
            style={{
              padding: '12px 6px',
              fontWeight: 800,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: 'none',
              backgroundColor: 'transparent',
              color: activeSubTab === 'coupons' ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: activeSubTab === 'coupons' ? '3px solid var(--border-dark)' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Tag size={16} /> Cupones ({coupons.length})
          </button>
        </div>

        {/* SUBTAB 1: OVERVIEW & ANALYTICS */}
        {activeSubTab === 'overview' && (
          <div style={{ textAlign: 'left' }}>
            {/* KPI Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              marginBottom: '40px'
            }}>
              <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', color: 'var(--text-muted)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ingresos Brutos</span>
                  <DollarSign size={18} />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 900 }}>${totalGrossSales.toLocaleString('es-CL')} CLP</div>
                <span style={{ fontSize: '0.75rem', color: 'green', fontWeight: 700 }}>+18.3% vs semana anterior</span>
              </div>

              <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', color: 'var(--text-muted)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Órdenes Totales</span>
                  <ShoppingCart size={18} />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 900 }}>{orders.length}</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ticket Promedio: ${(totalGrossSales / (orders.length || 1)).toLocaleString('es-CL', { maximumFractionDigits: 0 })} CLP</span>
              </div>

              <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', color: 'var(--text-muted)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Catálogo Activo</span>
                  <Layers size={18} />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 900 }}>{products.length}</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fundas cargadas en producción</span>
              </div>

              <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', color: 'var(--text-muted)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Usuarios Registrados</span>
                  <Users size={18} />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 900 }}>{users.length}</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{users.filter(u => u.role === 'admin').length} administradores</span>
              </div>
            </div>

            {/* Recent activity & Charts */}
            <div className="grid-cols-2" style={{ gap: '30px', alignItems: 'start' }}>
              {/* Sales Chart Mockup */}
              <div style={{ padding: '30px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px' }}>
                  Tendencia de Ventas Diarias
                </h3>
                
                {/* Visual Custom Bars representing Sales */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '20px', borderBottom: '2px solid var(--border-dark)', paddingBottom: '10px' }}>
                  {dailySales.map((item, idx) => {
                    const barHeight = maxSale > 1 ? (item.val / maxSale) * 120 : 0;
                    const displayLabel = item.val > 0 ? `$${(item.val / 1000).toFixed(0)}k` : '$0';
                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, gap: '8px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>{displayLabel}</span>
                        <div style={{
                          width: '28px',
                          height: `${barHeight}px`,
                          backgroundColor: item.val > 0 ? 'var(--text-primary)' : 'var(--border-light)',
                          transition: 'height var(--transition-normal) ease-out'
                        }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{item.day}</span>
                      </div>
                    );
                  })}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '16px', textAlign: 'center' }}>
                  * Ventas diarias calculadas en tiempo real a partir de las órdenes registradas en el sistema.
                </p>
              </div>

              {/* Status breakdown */}
              <div style={{ padding: '30px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)', height: '100%', boxSizing: 'border-box' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px' }}>
                  Resumen de Despachos
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[
                    { label: 'Entregados con Éxito', count: orders.filter(o => o.status === 'Entregado').length },
                    { label: 'En Tránsito (Despachado)', count: orders.filter(o => o.status === 'Despachado').length },
                    { label: 'En Taller (Producción)', count: orders.filter(o => o.status === 'En producción').length }
                  ].map((st, i) => {
                    const pct = orders.length > 0 ? Math.round((st.count / orders.length) * 100) : 0;
                    return (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                          <span>{st.label} ({st.count})</span>
                          <span>{pct}%</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: 'var(--text-primary)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: CATALOG MANAGEMENT */}
        {activeSubTab === 'catalog' && (
          <div className="grid-cols-2" style={{ alignItems: 'start', gap: '40px' }}>
            
            {/* Left: Product Form */}
            <div style={{ textAlign: 'left' }}>
              <div style={{
                padding: '32px',
                border: '2px solid var(--border-dark)',
                backgroundColor: 'var(--bg-primary)'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', textTransform: 'uppercase' }}>
                  {editingProduct ? 'Editar Diseño Existente' : 'Crear Nuevo Diseño'}
                </h3>

                <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
                      NOMBRE DEL DISEÑO
                    </label>
                    <input
                      type="text"
                      required
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      placeholder="Ej. Cyber Chevron"
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
                      DESCRIPCIÓN
                    </label>
                    <textarea
                      required
                      value={prodDesc}
                      onChange={(e) => setProdDesc(e.target.value)}
                      placeholder="Escribe los detalles de este patrón..."
                      className="form-input"
                      rows={3}
                      style={{ resize: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
                        PRECIO ($ CLP)
                      </label>
                      <input
                        type="number"
                        required
                        value={prodPrice}
                        onChange={(e) => setProdPrice(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
                        CATEGORÍA
                      </label>
                      <select
                        value={prodCategory}
                        onChange={(e) => setProdCategory(e.target.value)}
                        className="form-input"
                        style={{ fontWeight: 600, height: '46px', padding: '0 12px' }}
                      >
                        <option value="Minimalista">Minimalista</option>
                        <option value="Geométrico">Geométrico</option>
                        <option value="Texturas">Texturas</option>
                        <option value="Artístico">Artístico</option>
                      </select>
                    </div>
                  </div>

                  {/* Pattern Preset selection */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>
                      PATRÓN GEOMÉTRICO (RENDERIZACIÓN CSS)
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                      {PATTERNS_PRESETS.map((preset, index) => (
                        <button
                          type="button"
                          key={index}
                          onClick={() => setSelectedPresetIndex(index)}
                          style={{
                            padding: '12px',
                            border: selectedPresetIndex === index ? '2px solid var(--border-dark)' : '1px solid var(--border-light)',
                            backgroundColor: selectedPresetIndex === index ? 'var(--bg-secondary)' : 'transparent',
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}
                        >
                          <span style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px',
                            border: '1px solid #aaa',
                            ...preset.value
                          }} />
                          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    {editingProduct && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setEditingProduct(null);
                          setProdName('');
                          setProdDesc('');
                          setProdPrice(19990);
                        }}
                        className="btn-secondary" 
                        style={{ flex: 1, justifyContent: 'center' }}
                      >
                        Cancelar
                      </button>
                    )}
                    <button type="submit" className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                      <Plus size={16} /> {editingProduct ? 'Guardar Cambios' : 'Publicar en Tienda'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right: Products List */}
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', textTransform: 'uppercase' }}>
                Listado de Diseños ({products.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '580px', overflowY: 'auto', paddingRight: '6px' }}>
                {products.map(product => (
                  <div
                    key={product.id}
                    style={{
                      padding: '16px 20px',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '4px',
                        border: '1px solid var(--border-light)',
                        ...product.pattern
                      }} />
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{product.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {product.category} — ${product.price.toLocaleString('es-CL')} CLP
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => startEditProduct(product)}
                        style={{ cursor: 'pointer', border: 'none', backgroundColor: 'transparent' }}
                        className="btn-icon flex-center"
                        title="Editar diseño"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => {
                          if(confirm(`¿Estás seguro de eliminar "${product.name}"?`)){
                            onDeleteProduct(product.id);
                            triggerToast('Producto eliminado.');
                          }
                        }}
                        style={{ color: '#d9534f', cursor: 'pointer', border: 'none', backgroundColor: 'transparent' }}
                        className="btn-icon flex-center"
                        title="Eliminar producto"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: ORDERS MANAGEMENT */}
        {activeSubTab === 'orders' && (
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', textTransform: 'uppercase' }}>
              Gestión de Pedidos Clientes
            </h3>
            
            <div style={{ overflowX: 'auto', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-dark)', backgroundColor: 'var(--bg-tertiary)' }}>
                    <th style={{ padding: '16px 20px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Pedido ID</th>
                    <th style={{ padding: '16px 20px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Cliente</th>
                    <th style={{ padding: '16px 20px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Detalle Productos</th>
                    <th style={{ padding: '16px 20px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Total</th>
                    <th style={{ padding: '16px 20px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Estado</th>
                    <th style={{ padding: '16px 20px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '16px 20px', fontWeight: 700, fontSize: '0.9rem' }}>#{order.id}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{order.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.email}</div>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '0.85rem' }}>{order.items}</td>
                      <td style={{ padding: '16px 20px', fontWeight: 700 }}>${order.total.toLocaleString('es-CL')}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          padding: '4px 10px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          backgroundColor: 
                            order.status === 'Entregado' ? '#e2f0d9' :
                            order.status === 'Despachado' ? '#fff2cc' :
                            order.status === 'En producción' ? '#fce4d6' : '#ededed',
                          color:
                            order.status === 'Entregado' ? '#385723' :
                            order.status === 'Despachado' ? '#7f6000' :
                            order.status === 'En producción' ? '#c65911' : '#595959',
                          borderRadius: '4px'
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="form-input"
                          style={{
                            padding: '6px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            width: '140px',
                            height: '32px'
                          }}
                        >
                          <option value="Recibido">Recibido</option>
                          <option value="En producción">En producción</option>
                          <option value="Despachado">Despachado</option>
                          <option value="Entregado">Entregado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 4: USERS MANAGEMENT */}
        {activeSubTab === 'users' && (
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', textTransform: 'uppercase' }}>
              Base de Clientes y Roles
            </h3>

            <div style={{ overflowX: 'auto', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-dark)', backgroundColor: 'var(--bg-tertiary)' }}>
                    <th style={{ padding: '16px 20px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Nombre</th>
                    <th style={{ padding: '16px 20px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Email</th>
                    <th style={{ padding: '16px 20px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Rol</th>
                    <th style={{ padding: '16px 20px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>ShellPoints</th>
                    <th style={{ padding: '16px 20px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Acciones de Fidelidad</th>
                    <th style={{ padding: '16px 20px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Seguridad</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '16px 20px', fontWeight: 700, fontSize: '0.9rem' }}>{u.name}</td>
                      <td style={{ padding: '16px 20px', fontSize: '0.85rem' }}>{u.email}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          padding: '4px 8px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          backgroundColor: u.role === 'admin' ? '#000' : '#e1e1e1',
                          color: u.role === 'admin' ? '#fff' : '#333',
                          borderRadius: '2px'
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', fontWeight: 800 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Award size={14} /> {u.points} pts
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => adjustUserPoints(u.id, 100)}
                            className="btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '0.7rem' }}
                          >
                            +100 pts
                          </button>
                          <button
                            onClick={() => adjustUserPoints(u.id, -100)}
                            className="btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '0.7rem' }}
                            disabled={u.points < 100}
                          >
                            -100 pts
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <button
                          onClick={() => {
                            if(confirm(`¿Deseas cambiar el rol de ${u.name}?`)){
                              toggleUserRole(u.id);
                            }
                          }}
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700 }}
                          disabled={u.email === 'admin@shellout.com'} // Protect primary admin
                        >
                          Cambiar Rol
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 5: DISCOUNT COUPONS */}
        {activeSubTab === 'coupons' && (
          <div className="grid-cols-2" style={{ alignItems: 'start', gap: '40px' }}>
            
            {/* Create Coupon form */}
            <div style={{ textAlign: 'left' }}>
              <div style={{
                padding: '32px',
                border: '2px solid var(--border-dark)',
                backgroundColor: 'var(--bg-primary)'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', textTransform: 'uppercase' }}>
                  Crear Nuevo Cupón
                </h3>

                <form onSubmit={handleAddCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
                      CÓDIGO DE CUPÓN
                    </label>
                    <input
                      type="text"
                      required
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Ej. VERANO10K"
                      className="form-input"
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
                        VALOR ($ CLP)
                      </label>
                      <input
                        type="number"
                        required
                        value={couponVal}
                        onChange={(e) => setCouponVal(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
                        TIPO
                      </label>
                      <select
                        value={couponType}
                        onChange={(e) => setCouponType(e.target.value)}
                        className="form-input"
                        style={{ fontWeight: 600, height: '46px', padding: '0 12px' }}
                      >
                        <option value="Fijo">Descuento Fijo</option>
                        <option value="Envío">Descuento Envío</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
                    <Plus size={16} /> Crear Cupón
                  </button>
                </form>
              </div>
            </div>

            {/* Coupons List */}
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', textTransform: 'uppercase' }}>
                Cupones Activos ({coupons.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    style={{
                      padding: '16px 20px',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          padding: '2px 8px',
                          fontSize: '0.85rem',
                          fontWeight: 900,
                          backgroundColor: '#000',
                          color: '#fff',
                          letterSpacing: '0.05em'
                        }}>
                          {c.code}
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                          ({c.type})
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '6px 0 0' }}>
                        {c.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteCoupon(c.code)}
                      style={{ color: '#d9534f', cursor: 'pointer', border: 'none', backgroundColor: 'transparent' }}
                      className="btn-icon flex-center"
                      title="Eliminar cupón"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
