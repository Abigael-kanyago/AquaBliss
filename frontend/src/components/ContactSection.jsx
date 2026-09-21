import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Truck } from 'lucide-react';

export default function ContactSection({ onOpenOrder }) {
  return (
    <section id="contact" className="section" style={{ background: 'var(--white)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px auto' }}>
          <span className="section-label">Find & Reach Us</span>
          <h2 className="section-title">Get In Touch With AquaBliss</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            We're conveniently situated on Garissa Road, Makongeni. Call or message us anytime for immediate deliveries.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '36px',
            alignItems: 'stretch',
          }}
          className="contact-grid"
        >
          {/* Contact Details Card */}
          <div
            className="card-light"
            style={{
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Contact Information</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(0, 150, 199, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--blue)',
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={20} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '2px' }}>Physical Location</strong>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
                      Garissa Road, Makongeni, Thika, Kiambu County, Kenya
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(0, 150, 199, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--blue)',
                      flexShrink: 0,
                    }}
                  >
                    <Phone size={20} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '2px' }}>Phone / Dispatch</strong>
                    <a href="tel:+254799184794" style={{ color: 'var(--blue)', fontSize: '0.92rem', fontWeight: 600 }}>
                      +254 799 184 794
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(0, 150, 199, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--blue)',
                      flexShrink: 0,
                    }}
                  >
                    <Mail size={20} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '2px' }}>Email Support</strong>
                    <a href="mailto:aquabliss217@gmail.com" style={{ color: 'var(--blue)', fontSize: '0.92rem' }}>
                      aquabliss217@gmail.com
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(0, 150, 199, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--blue)',
                      flexShrink: 0,
                    }}
                  >
                    <Clock size={20} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '2px' }}>Opening Hours</strong>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
                      Sunday – Friday: 9:00 AM – 9:30 PM <br />
                      Saturday: Closed (Maintenance)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <button
                className="btn-primary"
                onClick={() => onOpenOrder({ type: 'refill' })}
                style={{ flex: 1, padding: '12px' }}
              >
                <Truck size={16} />
                <span>Order Delivery</span>
              </button>

              <a
                href="https://wa.me/254799184794"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '50px',
                  background: '#25d366',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                <MessageCircle size={18} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Location / Service Zone Card */}
          <div
            className="card-light"
            style={{
              padding: '36px',
              background: 'linear-gradient(135deg, var(--navy) 0%, #15273c 100%)',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--sky)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                <MapPin size={16} />
                <span>Garissa Road Dispatch Station</span>
              </div>

              <h3 style={{ color: '#ffffff', fontSize: '1.45rem', marginBottom: '14px' }}>
                Delivery Right to Your Gate
              </h3>

              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.92rem', lineHeight: 1.65, marginBottom: '24px' }}>
                Our dispatch station along Garissa Road is equipped with multi-stage Reverse Osmosis purification lines, automated bottle sterilization baths, and a fleet of dedicated delivery motorbikes.
              </p>

              <div style={{ background: 'rgba(255, 255, 255, 0.06)', borderRadius: '14px', padding: '18px', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--sky)', marginBottom: '8px' }}>
                  Coverage Neighborhoods:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                  <div>✓ Makongeni Phase 1–5</div>
                  <div>✓ Posta Makongeni</div>
                  <div>✓ Ananas Mall & Estates</div>
                  <div>✓ Landless & Happy Valley</div>
                  <div>✓ Garissa Road Corridor</div>
                  <div>✓ Section 9 & Thika CBD</div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>
              ⚡ Average dispatch time: <strong>25 – 40 minutes</strong>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
