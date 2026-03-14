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
    <div className="flex flex-col items-center justify-center gap-6">
      <button
        onClick={handleClick} // Changed from handleScan to handleClick to match existing function name
        disabled={isScanning}
        className={`premium-auth-btn ${isScanning ? 'scanning' : ''}`}
        aria-label="Launch Immersive Mode"
      >
        <div className="btn-content flex items-center gap-4">
          <svg
            className={`w-6 h-6 ${isScanning ? 'text-cyan-400' : 'text-gray-400'} transition-colors duration-300`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
          </svg>
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
