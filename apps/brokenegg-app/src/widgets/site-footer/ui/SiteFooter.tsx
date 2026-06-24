import { useTranslations } from 'next-intl';

export function SiteFooter() {
  const t = useTranslations('footer');
  const links = [t('privacy'), t('terms'), t('contact')];
  return (
    <footer>
      <div>{t('copyright')}</div>
      <div style={{ display: 'flex', gap: '24px' }}>
        {links.map((link) => (
          <span key={link}>{link}</span>
        ))}
      </div>
      <div>{t('ref')}</div>
    </footer>
  );
}
