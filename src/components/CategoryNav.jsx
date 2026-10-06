import React from 'react';
import { 
  Sparkles, 
  Smartphone, 
  Globe, 
  Package, 
  GraduationCap 
} from 'lucide-react';

export function CategoryNav({ activeCategory, setActiveCategory, counts }) {
  const tabs = [
    { id: 'all', label: 'All Items', icon: Sparkles, count: counts.all },
    { id: 'android', label: 'Android APKs', icon: Smartphone, count: counts.android },
    { id: 'web', label: 'Web SaaS', icon: Globe, count: counts.web },
    { id: 'library', label: 'Open Source', icon: Package, count: counts.library },
    { id: 'academic', label: 'Academic', icon: GraduationCap, count: counts.academic }
  ];

  return (
    <nav className="category-nav-bar">
      <div className="category-nav-container">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              className={`clay-cat-tab ${isActive ? 'active' : ''}`}
              onClick={() => setActiveCategory(tab.id)}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
              <span className="clay-pill-count">{tab.count || 0}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
