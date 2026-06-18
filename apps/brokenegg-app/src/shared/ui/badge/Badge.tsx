import type { CSSProperties, ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  active?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Badge({ children, active = false, className = '', style }: BadgeProps) {
  const classes = ['badge', active ? 'active' : '', className].filter(Boolean).join(' ');
  return (
    <span className={classes} style={style}>
      {children}
    </span>
  );
}
