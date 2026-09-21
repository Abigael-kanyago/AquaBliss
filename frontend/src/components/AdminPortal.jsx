import React, { useState, useEffect } from 'react';
import { Shield, X, Lock, User, RefreshCw, CheckCircle2, AlertCircle, Search, Filter, Settings, Users, ShoppingBag, LogOut, Check, Trash2, Plus } from 'lucide-react';

export default function AdminPortal({ isOpen, onClose, onPricesUpdated }) {
  const [auth, setAuth] = useState({ loggedIn: false, username: '', role: '' });
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'pricing', 'staff'

  // Login form state
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Pricing state
  const [priceForm, setPriceForm] = useState({
    refill_price_per_liter: 10,
    bottle_cost: 180,
    pump_cost: 250,
    packaged_price_20l: 180,
    branding_cost: 100,
  });
  const [priceSuccess, setPriceSuccess] = useState(false);

  // Staff state
  const [staffList, setStaffList] = useState([]);
  const [newStaffUser, setNewStaffUser] = useState('');
  const [newStaffPass, setNewStaffPass] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('staff');
  const [staffMsg, setStaffMsg] = useState(null);

  // Check auth status on open
  useEffect(() => {
    if (isOpen) {
      checkAuthStatus();
    }
  }, [isOpen]);

  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/auth-status');
      const data = await res.json();
      if (data.authenticated) {
        setAuth({ loggedIn: true, username: data.username, role: data.role });
        fetchOrders();
        fetchPrices();
        fetchStaff();
      } else {
        setAuth({ loggedIn: false, username: '', role: '' });
      }
    } catch (_) {}
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoading(true);

    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAuth({ loggedIn: true, username: data.username, role: data.role });
        fetchOrders();
        fetchPrices();
        fetchStaff();
      } else {
        setLoginError(data.message || 'Invalid username or password.');
      }
    } catch (err) {
      setLoginError('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/logout', { method: 'POST', headers: { 'Accept': 'application/json' } });
      setAuth({ loggedIn: false, username: '', role: '' });
    } catch (_) {}
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/orders?format=json', {
        headers: { 'Accept': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchPrices = async () => {
    try {
      const res = await fetch('/get-prices');
      const data = await res.json();
      if (data.success && data.prices) {
        const pObj = {};
        data.prices.forEach((item) => {
          pObj[item.key] = Number(item.value);
        });
        setPriceForm(pObj);
      }
    } catch (_) {}
  };

  const fetchStaff = async () => {
    try {
      const res = await fetch('/get-staff');
      const data = await res.json();
      if (data.success) {
        setStaffList(data.staff || []);
      }
    } catch (_) {}
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/update-order-status/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleSavePrices = async (e) => {
    e.preventDefault();
    setPriceSuccess(false);
    try {
      const res = await fetch('/update-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(priceForm),
      });
      if (res.ok) {
        setPriceSuccess(true);
        if (onPricesUpdated) onPricesUpdated();
        setTimeout(() => setPriceSuccess(false), 3000);
      }
    } catch (_) {}
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setStaffMsg(null);
    try {
      const res = await fetch('/add-staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          username: newStaffUser,
          password: newStaffPass,
          role: newStaffRole,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStaffMsg({ type: 'success', text: 'Staff account added!' });
        setNewStaffUser('');
        setNewStaffPass('');
        fetchStaff();
      } else {
        setStaffMsg({ type: 'error', text: data.message || 'Failed to add staff' });
      }
    } catch (_) {
      setStaffMsg({ type: 'error', text: 'Server error' });
    }
  };

  const handleDeleteStaff = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this staff user?')) return;
    try {
      const res = await fetch(`/delete-staff/${userId}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        fetchStaff();
      }
    } catch (_) {}
  };

  if (!isOpen) return null;

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      order.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.address?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(3, 8, 16, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: auth.loggedIn ? '1080px' : '440px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(11, 25, 44, 0.98)',
          border: '1px solid rgba(72, 202, 228, 0.35)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 242, 254, 0.15)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0, 0, 0, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(0, 242, 254, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)',
              }}
            >
              <Shield size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.1 }}>
                AquaBliss Staff & Admin
              </h3>
              {auth.loggedIn && (
                <span style={{ fontSize: '0.75rem', color: '#34d399' }}>
                  Logged in as <strong>{auth.username}</strong> ({auth.role})
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {auth.loggedIn && (
              <button
                onClick={handleLogout}
                title="Logout"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#f87171',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {!auth.loggedIn ? (
          /* LOGIN FORM */
          <div style={{ padding: '36px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
                Admin Authentication
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Enter your staff credentials to manage orders & prices.
              </p>
            </div>

            {loginError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '10px',
                  color: '#f87171',
                  fontSize: '0.85rem',
                  marginBottom: '16px',
                }}
              >
                <AlertCircle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Username
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="admin"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 38px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      outline: 'none',
                    }}
                  />
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-subtle)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 38px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      outline: 'none',
                    }}
                  />
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-subtle)' }} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', marginTop: '8px' }}
              >
                {loading ? 'Verifying...' : 'Sign In to Portal'}
              </button>
            </form>
          </div>
        ) : (
          /* LOGGED IN DASHBOARD */
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            {/* Nav Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                padding: '14px 28px',
                background: 'rgba(0, 0, 0, 0.2)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <button
                onClick={() => setActiveTab('orders')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: activeTab === 'orders' ? '#ffffff' : 'var(--text-muted)',
                  background: activeTab === 'orders' ? 'var(--primary)' : 'transparent',
                }}
              >
                <ShoppingBag size={16} />
                <span>Live Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('pricing')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: activeTab === 'pricing' ? '#ffffff' : 'var(--text-muted)',
                  background: activeTab === 'pricing' ? 'var(--primary)' : 'transparent',
                }}
              >
                <Settings size={16} />
                <span>Price Settings</span>
              </button>

              {auth.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('staff')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: activeTab === 'staff' ? '#ffffff' : 'var(--text-muted)',
                    background: activeTab === 'staff' ? 'var(--primary)' : 'transparent',
                  }}
                >
                  <Users size={16} />
                  <span>Staff Accounts</span>
                </button>
              )}
            </div>

            {/* TAB 1: ORDERS */}
            {activeTab === 'orders' && (
              <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
                {/* Search & Status Filter Bar */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '240px' }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <input
                        type="text"
                        placeholder="Search by customer name, phone, address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px 10px 36px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          outline: 'none',
                          fontSize: '0.88rem',
                        }}
                      />
                      <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-subtle)' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      style={{
                        padding: '10px 14px',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'var(--text-main)',
                        fontSize: '0.88rem',
                      }}
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={fetchOrders}
                      title="Refresh orders"
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-main)',
                      }}
                    >
                      <RefreshCw size={16} className={ordersLoading ? 'animate-spin' : ''} />
                    </button>
                  </div>
                </div>

                {/* Orders List / Table */}
                {filteredOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                    No orders match your filter criteria.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredOrders.map((order) => {
                      const statusColors = {
                        pending: '#fbbf24',
                        processing: '#60a5fa',
                        delivered: '#34d399',
                        cancelled: '#f87171',
                      };

                      return (
                        <div
                          key={order.id}
                          style={{
                            padding: '18px 22px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            borderRadius: '12px',
                            display: 'grid',
                            gridTemplateColumns: '80px 1.5fr 1fr 120px 140px',
                            gap: '16px',
                            alignItems: 'center',
                          }}
                        >
                          {/* Order ID */}
                          <div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>ID</span>
                            <div style={{ fontWeight: 800, color: 'var(--accent-cyan)' }}>#{order.id}</div>
                          </div>

                          {/* Customer & Address */}
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{order.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {order.phone || order.email}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
                              📍 {order.address}
                            </div>
                          </div>

                          {/* Order Details */}
                          <div>
                            <div style={{ textTransform: 'capitalize', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                              {order.order_type}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              {order.details
                                ? Object.entries(order.details)
                                    .map(([k, v]) => `${k}: ${v}`)
                                    .join(' · ')
                                : '-'}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                              {order.created_at_str || ''}
                            </div>
                          </div>

                          {/* Price */}
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Total</span>
                            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff' }}>
                              KSh {Number(order.total_price).toLocaleString()}
                            </div>
                          </div>

                          {/* Status Selector */}
                          <div>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                              style={{
                                width: '100%',
                                padding: '8px 10px',
                                borderRadius: '8px',
                                background: 'rgba(0, 0, 0, 0.5)',
                                border: `1px solid ${statusColors[order.status] || 'rgba(255,255,255,0.1)'}`,
                                color: statusColors[order.status] || '#ffffff',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                cursor: 'pointer',
                              }}
                            >
                              <option value="pending" style={{ color: '#000' }}>Pending</option>
                              <option value="processing" style={{ color: '#000' }}>Processing</option>
                              <option value="delivered" style={{ color: '#000' }}>Delivered</option>
                              <option value="cancelled" style={{ color: '#000' }}>Cancelled</option>
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PRICING */}
            {activeTab === 'pricing' && (
              <div style={{ padding: '28px', overflowY: 'auto', flex: 1, maxWidth: '640px' }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
                  Live Product Pricing Configuration
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                  Changes are stored in PostgreSQL settings and will update the entire website & checkout calculator instantly.
                </p>

                {priceSuccess && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 16px',
                      background: 'rgba(52, 211, 153, 0.15)',
                      border: '1px solid rgba(52, 211, 153, 0.3)',
                      borderRadius: '10px',
                      color: '#34d399',
                      fontSize: '0.88rem',
                      marginBottom: '20px',
                    }}
                  >
                    <CheckCircle2 size={18} />
                    <span>Prices successfully updated in PostgreSQL database!</span>
                  </div>
                )}

                <form onSubmit={handleSavePrices} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Refill Price Per Liter (KSh)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={priceForm.refill_price_per_liter || ''}
                      onChange={(e) => setPriceForm({ ...priceForm, refill_price_per_liter: Number(e.target.value) })}
                      style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      New 20L Dispenser Bottle Cost (KSh)
                    </label>
                    <input
                      type="number"
                      value={priceForm.bottle_cost || ''}
                      onChange={(e) => setPriceForm({ ...priceForm, bottle_cost: Number(e.target.value) })}
                      style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Water Pump Cost (KSh)
                    </label>
                    <input
                      type="number"
                      value={priceForm.pump_cost || ''}
                      onChange={(e) => setPriceForm({ ...priceForm, pump_cost: Number(e.target.value) })}
                      style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Packaged 20L Bottle Price (KSh)
                    </label>
                    <input
                      type="number"
                      value={priceForm.packaged_price_20l || ''}
                      onChange={(e) => setPriceForm({ ...priceForm, packaged_price_20l: Number(e.target.value) })}
                      style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Custom Branding Label Cost (KSh)
                    </label>
                    <input
                      type="number"
                      value={priceForm.branding_cost || ''}
                      onChange={(e) => setPriceForm({ ...priceForm, branding_cost: Number(e.target.value) })}
                      style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ padding: '14px', marginTop: '10px' }}>
                    <Check size={18} />
                    <span>Save & Update All Prices</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: STAFF */}
            {activeTab === 'staff' && (
              <div style={{ padding: '28px', overflowY: 'auto', flex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
                  {/* Current Staff List */}
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Active Staff Users</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {staffList.map((member) => (
                        <div
                          key={member.id}
                          style={{
                            padding: '14px 18px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700 }}>{member.username}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Role: <span style={{ textTransform: 'capitalize', color: 'var(--accent-cyan)' }}>{member.role}</span> · Created: {member.created_at || ''}
                            </div>
                          </div>

                          {member.username !== auth.username && (
                            <button
                              onClick={() => handleDeleteStaff(member.id)}
                              style={{
                                padding: '8px',
                                borderRadius: '6px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: '#f87171',
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add New Staff Form */}
                  <div className="glass-card" style={{ padding: '24px' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Add New Staff Member</h4>

                    {staffMsg && (
                      <div
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          background: staffMsg.type === 'success' ? 'rgba(52,211,153,0.15)' : 'rgba(239,68,68,0.15)',
                          color: staffMsg.type === 'success' ? '#34d399' : '#f87171',
                          fontSize: '0.85rem',
                          marginBottom: '14px',
                        }}
                      >
                        {staffMsg.text}
                      </div>
                    )}

                    <form onSubmit={handleAddStaff} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          Username
                        </label>
                        <input
                          type="text"
                          required
                          value={newStaffUser}
                          onChange={(e) => setNewStaffUser(e.target.value)}
                          style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          Password
                        </label>
                        <input
                          type="password"
                          required
                          value={newStaffPass}
                          onChange={(e) => setNewStaffPass(e.target.value)}
                          style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          Role
                        </label>
                        <select
                          value={newStaffRole}
                          onChange={(e) => setNewStaffRole(e.target.value)}
                          style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                        >
                          <option value="staff">Staff (Orders only)</option>
                          <option value="admin">Administrator (Full Access)</option>
                        </select>
                      </div>

                      <button type="submit" className="btn-primary" style={{ padding: '12px' }}>
                        <Plus size={16} />
                        <span>Add Staff Member</span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
