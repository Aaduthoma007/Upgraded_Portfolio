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
        disabled={isScanning}
        aria-label="Launch Immersive Mode"
      >
        {/* Animated border */}
        <div className="auth-border" />

        {/* Custom Icon (replacing fingerprint) */}
        <div className="auth-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
          </svg>
          {isScanning && <div className="auth-scan-sweep" />}
        </div>

        {/* Text */}
        <div className="auth-text">
          <span className="auth-label">
            {isScanning ? 'INITIALIZING...' : 'LAUNCH IMMERSIVE MODE'}
          </span>
          <span className="auth-sublabel">
            {isScanning ? 'Loading 3D environment' : 'Press to enter interactive portfolio'}
          </span>
        </div>

        {/* Loading Spinner */}
        {isScanning && <div className="auth-spinner" />}
      </button>
    </div>
  );
}
