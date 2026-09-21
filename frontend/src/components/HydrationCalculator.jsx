import React, { useState } from 'react';
import { Calculator, Users, Activity, TrendingDown, Droplets, Sparkles, Check } from 'lucide-react';

export default function HydrationCalculator({ onOpenOrder, prices }) {
  const [people, setPeople] = useState(4);
  const [activeLevel, setActiveLevel] = useState('moderate'); // 'light', 'moderate', 'high'

  const litersPerPersonDay = activeLevel === 'light' ? 2.0 : activeLevel === 'moderate' ? 2.5 : 3.2;
  const monthlyLiters = Math.round(people * litersPerPersonDay * 30);
  const monthlyBottles20L = Math.ceil(monthlyLiters / 20);

  const refillRate = prices?.refill_price_per_liter || 10;
  const aquaBlissCost = monthlyLiters * refillRate;
  const retailBottledCost = monthlyLiters * 45; // Standard 500ml/1L supermarket rate (~KSh 45-50/L)
  const monthlySavings = retailBottledCost - aquaBlissCost;

  return (
    <section id="calculator" className="section" style={{ background: 'linear-gradient(180deg, #071324 0%, var(--bg-dark) 100%)' }}>
      <div className="container">
        <div className="section-header">
          <div className="glass-pill">
            <Calculator size={14} />
            <span>Smart Hydration & Savings</span>
          </div>
          <h2 className="section-title">
            Calculate Your Family’s <span className="gradient-text">Water Needs</span>
          </h2>
          <p className="section-sub">
            See how much clean water your home or office needs each month and how much you save with AquaBliss refills.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '36px',
            alignItems: 'center',
          }}
          className="calc-grid"
        >
          {/* Inputs Card */}
          <div className="glass-card" style={{ padding: '36px' }}>
            {/* Number of people */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  <Users size={18} style={{ color: 'var(--accent-cyan)' }} />
                  <span>Number of People in Household / Office:</span>
                </label>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  {people} {people === 1 ? 'Person' : 'People'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={people}
                onChange={(e) => setPeople(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
                <span>1 Person</span>
                <span>4 (Family)</span>
                <span>15 (Office)</span>
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '14px' }}>
                <Activity size={18} style={{ color: 'var(--accent-cyan)' }} />
                <span>Daily Activity & Climate Level:</span>
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[
                  { id: 'light', label: 'Light', desc: '2.0L / day' },
                  { id: 'moderate', label: 'Moderate', desc: '2.5L / day' },
                  { id: 'high', label: 'Active', desc: '3.2L / day' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setActiveLevel(lvl.id)}
                    style={{
                      padding: '14px 10px',
                      borderRadius: '12px',
                      background: activeLevel === lvl.id ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${activeLevel === lvl.id ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.08)'}`,
                      textAlign: 'center',
                      color: activeLevel === lvl.id ? 'var(--accent-cyan)' : 'var(--text-main)',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{lvl.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '2px' }}>{lvl.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div
            className="glass-card"
            style={{
              padding: '36px',
              background: 'rgba(13, 30, 52, 0.92)',
              border: '1px solid rgba(72, 202, 228, 0.35)',
            }}
          >
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px' }}>
              Your Monthly Requirement
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ padding: '16px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '14px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly Volume</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '4px' }}>
                  {monthlyLiters}L
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>~{monthlyBottles20L} bottles (20L)</div>
              </div>

              <div style={{ padding: '16px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '14px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly Cost</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
                  KSh {aquaBlissCost.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>At KSh {refillRate}/L refill rate</div>
              </div>
            </div>

            {/* Savings Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px 20px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '14px',
                marginBottom: '24px',
              }}
            >
              <TrendingDown size={28} style={{ color: '#34d399', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Estimated Monthly Savings vs Bottled Brands:</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}>
                  Save ~KSh {monthlySavings.toLocaleString()} / month
                </div>
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', padding: '15px' }}
              onClick={() => onOpenOrder({ type: 'refill', liters: 20 })}
            >
              <Droplets size={18} />
              <span>Order Refill for My Home</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .calc-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
