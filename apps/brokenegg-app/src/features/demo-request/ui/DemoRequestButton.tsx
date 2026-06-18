import type { CSSProperties } from 'react';
import { Button } from '@/shared/ui/button';
import { siteConfig } from '@/shared/config';

type DemoRequestVariant = 'primary' | 'secondary' | 'badge';

interface DemoRequestButtonProps {
  variant?: DemoRequestVariant;
  label?: string;
  style?: CSSProperties;
}

/**
 * The "데모 요청" call-to-action. Reused in the header, hero, and final CTA,
 * always pointing at the same demo anchor.
 */
export function DemoRequestButton({
  variant = 'primary',
  label = '데모 요청하기',
  style,
}: DemoRequestButtonProps) {
  if (variant === 'badge') {
    return (
      <a href={siteConfig.demoAnchor} className="badge">
        {label}
      </a>
    );
  }

  return (
    <Button href={siteConfig.demoAnchor} variant={variant} style={style}>
      {label}
    </Button>
  );
}
