import React from 'react';
import { ShieldCheck, Truck, PhoneCall, Smartphone, Clock, Sparkles } from 'lucide-react';

export default function TrustStrip() {
  const trustItems = [
    {
      icon: <ShieldCheck size={22} style={{ color: '#34d399' }} />,
      title: 'Lab-Tested Purity',
      desc: 'Reverse Osmosis & UV Treated',
    },
    {
      icon: <Truck size={22} style={{ color: 'var(--accent-cyan)' }} />,
      title: 'Free Delivery',
      desc: 'Makongeni & Garissa Road',
    },
    {
      icon: <Clock size={22} style={{ color: 'var(--accent-gold)' }} />,
      title: 'Same-Day Fast Dispatch',
      desc: 'Usually within 30-45 mins',
    },
    {
      icon: <Smartphone size={22} style={{ color: '#60a5fa' }} />,
      title: 'Pay via M-Pesa',
      desc: 'Simple cash on delivery / M-Pesa',
    },
    {
      icon: <Sparkles size={22} style={{ color: '#f472b6' }} />,
      title: 'Open Sun – Fri',
      desc: '9:00 AM – 9:30 PM Everyday',
    },
  ];

  return (
    <div
      style={{
        background: 'rgba(11, 25, 44, 0.95)',
        borderTop: '1px solid rgba(72, 202, 228, 0.15)',
        borderBottom: '1px solid rgba(72, 202, 228, 0.15)',
        padding: '24px 0',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '20px',
            alignItems: 'center',
          }}
        >
          {trustItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '8px 12px',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '2px' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
