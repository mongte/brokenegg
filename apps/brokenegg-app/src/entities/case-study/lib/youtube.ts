/** YouTube embed/watch/단축 URL에서 11자리 영상 ID를 추출. */
export function getYouTubeId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:embed\/|v=|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

/** 영상 ID 기반 썸네일 URL. hqdefault는 모든 영상에 존재해 404가 없다. */
export function getYouTubeThumbnail(url?: string): string | null {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

/**
 * 클릭 재생용 embed src.
 * - autoplay=1 + (mute 미지정) → 소리 ON으로 즉시 재생.
 *   클릭(사용자 제스처) 이후 마운트되므로 브라우저 자동재생 정책에 막히지 않는다.
 */
export function buildAutoplaySrc(embedUrl: string): string {
  const sep = embedUrl.includes('?') ? '&' : '?';
  return `${embedUrl}${sep}autoplay=1&rel=0&playsinline=1`;
}
