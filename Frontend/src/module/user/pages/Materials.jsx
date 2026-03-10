import React, { useState } from 'react';
import { mockMaterials } from '../mockData';

const MaterialCategories = ['All', 'Basic', 'Steel', 'Masonry', 'Flooring', 'Plumbing', 'Electrical', 'Finishing', 'Wood'];

const initialMaterials = [
    { id: 'MAT-101', name: 'Cement (OPC 53 Grade)', category: 'Basic', price: '420', unit: 'per bag (50kg)', image: 'https://images.unsplash.com/photo-1589939705384-5185138a19af?w=400&q=80', status: 'Active', brands: [{ id: 'b1', name: 'UltraTech Cement', price: 420, quality: 'Premium' }, { id: 'b2', name: 'ACC Gold', price: 455, quality: 'High Strength' }] },
    { id: 'MAT-102', name: 'TMT Steel Rods (12mm)', category: 'Steel', price: '58', unit: 'per kg', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80', status: 'Active', brands: [{ id: 's1', name: 'Tata Tiscon SD', price: 68, quality: 'FE 550D' }] },
    { id: 'MAT-103', name: 'Premium Red Bricks', category: 'Masonry', price: '9', unit: 'per piece', image: 'https://images.unsplash.com/photo-1590069230002-70cc8a49c958?w=400&q=80', status: 'Active', brands: [{ id: 'br1', name: 'Local Premium', price: 9, quality: 'Grade A' }] },
    { id: 'MAT-104', name: 'Coarse River Sand', category: 'Basic', price: '55', unit: 'per cft', image: 'https://images.unsplash.com/photo-1589939705384-5185138a19af?w=400&q=80', status: 'Active', brands: [{ id: 'gen1', name: 'Standard Quality', price: 55, quality: 'ISI Marked' }] }
];

const Materials = () => {
    const [viewMode, setViewMode] = useState('store'); // 'store' or 'orders'
    const [search, setSearch] = useState('');
    const [activeCat, setActiveCat] = useState('All');
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [bookingData, setBookingData] = useState({ brand: '', quantity: 1 });
    const [showSuccess, setShowSuccess] = useState(false);
    const [showUserNotifs, setShowUserNotifs] = useState(false);

    // My Orders history logic
    const [myOrders, setMyOrders] = useState([]);

    const loadOrders = () => {
        const orders = JSON.parse(localStorage.getItem('cc_material_orders') || '[]');
        const currentUserId = localStorage.getItem('user_id') || 'USER-001';
        setMyOrders(orders.filter(o => o.userId === currentUserId));
    };

    // Dynamic catalog from Admin
    const [catalog, setCatalog] = useState(() => {
        const saved = localStorage.getItem('cc_materials_catalog');
        return saved ? JSON.parse(saved) : initialMaterials;
    });

    // Listen for storage changes
    React.useEffect(() => {
        loadOrders();
        const handleStorage = (e) => {
            if (!e || !e.key || e.key === 'cc_materials_catalog' || e.key === 'cc_material_orders') {
                const refreshedCat = localStorage.getItem('cc_materials_catalog');
                if (refreshedCat) setCatalog(JSON.parse(refreshedCat));
                loadOrders();
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    // Removed hardcoded brand logic (Now using dynamic catalog)

    // User notifications (Accepted/Rejected orders)
    const userNotifications = React.useMemo(() => {
        const orders = JSON.parse(localStorage.getItem('cc_material_orders') || '[]');
        return orders.filter(o => o.userId === (localStorage.getItem('user_id') || 'USER-001') && o.status !== 'pending');
    }, [showUserNotifs, showSuccess]);

    const handleBooking = () => {
        if (!bookingData.brand) {
            alert('Please select a brand first');
            return;
        }

        try {
            const newOrder = {
                id: `ORD-${Date.now()}`,
                userId: localStorage.getItem('user_id') || 'USER-001',
                userName: localStorage.getItem('user_name') || 'Guest User',
                userAddress: `${localStorage.getItem('user_city') || 'N/A'}, ${localStorage.getItem('user_area') || ''}`,
                userPhone: localStorage.getItem('user_phone') || 'N/A',
                materialName: selectedMaterial.name,
                brand: bookingData.brand.name,
                quantity: bookingData.quantity,
                unit: selectedMaterial.unit,
                pricePerUnit: bookingData.brand.price,
                totalPrice: (bookingData.brand.price || 0) * bookingData.quantity,
                status: 'pending',
                createdAt: new Date().toISOString(),
                deliveryTime: null
            };

            const existingOrders = JSON.parse(localStorage.getItem('cc_material_orders') || '[]');
            localStorage.setItem('cc_material_orders', JSON.stringify([newOrder, ...existingOrders]));

            setShowSuccess(true);
            loadOrders(); // Immediate refresh local state

            // Dispatch custom storage event for same-window updates
            window.dispatchEvent(new Event('storage'));
        } catch (err) {
            console.error("Booking failed:", err);
            alert("Ordering failed, please try again.");
        }
    };

    const filtered = React.useMemo(() => {
        return catalog.filter(m => {
            const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
            const matchesCat = activeCat === 'All' || m.category === activeCat;
            const isActive = m.status === 'Active';
            return matchesSearch && matchesCat && isActive;
        });
    }, [search, activeCat, catalog]);

    return (
        <div style={{ paddingBottom: 20 }}>
            {/* Refined Managed Header */}
            <header style={{
                padding: '16px 20px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                borderRadius: '0 0 32px 32px',
                boxShadow: '0 10px 40px rgba(124, 58, 237, 0.25)',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                {/* Brand & Action Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                        <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: '21px', fontWeight: '1000', color: '#fff', margin: '0 0 2px 0', letterSpacing: '-0.5px' }}>
                            Material Store
                        </h1>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: 'rgba(255,255,255,0.6)', margin: 0, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                            Direct booking & rates
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {/* Tab Toggle - Compact Glass */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            padding: '3px',
                            borderRadius: '14px',
                            display: 'flex',
                            gap: '3px',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <button
                                onClick={() => setViewMode('store')}
                                style={{
                                    padding: '6px 12px', borderRadius: '11px',
                                    background: viewMode === 'store' ? '#fff' : 'transparent',
                                    color: viewMode === 'store' ? '#7C3AED' : 'rgba(255, 255, 255, 0.6)',
                                    fontSize: '9px', fontWeight: '900', textTransform: 'uppercase',
                                    border: 'none', cursor: 'pointer', transition: 'all 0.3s ease'
                                }}
                            >
                                Store
                            </button>
                            <button
                                onClick={() => setViewMode('orders')}
                                style={{
                                    padding: '6px 12px', borderRadius: '11px',
                                    background: viewMode === 'orders' ? '#fff' : 'transparent',
                                    color: viewMode === 'orders' ? '#7C3AED' : 'rgba(255, 255, 255, 0.6)',
                                    fontSize: '9px', fontWeight: '900', textTransform: 'uppercase',
                                    border: 'none', cursor: 'pointer', transition: 'all 0.3s ease'
                                }}
                            >
                                Orders
                            </button>
                        </div>

                        {/* Compact Notification Bell */}
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowUserNotifs(!showUserNotifs)}
                                style={{
                                    width: '34px', height: '34px', borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                    transition: 'all 0.2s', position: 'relative', backdropFilter: 'blur(10px)'
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>
                                {userNotifications.length > 0 && <span style={{ position: 'absolute', top: '7px', right: '7px', width: '7px', height: '7px', background: '#EF4444', borderRadius: '50%', border: '1.5px solid #7C3AED' }} />}
                            </button>

                            {/* Premium Side Drawer Notifications */}
                            {showUserNotifs && (
                                <>
                                    {/* Backdrop */}
                                    <div
                                        onClick={() => setShowUserNotifs(false)}
                                        style={{
                                            position: 'fixed', inset: 0,
                                            background: 'rgba(0,0,0,0.3)',
                                            backdropFilter: 'blur(4px)',
                                            zIndex: 2000,
                                            animation: 'fadeIn 0.3s ease'
                                        }}
                                    />
                                    {/* Drawer */}
                                    <div style={{
                                        position: 'fixed', top: 0, right: 0,
                                        width: '85%', maxWidth: '340px', height: '100vh',
                                        background: '#fff',
                                        boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
                                        zIndex: 3000,
                                        display: 'flex', flexDirection: 'column',
                                        animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                    }}>
                                        <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#111827', letterSpacing: '0.5px' }}>NOTIFICATIONS</h4>
                                            <button
                                                onClick={() => setShowUserNotifs(false)}
                                                style={{ border: 'none', background: '#F8FAFC', width: '32px', height: '32px', borderRadius: '10px', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >✕</button>
                                        </div>

                                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
                                            {userNotifications.length === 0 ? (
                                                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                                    <div style={{ fontSize: '40px', marginBottom: 16 }}>🔔</div>
                                                    <p style={{ fontSize: '14px', color: '#94A3B8', fontWeight: '500' }}>No notifications yet.</p>
                                                </div>
                                            ) : (
                                                userNotifications.map(notif => (
                                                    <div key={notif.id} style={{ padding: '16px', borderRadius: '20px', background: notif.status === 'accepted' ? '#F0FDF4' : '#FEF2F2', border: '1px solid', borderColor: notif.status === 'accepted' ? '#DCFCE7' : '#FEE2E2', position: 'relative' }}>
                                                        <div style={{ display: 'flex', gap: 12 }}>
                                                            <div style={{
                                                                width: '10px', height: '10px', borderRadius: '50%',
                                                                background: notif.status === 'accepted' ? '#10B981' : '#EF4444',
                                                                marginTop: '4px'
                                                            }} />
                                                            <div>
                                                                <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '800', color: notif.status === 'accepted' ? '#166534' : '#991B1B' }}>
                                                                    {notif.status === 'accepted' ? 'Order Confirmed' : 'Order Rejected'}
                                                                </p>
                                                                <p style={{ margin: 0, fontSize: '11px', fontWeight: '600', color: notif.status === 'accepted' ? '#15803D' : '#B91C1C', lineHeight: 1.5 }}>
                                                                    {notif.brand}: {notif.status === 'accepted' ? `Your material is arriving in ${notif.deliveryTime}.` : 'The order was declined by admin.'}
                                                                </p>
                                                                <p style={{ margin: '8px 0 0', fontSize: '9px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>
                                                                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        <div style={{ padding: '20px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9' }}>
                                            <button
                                                onClick={() => { setShowUserNotifs(false); setViewMode('orders'); }}
                                                style={{ width: '100%', padding: '14px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', color: '#fff', fontSize: '13px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)' }}
                                            >
                                                VIEW ALL ORDERS
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Integrated Search Bar - Refined */}
                {viewMode === 'store' && (
                    <div style={{
                        background: '#fff',
                        borderRadius: '16px',
                        padding: '0 16px',
                        height: '46px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            type="text"
                            placeholder="Requirement details..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                border: 'none', background: 'transparent', width: '100%',
                                fontFamily: "'Inter', sans-serif", fontSize: '13px', outline: 'none',
                                color: '#111827', fontWeight: '500'
                            }}
                        />
                    </div>
                )}
            </header>

            {viewMode === 'store' ? (
                <>
                    {/* Reference Note Banner */}
                    <div style={{ padding: '16px 20px 0' }} className="fade-in-slide">
                        <div style={{
                            background: 'linear-gradient(90deg, #FFFBEB 0%, #FEF9C3 100%)',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            border: '1px solid rgba(133, 77, 14, 0.1)',
                            boxShadow: '0 4px 12px rgba(133, 77, 14, 0.04)'
                        }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '10px', background: '#FEF08A',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0
                            }}>
                                💡
                            </div>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#854D0E', margin: 0, lineHeight: 1.5, fontWeight: '500' }}>
                                <b style={{ fontWeight: '900', color: '#713F12' }}>Live Market:</b> Tap any material to select brand and book directly.
                            </p>
                        </div>
                    </div>

                    {/* Category Filter Chips */}
                    <div style={{
                        padding: '20px 0 8px',
                        display: 'flex',
                        gap: 8,
                        overflowX: 'auto',
                        scrollbarWidth: 'none',
                        paddingLeft: 20,
                        paddingRight: 20
                    }} className="hide-scrollbar">
                        {MaterialCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCat(cat)}
                                style={{
                                    padding: '10px 18px',
                                    borderRadius: '12px',
                                    border: '1px solid',
                                    borderColor: activeCat === cat ? '#7C3AED' : '#F3F4F6',
                                    background: activeCat === cat ? '#7C3AED' : '#fff',
                                    color: activeCat === cat ? '#fff' : '#4B5563',
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '14px',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    boxShadow: activeCat === cat ? '0 8px 16px rgba(124, 58, 237, 0.2)' : 'none',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Materials Grid */}
                    <div style={{
                        padding: '16px 20px',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px'
                    }}>
                        {filtered.map(m => (
                            <div key={m.id} style={{
                                background: '#fff',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                border: '1px solid #F3F4F6',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '240px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                                onClick={() => setSelectedMaterial(m)}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ height: '110px', width: '100%', overflow: 'hidden', position: 'relative', background: '#F3F4F6' }}>
                                    <img
                                        src={m.image}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        alt={m.name}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div style={{
                                        position: 'absolute', top: '8px', right: '8px',
                                        background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '6px',
                                        fontSize: '10px', fontWeight: '800', color: '#7C3AED', backdropFilter: 'blur(4px)'
                                    }}>
                                        {m.category}
                                    </div>
                                </div>
                                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                                    <div>
                                        <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: '800', color: '#111827', margin: '0 0 6px 0', lineHeight: 1.4, height: '42px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                            {m.name}
                                        </h3>
                                    </div>
                                    <div style={{ paddingTop: 8, borderTop: '1px solid #F9FAFB' }}>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: '900', color: '#7C3AED' }}>
                                                {m.price}
                                            </span>
                                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#64748B', fontWeight: '600' }}>
                                                {m.unit}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
                            <p style={{ fontSize: '40px', marginBottom: 12 }}>🧱</p>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>No materials found for "{search}"</p>
                        </div>
                    )}
                </>
            ) : (
                <div style={{ padding: '24px 20px' }} className="fade-in-slide">
                    <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1F2937', marginBottom: '20px' }}>Order History</h2>
                    {myOrders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '24px', border: '1px solid #F1F5F9' }}>
                            <p style={{ fontSize: '40px', marginBottom: 12 }}>📦</p>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#94A3B8' }}>You haven't booked any materials yet.</p>
                            <button
                                onClick={() => setViewMode('store')}
                                style={{ marginTop: '16px', padding: '10px 20px', borderRadius: '12px', background: '#7C3AED', color: '#fff', border: 'none', fontWeight: '800', fontSize: '12px' }}
                            >
                                Browse Materials
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {myOrders.map(order => (
                                <div key={order.id} style={{ background: '#fff', borderRadius: '24px', padding: '20px', border: '1px solid #F1F5F9', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <div>
                                            <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '900', color: '#111827' }}>{order.materialName}</h4>
                                            <p style={{ margin: 0, fontSize: '11px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>{order.brand} • {order.quantity} {order.unit}</p>
                                        </div>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontBlack: '900', textTransform: 'uppercase', letterSpacing: '0.5px',
                                            background: order.status === 'pending' ? '#FFFBEB' : order.status === 'accepted' ? '#ECFDF5' : '#FEF2F2',
                                            color: order.status === 'pending' ? '#D97706' : order.status === 'accepted' ? '#059669' : '#DC2626'
                                        }}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F9FAFB' }}>
                                        <p style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#7C3AED' }}>₹{order.totalPrice}</p>
                                        <p style={{ margin: 0, fontSize: '10px', fontWeight: '700', color: '#D1D5DB' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    {order.status === 'accepted' && order.deliveryTime && (
                                        <div style={{ marginTop: '12px', padding: '10px', background: '#F0FDFA', borderRadius: '12px', border: '1px solid #CCFBF1' }}>
                                            <p style={{ margin: 0, fontSize: '11px', fontWeight: '800', color: '#0F766E' }}>🚚 Estimated Delivery: {order.deliveryTime}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Booking Modal ── */}
            {selectedMaterial && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                    background: 'rgba(17, 24, 39, 0.7)', backdropFilter: 'blur(8px)'
                }}>
                    <div style={{
                        width: '100%', maxWidth: '500px', background: '#fff',
                        borderRadius: '32px 32px 0 0', padding: '24px',
                        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                            <div>
                                <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#111827' }}>Book {selectedMaterial.name}</h2>
                                <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Market Price: {selectedMaterial.price}</p>
                            </div>
                            <button onClick={() => setSelectedMaterial(null)} style={{ border: 'none', background: '#F1F5F9', width: '36px', height: '36px', borderRadius: '12px', cursor: 'pointer', color: '#64748B' }}>✕</button>
                        </div>

                        {showSuccess ? (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <div style={{ width: '64px', height: '64px', background: '#ECFDF5', borderRadius: '50%', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#065F46' }}>Booking Request Sent</h3>
                                <p style={{ fontSize: '13px', color: '#047857', marginBottom: '24px' }}>Admin will confirm your delivery shortly.</p>

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        onClick={() => {
                                            setShowSuccess(false);
                                            setSelectedMaterial(null);
                                            setBookingData({ brand: '', quantity: 1 });
                                            setViewMode('orders');
                                        }}
                                        style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: '#7C3AED', color: '#fff', fontSize: '13px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase' }}
                                    >
                                        View My Orders
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowSuccess(false);
                                            setSelectedMaterial(null);
                                            setBookingData({ brand: '', quantity: 1 });
                                        }}
                                        style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', fontSize: '13px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase' }}
                                    >
                                        Keep Shopping
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '900', color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Select Brand</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {selectedMaterial.brands && selectedMaterial.brands.length > 0 ? (
                                            selectedMaterial.brands.map(brand => (
                                                <div
                                                    key={brand.id}
                                                    onClick={() => setBookingData({ ...bookingData, brand })}
                                                    style={{
                                                        padding: '14px 18px', borderRadius: '16px', border: '2px solid',
                                                        borderColor: bookingData.brand?.id === brand.id ? '#7C3AED' : '#F1F5F9',
                                                        background: bookingData.brand?.id === brand.id ? '#F5F3FF' : '#fff',
                                                        cursor: 'pointer', transition: 'all 0.2s',
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                                    }}
                                                >
                                                    <div>
                                                        <p style={{ fontSize: '14px', fontWeight: '800', color: bookingData.brand?.id === brand.id ? '#7C3AED' : '#1F2937', margin: 0 }}>{brand.name}</p>
                                                        <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#94A3B8', margin: 0 }}>{brand.quality}</p>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <p style={{ fontSize: '15px', fontWeight: '900', color: '#111827', margin: 0 }}>₹{brand.price}</p>
                                                        <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#94A3B8', margin: 0 }}>{selectedMaterial.unit}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p style={{ textAlign: 'center', fontSize: '12px', color: '#94A3B8', padding: '20px' }}>No brands available for this material.</p>
                                        )}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '11px', fontWeight: '900', color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Quantity ({selectedMaterial.unit})</label>
                                        <input
                                            type="number"
                                            value={bookingData.quantity}
                                            onChange={(e) => setBookingData({ ...bookingData, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                                            style={{
                                                width: '100%', padding: '14px 18px', borderRadius: '16px', border: '2px solid #F1F5F9',
                                                fontSize: '16px', fontWeight: '800', background: '#FAFBFC', outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '11px', fontWeight: '900', color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Est. Total</label>
                                        <p style={{ fontSize: '24px', fontWeight: '900', color: '#7C3AED', margin: 0 }}>
                                            ₹{(bookingData.brand?.price || 0) * bookingData.quantity}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleBooking}
                                    style={{
                                        width: '100%', padding: '18px', borderRadius: '18px', border: 'none',
                                        background: '#7C3AED', color: '#fff', fontSize: '15px', fontWeight: '900',
                                        cursor: 'pointer', boxShadow: '0 10px 20px rgba(124, 58, 237, 0.3)',
                                        marginTop: 8, textTransform: 'uppercase', letterSpacing: '1px'
                                    }}>
                                    Confirm Booking
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { transform: translateY(10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .fade-in-slide { animation: slideIn 0.5s ease-out; }
            `}</style>
        </div>
    );
};

export default Materials;
