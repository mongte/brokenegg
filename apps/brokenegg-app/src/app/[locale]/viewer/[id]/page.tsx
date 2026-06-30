import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { GodotViewer } from '@/widgets/godot-viewer';

/** QR id → 에셋 폴더/키 매핑 (현재 poim 하나). 새 모델은 여기 한 줄 추가 → 재배포 불필요. */
const ASSET_FOLDERS: Record<string, string> = {
  poim: 'poim',
};

/**
 * 에셋 베이스 결정:
 * - `NEXT_PUBLIC_GODOT_CDN_BASE` 설정 시 → 그 R2 Cloudflare Worker(cross-origin)에서 서빙(프로덕션).
 *   클라이언트가 R2/Worker 에서 직접 받아 egress($0) 유지.
 * - 미설정(로컬 dev) 시 → 같은 오리진 라우트 핸들러 `/godot/<folder>` 사용.
 * 단일 출처: brokenegg-doc/wiki/핵심 기술 - 3D 웹뷰어 배포 아키텍처.md
 */
const CDN_BASE = process.env.NEXT_PUBLIC_GODOT_CDN_BASE?.replace(/\/$/, '');

export default async function ViewerPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const folder = ASSET_FOLDERS[id];
  if (!folder) notFound();

  const base = CDN_BASE ? `${CDN_BASE}/${folder}` : `/godot/${folder}`;
  return <GodotViewer base={base} />;
}
