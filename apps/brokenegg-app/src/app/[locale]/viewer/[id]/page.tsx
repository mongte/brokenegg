import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { GodotViewer } from '@/widgets/godot-viewer';

/** QR id → 에셋 폴더 매핑 (로컬 테스트: 현재 poim 하나). 추후 R2 URL 매핑으로 교체. */
const ASSET_FOLDERS: Record<string, string> = {
  poim: 'poim',
};

export default async function ViewerPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const folder = ASSET_FOLDERS[id];
  if (!folder) notFound();

  return <GodotViewer base={`/godot/${folder}`} />;
}
