import { useWindowDimensions } from 'react-native';

// Color, spacing and typography tokens derived from Figma design system
export const colors = {
  primary: '#030213', // dark navy (was #6B0F1A)
  accent: '#DAA520', // gold
  background: '#FFFFFF',
  surface: '#FFFFFF',
  text: '#1F2937',
  muted: '#666666',
  border: '#DDDDDD',
  success: '#059669',
  danger: '#DC2626',
  primaryDark: '#1a0008', // For hover/focus states
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  hero: 60,
};

export const type = {
  h1: 48,
  h2: 36,
  h3: 32,
  section: 32,
  subtitle: 18,
  body: 16,
  small: 14,
};

export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  round: 999,
};

export const breakpoints = {
  web: 768,
};

// Hook: returns boolean flags useful for responsive layouts
export function useResponsive() {
  const { width } = useWindowDimensions();
  return {
    isWide: width >= breakpoints.web,
    width,
  };
}

// Helper: convert a gap value to child margins (avoids using 'gap')
export function gapToMargins(gap) {
  const half = gap / 2;
  return {
    marginHorizontal: -half,
  };
}

export default {
  colors,
  spacing,
  type,
  radius,
  breakpoints,
  useResponsive,
  gapToMargins,
};
