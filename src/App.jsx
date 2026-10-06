import React, { useState, useEffect, useMemo } from 'react';
import { useProjects } from './hooks/useProjects';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { HeroCarousel } from './components/HeroCarousel';
import { TopChartsSection } from './components/TopChartsSection';
import { AppCard } from './components/AppCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { LiveWebPreviewModal } from './components/LiveWebPreviewModal';
import { Footer } from './components/Footer';
import { 
  Sparkles, 
  Smartphone, 
  Globe, 
  Package, 
  Search, 
  RefreshCw,
  AlertCircle,
  Filter
} from 'lucide-react';

export default function App() {
  const { projects, loading, isRefreshing, lastUpdated, error, refresh } = useProjects();
  
  // Default to Light Theme
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('aakashplay_theme') || 'light';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [previewApp, setPreviewApp] = useState(null);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aakashplay_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Extract counts
  const counts = useMemo(() => {
    const res = { all: projects.length, android: 0, web: 0, library: 0, academic: 0 };
    projects.forEach(p => {
      if (p.computedType === 'android') res.android++;
      else if (p.computedType === 'web') res.web++;
      else if (p.computedType === 'library') res.library++;
      else if (p.computedType === 'academic') res.academic++;
    });
    return res;
  }, [projects]);

  // Extract unique popular tags
  const popularTags = useMemo(() => {
    const tagMap = {};
    projects.forEach(p => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach(t => {
          if (!t.startsWith('http')) {
            tagMap[t] = (tagMap[t] || 0) + 1;
          }
        });
      }
    });
    return Object.entries(tagMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 14)
      .map(([tag]) => tag);
  }, [projects]);

  // Featured apps for Hero carousel (Flagships)
  const featuredProjects = useMemo(() => {
    // Pick standout apps (StorX, Dayflow, JSON Lens, SavePulse, BatteryUtils, etc.)
    const flags = ['StorX', 'Dayflow', 'JSON Lens', 'SavePulse', 'BatteryUtils', 'CleanCraft', 'MovieGather', 'ResumeCraft'];
    const matches = projects.filter(p => flags.some(f => p.title.toLowerCase().includes(f.toLowerCase())));
    return matches.length > 0 ? matches.slice(0, 5) : projects.slice(0, 4);
  }, [projects]);

  // Filtered project list
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      // Category filter
      if (activeCategory !== 'all' && p.computedType !== activeCategory) {
        return false;
      }

      // Tag filter
      if (selectedTag && !p.tags?.some(t => t.toLowerCase() === selectedTag.toLowerCase())) {
        return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = p.title?.toLowerCase().includes(q);
        const inDesc = p.description?.toLowerCase().includes(q);
        const inTags = p.tags?.some(t => t.toLowerCase().includes(q));
        const inCat = p.category?.toLowerCase().includes(q);
        if (!inTitle && !inDesc && !inTags && !inCat) return false;
      }

      return true;
    });
  }, [projects, activeCategory, selectedTag, searchQuery]);

  return (
    <div className="app-container">
      {/* Header with Search, Live Status and Theme toggle */}
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        theme={theme}
        toggleTheme={toggleTheme}
        isRefreshing={isRefreshing}
        onRefresh={refresh}
        lastUpdated={lastUpdated}
        totalCount={projects.length}
      />

      {/* Play Store Category Navigation */}
      <CategoryNav 
        activeCategory={activeCategory}
        setActiveCategory={(cat) => {
          setActiveCategory(cat);
          setSelectedTag('');
        }}
        counts={counts}
      />

      {/* Main Content Area */}
      <main className="main-layout">
        {/* Error notification if DB fetch failed & no cache */}
        {error && projects.length === 0 && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f87171' }}>
              <AlertCircle size={20} />
              <span>Failed to sync with Firebase Realtime Database. Check network or database access.</span>
            </div>
            <button className="btn-primary" onClick={refresh} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {/* Hero Carousel (Only on 'all' view when not searching) */}
        {!searchQuery && activeCategory === 'all' && (
          <HeroCarousel 
            featuredProjects={featuredProjects}
            onSelectApp={(app) => setSelectedApp(app)}
          />
        )}

        {/* Top Charts Section (Only when browsing 'all' and not searching) */}
        {!searchQuery && activeCategory === 'all' && (
          <TopChartsSection 
            projects={projects}
            onSelectApp={(app) => setSelectedApp(app)}
          />
        )}

        {/* Tags Quick Filter Cloud */}
        {popularTags.length > 0 && (
          <div className="tags-filter-bar">
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginRight: 4 }}>
              <Filter size={13} /> Filter:
            </span>
            <button
              className={`clay-filter-chip ${!selectedTag ? 'active' : ''}`}
              onClick={() => setSelectedTag('')}
            >
              All Tags
            </button>
            {popularTags.map((tag) => (
              <button
                key={tag}
                className={`clay-filter-chip ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Catalog Section Header */}
        <div className="section-header">
          <div>
            <h2 className="section-title">
              {activeCategory === 'all' ? '✨ All Applications & Software' : 
               activeCategory === 'android' ? '📱 Native Android Applications' : 
               activeCategory === 'web' ? '🌐 Web SaaS & Cloud Tools' : 
               activeCategory === 'library' ? '📦 Open-Source Libraries & Packages' : 
               '🎓 Academic Research Projects'}
            </h2>
            <p className="section-subtitle">
              {filteredProjects.length} item{filteredProjects.length === 1 ? '' : 's'} available • Click any card for details, APK download, or live launch
            </p>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && projects.length === 0 && (
          <div className="app-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-shimmer"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty Search / Filter State */}
        {!loading && filteredProjects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: 'var(--bg-surface)', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-lg)', margin: '2rem 0' }}>
            <Search size={42} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              No matching applications found
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              We couldn't find any projects matching "{searchQuery}" with the selected filters.
            </p>
            <button 
              className="btn-primary"
              onClick={() => {
                setSearchQuery('');
                setSelectedTag('');
                setActiveCategory('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* App Cards Grid */}
        <div className="app-grid">
          {filteredProjects.map((project) => (
            <AppCard 
              key={project.id || project.firebaseKey}
              project={project}
              onSelect={(app) => setSelectedApp(app)}
              onLaunchWebPreview={(app) => setPreviewApp(app)}
            />
          ))}
        </div>
      </main>

      {/* Product Detail Modal Dialog */}
      {selectedApp && (
        <ProductDetailModal 
          project={selectedApp}
          onClose={() => setSelectedApp(null)}
          onLaunchPreview={(app) => setPreviewApp(app)}
        />
      )}

      {/* Live Web Sandbox Preview Modal */}
      {previewApp && (
        <LiveWebPreviewModal 
          project={previewApp}
          onClose={() => setPreviewApp(null)}
        />
      )}

      {/* Footer */}
      <Footer 
        totalCount={projects.length}
        lastUpdated={lastUpdated}
      />
    </div>
  );
}
