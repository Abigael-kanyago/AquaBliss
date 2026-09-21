import React from 'react';

export default function AquaBlissLogo({ size = 42, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ verticalAlign: 'middle', display: 'inline-block', flexShrink: 0 }}
    >
      <defs>
        <radialGradient id="aquaGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#48cae4" />
          <stop offset="100%" stopColor="#0077b6" />
        </radialGradient>
        <linearGradient id="dropGradientPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00b4d8" />
          <stop offset="100%" stopColor="#0077cc" />
        </linearGradient>
        <linearGradient id="dropGradientSecondary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#90e0ef" />
          <stop offset="100%" stopColor="#0096c7" />
        </linearGradient>
        <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0096c7" floodOpacity="0.35" />
        </filter>
      </defs>

      <g filter="url(#glowEffect)">
        {/* Center Droplet Core */}
        <circle cx="50" cy="50" r="9" fill="url(#aquaGlow)" />

        {/* 4 Cardinal Droplets */}
        {/* Top (12 o'clock) */}
        <path
          d="M50 10 C46 22, 43 28, 45 32 C47 35, 53 35, 55 32 C57 28, 54 22, 50 10 Z"
          fill="url(#dropGradientPrimary)"
        />
        {/* Bottom (6 o'clock) */}
        <path
          d="M50 90 C46 78, 43 72, 45 68 C47 65, 53 65, 55 68 C57 72, 54 78, 50 90 Z"
          fill="url(#dropGradientPrimary)"
        />
        {/* Right (3 o'clock) */}
        <path
          d="M90 50 C78 46, 72 43, 68 45 C65 47, 65 53, 68 55 C72 57, 78 54, 90 50 Z"
          fill="url(#dropGradientPrimary)"
        />
        {/* Left (9 o'clock) */}
        <path
          d="M10 50 C22 46, 28 43, 32 45 C35 47, 35 53, 32 55 C28 57, 22 54, 10 50 Z"
          fill="url(#dropGradientPrimary)"
        />

        {/* 4 Diagonal Droplets (Lighter cyan) */}
        {/* Top-Right */}
        <path
          d="M78 22 C68 28, 62 34, 63 38 C65 42, 70 41, 73 38 C76 34, 76 28, 78 22 Z"
          fill="url(#dropGradientSecondary)"
        />
        {/* Bottom-Right */}
        <path
          d="M78 78 C68 72, 62 66, 63 62 C65 58, 70 59, 73 62 C76 66, 76 72, 78 78 Z"
          fill="url(#dropGradientSecondary)"
        />
        {/* Bottom-Left */}
        <path
          d="M22 78 C32 72, 38 66, 37 62 C35 58, 30 59, 27 62 C24 66, 24 72, 22 78 Z"
          fill="url(#dropGradientSecondary)"
        />
        {/* Top-Left */}
        <path
          d="M22 22 C32 28, 38 34, 37 38 C35 42, 30 41, 27 38 C24 34, 24 28, 22 22 Z"
          fill="url(#dropGradientSecondary)"
        />
      </g>
    </svg>
  );
}
