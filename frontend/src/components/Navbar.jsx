import React, { useState, useEffect } from 'react';
import { Droplets, PhoneCall, Clock, Menu, X, Shield, MapPin, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenOrder, onOpenAdmin, prices }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [storeStatus, setStoreStatus] = useState({ isOpen: true, text: 'Open Now · Fast Delivery' });

  // Compute live operating status (Sun-Fri: 9:00 AM - 9:30 PM)
  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      // Use EAT (UTC+3) or client local
      const day = now.getDay(); // 0 is Sunday, 6 is Saturday
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const timeInMins = hours * 60 + minutes;

      const openMins = 9 * 60; // 9:00 AM
      const closeMins = 21 * 60 + 30; // 9:30 PM

      if (day === 6) {
        // Saturday closed
        setStoreStatus({ isOpen: false, text: 'Closed Saturday · Opens Sun 9:00 AM' });
      } else if (timeInMins >= openMins && timeInMins <= closeMins) {
        setStoreStatus({ isOpen: true, text: 'Open Now · Fast Delivery' });
      } else {
        setStoreStatus({ isOpen: false, text: 'Closed · Next Delivery at 9:00 AM' });
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Handle scroll backdrop
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        background: isScrolled
          ? 'rgba(6, 14, 26, 0.92)'
          : 'rgba(6, 14, 26, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${isScrolled ? 'rgba(72, 202, 228, 0.2)' : 'rgba(255, 255, 255, 0.08)'}`,
        boxShadow: isScrolled ? '0 10px 30px rgba(0, 0, 0, 0.4)' : 'none',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '76px',
        }}
      >
        {/* Brand Logo */}
        <a
          href="#"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(0, 150, 199, 0.3), rgba(0, 242, 254, 0.1))',
              border: '1px solid rgba(72, 202, 228, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 0 15px rgba(0, 242, 254, 0.2)',
            }}
          >
            <img
              src="/logo-1.PNG"
              alt="AquaBliss"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.4rem',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                display: 'block',
                lineHeight: 1.1,
              }}
            >
              Aqua<span style={{ color: 'var(--accent-cyan)' }}>Bliss</span>
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Pure Water · Makongeni
            </span>
          </div>
        </a>

        {/* Live Store Status Pill */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
          className="desktop-status"
        >
          <span className={`live-dot ${storeStatus.isOpen ? 'open' : 'closed'}`}></span>
          <span style={{ color: storeStatus.isOpen ? '#34d399' : '#fbbf24', fontWeight: 500 }}>
            {storeStatus.text}
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '26px',
          }}
          className="desktop-nav"
        >
          <a
            href="#services"
            style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--accent-cyan)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}
          >
            Services
          </a>
          <a
            href="#customizer"
            style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--accent-cyan)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}
          >
            Order Studio
          </a>
          <a
            href="#purity"
            style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--accent-cyan)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}
          >
            Purity Lab
          </a>
          <a
            href="#calculator"
            style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--accent-cyan)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}
          >
            Hydration
          </a>
          <a
            href="#coverage"
            style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--accent-cyan)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}
          >
            Delivery Area
          </a>

          {/* Call Link */}
          <a
            href="tel:+254799184794"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--accent-cyan)',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(0, 242, 254, 0.08)',
              border: '1px solid rgba(0, 242, 254, 0.2)',
            }}
          >
            <PhoneCall size={14} />
            <span>0799 184 794</span>
          </a>

          {/* Admin link */}
          <button
            onClick={onOpenAdmin}
            title="Staff & Admin Portal"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-subtle)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-main)';
              e.currentTarget.style.borderColor = 'rgba(72, 202, 228, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-subtle)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <Shield size={16} />
          </button>

          {/* Main Order CTA */}
          <button
            className="btn-primary btn-sm"
            onClick={() => onOpenOrder({ type: 'refill' })}
            style={{
              boxShadow: '0 0 20px rgba(0, 150, 199, 0.4)',
            }}
          >
            <Droplets size={16} />
            <span>Order Water</span>
          </button>
        </nav>

        {/* Mobile menu toggle */}
        <div style={{ display: 'none' }} className="mobile-toggle">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation"
            style={{
              padding: '8px',
              color: 'var(--text-main)',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
            }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          style={{
            background: 'rgba(6, 14, 26, 0.98)',
            backdropFilter: 'blur(24px)',
            borderBottom: '1px solid var(--border-glass)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
            }}
          >
            <span className={`live-dot ${storeStatus.isOpen ? 'open' : 'closed'}`}></span>
            <span style={{ color: storeStatus.isOpen ? '#34d399' : '#fbbf24' }}>
              {storeStatus.text}
            </span>
          </div>

          <a
            href="#services"
            onClick={() => setIsOpen(false)}
            style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '1.05rem' }}
          >
            Services & Pricing
          </a>
          <a
            href="#customizer"
            onClick={() => setIsOpen(false)}
            style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '1.05rem' }}
          >
            Interactive Order Studio
          </a>
          <a
            href="#purity"
            onClick={() => setIsOpen(false)}
            style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '1.05rem' }}
          >
            5-Stage Purity Lab
          </a>
          <a
            href="#calculator"
            onClick={() => setIsOpen(false)}
            style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '1.05rem' }}
          >
            Hydration Calculator
          </a>
          <a
            href="#coverage"
            onClick={() => setIsOpen(false)}
            style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '1.05rem' }}
          >
            Delivery Zones (Makongeni)
          </a>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button
              className="btn-primary"
              style={{ flex: 1 }}
              onClick={() => {
                setIsOpen(false);
                onOpenOrder({ type: 'refill' });
              }}
            >
              <Droplets size={16} />
              <span>Order Refill</span>
            </button>
            <button
              className="btn-outline"
              onClick={() => {
                setIsOpen(false);
                onOpenAdmin();
              }}
              style={{ padding: '12px 18px' }}
            >
              <Shield size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Inline styles for media query switches */}
      <style>{`
        @media (min-width: 1024px) {
          .desktop-status {
            display: inline-flex !important;
          }
        }
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}
