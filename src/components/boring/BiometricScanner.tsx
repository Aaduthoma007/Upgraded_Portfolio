'use client';

import React from 'react';

interface BiometricScannerProps {
  onScan: () => void;
}

export default function BiometricScanner({ onScan }: BiometricScannerProps) {
  return (
    <div className="scanner-container">
      <div className="scanner-label">
        <span className="scanner-label-arrow">→</span>
        <span>AUTHENTICATE</span>
      </div>
      <button className="scanner-btn" onClick={onScan} aria-label="Biometric Scanner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" opacity="0.15" fill="currentColor" />
          <path d="M7 12c0-2.76 2.24-5 5-5" strokeLinecap="round" />
          <path d="M17 12c0 2.76-2.24 5-5 5" strokeLinecap="round" />
          <path d="M12 7v10" strokeLinecap="round" />
          <path d="M9 12c0-1.66 1.34-3 3-3" strokeLinecap="round" />
          <path d="M15 12c0 1.66-1.34 3-3 3" strokeLinecap="round" />
          <path d="M12 9v6" strokeLinecap="round" opacity="0.6" />
        </svg>
        <div className="scan-line" />
        <div className="scanner-ring" />
        <div className="scanner-ring ring-2" />
      </button>
    </div>
  );
}
