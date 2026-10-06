import React from 'react';
import { Flame, Star, Download, ExternalLink, Award } from 'lucide-react';

export function TopChartsSection({ projects, onSelectApp }) {
  if (!projects || projects.length < 4) return null;

  const topList = projects.slice(0, 6);

  return (
    <section style={{ marginBottom: '3rem' }}>
      <div className="section-header">
        <div>
          <div className="section-title">
            <Flame size={24} color="#f97316" />
            <span>Top Rated & Flagship Software</span>
          </div>
          <p className="section-subtitle">
            Most popular Android apps, SaaS platforms, and open-source utilities
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {topList.map((app, index) => (
          <div
            key={app.id || index}
            onClick={() => onSelectApp(app)}
            style={{
              background: 'var(--bg-clay-card)',
              borderRadius: 'var(--radius-clay-md)',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              cursor: 'pointer',
              boxShadow: 'var(--clay-shadow-sm)',
              border: 'var(--border-clay)',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
              e.currentTarget.style.boxShadow = 'var(--clay-shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'var(--clay-shadow-sm)';
            }}
          >
            {/* Rank Badge */}
            <span style={{ 
              fontSize: '1.2rem', 
              fontWeight: 800, 
              color: index < 3 ? 'var(--primary)' : 'var(--text-muted)', 
              width: '28px', 
              textAlign: 'center' 
            }}>
              #{index + 1}
            </span>

            {/* App Icon */}
            <div className="clay-icon-bubble" style={{ width: 52, height: 52, borderRadius: 16 }}>
              <img 
                src={app.image} 
                alt={app.title} 
                className="app-icon"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </div>

            {/* Title & Metadata */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {app.title}
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                <span style={{ fontWeight: 600 }}>{app.category}</span>
                <span>•</span>
                <span style={{ fontWeight: 600, color: 'var(--text-subtle)' }}>
                  {app.date || 'Active'}
                </span>
              </div>
            </div>

            {/* Action Mini Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (app.webapp) window.open(app.webapp, '_blank');
                else onSelectApp(app);
              }}
              className="clay-btn-icon"
              style={{ width: 36, height: 36 }}
              title={app.isApk ? 'Download APK' : 'Open'}
            >
              {app.isApk ? <Download size={16} color="var(--primary)" /> : <ExternalLink size={16} color="var(--accent-neon)" />}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
