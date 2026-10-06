import React from 'react';
import { ShieldCheck, Heart, Sparkles, Terminal } from 'lucide-react';
import { GithubIcon, AakashPlayLogo } from './Icons';

export function Footer({ totalCount, lastUpdated }) {
  const storeName = import.meta.env.VITE_STORE_NAME || 'AakashPlay';
  const developerName = import.meta.env.VITE_DEVELOPER_NAME || 'Aakash Sakhalkar';
  const developerGithub = import.meta.env.VITE_DEVELOPER_GITHUB || 'https://github.com/aakashsakhalkar';
  const developerPortfolio = import.meta.env.VITE_DEVELOPER_PORTFOLIO || 'https://aakash-sakhalkar.web.app/';

  return (
    <footer style={{ background: 'var(--bg-clay)', padding: '3.5rem 1.75rem 2.5rem', marginTop: 'auto', borderTop: 'var(--border-clay)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <AakashPlayLogo size={34} />
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>{storeName}</h3>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', maxWidth: '440px', lineHeight: 1.65 }}>
              The official app store, software showroom, and open-source registry engineered and curated by{' '}
              <a 
                href={developerPortfolio} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '3px' }}
              >
                {developerName}
              </a>.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '3.5rem', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', marginBottom: '0.85rem', letterSpacing: '0.05em' }}>
                Ecosystem
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                <li>📱 Android APKs ({totalCount || 0} items)</li>
                <li>🌐 Web SaaS Applications</li>
                <li>📦 Open-Source Libraries</li>
                <li>⚡ Live Realtime Sync</li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', marginBottom: '0.85rem', letterSpacing: '0.05em' }}>
                Developer
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
                <li>
                  <a href={developerPortfolio} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    🌐 Official Portfolio
                  </a>
                </li>
                <li>
                  <a href={developerGithub} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <GithubIcon size={16} /> GitHub Profile
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.06)', paddingTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div>
            © {new Date().getFullYear()} {storeName} • Powered by Firebase Realtime Database
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span>Crafted with</span>
            <Heart size={15} color="#f43f5e" fill="#f43f5e" />
            <span>by</span>
            <a 
              href={developerPortfolio} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              {developerName}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
