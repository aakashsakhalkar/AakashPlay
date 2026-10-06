import React, { useState, useEffect } from 'react';
import { 
  Download, 
  ExternalLink, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';

export function HeroCarousel({ featuredProjects, onSelectApp }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!featuredProjects || featuredProjects.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProjects.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredProjects]);

  if (!featuredProjects || featuredProjects.length === 0) return null;

  const current = featuredProjects[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProjects.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length);
  };

  return (
    <section className="hero-section">
      <div className="hero-clay-card">
        <div className="hero-content">
          <div className="hero-tag-clay">
            <Sparkles size={16} />
            <span>Featured Spotlight</span>
            <span style={{ opacity: 0.6 }}>•</span>
            <span>{current.category || 'App'}</span>
          </div>

          <h1 className="hero-title">{current.title}</h1>
          
          <p className="hero-desc">{current.description}</p>

          <div className="hero-actions">
            <button 
              className="clay-btn-primary"
              onClick={() => onSelectApp(current)}
            >
              {current.isApk ? <Download size={20} /> : <ExternalLink size={20} />}
              <span>{current.isApk ? 'Install APK' : (current.computedType === 'web' ? 'Launch Web App' : 'Explore Library')}</span>
            </button>

            <button 
              className="clay-btn-secondary"
              onClick={() => onSelectApp(current)}
            >
              <span>View Details</span>
              <ChevronRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a7f3d0', fontSize: '0.9rem', fontWeight: 700, marginLeft: '0.5rem' }}>
              <ShieldCheck size={18} />
              <span>Verified Production Build</span>
            </div>
          </div>
        </div>

        {/* Carousel Indicators & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 3, marginTop: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {featuredProjects.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  width: idx === currentIndex ? '32px' : '10px',
                  height: '10px',
                  borderRadius: '9999px',
                  background: idx === currentIndex ? '#10b981' : 'rgba(255, 255, 255, 0.35)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  boxShadow: idx === currentIndex ? '0 0 10px rgba(16, 185, 129, 0.8)' : 'none'
                }}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button
              onClick={handlePrev}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.16)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.4)',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.16)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.4)',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
