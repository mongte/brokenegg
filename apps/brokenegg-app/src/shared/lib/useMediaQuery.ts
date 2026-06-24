'use client';

import { useEffect, useState } from 'react';

/**
 * 미디어 쿼리 매칭 여부를 구독한다. SSR 시에는 `false`로 시작하고,
 * 마운트 후 실제 매칭값으로 동기화한다(하이드레이션 안전).
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);

  return matches;
}
