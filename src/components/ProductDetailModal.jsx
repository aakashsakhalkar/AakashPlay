import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Download, 
  ExternalLink, 
  QrCode, 
  Share2, 
  ShieldCheck, 
  Check, 
  Copy, 
  Smartphone, 
  Globe, 
  Package, 
  Calendar, 
  Terminal, 
  Cpu, 
  Layers, 
  Sparkles 
} from 'lucide-react';
import { GithubIcon } from './Icons';
import confetti from 'canvas-confetti';

export function ProductDetailModal({ project, onClose, onLaunchPreview }) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const developerName = import.meta.env.VITE_DEVELOPER_NAME || 'Aakash Sakhalkar';

  if (!project) return null;

  const handleAction = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    if (project.webapp) {
      window.open(project.webapp, '_blank');
    } else if (project.github) {
      window.open(project.github, '_blank');
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${project.title} on AakashPlay`,
        text: `Check out ${project.title} on AakashPlay Store:`,
        url: project.webapp || url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(project.webapp || url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getDependencySnippet = () => {
    if (project.tags?.some(t => t.toLowerCase().includes('npm'))) {
      return `npm install ${project.title.toLowerCase().replace(/\s+/g, '-')}`;
    }
    if (project.tags?.some(t => t.toLowerCase().includes('jitpack'))) {
      return `implementation 'com.github.aakashsakhalkar:${project.title}:v1.0.0'`;
    }
    return null;
  };

  const dependencySnippet = getDependencySnippet();

  const handleCopySnippet = () => {
    if (!dependencySnippet) return;
    navigator.clipboard.writeText(dependencySnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(project.webapp || project.github || window.location.href)}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="clay-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header with 3D App Bubble */}
        <div className="modal-header">
          <div className="clay-icon-bubble" style={{ width: 84, height: 84, borderRadius: 26 }}>
            <img 
              src={project.image} 
              alt={project.title} 
              className="app-icon"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0, paddingRight: '2rem' }}>
            <h2 style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {project.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '0.95rem', color: 'var(--primary)', fontWeight: 800 }}>
                {developerName}
              </span>
              <ShieldCheck size={18} color="var(--primary)" title="Verified Creator" />
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: 600 }}>
              {project.category} • Certified Production Release
            </div>
          </div>

          <button className="clay-btn-icon" onClick={onClose} aria-label="Close dialog" style={{ width: 40, height: 40 }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Real Metrics Strip */}
          <div className="clay-metrics-strip">
            <div className="metric-item">
              <div className="metric-value" style={{ fontSize: '1.05rem' }}>
                {project.isApk ? 'Android APK' : (project.computedType === 'web' ? 'Web App' : 'Library')}
              </div>
              <div className="metric-label">Platform</div>
            </div>

            <div className="metric-item">
              <div className="metric-value" style={{ fontSize: '1.05rem' }}>
                {project.date || 'Active'}
              </div>
              <div className="metric-label">Release Date</div>
            </div>

            <div className="metric-item">
              <div className="metric-value" style={{ fontSize: '1.05rem' }}>
                {project.tagsCount || project.tags?.length || 0} Techs
              </div>
              <div className="metric-label">Stack Size</div>
            </div>

            <div className="metric-item">
              <div className="metric-value" style={{ fontSize: '1.05rem', color: 'var(--primary)' }}>
                {project.isApk ? 'Free APK' : (project.computedType === 'web' ? 'Free SaaS' : 'Open Source')}
              </div>
              <div className="metric-label">Access</div>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button 
              className="clay-btn-primary" 
              style={{ flex: 1, minWidth: '220px', justifyContent: 'center', padding: '0.95rem 1.75rem', fontSize: '1.05rem' }}
              onClick={handleAction}
            >
              {project.isApk ? <Download size={22} /> : <ExternalLink size={22} />}
              <span>{project.isApk ? 'Download & Install APK' : (project.computedType === 'web' ? 'Launch Web App' : 'Open GitHub Repository')}</span>
            </button>

            {project.computedType === 'web' && project.webapp && (
              <button 
                className="clay-btn-secondary"
                style={{ color: 'var(--text-main)', background: 'var(--bg-clay)', border: 'var(--border-clay)', padding: '0.95rem 1.4rem' }}
                onClick={() => {
                  onClose();
                  onLaunchPreview(project);
                }}
                title="Interactive Live Sandbox Preview"
              >
                <Globe size={20} color="#3b82f6" />
                <span>Live Sandbox</span>
              </button>
            )}

            {project.isApk && (
              <button 
                className="clay-btn-icon" 
                style={{ width: 48, height: 48 }}
                onClick={() => setShowQr(!showQr)} 
                title="Scan QR to install on Phone"
              >
                <QrCode size={22} />
              </button>
            )}

            <button 
              className="clay-btn-icon" 
              style={{ width: 48, height: 48 }}
              onClick={handleShare} 
              title="Share project"
            >
              {copied ? <Check size={22} color="#10b981" /> : <Share2 size={22} />}
            </button>
          </div>

          {/* QR Code Card */}
          {showQr && project.isApk && (
            <div style={{ background: 'var(--bg-clay)', border: 'var(--border-clay)', borderRadius: 'var(--radius-clay-md)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', boxShadow: 'var(--clay-shadow-sm)', animation: 'clayFadeIn 0.3s ease' }}>
              <img src={qrUrl} alt="QR Code" style={{ width: 120, height: 120, borderRadius: 12, background: 'white', padding: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  📲 Scan with Phone Camera
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Scan this QR code with your Android phone's camera to download and install <strong>{project.title}</strong> directly on your mobile device.
                </p>
              </div>
            </div>
          )}

          {/* Dependency Code Snippet if Open Source */}
          {dependencySnippet && (
            <div>
              <div className="section-title" style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>
                <Terminal size={20} color="var(--clay-purple)" />
                <span>Package Dependency</span>
              </div>
              <div style={{ background: '#0f172a', borderRadius: 'var(--radius-clay-sm)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#38bdf8', boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5)' }}>
                <code>{dependencySnippet}</code>
                <button 
                  onClick={handleCopySnippet} 
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '0.4rem 0.85rem', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 700 }}
                >
                  {copiedSnippet ? <Check size={15} color="var(--primary)" /> : <Copy size={15} />}
                  <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

          {/* About this app */}
          <div>
            <div className="section-title" style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>
              <Sparkles size={20} color="var(--primary)" />
              <span>About this application</span>
            </div>
            <div className="clay-desc-box">
              {project.description}
            </div>
          </div>

          {/* Clay Data Safety Badge */}
          <div style={{ background: 'var(--bg-clay)', border: 'var(--border-clay)', borderRadius: 'var(--radius-clay-md)', padding: '1.5rem', boxShadow: 'var(--clay-shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <ShieldCheck size={22} color="var(--primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Data Safety & Privacy
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
              Privacy-first engineering standard: No unauthorized telemetry, zero third-party ad tracking, and local device-first execution.
            </p>
          </div>

          {/* Technical Specifications */}
          <div>
            <div className="section-title" style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>
              <Cpu size={20} color="#3b82f6" />
              <span>Technical Details</span>
            </div>
            <div className="specs-grid">
              <div className="clay-spec-card">
                <Calendar size={22} color="var(--text-muted)" />
                <div>
                  <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Updated Date</h4>
                  <p style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>{project.date || 'Active'}</p>
                </div>
              </div>

              <div className="clay-spec-card">
                <Layers size={22} color="var(--text-muted)" />
                <div>
                  <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Category</h4>
                  <p style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>{project.category}</p>
                </div>
              </div>

              {project.github && (
                <div className="clay-spec-card" style={{ gridColumn: 'span 2', cursor: 'pointer' }} onClick={() => window.open(project.github, '_blank')}>
                  <GithubIcon size={22} color="var(--text-muted)" />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>GitHub Repository</h4>
                    <p style={{ color: '#3b82f6', fontWeight: 700, textDecoration: 'underline', fontSize: '0.92rem' }}>{project.github}</p>
                  </div>
                  <ExternalLink size={18} color="var(--text-muted)" />
                </div>
              )}
            </div>
          </div>

          {/* Tech Stack Chips */}
          {project.tags && project.tags.length > 0 && (
            <div>
              <div className="section-title" style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>
                <Layers size={20} color="#f59e0b" />
                <span>Technologies & Frameworks</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="clay-tag-pill" style={{ fontSize: '0.85rem', padding: '0.4rem 0.95rem' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
