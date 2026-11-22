import { useState, useEffect, useCallback } from 'react';

export type AppRoute = 'home' | 'briefing' | 'preview' | 'investigate' | 'not-found';

const ROUTE_HASHES: Record<AppRoute, string> = {
  home: '#/',
  briefing: '#/briefing',
  preview: '#/preview',
  investigate: '#/investigate',
  'not-found': '#/not-found',
};

export function getRouteFromHash(rawHash: string): AppRoute {
  const normalized = rawHash.replace(/^#\/?/, '').trim().toLowerCase();
  if (normalized === '' || normalized === 'home') return 'home';
  if (normalized === 'briefing') return 'briefing';
  if (normalized === 'preview') return 'preview';
  if (normalized === 'investigate') return 'investigate';
  return 'not-found';
}

function describeRoute(route: AppRoute): string {
  switch (route) {
    case 'home': return 'ScamSignal Home: The internet is testing you.';
    case 'briefing': return 'Mission 1 Briefing: The Missing Package.';
    case 'preview': return 'Mission 1 Simulation Preview.';
    case 'investigate': return 'Mission 1: Interactive Investigation.';
    case 'not-found': return 'Requested page not found.';
  }
}

export function useNavigation() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() =>
    getRouteFromHash(window.location.hash)
  );
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const syncRoute = () => setCurrentRoute(getRouteFromHash(window.location.hash));
    window.addEventListener('hashchange', syncRoute);
    return () => window.removeEventListener('hashchange', syncRoute);
  }, []);

  useEffect(() => {
    setAnnouncement(`Navigated to ${describeRoute(currentRoute)}`);
    window.scrollTo(0, 0);
    document.querySelector<HTMLElement>('h1')?.focus();
  }, [currentRoute]);

  const navigateTo = useCallback((route: AppRoute) => {
    setCurrentRoute(route);
    const nextHash = ROUTE_HASHES[route];
    if (window.location.hash !== nextHash) window.location.hash = nextHash;
  }, []);

  return { currentRoute, announcement, navigateTo };
}
