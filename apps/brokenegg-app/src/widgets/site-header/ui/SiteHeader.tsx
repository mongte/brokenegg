import { Badge } from '@/shared/ui/badge';
import { Logo } from '@/shared/ui/logo';
import { siteConfig } from '@/shared/config';
import { DemoRequestButton } from '@/features/demo-request';

export function SiteHeader() {
  return (
    <header>
      <div className="nav-left">
        {siteConfig.nav.map((item) => (
          <Badge key={item.label} active={item.active}>
            {item.label}
          </Badge>
        ))}
      </div>
      <div className="logo">
        <Logo />
      </div>
      <div className="nav-right">
        <DemoRequestButton variant="badge" label="DEMO REQUEST" />
        <div className="menu-toggle" />
      </div>
    </header>
  );
}
