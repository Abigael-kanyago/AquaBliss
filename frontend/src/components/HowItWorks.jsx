import React from 'react';
import { ShoppingBag, Truck, Smartphone, CheckCircle2, Droplets, ArrowRight } from 'lucide-react';

export default function HowItWorks({ onOpenOrder }) {
  const steps = [
    {
      num: '01',
      title: 'Choose Your Water',
      desc: 'Select water refilling (KSh 10/L) or packaged 20L bottles. Customize with pumps or new bottles in seconds.',
      icon: <Droplets size={22} />,
    },
    {
      num: '02',
      title: 'Enter Delivery Address',
      desc: 'Provide your estate, phase, or landmark in Makongeni. No advance payment required.',
      icon: <ShoppingBag size={22} />,
    },
    {
      num: '03',
      title: 'Rapid Doorstep Delivery',
      desc: 'Our delivery team along Garissa Road dispatches immediately to your gate within 30–45 minutes.',
      icon: <Truck size={22} />,
    },
    {
      num: '04',
      title: 'Pay Upon Arrival via M-Pesa',
      desc: 'Inspect your sealed bottles or refilled containers, then pay conveniently via M-Pesa or Cash.',
      icon: <Smartphone size={22} />,
    },
  ];

  return (
    <section className="section" style={{ background: 'var(--white)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px auto' }}>
          <span className="section-label">Simple & Hassle-Free</span>
          <h2 className="section-title">How Ordering Works</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            Getting pure, refreshing water delivered to your house has never been easier.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
            marginBottom: '48px',
          }}
          className="steps-grid"
        >
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="card-light"
              style={{
                padding: '28px 22px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      background: 'rgba(0, 150, 199, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--blue)',
                    }}
                  >
                    {step.icon}
                  </div>
                  <span
                    style={{
                      fontSize: '1.4rem',
                      fontFamily: 'var(--font-serif)',
                      fontWeight: 800,
                      color: '#d0e2ec',
                    }}
                  >
                    {step.num}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* M-Pesa Payment Info Card */}
        <div
          style={{
            maxWidth: '720px',
            margin: '0 auto',
            background: 'var(--light)',
            border: '1.5px dashed rgba(0, 150, 199, 0.35)',
            borderRadius: '20px',
            padding: '36px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#10b981',
              fontWeight: 700,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            <Smartphone size={18} />
            <span>M-Pesa Payment Upon Delivery</span>
          </div>

          <h3 style={{ fontSize: '1.45rem', marginBottom: '8px' }}>
            Zero Risk · Pay Only When You Receive Your Water
          </h3>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '520px', margin: '0 auto 24px auto' }}>
            You can pay directly to our rider via M-Pesa Till Number or Cash once your bottles are safely delivered and placed at your dispenser.
          </p>

          <button
            className="btn-primary"
            onClick={() => onOpenOrder({ type: 'refill' })}
            style={{ padding: '14px 34px' }}
          >
            <Droplets size={18} />
            <span>Place Order Now</span>
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .steps-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .steps-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
