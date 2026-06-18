import { siteConfig } from '@/shared/config';

export function SiteFooter() {
  const { footer } = siteConfig;
  return (
    <footer>
      <div>{footer.copyright}</div>
      <div style={{ display: 'flex', gap: '24px' }}>
        {footer.links.map((link) => (
          <span key={link}>{link}</span>
        ))}
      </div>
      <div>{footer.ref}</div>
    </footer>
  );
}
