import { TenantBranding } from '@/types/tenant';

export interface BrandingTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    input: string;
    ring: string;
  };
  typography: {
    fontFamily: string;
    headingFontFamily?: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Convert tenant branding to a complete theme
export function createBrandingTheme(
  branding: TenantBranding | null,
): BrandingTheme {
  const defaultTheme: BrandingTheme = {
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#0f172a',
      background: '#ffffff',
      foreground: '#0f172a',
      muted: '#f1f5f9',
      mutedForeground: '#64748b',
      border: '#e2e8f0',
      input: '#f1f5f9',
      ring: '#2563eb',
    },
    typography: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    },
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
    },
  };

  if (!branding) {
    return defaultTheme;
  }

  // Override with tenant branding
  return {
    ...defaultTheme,
    colors: {
      ...defaultTheme.colors,
      primary: branding.primaryColor || defaultTheme.colors.primary,
      secondary: branding.secondaryColor || defaultTheme.colors.secondary,
      accent:
        branding.accentColor ||
        branding.primaryColor ||
        defaultTheme.colors.accent,
    },
    typography: {
      ...defaultTheme.typography,
      fontFamily: branding.fontFamily || defaultTheme.typography.fontFamily,
      headingFontFamily:
        branding.fontFamily || defaultTheme.typography.fontFamily,
    },
  };
}

// Generate CSS variables from branding theme
export function generateCSSVariables(
  theme: BrandingTheme,
): Record<string, string> {
  return {
    '--brand-primary': theme.colors.primary,
    '--brand-secondary': theme.colors.secondary,
    '--brand-accent': theme.colors.accent,
    '--brand-background': theme.colors.background,
    '--brand-foreground': theme.colors.foreground,
    '--brand-muted': theme.colors.muted,
    '--brand-muted-foreground': theme.colors.mutedForeground,
    '--brand-border': theme.colors.border,
    '--brand-input': theme.colors.input,
    '--brand-ring': theme.colors.ring,
    '--brand-font-family': theme.typography.fontFamily,
    '--brand-font-size-xs': theme.typography.fontSize.xs,
    '--brand-font-size-sm': theme.typography.fontSize.sm,
    '--brand-font-size-base': theme.typography.fontSize.base,
    '--brand-font-size-lg': theme.typography.fontSize.lg,
    '--brand-font-size-xl': theme.typography.fontSize.xl,
    '--brand-font-size-2xl': theme.typography.fontSize['2xl'],
    '--brand-font-size-3xl': theme.typography.fontSize['3xl'],
    '--brand-font-size-4xl': theme.typography.fontSize['4xl'],
    '--brand-font-weight-normal': theme.typography.fontWeight.normal.toString(),
    '--brand-font-weight-medium': theme.typography.fontWeight.medium.toString(),
    '--brand-font-weight-semibold':
      theme.typography.fontWeight.semibold.toString(),
    '--brand-font-weight-bold': theme.typography.fontWeight.bold.toString(),
    '--brand-spacing-xs': theme.spacing.xs,
    '--brand-spacing-sm': theme.spacing.sm,
    '--brand-spacing-md': theme.spacing.md,
    '--brand-spacing-lg': theme.spacing.lg,
    '--brand-spacing-xl': theme.spacing.xl,
    '--brand-border-radius-sm': theme.borderRadius.sm,
    '--brand-border-radius-md': theme.borderRadius.md,
    '--brand-border-radius-lg': theme.borderRadius.lg,
    '--brand-border-radius-xl': theme.borderRadius.xl,
  };
}

