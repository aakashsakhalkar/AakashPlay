import React from 'react';

export function GithubIcon({ size = 18, color = "currentColor", ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function AakashPlayLogo({ size = 36, ...props }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      {...props}
    >
      <defs>
        <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#c026d3" />
        </linearGradient>
        <linearGradient id="logoLetterAGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ede9fe" />
        </linearGradient>
        <linearGradient id="logoPlayArrowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c026d3" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>

      <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#logoBgGrad)" />
      <rect x="3" y="3" width="42" height="42" rx="13" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" fill="none" />

      {/* Bold Letter 'A' Outer Silhouette */}
      <path 
        fillRule="evenodd"
        clipRule="evenodd"
        d="M 24 7.5
           C 25.2 7.5 26.2 8.3 26.8 9.5
           L 39 37.5
           C 39.5 38.6 38.7 40 37.5 40
           L 31 40
           C 30.1 40 29.3 39.4 28.9 38.5
           L 26.8 33
           L 21.2 33
           L 19.1 38.5
           C 18.7 39.4 17.9 40 17 40
           L 10.5 40
           C 9.3 40 8.5 38.6 9 37.5
           L 21.2 9.5
           C 21.8 8.3 22.8 7.5 24 7.5 Z
           
           M 20.5 17
           C 19.7 16.4 18.5 17 18.5 18
           L 18.5 28
           C 18.5 29 19.7 29.6 20.5 29
           L 28.5 24
           C 29.3 23.5 29.3 22.5 28.5 22
           L 20.5 17 Z"
        fill="url(#logoLetterAGrad)" 
      />

      {/* Embedded Play Triangle Inside 'A' */}
      <path 
        d="M 20.5 17
           C 19.7 16.4 18.5 17 18.5 18
           L 18.5 28
           C 18.5 29 19.7 29.6 20.5 29
           L 28.5 24
           C 29.3 23.5 29.3 22.5 28.5 22
           L 20.5 17 Z"
        fill="url(#logoPlayArrowGrad)" 
      />
    </svg>
  );
}
