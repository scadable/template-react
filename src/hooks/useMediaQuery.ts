import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const media = window.matchMedia(query);

    setMatches(media.matches);

    const listener = () => setMatches(media.matches);

    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

export function useBreakpoints() {
  const isMobile = useMediaQuery('(max-width: 599px)');
  const isTablet = useMediaQuery('(min-width: 600px) and (max-width: 1199px)');
  const isDesktop = useMediaQuery('(min-width: 1200px)');

  return {
    isMobile,
    isTablet,
    isDesktop,
    isDesktopOrTablet: isTablet || isDesktop
  };
}