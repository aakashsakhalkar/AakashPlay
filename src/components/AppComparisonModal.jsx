import React, { useState } from 'react';
import { 
  X, 
  ArrowLeftRight, 
  Sparkles, 
  Check, 
  Smartphone, 
  Globe, 
  Package, 
  GraduationCap, 
  Download, 
  ExternalLink, 
  Calendar, 
  Layers, 
  ShieldCheck,
  Code2
} from 'lucide-react';
import { GithubIcon } from './Icons';

function ExpandableDescription({ text, maxLength = 160 }) {
  const [expanded, setExpanded] = useState(false);
  
  if (!text) return <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No description provided</span>;
  
  const isLong = text.length > maxLength;
  const displayed = isLong && !expanded ? `${text.slice(0, maxLength).trim()}...` : text;

  return (
    <div className="matrix-desc">
      <p style={{ margin: 0, lineHeight: 1.55 }}>{displayed}</p>
      {isLong && (
        <button
          onClick={() => setExpanded(prev => !prev)}
          className="clay-read-more-btn"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
}

export function AppComparisonModal({ app1, app2, onClose, onLaunchWebPreview }) {
  const [imgError1, setImgError1] = useState(false);
  const [imgError2, setImgError2] = useState(false);

  if (!app1 || !app2) return null;

  // Extract and clean tags
  const tags1 = (app1.tags || []).filter(t => !t.startsWith('http'));
  const tags2 = (app2.tags || []).filter(t => !t.startsWith('http'));

  // Calculate shared vs unique tech
  const sharedTags = tags1.filter(t => tags2.some(t2 => t2.toLowerCase() === t.toLowerCase()));
  const uniqueTags1 = tags1.filter(t => !tags2.some(t2 => t2.toLowerCase() === t.toLowerCase()));
  const uniqueTags2 = tags2.filter(t => !tags1.some(t1 => t1.toLowerCase() === t.toLowerCase()));

  const getTypeIcon = (type) => {
    switch (type) {
      case 'android': return <Smartphone size={16} color="var(--primary)" />;
      case 'web': return <Globe size={16} color="var(--accent-neon)" />;
      case 'library': return <Package size={16} color="var(--accent-cyan)" />;
      default: return <GraduationCap size={16} color="var(--accent-amber)" />;
    }
  };

  const getActionButton = (app, isApp1) => {
    if (app.isApk) {
      return (
        <a 
          href={app.webapp} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="clay-btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '0.65rem 1rem', fontSize: '0.88rem' }}
        >
          <Download size={16} />
          <span>Download APK</span>
        </a>
      );
    }
    if (app.computedType === 'web' && app.webapp) {
      return (
        <button 
          onClick={() => {
            onClose();
            onLaunchWebPreview(app);
          }}
          className="clay-btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '0.65rem 1rem', fontSize: '0.88rem' }}
        >
          <ExternalLink size={16} />
          <span>Live Web Sandbox</span>
        </button>
      );
    }
    return (
      <a 
        href={app.github || app.webapp || '#'} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="clay-btn-secondary"
        style={{ width: '100%', justifyContent: 'center', padding: '0.65rem 1rem', fontSize: '0.88rem' }}
      >
        <GithubIcon size={16} />
        <span>Source Code</span>
      </a>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div 
        className="clay-modal-container compare-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="clay-icon-bubble" style={{ width: 40, height: 40, background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <ArrowLeftRight size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Side-by-Side App Comparison
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Comparing architecture, tech stack & platforms
              </p>
            </div>
          </div>

          <button className="clay-btn-icon" onClick={onClose} aria-label="Close comparison" style={{ width: 40, height: 40 }}>
            <X size={20} />
          </button>
        </div>

        {/* Comparison Body */}
        <div className="compare-modal-body">
          {/* Top Overview Cards Grid */}
          <div className="compare-grid-header">
            {/* App 1 Card */}
            <div className="compare-app-header-box">
              <div className="clay-icon-bubble" style={{ width: 56, height: 56, flexShrink: 0 }}>
                {!imgError1 ? (
                  <img 
                    src={app1.image} 
                    alt={app1.title} 
                    className="app-icon"
                    onError={() => setImgError1(true)}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: 'var(--primary)', color: 'white', fontWeight: 800 }}>
                    {app1.title.charAt(0)}
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className="compare-badge-pill">App 1</span>
                <h3 className="compare-app-title" title={app1.title}>{app1.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                  {getTypeIcon(app1.computedType)}
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{app1.category}</span>
                </div>
              </div>
              <div style={{ width: '100%', marginTop: '0.75rem' }}>
                {getActionButton(app1, true)}
              </div>
            </div>

            {/* VS Divider */}
            <div className="compare-vs-badge">
              <span>VS</span>
            </div>

            {/* App 2 Card */}
            <div className="compare-app-header-box">
              <div className="clay-icon-bubble" style={{ width: 56, height: 56, flexShrink: 0 }}>
                {!imgError2 ? (
                  <img 
                    src={app2.image} 
                    alt={app2.title} 
                    className="app-icon"
                    onError={() => setImgError2(true)}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: 'var(--accent-neon)', color: 'white', fontWeight: 800 }}>
                    {app2.title.charAt(0)}
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className="compare-badge-pill" style={{ background: 'var(--accent-neon-light)', color: 'var(--accent-neon)' }}>App 2</span>
                <h3 className="compare-app-title" title={app2.title}>{app2.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                  {getTypeIcon(app2.computedType)}
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{app2.category}</span>
                </div>
              </div>
              <div style={{ width: '100%', marginTop: '0.75rem' }}>
                {getActionButton(app2, false)}
              </div>
            </div>
          </div>

          {/* Detailed Metric Matrix */}
          <div className="compare-matrix-section">
            <h4 className="compare-section-heading">
              <Layers size={16} color="var(--primary)" />
              <span>Specification Matrix</span>
            </h4>

            <div className="compare-table-container">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th style={{ width: '25%' }}>Attribute</th>
                    <th style={{ width: '37.5%' }}>{app1.title}</th>
                    <th style={{ width: '37.5%' }}>{app2.title}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="attribute-name">Platform / Format</td>
                    <td>
                      <span className="clay-size-badge">
                        {app1.isApk ? '📱 Android APK' : (app1.computedType === 'web' ? '🌐 Web SaaS' : '📦 Library')}
                      </span>
                    </td>
                    <td>
                      <span className="clay-size-badge">
                        {app2.isApk ? '📱 Android APK' : (app2.computedType === 'web' ? '🌐 Web SaaS' : '📦 Library')}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="attribute-name">Release / Timeline</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.85rem' }}>
                        <Calendar size={14} color="var(--text-muted)" />
                        {app1.date || 'Active Production'}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.85rem' }}>
                        <Calendar size={14} color="var(--text-muted)" />
                        {app2.date || 'Active Production'}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="attribute-name">Total Technologies</td>
                    <td>
                      <div style={{ marginBottom: '0.45rem' }}>
                        <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>{tags1.length}</strong> technologies
                      </div>
                      <div className="compare-tags-wrap">
                        {tags1.map((t, idx) => (
                          <span key={idx} className="clay-tag-pill" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.72rem' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div style={{ marginBottom: '0.45rem' }}>
                        <strong style={{ color: 'var(--accent-neon)', fontSize: '0.95rem' }}>{tags2.length}</strong> technologies
                      </div>
                      <div className="compare-tags-wrap">
                        {tags2.map((t, idx) => (
                          <span key={idx} className="clay-tag-pill" style={{ background: 'var(--accent-neon-light)', color: 'var(--accent-neon)', fontSize: '0.72rem' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="attribute-name">Description & Scope</td>
                    <td>
                      <ExpandableDescription text={app1.description} />
                    </td>
                    <td>
                      <ExpandableDescription text={app2.description} />
                    </td>
                  </tr>

                  <tr>
                    <td className="attribute-name">Source & License</td>
                    <td>
                      {app1.github ? (
                        <a href={app1.github} target="_blank" rel="noopener noreferrer" className="matrix-link">
                          <GithubIcon size={13} /> View on GitHub
                        </a>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Closed / Custom</span>
                      )}
                    </td>
                    <td>
                      {app2.github ? (
                        <a href={app2.github} target="_blank" rel="noopener noreferrer" className="matrix-link">
                          <GithubIcon size={13} /> View on GitHub
                        </a>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Closed / Custom</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Tech Stack Breakdown (Shared vs Unique) */}
          <div className="compare-matrix-section" style={{ marginTop: '1.5rem' }}>
            <h4 className="compare-section-heading">
              <Code2 size={16} color="var(--accent-cyan)" />
              <span>Tech Stack Deep-Dive</span>
            </h4>

            {sharedTags.length > 0 && (
              <div className="compare-tag-group shared">
                <span className="compare-tag-label">
                  <Check size={14} color="#10b981" />
                  <span>Shared Technologies ({sharedTags.length}):</span>
                </span>
                <div className="compare-tags-wrap">
                  {sharedTags.map((t, idx) => (
                    <span key={idx} className="clay-tag-pill shared-pill">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="compare-unique-grid">
              <div className="compare-tag-group">
                <span className="compare-tag-label" style={{ color: 'var(--primary)' }}>
                  Unique to {app1.title} ({uniqueTags1.length}):
                </span>
                <div className="compare-tags-wrap">
                  {uniqueTags1.length > 0 ? (
                    uniqueTags1.map((t, idx) => (
                      <span key={idx} className="clay-tag-pill" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                        {t}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>None (all overlap)</span>
                  )}
                </div>
              </div>

              <div className="compare-tag-group">
                <span className="compare-tag-label" style={{ color: 'var(--accent-neon)' }}>
                  Unique to {app2.title} ({uniqueTags2.length}):
                </span>
                <div className="compare-tags-wrap">
                  {uniqueTags2.length > 0 ? (
                    uniqueTags2.map((t, idx) => (
                      <span key={idx} className="clay-tag-pill" style={{ background: 'var(--accent-neon-light)', color: 'var(--accent-neon)' }}>
                        {t}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>None (all overlap)</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
