import React, { useState } from 'react';
import { Droplets, Package, Check, Plus, Minus, ShieldCheck, Tag, ShoppingBag, Sparkles } from 'lucide-react';

export default function OrderStudio({ onOpenOrder, prices }) {
  const [activeTab, setActiveTab] = useState('refill'); // 'refill' or 'packaged'
  
  // Refill state
  const [liters, setLiters] = useState(20);
  const [needBottle, setNeedBottle] = useState(false);
  const [needPump, setNeedPump] = useState(false);

  // Packaged state
  const [quantity, setQuantity] = useState(2);
  const [needBranding, setNeedBranding] = useState(false);

  // Prices from DB (with safe defaults)
  const pricePerL = prices?.refill_price_per_liter || 10;
  const bottleCost = prices?.bottle_cost || 180;
  const pumpCost = prices?.pump_cost || 250;
  const packagedPrice20L = prices?.packaged_price_20l || 180;
  const brandingCost = prices?.branding_cost || 100;

  // Calculate Subtotals
  const refillSubtotal = (liters * pricePerL) + (needBottle ? bottleCost : 0) + (needPump ? pumpCost : 0);
  const packagedSubtotal = (quantity * packagedPrice20L) + (needBranding ? brandingCost : 0);

  const handleProceed = () => {
    if (activeTab === 'refill') {
      onOpenOrder({
        type: 'refill',
        liters,
        bottle: needBottle ? 'yes' : 'no',
        pump: needPump ? 'yes' : 'no',
        calculatedTotal: refillSubtotal,
      });
    } else {
      onOpenOrder({
        type: 'packaged',
        quantity,
        brand: needBranding ? 'yes' : 'no',
        calculatedTotal: packagedSubtotal,
      });
    }
  };

  return (
    <section id="customizer" className="section" style={{ background: 'linear-gradient(180deg, var(--bg-dark) 0%, #071324 100%)' }}>
      <div className="container">
        <div className="section-header">
          <div className="glass-pill">
            <Sparkles size={14} />
            <span>Interactive Order Studio</span>
          </div>
          <h2 className="section-title">
            Customize & <span className="gradient-text">Build Your Order</span>
          </h2>
          <p className="section-sub">
            Choose your preferred water option, customize with pumps or dispenser bottles, and get transparent instant pricing.
          </p>
        </div>

        {/* Tab Selection */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(72, 202, 228, 0.2)',
            }}
          >
            <button
              onClick={() => setActiveTab('refill')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: activeTab === 'refill' ? '#ffffff' : 'var(--text-muted)',
                background: activeTab === 'refill' ? 'var(--primary)' : 'transparent',
                boxShadow: activeTab === 'refill' ? '0 4px 20px rgba(0, 150, 199, 0.4)' : 'none',
              }}
            >
              <Droplets size={18} />
              <span>Water Refill</span>
            </button>

            <button
              onClick={() => setActiveTab('packaged')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: activeTab === 'packaged' ? '#ffffff' : 'var(--text-muted)',
                background: activeTab === 'packaged' ? 'var(--primary)' : 'transparent',
                boxShadow: activeTab === 'packaged' ? '0 4px 20px rgba(0, 150, 199, 0.4)' : 'none',
              }}
            >
              <Package size={18} />
              <span>Packaged (20L Bottles)</span>
            </button>
          </div>
        </div>

        {/* Main Customizer Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '36px',
            alignItems: 'start',
          }}
          className="studio-grid"
        >
          {/* LEFT: Customizer Options */}
          <div className="glass-card" style={{ padding: '36px' }}>
            {activeTab === 'refill' ? (
              /* REFILL CONFIGURATOR */
              <div>
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Select Volume to Refill:
                  </label>
                  
                  {/* Preset Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
                    {[10, 20, 40, 60].map((val) => (
                      <button
                        key={val}
                        onClick={() => setLiters(val)}
                        style={{
                          padding: '10px 0',
                          borderRadius: '10px',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          background: liters === val ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                          border: `1px solid ${liters === val ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.08)'}`,
                          color: liters === val ? 'var(--accent-cyan)' : 'var(--text-main)',
                        }}
                      >
                        {val}L
                      </button>
                    ))}
                  </div>

                  {/* Volume Slider */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                      onClick={() => setLiters((prev) => Math.max(5, prev - 5))}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-main)',
                      }}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      step="5"
                      value={liters}
                      onChange={(e) => setLiters(Number(e.target.value))}
                      style={{ flex: 1, accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                    />
                    <button
                      onClick={() => setLiters((prev) => Math.min(200, prev + 5))}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-main)',
                      }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    {liters} Litres Selected
                  </div>
                </div>

                {/* Add-ons Checklist */}
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Optional Add-ons:
                  </label>

                  {/* Add-on 1: Bottle */}
                  <div
                    onClick={() => setNeedBottle(!needBottle)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: needBottle ? 'rgba(0, 150, 199, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${needBottle ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)'}`,
                      marginBottom: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '6px',
                          background: needBottle ? 'var(--primary)' : 'transparent',
                          border: `2px solid ${needBottle ? 'var(--primary)' : 'rgba(255, 255, 255, 0.2)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                        }}
                      >
                        {needBottle && <Check size={14} strokeWidth={3} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>New 20L Dispenser Bottle</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Food-grade BPA free heavy-duty bottle</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>+KSh {bottleCost}</div>
                  </div>

                  {/* Add-on 2: Pump */}
                  <div
                    onClick={() => setNeedPump(!needPump)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: needPump ? 'rgba(0, 150, 199, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${needPump ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '6px',
                          background: needPump ? 'var(--primary)' : 'transparent',
                          border: `2px solid ${needPump ? 'var(--primary)' : 'rgba(255, 255, 255, 0.2)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                        }}
                      >
                        {needPump && <Check size={14} strokeWidth={3} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Manual Hand Water Pump</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Easy flow hand press pump for 20L bottles</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>+KSh {pumpCost}</div>
                  </div>
                </div>
              </div>
            ) : (
              /* PACKAGED CONFIGURATOR */
              <div>
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Number of Sealed 20L Bottles:
                  </label>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', marginBottom: '16px' }}>
                    <button
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-main)',
                      }}
                    >
                      <Minus size={20} />
                    </button>
                    <div style={{ textAlign: 'center', minWidth: '120px' }}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-cyan)', lineHeight: 1 }}>
                        {quantity}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {quantity * 20} Litres Total
                      </div>
                    </div>
                    <button
                      onClick={() => setQuantity((prev) => Math.min(20, prev + 1))}
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-main)',
                      }}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                {/* Branding add-on */}
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Custom Branding:
                  </label>

                  <div
                    onClick={() => setNeedBranding(!needBranding)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: needBranding ? 'rgba(0, 150, 199, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${needBranding ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)'}`,
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '6px',
                          background: needBranding ? 'var(--primary)' : 'transparent',
                          border: `2px solid ${needBranding ? 'var(--primary)' : 'rgba(255, 255, 255, 0.2)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                        }}
                      >
                        {needBranding && <Check size={14} strokeWidth={3} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Custom Corporate / Event Branding</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Apply your company or event label to bottles</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>+KSh {brandingCost}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Visual Summary & Instant Checkout */}
          <div>
            <div
              className="glass-card"
              style={{
                padding: '36px',
                background: 'rgba(13, 30, 52, 0.9)',
                border: '1px solid rgba(72, 202, 228, 0.35)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 242, 254, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Order Summary</h3>
                <span className="glass-pill" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                  Live Quote
                </span>
              </div>

              {/* Breakdown List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                {activeTab === 'refill' ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                      <span>Water Refill ({liters} Litres × KSh {pricePerL})</span>
                      <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>KSh {liters * pricePerL}</span>
                    </div>
                    {needBottle && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                        <span>1× New 20L Dispenser Bottle</span>
                        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>KSh {bottleCost}</span>
                      </div>
                    )}
                    {needPump && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                        <span>1× Manual Hand Pump</span>
                        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>KSh {pumpCost}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                      <span>Packaged 20L Bottles ({quantity} × KSh {packagedPrice20L})</span>
                      <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>KSh {quantity * packagedPrice20L}</span>
                    </div>
                    {needBranding && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                        <span>Custom Branding Label</span>
                        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>KSh {brandingCost}</span>
                      </div>
                    )}
                  </>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Doorstep Delivery (Makongeni zone)</span>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>FREE</span>
                </div>
              </div>

              {/* Total Card */}
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: '1px solid rgba(72, 202, 228, 0.25)',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Total Payable
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-cyan)', lineHeight: 1.1 }}>
                    KSh {activeTab === 'refill' ? refillSubtotal.toLocaleString() : packagedSubtotal.toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>No hidden fees</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Pay on Delivery / M-Pesa</div>
                </div>
              </div>

              {/* Action Button */}
              <button
                className="btn-primary"
                style={{ width: '100%', padding: '16px', fontSize: '1.05rem' }}
                onClick={handleProceed}
              >
                <ShoppingBag size={20} />
                <span>Confirm & Place Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .studio-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
