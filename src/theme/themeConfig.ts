import { ThemeSettings } from '../types.ts';

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  settings: ThemeSettings;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'corporate-indigo',
    name: 'Corporate Indigo',
    description: 'Crisp enterprise navy, cool slate canvas, and clean typographic accents',
    settings: {
      mode: 'light',
      presetId: 'corporate-indigo',
      primaryColor: '#1e40af',
      primaryHover: '#1d4ed8',
      accentColor: '#0d9488',
      bgColor: '#f8fafc',
      surfaceColor: '#ffffff',
      surfaceSubtle: '#f1f5f9',
      borderColor: '#e2e8f0',
      textColor: '#0f172a',
      textMutedColor: '#64748b',
      radius: 10
    }
  },
  {
    id: 'nordic-emerald',
    name: 'Nordic Emerald',
    description: 'Clean Scandinavian forest green, organic sage tones, and soft borders',
    settings: {
      mode: 'light',
      presetId: 'nordic-emerald',
      primaryColor: '#047857',
      primaryHover: '#065f46',
      accentColor: '#0284c7',
      bgColor: '#f7faf8',
      surfaceColor: '#ffffff',
      surfaceSubtle: '#ecfdf5',
      borderColor: '#d1fae5',
      textColor: '#064e3b',
      textMutedColor: '#059669',
      radius: 12
    }
  },
  {
    id: 'midnight-titanium',
    name: 'Midnight Titanium',
    description: 'High-contrast dark mode with matte gunmetal surfaces and cobalt highlights',
    settings: {
      mode: 'dark',
      presetId: 'midnight-titanium',
      primaryColor: '#3b82f6',
      primaryHover: '#60a5fa',
      accentColor: '#10b981',
      bgColor: '#090d16',
      surfaceColor: '#111827',
      surfaceSubtle: '#1f2937',
      borderColor: '#374151',
      textColor: '#f9fafb',
      textMutedColor: '#9ca3af',
      radius: 10
    }
  },
  {
    id: 'royal-sapphire',
    name: 'Royal Sapphire',
    description: 'High-intent vibrant cobalt blue with crisp white card elevation',
    settings: {
      mode: 'light',
      presetId: 'royal-sapphire',
      primaryColor: '#2563eb',
      primaryHover: '#1d4ed8',
      accentColor: '#7c3aed',
      bgColor: '#f8faff',
      surfaceColor: '#ffffff',
      surfaceSubtle: '#eff6ff',
      borderColor: '#dbeafe',
      textColor: '#1e293b',
      textMutedColor: '#64748b',
      radius: 8
    }
  },
  {
    id: 'obsidian-violet',
    name: 'Obsidian Amethyst',
    description: 'Deep violet dark aesthetic, cyber glow telemetry, and luxury executive finish',
    settings: {
      mode: 'dark',
      presetId: 'obsidian-violet',
      primaryColor: '#8b5cf6',
      primaryHover: '#a78bfa',
      accentColor: '#ec4899',
      bgColor: '#0d0b18',
      surfaceColor: '#161228',
      surfaceSubtle: '#231d3d',
      borderColor: '#362d5d',
      textColor: '#f5f3ff',
      textMutedColor: '#a78bfa',
      radius: 12
    }
  },
  {
    id: 'crimson-apex',
    name: 'Crimson Apex',
    description: 'Commanding ruby red and deep charcoal for high-tempo industrial operations',
    settings: {
      mode: 'light',
      presetId: 'crimson-apex',
      primaryColor: '#be123c',
      primaryHover: '#9f1239',
      accentColor: '#b45309',
      bgColor: '#fffbfa',
      surfaceColor: '#ffffff',
      surfaceSubtle: '#fff1f2',
      borderColor: '#ffe4e6',
      textColor: '#1c1917',
      textMutedColor: '#78716c',
      radius: 6
    }
  }
];

export const DEFAULT_THEME: ThemeSettings = THEME_PRESETS[0].settings;

export const applyThemeToDom = (settings: ThemeSettings) => {
  const root = document.documentElement;

  root.style.setProperty('--app-primary', settings.primaryColor);
  root.style.setProperty('--app-primary-hover', settings.primaryHover);
  root.style.setProperty('--app-primary-light', `${settings.primaryColor}18`);
  root.style.setProperty('--app-accent', settings.accentColor);
  root.style.setProperty('--app-bg', settings.bgColor);
  root.style.setProperty('--app-surface', settings.surfaceColor);
  root.style.setProperty('--app-surface-subtle', settings.surfaceSubtle);
  root.style.setProperty('--app-border', settings.borderColor);
  root.style.setProperty('--app-text', settings.textColor);
  root.style.setProperty('--app-text-muted', settings.textMutedColor);
  root.style.setProperty('--app-radius', `${settings.radius}px`);

  if (settings.mode === 'dark') {
    root.setAttribute('data-mode', 'dark');
    root.classList.add('dark');
  } else {
    root.setAttribute('data-mode', 'light');
    root.classList.remove('dark');
  }
};
