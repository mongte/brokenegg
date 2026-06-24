import { setRequestLocale } from 'next-intl/server';
import { HomePage } from '@/views/home';

export default async function Index({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomePage />;
}
