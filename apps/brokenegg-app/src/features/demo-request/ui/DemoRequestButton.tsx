'use client';

import type { CSSProperties } from 'react';
import { openDemoModal } from '../lib/events';

type DemoRequestVariant = 'primary' | 'secondary' | 'badge';

interface DemoRequestButtonProps {
  variant?: DemoRequestVariant;
  label?: string;
  style?: CSSProperties;
}

/**
 * The "데모 요청" call-to-action. Reused in the header, hero, and final CTA.
 * Clicking opens the shared demo-request modal (via openDemoModal()).
 */
export function DemoRequestButton({
  variant = 'primary',
  label = '데모 요청하기',
  style,
}: DemoRequestButtonProps) {
  const className = variant === 'badge' ? 'badge' : `btn btn-${variant}`;

  return (
    <button type="button" className={className} style={style} onClick={openDemoModal}>
      {label}
    </button>
  );
}
