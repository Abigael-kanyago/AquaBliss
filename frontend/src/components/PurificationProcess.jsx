import React, { useState } from 'react';
import { Layers, ShieldCheck, Sparkles, Droplets, Activity, CheckCircle2, Zap, Award } from 'lucide-react';

export default function PurificationProcess() {
  const [activeStage, setActiveStage] = useState(2); // RO selected by default

  const stages = [
    {
      id: 0,
      number: '01',
      title: 'Sediment Pre-Filtration',
      short: '5-Micron Sediment',
      desc: 'Removes visible particles, sand, rust, and silt, protecting subsequent filtration layers.',
      efficiency: '100% Particles Removed',
      icon: <Layers size={20} />,
    },
    {
      id: 1,
      number: '02',
      title: 'Activated Carbon Filter',
      short: 'Activated Carbon',
      desc: 'Absorbs chlorine, volatile organic compounds (VOCs), unpleasant odors, and organic chemicals.',
      efficiency: 'Zero Chemical Odors',
      icon: <Sparkles size={20} />,
    },
    {
      id: 2,
      number: '03',
      title: 'Reverse Osmosis (RO)',
      short: 'RO Membrane',
      desc: 'Microscopic 0.0001 micron semi-permeable membrane eliminates 99.9% of dissolved solids and heavy metals.',
      efficiency: '99.9% Heavy Metal Elimination',
      icon: <Droplets size={20} />,
    },
    {
      id: 3,
      number: '04',
      title: 'Mineral Balance & Polishing',
      short: 'Alkaline Minerals',
      desc: 'Infuses vital natural electrolytes (magnesium, calcium, potassium) ensuring crisp, sweet taste and optimal pH 7.4.',
      efficiency: 'Optimal 7.4 pH Balanced',
      icon: <Award size={20} />,
    },
    {
      id: 4,
      number: '05',
      title: 'UV Sterilization Chamber',
      short: 'UV-C Germicidal',
      desc: 'Intense ultraviolet-C light eliminates 99.99% of bacteria, viruses, and pathogens without any added chemicals.',
      efficiency: '99.99% Pathogen Neutralization',
      icon: <Zap size={20} />,
    },
  ];

  return (
    <section id="purity" className="section" style={{ background: 'var(--bg-dark)' }}>
      <div className="container">
        <div className="section-header">
          <div className="glass-pill">
            <ShieldCheck size={14} />
            <span>5-Stage Purification Lab</span>
          </div>
          <h2 className="section-title">
            How We Guarantee <span className="gradient-text">100% Purity</span>
          </h2>
          <p className="section-sub">
            Every drop goes through five distinct, laboratory-grade purification phases before reaching your glass.
          </p>
        </div>

        {/* Stage Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '12px',
            marginBottom: '32px',
          }}
          className="stage-tabs"
        >
          {stages.map((stage) => {
            const isSelected = activeStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                style={{
                  padding: '16px 12px',
                  borderRadius: '14px',
                  background: isSelected ? 'rgba(0, 150, 199, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${isSelected ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.08)'}`,
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 8px 25px rgba(0, 242, 254, 0.15)' : 'none',
                }}
              >
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: isSelected ? 'var(--accent-cyan)' : 'var(--text-subtle)',
                    marginBottom: '4px',
                  }}
                >
                  STAGE {stage.number}
                </div>
                <div
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                  }}
                >
                  {stage.short}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Highlight Card */}
        <div
          className="glass-card"
          style={{
            padding: '40px',
            background: 'rgba(11, 25, 44, 0.85)',
            border: '1px solid rgba(72, 202, 228, 0.3)',
            marginBottom: '48px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '40px',
              alignItems: 'center',
            }}
            className="stage-detail-grid"
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--accent-cyan)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginBottom: '10px',
                }}
              >
                {stages[activeStage].icon}
                <span>STAGE {stages[activeStage].number} TECHNOLOGY</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px' }}>
                {stages[activeStage].title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '24px' }}>
                {stages[activeStage].desc}
              </p>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(52, 211, 153, 0.12)',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  color: '#34d399',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                <CheckCircle2 size={18} />
                <span>{stages[activeStage].efficiency}</span>
              </div>
            </div>

            {/* TDS Purity Comparison Widget */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '18px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '28px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>TDS Purity Level Meter</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>PPM (Parts Per Million)</span>
              </div>

              {/* AquaBliss TDS */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>AquaBliss Purified Water</span>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>20 PPM (Ultra Pure)</span>
                </div>
                <div style={{ height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: '8%',
                      height: '100%',
                      background: 'linear-gradient(90deg, #00f2fe, #34d399)',
                      borderRadius: '5px',
                    }}
                  />
                </div>
              </div>

              {/* Bottled standard */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Standard Bottled Water</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>120 PPM</span>
                </div>
                <div style={{ height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: '35%', height: '100%', background: 'rgba(72, 202, 228, 0.4)', borderRadius: '5px' }} />
                </div>
              </div>

              {/* Municipal tap */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Raw Municipal Tap Water</span>
                  <span style={{ color: '#f87171', fontWeight: 600 }}>380+ PPM</span>
                </div>
                <div style={{ height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: '85%', height: '100%', background: '#ef4444', borderRadius: '5px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .stage-tabs {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .stage-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
