import React from 'react';
import { Star, Quote, CheckCircle2, MessageSquare } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      name: 'James Mwangi',
      role: 'Resident, Makongeni Phase 3',
      text: 'The water quality is genuinely top tier. We used to boil water at home, but ever since subscribing to AquaBliss refills at 10 bob a litre, our family has never looked back. The delivery is always on time!',
      rating: 5,
    },
    {
      name: 'Sarah Ndung’u',
      role: 'Manager, Green Oasis Clinic',
      text: 'We order 20L packaged bottles for our medical facility waiting rooms. The bottles are pristine, sealed properly, and taste exceptionally fresh and pure. Highly recommended for clinics and corporate offices.',
      rating: 5,
    },
    {
      name: 'David Ochieng',
      role: 'Landless Resident',
      text: 'Their customer service is outstanding! I just sent a WhatsApp message when my 20L bottle ran out, and within 30 minutes the rider was at my gate with a fresh refill. Great team!',
      rating: 5,
    },
  ];

  return (
    <section id="reviews" className="section" style={{ background: 'linear-gradient(180deg, var(--bg-dark) 0%, #071324 100%)' }}>
      <div className="container">
        <div className="section-header">
          <div className="glass-pill">
            <MessageSquare size={14} />
            <span>Community Feedback</span>
          </div>
          <h2 className="section-title">
            Loved By <span className="gradient-text">Makongeni Residents</span>
          </h2>
          <p className="section-sub">
            Read authentic reviews from families, offices, and clinics that trust AquaBliss for their daily hydration.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '28px',
          }}
          className="reviews-grid"
        >
          {reviews.map((rev, index) => (
            <div
              key={index}
              className="glass-card"
              style={{
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'rgba(11, 25, 44, 0.75)',
              }}
            >
              <div>
                {/* Rating Stars */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="#f9c74f" stroke="#f9c74f" />
                  ))}
                </div>

                <p style={{ color: 'var(--text-main)', fontSize: '0.96rem', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '24px' }}>
                  "{rev.text}"
                </p>
              </div>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '1rem',
                  }}
                >
                  {rev.name[0]}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.95rem' }}>
                    <span>{rev.name}</span>
                    <CheckCircle2 size={14} style={{ color: '#34d399' }} />
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{rev.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .reviews-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
