import Image from 'next/image';
import logoSrc from './brokenegg-logo.png';

type LogoVariant = 'dark' | 'light';

interface LogoProps {
  /**
   * The source PNG is white (meant for dark backgrounds).
   * - `dark` (default): inverted to black via CSS so it reads on the light theme.
   * - `light`: rendered as-is (white) for use on dark surfaces.
   */
  variant?: LogoVariant;
  /** Rendered height in px; width scales to keep the 725:144 aspect ratio. */
  height?: number;
  className?: string;
}

const ASPECT_RATIO = 725 / 144;

export function Logo({ variant = 'dark', height = 28, className = '' }: LogoProps) {
  const width = Math.round(height * ASPECT_RATIO);
  return (
    <Image
      src={logoSrc}
      alt="Broken Egg"
      width={width}
      height={height}
      priority
      className={className}
      style={{ filter: variant === 'dark' ? 'brightness(0)' : 'none' }}
    />
  );
}
