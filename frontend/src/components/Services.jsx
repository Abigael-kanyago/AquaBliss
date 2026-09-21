import React from 'react';
import { Droplets, Package, Tag, Check, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Services({ onOpenOrder, prices }) {
  const refillPricePerL = prices?.refill_price_per_liter || 10;
  const packagedPrice20L = prices?.packaged_price_20l || 180;
  const brandingCost = prices?.branding_cost || 100;

  const services = [
    {
      title: 'Water Refilling',
      tag: 'Most Popular',
      price: `KSh ${refillPricePerL}`,
      unit: '/ litre',
      desc: 'Bring your empty containers or have us pick them up. Fresh, lab-purified water refilled on the spot or delivered directly to your doorstep in Makongeni.',
      image: '/ww.jpeg',
      features: [
        '5-Stage Reverse Osmosis purification',
        'Free doorstep delivery in Makongeni',
        'Refill 10L, 20L, or custom bulk quantities',
        'Fast turnaround with zero waiting time',
      ],
      type: 'refill',
      btnText: 'Order a Refill',
      highlight: true,
    },
    {
      title: 'Packaged Water (20L)',
      tag: 'Sealed & Branded',
      price: `KSh ${packagedPrice20L}`,
      unit: '/ 20L bottle',
      desc: 'Brand new, sanitised 20L water dispenser bottles filled and heat-sealed with tamper-evident caps. Perfect for executive offices, clinics, and family homes.',
      image: '/wb.jpeg',
      features: [
        'Food-grade heavy duty BPA-free bottle',
        'Tamper-evident hygiene seal',
        'Dispenser pump compatible',
        'Free delivery along Garissa Road',
      ],
      type: 'packaged',
      btnText: 'Buy Packaged Water',
      highlight: false,
    },
    {
      title: 'Custom Branded Water',
      tag: 'Events & Corporate',
      price: `+KSh ${brandingCost}`,
      unit: '/ custom label',
      desc: 'Elevate your business, wedding, church function, or corporate event with bespoke branded labels on sealed bottled water.',
      image: '/wd.jpeg',
      features: [
        'High-resolution waterproof custom labels',
        'Ideal for weddings, conferences, & businesses',
        'Available in bulk 20L and smaller sizes',
        'Fast printing and custom setup',
      ],
      type: 'packaged',
      btnText: 'Request Custom Branding',
      highlight: false,
    },
  ];

  return (
    <section id="services" className="section" style={{ background: 'var(--light)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px auto' }}>
          <span className="section-label">What We Offer</span>
          <h2 className="section-title">Choose Your Water Service</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            Whether you need a quick household refill or sealed branded bottles for your company — we provide certified pure water every time.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '28px',
          }}
          className="services-grid"
        >
          {services.map((srv, idx) => (
            <div
              key={idx}
              className="card-light"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Product Image Header */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '240px',
                    overflow: 'hidden',
                    background: 'var(--navy)',
                  }}
                >
                  <img
                    src={srv.image}
                    alt={srv.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                    onError={(e) => {
                      e.target.src = '/first.png';
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      background: srv.highlight ? 'var(--blue)' : 'rgba(13, 27, 42, 0.85)',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      padding: '4px 12px',
                      borderRadius: '50px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    }}
                  >
                    {srv.tag}
                  </div>
                </div>

                {/* Body Content */}
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '8px' }}>{srv.title}</h3>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '14px' }}>
                    <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--blue)' }}>
                      {srv.price}
                    </strong>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{srv.unit}</span>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
                    {srv.desc}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {srv.features.map((feat, fidx) => (
                      <div key={fidx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                        <Check size={16} style={{ color: 'var(--blue)', flexShrink: 0 }} />
                        <span style={{ color: 'var(--text)' }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div style={{ padding: '0 24px 24px 24px' }}>
                <button
                  className={srv.highlight ? 'btn-primary' : 'btn-outline-dark'}
                  style={{ width: '100%', padding: '13px' }}
                  onClick={() => onOpenOrder({ type: srv.type })}
                >
                  <span>{srv.btnText}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .services-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