// Generate Tailwind CSS overrides
export function generateTailwindOverrides(theme: BrandingTheme): string {
  return `
    .btn-primary {
      background-color: ${theme.colors.primary};
      border-color: ${theme.colors.primary};
      color: white;
    }
    
    .btn-primary:hover {
      background-color: ${adjustColorBrightness(theme.colors.primary, -20)};
      border-color: ${adjustColorBrightness(theme.colors.primary, -20)};
    }
    
    .btn-secondary {
      background-color: ${theme.colors.secondary};
      border-color: ${theme.colors.secondary};
      color: white;
    }
    
    .btn-outline {
      color: ${theme.colors.primary};
      border-color: ${theme.colors.primary};
      background-color: transparent;
    }
    
    .btn-outline:hover {
      background-color: ${theme.colors.primary};
      color: white;
    }
    
    .text-primary {
      color: ${theme.colors.primary};
    }
    
    .text-secondary {
      color: ${theme.colors.secondary};
    }
    
    .bg-primary {
      background-color: ${theme.colors.primary};
    }
    
    .bg-secondary {
      background-color: ${theme.colors.secondary};
    }
    
    .border-primary {
      border-color: ${theme.colors.primary};
    }
    
    .brand-font {
      font-family: ${theme.typography.fontFamily};
    }
    
    .brand-heading {
      font-family: ${theme.typography.headingFontFamily || theme.typography.fontFamily};
      font-weight: ${theme.typography.fontWeight.bold};
    }
  `;
}

// Utility functions
export function adjustColorBrightness(color: string, percent: number): string {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Adjust brightness
  const adjustedR = Math.max(0, Math.min(255, r + (r * percent) / 100));
  const adjustedG = Math.max(0, Math.min(255, g + (g * percent) / 100));
  const adjustedB = Math.max(0, Math.min(255, b + (b * percent) / 100));

  // Convert back to hex
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  return `#${toHex(adjustedR)}${toHex(adjustedG)}${toHex(adjustedB)}`;
}

export function getContrastColor(backgroundColor: string): string {
  // Calculate luminance
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export function validateBrandingColors(branding: Partial<TenantBranding>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate hex color format
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  if (branding.primaryColor && !hexRegex.test(branding.primaryColor)) {
    errors.push('Primary color must be a valid hex color (e.g., #2563eb)');
  }

  if (branding.secondaryColor && !hexRegex.test(branding.secondaryColor)) {
    errors.push('Secondary color must be a valid hex color (e.g., #64748b)');
  }

  if (branding.accentColor && !hexRegex.test(branding.accentColor)) {
    errors.push('Accent color must be a valid hex color (e.g., #0f172a)');
  }

  // Validate font family
  if (branding.fontFamily) {
    const validFonts = [
      'system-ui',
      'Inter',
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
      'serif',
      'monospace',
    ];

    const fontParts = branding.fontFamily
      .split(',')
      .map((f) => f.trim().replace(/['"]/g, ''));
    const hasValidFont = fontParts.some(
      (font) => validFonts.includes(font) || font.includes('font-'),
    );

    if (!hasValidFont) {
      errors.push('Font family should include a web-safe fallback font');
    }
  }

  // Validate URLs
  const urlRegex = /^https?:\/\/.+/;

  if (branding.logoUrl && !urlRegex.test(branding.logoUrl)) {
    errors.push('Logo URL must be a valid HTTP/HTTPS URL');
  }

  if (branding.faviconUrl && !urlRegex.test(branding.faviconUrl)) {
    errors.push('Favicon URL must be a valid HTTP/HTTPS URL');
  }

  return { valid: errors.length === 0, errors };
}

// Predefined color schemes for quick setup
export const PREDEFINED_COLOR_SCHEMES = {
  blue: {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#1e40af',
  },
  green: {
    primary: '#059669',
    secondary: '#6b7280',
    accent: '#047857',
  },
  purple: {
    primary: '#7c3aed',
    secondary: '#6b7280',
    accent: '#5b21b6',
  },
  red: {
    primary: '#dc2626',
    secondary: '#6b7280',
    accent: '#b91c1c',
  },
  orange: {
    primary: '#ea580c',
    secondary: '#6b7280',
    accent: '#c2410c',
  },
  teal: {
    primary: '#0d9488',
    secondary: '#6b7280',
    accent: '#0f766e',
  },
  indigo: {
    primary: '#4f46e5',
    secondary: '#6b7280',
    accent: '#3730a3',
  },
  pink: {
    primary: '#db2777',
    secondary: '#6b7280',
    accent: '#be185d',
  },
  gray: {
    primary: '#374151',
    secondary: '#6b7280',
    accent: '#111827',
  },
  slate: {
    primary: '#475569',
    secondary: '#64748b',
    accent: '#1e293b',
  },
} as const;

export type ColorScheme = keyof typeof PREDEFINED_COLOR_SCHEMES;
