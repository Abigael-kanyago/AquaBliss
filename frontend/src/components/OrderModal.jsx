import React, { useState, useEffect } from 'react';
import { X, Droplets, Package, CheckCircle2, AlertCircle, Loader2, Truck, Phone, Mail, MapPin, User, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderModal({ isOpen, onClose, initialData, prices }) {
  const [orderType, setOrderType] = useState(initialData?.type || 'refill');
  const [liters, setLiters] = useState(initialData?.liters || 20);
  const [bottle, setBottle] = useState(initialData?.bottle || 'no');
  const [pump, setPump] = useState(initialData?.pump || 'no');
  
  const [quantity, setQuantity] = useState(initialData?.quantity || 1);
  const [brand, setBrand] = useState(initialData?.brand || 'no');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      if (initialData.type) setOrderType(initialData.type);
      if (initialData.liters !== undefined) setLiters(initialData.liters);
      if (initialData.bottle) setBottle(initialData.bottle);
      if (initialData.pump) setPump(initialData.pump);
      if (initialData.quantity !== undefined) setQuantity(initialData.quantity);
      if (initialData.brand) setBrand(initialData.brand);
    }
  }, [initialData]);

  if (!isOpen) return null;

  // Compute live price
  const refillPricePerL = prices?.refill_price_per_liter || 10;
  const bottleCost = prices?.bottle_cost || 180;
  const pumpCost = prices?.pump_cost || 250;
  const packagedPrice20L = prices?.packaged_price_20l || 180;
  const brandingCost = prices?.branding_cost || 100;

  let calculatedTotal = 0;
  if (orderType === 'refill') {
    calculatedTotal = liters * refillPricePerL;
    if (bottle === 'yes') calculatedTotal += bottleCost;
    if (pump === 'yes') calculatedTotal += pumpCost;
  } else {
    calculatedTotal = quantity * packagedPrice20L;
    if (brand === 'yes') calculatedTotal += brandingCost;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!formData.address.trim()) {
      setError('Please enter your delivery address / apartment in Makongeni.');
      return;
    }

    setLoading(true);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim() + (formData.notes ? ` (Notes: ${formData.notes.trim()})` : ''),
      order_type: orderType,
      ...(orderType === 'refill'
        ? { liters: Number(liters), bottle, pump }
        : { quantity: Number(quantity), brand }),
    };

    try {
      const response = await fetch('/submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        // Trigger celebratory confetti!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00f2fe', '#0096c7', '#34d399', '#f9c74f'],
          });
        } catch (_) {}
      } else {
        setError(data.message || 'Failed to submit order. Please try again.');
      }
    } catch (err) {
      setError('Network connection error. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(3, 8, 16, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'rgba(11, 25, 44, 0.98)',
          border: '1px solid rgba(72, 202, 228, 0.35)',
          padding: '32px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 242, 254, 0.15)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
          }}
        >
          <X size={20} />
        </button>

        {success ? (
          /* SUCCESS CONFIRMATION STATE */
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(52, 211, 153, 0.15)',
                border: '2px solid #34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34d399',
                margin: '0 auto 20px auto',
              }}
            >
              <CheckCircle2 size={40} />
            </div>

            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '10px' }}>
              Order Placed Successfully!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.6 }}>
              Thank you, <strong style={{ color: 'var(--text-main)' }}>{formData.name}</strong>! We have received your order for <strong style={{ color: 'var(--accent-cyan)' }}>KSh {calculatedTotal.toLocaleString()}</strong> and our dispatch team along Garissa Road is preparing it.
            </p>

            <div
              style={{
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '18px',
                textAlign: 'left',
                marginBottom: '28px',
                fontSize: '0.88rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '6px' }}>
                <Truck size={16} />
                <span>Next Steps:</span>
              </div>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                <li>A confirmation email has been dispatched to <strong>{formData.email}</strong>.</li>
                <li>Our delivery rider will call <strong>{formData.phone || 'you'}</strong> upon arrival.</li>
                <li>Pay via M-Pesa or Cash upon safe doorstep delivery.</li>
              </ul>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', padding: '14px' }}
              onClick={onClose}
            >
              Done & Close
            </button>
          </div>
        ) : (
          /* ORDER FORM STATE */
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(0, 242, 254, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)',
                }}
              >
                <Droplets size={18} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Complete Your Order</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
              Same-day delivery across Makongeni, Thika. Pay upon delivery via M-Pesa.
            </p>

            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '10px',
                  color: '#f87171',
                  fontSize: '0.88rem',
                  marginBottom: '18px',
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Order Selection Summary Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(72, 202, 228, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Selected Service
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {orderType === 'refill' ? `Water Refill (${liters}L)` : `Packaged 20L (${quantity} Bottles)`}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Total
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    KSh {calculatedTotal.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Customer Inputs */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Your Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grace Wanjiku"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 40px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      outline: 'none',
                    }}
                  />
                  <User size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-subtle)' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Email Address *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      required
                      placeholder="name@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 40px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        outline: 'none',
                      }}
                    />
                    <Mail size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-subtle)' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Phone Number (M-Pesa)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      placeholder="07XX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 40px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        outline: 'none',
                      }}
                    />
                    <Phone size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-subtle)' }} />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Delivery Address & Landmark (Makongeni) *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Makongeni Phase 4, Green Court, House 12"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 40px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      outline: 'none',
                    }}
                  />
                  <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-subtle)' }} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '15px',
                  marginTop: '10px',
                  fontSize: '1rem',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Submitting Order...</span>
                  </>
                ) : (
                  <>
                    <Truck size={18} />
                    <span>Place Order · KSh {calculatedTotal.toLocaleString()}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
