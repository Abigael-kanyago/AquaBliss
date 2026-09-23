import React, { useState, useEffect } from 'react';
import { Droplets, Package, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Hero({ onOpenOrder, prices }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const refillPricePerL = prices?.refill_price_per_liter || 10;
  const packagedPrice20L = prices?.packaged_price_20l || 180;

  const slides = [
    {
      tag: 'Most Popular',
      title: 'Water Refilling',
      price: `KSh ${refillPricePerL}`,
      sub: 'Per Litre · Free Delivery',
      image: '/ww.jpeg',
      type: 'refill',
    },
    {
      tag: 'Sealed & Branded',
      title: 'Packaged 20L Water',
      price: `KSh ${packagedPrice20L}`,
      sub: 'Per 20L Bottle · Sealed Cap',
      image: '/wb.jpeg',
      type: 'packaged',
    },
    {
      tag: '100% Guaranteed',
      title: 'Always Pure & Crisp',
      price: 'Lab Tested',
      sub: 'Reverse Osmosis Treated',
      image: '/banner.jpg',
      type: 'refill',
    },
  ];

  // Auto-advance slides every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'var(--navy)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        paddingTop: '100px',
        paddingBottom: '80px',
      }}
    >
      {/* Background Hero Image with subtle opacity */}
      <img
        src="/banner.jpg"
        alt="AquaBliss Water"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.16,
          filter: 'blur(2px)',
          pointerEvents: 'none',
        }}
      />

      {/* Hero Linear Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(105deg, rgba(13, 27, 42, 0.98) 40%, rgba(13, 27, 42, 0.75) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 0.85fr',
            gap: '50px',
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          {/* LEFT: Headline & Value Prop */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(72, 202, 228, 0.15)',
                border: '1px solid rgba(72, 202, 228, 0.3)',
                color: 'var(--sky)',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '6px 16px',
                borderRadius: '50px',
                marginBottom: '20px',
              }}
            >
              <Sparkles size={15} />
              <span>Pure Water, Pure Bliss · Makongeni</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                color: '#ffffff',
                lineHeight: 1.15,
                marginBottom: '20px',
                fontFamily: 'var(--font-serif)',
              }}
            >
              Pure water, <br />
              delivered <br />
              <span style={{ color: 'var(--sky)' }}>to your door.</span>
            </h1>

            <p
              style={{
                fontSize: '1.1rem',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: 1.7,
                marginBottom: '32px',
                maxWidth: '480px',
              }}
            >
              Clean, fresh water for your home or office — refills from <strong style={{ color: 'var(--sky)' }}>KSh {refillPricePerL}/L</strong> and packaged 20L bottles delivered same day along Garissa Road, Makongeni.
            </p>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '14px',
                marginBottom: '40px',
              }}
            >
              <button
                className="btn-primary"
                onClick={() => onOpenOrder({ type: 'refill' })}
                style={{ padding: '15px 36px', fontSize: '1rem' }}
              >
                <Droplets size={18} />
                <span>Order a Refill</span>
              </button>

              <button
                className="btn-outline"
                onClick={() => onOpenOrder({ type: 'packaged' })}
                style={{ padding: '14px 32px', fontSize: '1rem' }}
              >
                <Package size={18} />
                <span>Buy Packaged Water</span>
              </button>
            </div>

            {/* Hero Key Stats Strip */}
            <div
              style={{
                display: 'flex',
                gap: '36px',
                paddingTop: '24px',
                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <div>
                <strong
                  style={{
                    display: 'block',
                    fontSize: '1.8rem',
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--sky)',
                    fontWeight: 700,
                  }}
                >
                  KSh {refillPricePerL}
                </strong>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Per Litre
                </span>
              </div>

              <div>
                <strong
                  style={{
                    display: 'block',
                    fontSize: '1.8rem',
                    fontFamily: 'var(--font-serif)',
                    color: '#34d399',
                    fontWeight: 700,
                  }}
                >
                  Same Day
                </strong>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Doorstep Delivery
                </span>
              </div>

              <div>
                <strong
                  style={{
                    display: 'block',
                    fontSize: '1.8rem',
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--gold)',
                    fontWeight: 700,
                  }}
                >
                  6 Days
                </strong>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  A Week (Sun-Fri)
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Animated Rotating Visual Showcase Cards */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '440px',
            }}
          >
            {/* Pulsing Ambient Rings */}
            <div
              style={{
                position: 'absolute',
                width: '380px',
                height: '380px',
                borderRadius: '50%',
                border: '1px solid rgba(72, 202, 228, 0.15)',
                animation: 'pulse-ring 4s ease-in-out infinite',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '480px',
                height: '480px',
                borderRadius: '50%',
                border: '1px solid rgba(72, 202, 228, 0.08)',
                animation: 'pulse-ring 5s ease-in-out infinite',
                pointerEvents: 'none',
              }}
            />

            {/* Slides Cards Container */}
            <div
              style={{
                position: 'relative',
                width: '320px',
                height: '410px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 150, 199, 0.25)',
                border: '1px solid rgba(72, 202, 228, 0.3)',
              }}
            >
              {slides.map((slide, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: currentSlide === idx ? 1 : 0,
                    transform: currentSlide === idx ? 'scale(1)' : 'scale(1.04)',
                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Subtle dark shade */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(13,27,42,0.88) 100%)',
                    }}
                  />

                  {/* Top Badge */}
                  <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        padding: '4px 12px',
                        borderRadius: '50px',
                        background: 'rgba(0, 180, 216, 0.85)',
                        color: '#ffffff',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      }}
                    >
                      {slide.tag}
                    </span>
                  </div>

                  {/* Bottom Glass Content */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '20px 24px',
                      background: 'rgba(13, 27, 42, 0.92)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.4rem',
                        color: '#ffffff',
                        marginBottom: '8px',
                      }}
                    >
                      {slide.title}
                    </h3>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        paddingTop: '10px',
                      }}
                    >
                      <strong
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.4rem',
                          color: 'var(--sky)',
                        }}
                      >
                        {slide.price}
                      </strong>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: 'rgba(255, 255, 255, 0.65)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {slide.sub}
                      </span>
                    </div>

                    <button
                      className="btn-primary"
                      style={{ width: '100%', marginTop: '14px', padding: '10px' }}
                      onClick={() => onOpenOrder({ type: slide.type })}
                    >
                      <span>Order This</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Slide Navigation Dots */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  style={{
                    width: currentSlide === idx ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: currentSlide === idx ? 'var(--sky)' : 'rgba(255, 255, 255, 0.25)',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
