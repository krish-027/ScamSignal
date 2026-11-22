import { useState, useEffect, useCallback } from 'react';

export type AppRoute = 'home' | 'briefing' | 'preview';

function getRouteFromLocation(): AppRoute {
  const hash = window.location.hash.toLowerCase().replace('#', '').trim();
  if (hash === 'briefing') return 'briefing';
  if (hash === 'preview') return 'preview';

  // Also check pathname for clean url compatibility
  const path = window.location.pathname.toLowerCase();
  if (path.includes('/briefing')) return 'briefing';
  if (path.includes('/preview')) return 'preview';

  return 'home';
}

export function useNavigation() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getRouteFromLocation);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentRoute(getRouteFromLocation());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = useCallback((route: AppRoute) => {
    const hash = route === 'home' ? '' : `#${route}`;
    if (window.location.hash !== hash) {
      window.history.pushState(null, '', hash || window.location.pathname);
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigateTo('home');
    }
  }, [navigateTo]);

  return {
    currentRoute,
    navigateTo,
    goBack,
  };
}
