import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0); // first item open by default

  const faqs = [
    {
      q: 'Do you deliver to my estate in Makongeni?',
      a: 'Yes! We deliver across all phases of Makongeni (Phase 1, Phase 2, Phase 3, Phase 4, Phase 5), Posta, Ananas Mall area, Landless, and along the entire Garissa Road corridor. Delivery within Makongeni is 100% free of charge.',
    },
    {
      q: 'How much does water refilling cost?',
      a: 'Our water refilling rate is currently just KSh 10 per litre. Refilling a standard 20L dispenser bottle is only KSh 200, which is significantly more affordable and purer than commercial 500ml single-use bottles.',
    },
    {
      q: 'Can I purchase a 20L bottle or pump if I don’t have one?',
      a: 'Absolutely! You can add a brand new food-grade 20L dispenser bottle for KSh 180 and a manual hand-press pump for KSh 250 directly in our interactive order studio or when placing your order.',
    },
    {
      q: 'What purification technology does AquaBliss use?',
      a: 'We use a certified 5-stage purification system: Sediment Pre-Filtration, Activated Carbon, Industrial Reverse Osmosis (RO), Mineral Balance infusion (pH 7.4), and high-intensity UV-C germicidal sterilization to ensure 99.9% purity.',
    },
    {
      q: 'What are your delivery hours?',
      a: 'We are open and delivering from Sunday to Friday, 9:00 AM to 9:30 PM. Saturday is our plant sanitization and maintenance day. Orders submitted online are dispatched immediately during working hours.',
    },
    {
      q: 'How do I pay for my water order?',
      a: 'You only pay when your water is delivered! We accept M-Pesa (Till Number / Send Money) and Cash on delivery. Our delivery rider will provide the payment prompt upon arrival.',
    },
  ];

  return (
    <section id="faq" className="section" style={{ background: 'var(--light)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px auto' }}>
          <span className="section-label">Got Questions?</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            Everything you need to know about our purification, delivery, and pricing.
          </p>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="card-light"
                style={{
                  padding: '20px 24px',
                  cursor: 'pointer',
                  borderColor: isOpen ? 'rgba(0, 150, 199, 0.4)' : 'var(--border-light)',
                  boxShadow: isOpen ? '0 8px 24px rgba(0, 150, 199, 0.08)' : 'var(--shadow-sm)',
                }}
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}
                >
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: isOpen ? 'var(--blue)' : 'var(--text)' }}>
                    {faq.q}
                  </h4>
                  <div
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      color: isOpen ? 'var(--blue)' : 'var(--text-muted)',
                      flexShrink: 0,
                    }}
                  >
                    <ChevronDown size={20} />
                  </div>
                </div>

                {isOpen && (
                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.92rem',
                      lineHeight: 1.65,
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px solid #edf2f7',
                    }}
                  >
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '14px' }}>
            Have a custom question or large corporate bulk order?
          </p>
          <a
            href="https://wa.me/254799184794?text=Hello%20AquaBliss%20I%20have%20a%20question"
            target="_blank"
            rel="noreferrer"
            className="btn-outline-dark"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <MessageCircle size={18} />
            <span>Chat Directly on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
