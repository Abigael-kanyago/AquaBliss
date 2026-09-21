import React, { useState } from 'react';
import { MapPin, Clock, Truck, PhoneCall, Navigation, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function DeliveryZone({ onOpenOrder }) {
  const [selectedZone, setSelectedZone] = useState(0);

  const zones = [
    {
      name: 'Makongeni (Phase 1–5 & Posta)',
      eta: '20 – 35 mins',
      fee: 'FREE Delivery',
      desc: 'Immediate dispatch directly from our Garissa Road facility.',
      highlight: true,
    },
    {
      name: 'Ananas Mall & Surroundings',
      eta: '25 – 40 mins',
      fee: 'FREE Delivery',
      desc: 'Residential and commercial offices around Ananas Mall.',
      highlight: true,
    },
    {
      name: 'Landless & Happy Valley',
      eta: '35 – 50 mins',
      fee: 'FREE Delivery',
      desc: 'Regular scheduled morning & afternoon delivery routes.',
      highlight: false,
    },
    {
      name: 'Thika Town & Section 9',
      eta: '30 – 45 mins',
      fee: 'FREE Delivery',
      desc: 'Offices, clinics, and residential apartments in Thika CBD.',
      highlight: false,
    },
  ];

  return (
    <section id="coverage" className="section" style={{ background: 'var(--bg-dark)' }}>
      <div className="container">
        <div className="section-header">
          <div className="glass-pill">
            <MapPin size={14} />
            <span>Fast Local Delivery</span>
          </div>
          <h2 className="section-title">
            Makongeni & <span className="gradient-text">Garissa Road Coverage</span>
          </h2>
          <p className="section-sub">
            Strategically located along Garissa Road to deliver pure water across Makongeni and surrounding Thika neighborhoods in minutes.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '36px',
            alignItems: 'center',
          }}
          className="coverage-grid"
        >
          {/* Zone Selector Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {zones.map((zone, index) => {
              const isSelected = selectedZone === index;
              return (
                <div
                  key={index}
                  onClick={() => setSelectedZone(index)}
                  className="glass-card"
                  style={{
                    padding: '20px 24px',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(0, 150, 199, 0.18)' : 'rgba(11, 25, 44, 0.7)',
                    borderColor: isSelected ? 'var(--accent-cyan)' : 'var(--border-glass)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <MapPin size={18} style={{ color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)' }} />
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: isSelected ? '#ffffff' : 'var(--text-main)' }}>
                        {zone.name}
                      </h4>
                    </div>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#34d399',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(52, 211, 153, 0.12)',
                      }}
                    >
                      {zone.fee}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    {zone.desc}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} style={{ color: 'var(--accent-gold)' }} />
                      <span>Est. Time: <strong style={{ color: 'var(--text-main)' }}>{zone.eta}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery Details & Hotline Card */}
          <div>
            <div
              className="glass-card"
              style={{
                padding: '36px',
                background: 'rgba(13, 30, 52, 0.92)',
                border: '1px solid rgba(72, 202, 228, 0.35)',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'rgba(0, 242, 254, 0.12)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)',
                  marginBottom: '20px',
                }}
              >
                <Truck size={26} />
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>
                Delivery Schedule & Dispatch
              </h3>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '24px' }}>
                We operate rapid motorized delivery bikes and vans equipped with sanitary protective containers to ensure your water arrives safely and untouched.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={18} style={{ color: '#34d399' }} />
                  <span>Sunday – Friday: <strong>9:00 AM – 9:30 PM</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={18} style={{ color: '#34d399' }} />
                  <span>Physical Address: <strong>Garissa Road, Makongeni, Thika</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={18} style={{ color: '#34d399' }} />
                  <span>Fast Dispatch Line: <strong>+254 799 184 794</strong></span>
                </div>
              </div>

              <button
                className="btn-primary"
                style={{ width: '100%', padding: '14px' }}
                onClick={() => onOpenOrder({ type: 'refill' })}
              >
                <Truck size={18} />
                <span>Request Delivery to {zones[selectedZone].name.split('(')[0]}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .coverage-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
