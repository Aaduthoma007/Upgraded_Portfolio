'use client';

import React, { useState } from 'react';

interface BiometricScannerProps {
  onScan: () => void;
}

export default function BiometricScanner({ onScan }: BiometricScannerProps) {
  const [isScanning, setIsScanning] = useState(false);

  const handleClick = () => {
    if (isScanning) return;
    setIsScanning(true);
    // Brief scan animation before triggering
    setTimeout(() => {
      onScan();
    }, 600);
  };

  return (
    <div className="auth-cta-wrapper">
      <button
        className={`auth-cta ${isScanning ? 'scanning' : ''}`}
        onClick={handleClick}
        aria-label="Authenticate Identity"
      >
        {/* Animated border */}
        <div className="auth-border" />

        {/* Fingerprint icon */}
        <div className="auth-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M12 10a2 2 0 0 1 2 2c0 1.02-.1 2.51-.26 4" />
            <path d="M8.65 14.24a7 7 0 0 0-.13 1.26c-.1 1.4-.26 2.73-.75 3.86" />
            <path d="M6.22 11a5 5 0 0 1 9.56 0" />
            <path d="M14 13.12c0 .74 0 1.51-.13 2.88m-4.9-2.74A2 2 0 0 1 12 10" />
            <path d="M17.13 12.88c0 .52-.01 1.04-.05 1.56" />
            <path d="M4.26 10.13A8 8 0 0 1 20 11.74" />
            <path d="M3.51 15.11a8.6 8.6 0 0 1 .07-4.98" />
            <path d="M12 2a10 10 0 0 0-7.74 3.66" />
            <path d="M12 2a10 10 0 0 1 8.35 4.5" />
          </svg>
          {isScanning && <div className="auth-scan-sweep" />}
        </div>

        {/* Text */}
        <div className="auth-text">
          <span className="auth-label">
            {isScanning ? 'SCANNING...' : 'AUTHENTICATE IDENTITY'}
          </span>
          <span className="auth-sublabel">
            {isScanning ? 'Verifying biometric data' : 'Press to enter secure environment'}
          </span>
        </div>

        {/* Arrow */}
        {!isScanning && (
          <div className="auth-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        )}

        {/* Scanning spinner */}
        {isScanning && (
          <div className="auth-spinner" />
        )}
      </button>
    </div>
  );
}
