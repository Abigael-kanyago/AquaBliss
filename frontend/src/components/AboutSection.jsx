import React from 'react';
import { ShieldCheck, Award, Heart, CheckCircle2, Droplets, MapPin, Truck } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="section section-dark" style={{ background: 'var(--navy)' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px',
            alignItems: 'center',
          }}
          className="about-grid"
        >
          {/* LEFT: Text Story */}
          <div>
            <span className="section-label" style={{ color: 'var(--sky)' }}>About AquaBliss</span>
            <h2 className="section-title" style={{ color: '#ffffff' }}>
              Pure Water for a <br />
              <span style={{ color: 'var(--sky)' }}>Healthier Community</span>
            </h2>

            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '24px' }}>
              Founded with a mission to bring safe, lab-grade drinking water to Makongeni and Garissa Road, AquaBliss provides premium purification at prices every family and business can afford.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(72, 202, 228, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--sky)',
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '2px' }}>
                    Multi-Stage Reverse Osmosis
                  </h4>
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    Every drop is filtered through 5 precision purification stages to remove heavy metals, chlorine, and biological impurities.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(52, 211, 153, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#34d399',
                    flexShrink: 0,
                  }}
                >
                  <Truck size={20} />
                </div>
                <div>
                  <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '2px' }}>
                    Fast Doorstep Delivery
                  </h4>
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    Direct motorized delivery routes across Makongeni (Phase 1–5), Posta, Ananas Mall, and Garissa Road in under 45 minutes.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold)',
                    flexShrink: 0,
                  }}
                >
                  <Award size={20} />
                </div>
                <div>
                  <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '2px' }}>
                    Affordable Hydration for All
                  </h4>
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    Water refills at just KSh 10 per litre, eliminating the hassle and health risks of boiling or buying expensive single-use bottles.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--sky)', fontSize: '0.9rem', fontWeight: 600 }}>
              <MapPin size={18} />
              <span>Visit our plant: Garissa Road, Makongeni, Thika</span>
            </div>
          </div>

          {/* RIGHT: High-Res Photo Showcase Collage */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              position: 'relative',
            }}
          >
            <div
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                height: '340px',
                boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                border: '1px solid rgba(72, 202, 228, 0.2)',
              }}
            >
              <img
                src="/ww1.jpeg"
                alt="AquaBliss Purification Facility"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = '/first.png'; }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  height: '160px',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                  border: '1px solid rgba(72, 202, 228, 0.2)',
                }}
              >
                <img
                  src="/delivery.jpeg"
                  alt="AquaBliss Delivery Van"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = '/first.png'; }}
                />
              </div>

              <div
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  height: '160px',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                  border: '1px solid rgba(72, 202, 228, 0.2)',
                }}
              >
                <img
                  src="/wb.jpeg"
                  alt="AquaBliss Water Bottles"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = '/first.png'; }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
