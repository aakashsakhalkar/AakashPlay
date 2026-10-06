import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Smartphone, 
  Tablet, 
  Monitor, 
  RefreshCw,
  Globe
} from 'lucide-react';

export function LiveWebPreviewModal({ project, onClose }) {
  const [deviceMode, setDeviceMode] = useState('desktop');
  const [iframeKey, setIframeKey] = useState(0);

  if (!project || !project.webapp) return null;

  const getWidth = () => {
    switch (deviceMode) {
      case 'mobile': return '390px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 110 }}>
      <div 
        className="clay-modal-container" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '1280px', height: '94vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Preview Control Bar */}
        <div style={{ background: 'var(--bg-clay)', borderBottom: 'var(--border-clay)', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="clay-icon-bubble" style={{ width: 36, height: 36, borderRadius: 10 }}>
              <Globe size={18} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                {project.title}
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-clay-raised)', padding: '0.1rem 0.45rem', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(0,0,0,0.06)' }}>
                  Live Sandbox
                </span>
              </h3>
            </div>
          </div>

          {/* Device Frame Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-clay-raised)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-pill)', boxShadow: 'var(--clay-shadow-sm)', border: 'var(--border-clay)' }}>
            <button
              onClick={() => setDeviceMode('mobile')}
              className="clay-btn-icon"
              style={{ 
                width: 32, 
                height: 32, 
                background: deviceMode === 'mobile' ? 'linear-gradient(135deg, var(--primary), var(--accent-neon))' : 'transparent', 
                color: deviceMode === 'mobile' ? 'white' : 'var(--text-muted)', 
                boxShadow: deviceMode === 'mobile' ? '0 2px 8px var(--primary-glow)' : 'none',
                border: 'none'
              }}
              title="Mobile View (390px)"
            >
              <Smartphone size={15} />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className="clay-btn-icon"
              style={{ 
                width: 32, 
                height: 32, 
                background: deviceMode === 'tablet' ? 'linear-gradient(135deg, var(--primary), var(--accent-neon))' : 'transparent', 
                color: deviceMode === 'tablet' ? 'white' : 'var(--text-muted)', 
                boxShadow: deviceMode === 'tablet' ? '0 2px 8px var(--primary-glow)' : 'none',
                border: 'none'
              }}
              title="Tablet View (768px)"
            >
              <Tablet size={15} />
            </button>
            <button
              onClick={() => setDeviceMode('desktop')}
              className="clay-btn-icon"
              style={{ 
                width: 32, 
                height: 32, 
                background: deviceMode === 'desktop' ? 'linear-gradient(135deg, var(--primary), var(--accent-neon))' : 'transparent', 
                color: deviceMode === 'desktop' ? 'white' : 'var(--text-muted)', 
                boxShadow: deviceMode === 'desktop' ? '0 2px 8px var(--primary-glow)' : 'none',
                border: 'none'
              }}
              title="Desktop Fullscreen"
            >
              <Monitor size={15} />
            </button>
          </div>

          {/* Right Action Tools */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button 
              className="clay-btn-icon" 
              style={{ width: 36, height: 36 }}
              onClick={() => setIframeKey(k => k + 1)}
              title="Reload Preview"
            >
              <RefreshCw size={15} />
            </button>
            <button 
              className="clay-btn-primary" 
              style={{ padding: '0.45rem 1.15rem', fontSize: '0.85rem' }}
              onClick={() => window.open(project.webapp, '_blank')}
              title="Open direct live app in new tab"
            >
              <ExternalLink size={15} />
              <span>Open in New Tab</span>
            </button>
            <button 
              className="clay-btn-icon" 
              style={{ width: 36, height: 36 }}
              onClick={onClose}
              title="Close sandbox"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Clean Viewport without any annoying overlay blobs */}
        <div style={{ flex: 1, background: '#0a0814', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative' }}>
          <iframe 
            key={iframeKey}
            src={project.webapp}
            title={project.title}
            style={{
              width: getWidth(),
              height: '100%',
              border: 'none',
              background: '#ffffff',
              transition: 'width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
              borderRadius: deviceMode !== 'desktop' ? '20px' : '0',
              boxShadow: deviceMode !== 'desktop' ? '0 12px 36px rgba(0,0,0,0.7)' : 'none'
            }}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </div>
    </div>
  );
}
