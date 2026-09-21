import React from 'react';
import { Droplets, Phone, Mail, MapPin, Clock, MessageCircle, Shield, Heart } from 'lucide-react';

export default function Footer({ onOpenAdmin }) {
  return (
    <footer
      style={{
        background: 'rgba(3, 8, 16, 0.98)',
        borderTop: '1px solid rgba(72, 202, 228, 0.15)',
        padding: '70px 0 30px',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 0.9fr 0.9fr 1.1fr',
            gap: '40px',
            marginBottom: '50px',
          }}
          className="footer-grid"
        >
          {/* Col 1: Brand & Bio */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(0, 150, 199, 0.2)',
                  border: '1px solid rgba(72, 202, 228, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <img
                  src="/logo-1.PNG"
                  alt="AquaBliss Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800 }}>
                Aqua<span style={{ color: 'var(--accent-cyan)' }}>Bliss</span>
              </span>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.65, maxWidth: '320px', marginBottom: '20px' }}>
              Delivering certified 5-stage reverse osmosis purified water to homes, clinics, and businesses across Makongeni and Garissa Road.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href="https://wa.me/254799184794?text=Hello%20AquaBliss%20I%20would%20like%20to%20order%20water"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(37, 211, 102, 0.15)',
                  border: '1px solid rgba(37, 211, 102, 0.3)',
                  color: '#25d366',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                <MessageCircle size={16} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '18px', color: '#ffffff' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li><a href="#services" style={{ color: 'inherit' }}>Services & Refills</a></li>
              <li><a href="#customizer" style={{ color: 'inherit' }}>Interactive Order Studio</a></li>
              <li><a href="#purity" style={{ color: 'inherit' }}>5-Stage Filtration Lab</a></li>
              <li><a href="#calculator" style={{ color: 'inherit' }}>Hydration Calculator</a></li>
              <li><a href="#coverage" style={{ color: 'inherit' }}>Makongeni Delivery Area</a></li>
              <li><a href="#reviews" style={{ color: 'inherit' }}>Customer Reviews</a></li>
            </ul>
          </div>

          {/* Col 3: Operating Hours */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '18px', color: '#ffffff' }}>Working Hours</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Clock size={16} style={{ color: 'var(--accent-gold)', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong>Sunday – Friday:</strong>
                  <div>9:00 AM – 9:30 PM</div>
                </div>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Clock size={16} style={{ color: '#f87171', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong>Saturday:</strong>
                  <div>Closed (Sanitization day)</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '18px', color: '#ffffff' }}>Contact & Location</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} style={{ color: 'var(--accent-cyan)' }} />
                <a href="tel:+254799184794" style={{ color: 'inherit' }}>+254 799 184 794</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} style={{ color: 'var(--accent-cyan)' }} />
                <a href="mailto:aquabliss217@gmail.com" style={{ color: 'inherit' }}>aquabliss217@gmail.com</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={16} style={{ color: 'var(--accent-cyan)', marginTop: '3px', flexShrink: 0 }} />
                <span>Garissa Road, Makongeni, Thika, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '0.82rem',
            color: 'var(--text-subtle)',
          }}
        >
          <div>
            © {new Date().getFullYear()} AquaBliss. All Rights Reserved. Pure Water, Pure Bliss.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={onOpenAdmin}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-subtle)',
                fontSize: '0.82rem',
              }}
            >
              <Shield size={14} />
              <span>Staff Portal</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
