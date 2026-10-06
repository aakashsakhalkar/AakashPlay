import React, { useState } from 'react';
import { 
  Star, 
  Download, 
  ExternalLink, 
  Code2, 
  Smartphone, 
  Globe, 
  Package, 
  GraduationCap
} from 'lucide-react';

export function AppCard({ project, onSelect }) {
  const [imgError, setImgError] = useState(false);

  const getActionConfig = () => {
    if (project.isApk) {
      return {
        label: 'Install APK',
        icon: Download,
        className: 'install',
        action: (e) => {
          e.stopPropagation();
          window.open(project.webapp, '_blank');
        }
      };
    }
    if (project.computedType === 'web' && project.webapp) {
      return {
        label: 'Launch App',
        icon: ExternalLink,
        className: 'launch',
        action: (e) => {
          e.stopPropagation();
          window.open(project.webapp, '_blank');
        }
      };
    }
    return {
      label: 'View Project',
      icon: Code2,
      className: 'code',
      action: (e) => {
        e.stopPropagation();
        onSelect(project);
      }
    };
  };

  const action = getActionConfig();
  const ActionIcon = action.icon;

  const getTypeIcon = () => {
    switch (project.computedType) {
      case 'android': return <Smartphone size={14} color="var(--primary)" />;
      case 'web': return <Globe size={14} color="var(--accent-neon)" />;
      case 'library': return <Package size={14} color="var(--accent-cyan)" />;
      default: return <GraduationCap size={14} color="var(--accent-amber)" />;
    }
  };

  return (
    <div 
      className="clay-app-card"
      onClick={() => onSelect(project)}
    >
      <div>
        <div className="app-card-top">
          <div className="clay-icon-bubble">
            {!imgError ? (
              <img 
                src={project.image} 
                alt={project.title} 
                className="app-icon"
                loading="lazy"
                onError={() => setImgError(true)}
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--primary), var(--accent-blue))', color: 'white', fontWeight: 800, fontSize: '1.4rem' }}>
                {project.title.charAt(0)}
              </div>
            )}
          </div>

          <div className="app-meta">
            <h3 className="app-title" title={project.title}>
              {project.title}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {getTypeIcon()}
              <span className="app-category">{project.category}</span>
            </div>

            <div className="app-stats-row">
              <span className="clay-size-badge">
                {project.isApk ? 'Android APK' : (project.computedType === 'web' ? 'Web App' : 'Library')}
              </span>
              {project.tagsCount > 0 && (
                <>
                  <span style={{ opacity: 0.3 }}>•</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {project.tagsCount} Tech{project.tagsCount === 1 ? '' : 's'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <p className="app-desc-preview">{project.description}</p>

        {project.tags && project.tags.length > 0 && (
          <div className="app-tags-row">
            {project.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="clay-tag-pill">
                {tag.replace('https://', '').split('/')[0]}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="clay-tag-pill" style={{ opacity: 0.7 }}>
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="app-card-footer">
        <span className="app-date">{project.date || 'Active'}</span>
        <button 
          className={`clay-action-btn ${action.className}`}
          onClick={action.action}
        >
          <ActionIcon size={14} />
          <span>{action.label}</span>
        </button>
      </div>
    </div>
  );
}
