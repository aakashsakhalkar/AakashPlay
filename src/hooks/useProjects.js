import { useState, useEffect, useCallback, useRef } from 'react';

const FIREBASE_DB_URL = import.meta.env.VITE_FIREBASE_DB_URL || 'https://personalsharingapp.firebaseio.com/CareerHighlights/projects.json';
const POLL_INTERVAL = Number(import.meta.env.VITE_POLL_INTERVAL_MS) || 20000;
const CACHE_KEY = 'aakashplay_projects_cache';

const MONTHS_MAP = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11
};

// Comprehensive parser handling:
// - "7th Oct 2026", "22th Dec 2025", "1st Jun 2025", "03rd Oct 2024"
// - "Jun 2024", "Oct 2019", "Feb 2024", "September 2023"
// - "2020", "2021", "2022"
// - "2025-10-23", "2024-06-15"
function parseProjectDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return 0;
  
  const str = dateStr.trim().toLowerCase();

  // 1. Day + Month + Year (e.g. "7th Oct 2026", "03rd Oct 2024", "1st Jun 2025")
  const dayMonthYearMatch = str.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)\s+(\d{4})/i);
  if (dayMonthYearMatch) {
    const day = parseInt(dayMonthYearMatch[1], 10);
    const monthName = dayMonthYearMatch[2].toLowerCase();
    const year = parseInt(dayMonthYearMatch[3], 10);
    const month = MONTHS_MAP[monthName] ?? MONTHS_MAP[monthName.slice(0, 3)] ?? 0;
    return new Date(year, month, day).getTime();
  }

  // 2. Month + Year only (e.g. "Jun 2024", "Oct 2019", "September 2023")
  const monthYearMatch = str.match(/^([a-z]+)\s+(\d{4})$/i);
  if (monthYearMatch) {
    const monthName = monthYearMatch[1].toLowerCase();
    const year = parseInt(monthYearMatch[2], 10);
    const month = MONTHS_MAP[monthName] ?? MONTHS_MAP[monthName.slice(0, 3)] ?? 0;
    return new Date(year, month, 1).getTime();
  }

  // 3. Year only (e.g. "2020", "2021", "2022", "2023")
  const yearOnlyMatch = str.match(/^(\d{4})$/);
  if (yearOnlyMatch) {
    return new Date(parseInt(yearOnlyMatch[1], 10), 0, 1).getTime();
  }

  // 4. Standard ISO or native fallback
  const cleaned = str.replace(/(\d+)(st|nd|rd|th)/gi, '$1').trim();
  const nativeParsed = Date.parse(cleaned);
  if (!isNaN(nativeParsed)) return nativeParsed;

  return 0;
}

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  // Normalize and accurately sort projects
  const processRawData = (rawData) => {
    if (!rawData) return [];
    
    const rawList = Array.isArray(rawData) 
      ? rawData 
      : Object.entries(rawData).map(([key, val]) => ({
          firebaseKey: key,
          ...val,
          id: val.id || key
        }));

    return rawList
      .filter(item => item && (item.title || item.name))
      .map(item => {
        const isApk = item.webapp && item.webapp.toLowerCase().endsWith('.apk');
        const isGithub = item.webapp && (item.webapp.includes('github.com') || item.github?.includes('github.com'));
        const categoryLower = (item.category || '').toLowerCase();

        let computedType = 'web';
        if (isApk || categoryLower.includes('android')) {
          computedType = 'android';
        } else if (categoryLower.includes('open source') || (!isApk && isGithub && !item.webapp.includes('.app') && !item.webapp.includes('.netlify.app'))) {
          computedType = 'library';
        } else if (categoryLower.includes('academic')) {
          computedType = 'academic';
        }

        const parsedTimestamp = parseProjectDate(item.date);
        const tags = Array.isArray(item.tags) ? item.tags : (item.tags ? [item.tags] : []);

        return {
          ...item,
          title: item.title || item.name || 'Untitled Project',
          category: item.category || 'General',
          computedType,
          isApk,
          parsedTimestamp,
          tags,
          tagsCount: tags.length,
          image: item.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
          accessType: isApk ? 'Free APK Download' : (computedType === 'web' ? 'Free Web Access' : 'Open Source')
        };
      })
      // Absolute Chronological Sorting: Newest Release first
      .sort((a, b) => {
        if (b.parsedTimestamp !== a.parsedTimestamp) {
          return b.parsedTimestamp - a.parsedTimestamp;
        }
        // Secondary fallback by database key index
        const aKey = parseInt(String(a.firebaseKey || a.id).split('_')[0], 10) || 0;
        const bKey = parseInt(String(b.firebaseKey || b.id).split('_')[0], 10) || 0;
        return bKey - aKey;
      });
  };

  const fetchProjects = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const timestampUrl = `${FIREBASE_DB_URL}${FIREBASE_DB_URL.includes('?') ? '&' : '?'}_t=${Date.now()}`;
      const res = await fetch(timestampUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch from Firebase`);
      
      const data = await res.json();
      const formatted = processRawData(data);
      
      if (isMounted.current) {
        setProjects(formatted);
        setLastUpdated(new Date());
        setError(null);
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          timestamp: Date.now(),
          data: formatted
        }));
      }
    } catch (err) {
      console.warn('Realtime fetch error, falling back to cache if available:', err);
      if (isMounted.current) {
        setError(err.message);
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached && projects.length === 0) {
          try {
            const parsed = JSON.parse(cached);
            setProjects(parsed.data || []);
            setLastUpdated(new Date(parsed.timestamp));
          } catch (e) {
            console.error('Failed to parse cache', e);
          }
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [projects.length]);

  useEffect(() => {
    isMounted.current = true;

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.data && parsed.data.length > 0) {
          setProjects(parsed.data);
          setLastUpdated(new Date(parsed.timestamp));
          setLoading(false);
        }
      } catch (e) {
        // ignore
      }
    }

    fetchProjects();

    const interval = setInterval(() => {
      fetchProjects(false);
    }, POLL_INTERVAL);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [fetchProjects]);

  return {
    projects,
    loading,
    isRefreshing,
    lastUpdated,
    error,
    refresh: () => fetchProjects(true)
  };
}
