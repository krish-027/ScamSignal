import { useState, useEffect, useCallback } from 'react';

export type AppRoute = 'home' | 'briefing' | 'preview' | 'not-found';

const ROUTE_HASHES: Record<AppRoute, string> = {
  home: '#/',
  briefing: '#/briefing',
  preview: '#/preview',
  'not-found': '#/not-found',
};

export function getRouteFromHash(rawHash: string): AppRoute {
  const normalized = rawHash.replace(/^#\/?/, '').trim().toLowerCase();
  if (normalized === '' || normalized === 'home') return 'home';
  if (normalized === 'briefing') return 'briefing';
  if (normalized === 'preview') return 'preview';
  return 'not-found';
}

function describeRoute(route: AppRoute): string {
  switch (route) {
    case 'home':
      return 'ScamSignal Home: The internet is testing you.';
    case 'briefing':
      return 'Mission 1 Briefing: The Missing Package.';
    case 'preview':
      return 'Mission 1 Simulation Preview.';
    case 'not-found':
      return 'Requested page not found.';
  }
}

export function useNavigation() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() =>
    getRouteFromHash(window.location.hash)
  );
  const [announcement, setAnnouncement] = useState('');

  // Only hashchange drives browser Back/Forward synchronization.
  useEffect(() => {
    const syncRoute = () => {
      setCurrentRoute(getRouteFromHash(window.location.hash));
    };
    window.addEventListener('hashchange', syncRoute);
    return () => window.removeEventListener('hashchange', syncRoute);
  }, []);

  // Runs after React commits the destination view; no timer is needed.
  useEffect(() => {
    setAnnouncement(`Navigated to ${describeRoute(currentRoute)}`);
    window.scrollTo(0, 0);
    document.querySelector<HTMLElement>('h1')?.focus();
  }, [currentRoute]);

  const navigateTo = useCallback((route: AppRoute) => {
    // State update is immediate for button interactions and component tests.
    // The hashchange event later keeps browser-history navigation in sync.
    setCurrentRoute(route);
    const nextHash = ROUTE_HASHES[route];
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
  }, []);

  return { currentRoute, announcement, navigateTo };
}
