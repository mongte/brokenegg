import type { CSSProperties, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  style?: CSSProperties;
}

/**
 * Link-styled button. The design system renders CTAs as anchors,
 * so this is an <a> under the hood.
 */
export function Button({
  href,
  children,
  variant = 'primary',
  className = '',
  style,
}: ButtonProps) {
  const classes = ['btn', `btn-${variant}`, className].filter(Boolean).join(' ');
  return (
    <a href={href} className={classes} style={style}>
      {children}
    </a>
  );
}
