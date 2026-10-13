import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { THEME_PRESETS, DEFAULT_THEME } from '../theme/themeConfig.ts';
import { ThemeSettings } from '../types.ts';
import {
  X,
  Palette,
  Check,
  RotateCcw,
  Sliders,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';

export const ThemeCustomizerModal: React.FC = () => {
  const { themeSettings, setThemeSettings, applyPresetTheme, themeModalOpen, setThemeModalOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  if (!themeModalOpen) return null;

  const handleCustomChange = <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
    setThemeSettings({
      ...themeSettings,
      presetId: 'custom',
      [key]: value
    });
  };

  const handleModeToggle = (mode: 'light' | 'dark') => {
    if (mode === 'dark') {
      const darkPreset = THEME_PRESETS.find((p) => p.settings.mode === 'dark') || THEME_PRESETS[2];
      setThemeSettings(darkPreset.settings);
    } else {
      const lightPreset = THEME_PRESETS.find((p) => p.settings.mode === 'light') || THEME_PRESETS[0];
      setThemeSettings(lightPreset.settings);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl theme-surface border theme-border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: themeSettings.primaryColor }}
            >
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight theme-text">Application Color & Theme Studio</h3>
              <p className="text-[11px] theme-text-muted">Global CSS design tokens, custom colors, and dark mode</p>
            </div>
          </div>
          <button
            onClick={() => setThemeModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b theme-border px-6 pt-3 gap-6">
          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'presets'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent theme-text-muted hover:theme-text'
            }`}
            style={activeTab === 'presets' ? { borderColor: themeSettings.primaryColor, color: themeSettings.primaryColor } : {}}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Design Presets</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'custom'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent theme-text-muted hover:theme-text'
            }`}
            style={activeTab === 'custom' ? { borderColor: themeSettings.primaryColor, color: themeSettings.primaryColor } : {}}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Custom Color Palette Builder</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Mode Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl theme-surface-subtle border theme-border">
            <span className="text-xs font-medium theme-text">Color Mode</span>
            <div className="flex items-center gap-1 p-0.5 rounded-lg border theme-border theme-surface">
              <button
                onClick={() => handleModeToggle('light')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  themeSettings.mode === 'light'
                    ? 'theme-surface theme-text shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                onClick={() => handleModeToggle('dark')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  themeSettings.mode === 'dark'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {activeTab === 'presets' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THEME_PRESETS.map((preset) => {
                const isSelected = themeSettings.presetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => applyPresetTheme(preset.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all text-xs relative ${
                      isSelected
                        ? 'border-2 shadow-sm'
                        : 'theme-border theme-surface-subtle hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                    style={isSelected ? { borderColor: preset.settings.primaryColor } : {}}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold theme-text">{preset.name}</span>
                      {isSelected && (
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: preset.settings.primaryColor }}
                        >
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] theme-text-muted mb-3 line-clamp-2">{preset.description}</p>
                    {/* Color Swatches */}
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-5 h-5 rounded-md border border-black/10 shadow-xs"
                        style={{ backgroundColor: preset.settings.primaryColor }}
                        title="Primary"
                      />
                      <span
                        className="w-5 h-5 rounded-md border border-black/10 shadow-xs"
                        style={{ backgroundColor: preset.settings.accentColor }}
                        title="Accent"
                      />
                      <span
                        className="w-5 h-5 rounded-md border border-black/10 shadow-xs"
                        style={{ backgroundColor: preset.settings.bgColor }}
                        title="Background"
                      />
                      <span
                        className="w-5 h-5 rounded-md border border-black/10 shadow-xs"
                        style={{ backgroundColor: preset.settings.surfaceColor }}
                        title="Card Surface"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold theme-text mb-1">Primary Brand Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeSettings.primaryColor}
                      onChange={(e) => handleCustomChange('primaryColor', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border theme-border"
                    />
                    <input
                      type="text"
                      value={themeSettings.primaryColor}
                      onChange={(e) => handleCustomChange('primaryColor', e.target.value)}
                      className="text-xs font-mono px-3 py-2 rounded-lg border theme-border theme-surface theme-text w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold theme-text mb-1">Accent Secondary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeSettings.accentColor}
                      onChange={(e) => handleCustomChange('accentColor', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border theme-border"
                    />
                    <input
                      type="text"
                      value={themeSettings.accentColor}
                      onChange={(e) => handleCustomChange('accentColor', e.target.value)}
                      className="text-xs font-mono px-3 py-2 rounded-lg border theme-border theme-surface theme-text w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold theme-text mb-1">Canvas Background</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeSettings.bgColor}
                      onChange={(e) => handleCustomChange('bgColor', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border theme-border"
                    />
                    <input
                      type="text"
                      value={themeSettings.bgColor}
                      onChange={(e) => handleCustomChange('bgColor', e.target.value)}
                      className="text-xs font-mono px-3 py-2 rounded-lg border theme-border theme-surface theme-text w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold theme-text mb-1">Card Surface Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeSettings.surfaceColor}
                      onChange={(e) => handleCustomChange('surfaceColor', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border theme-border"
                    />
                    <input
                      type="text"
                      value={themeSettings.surfaceColor}
                      onChange={(e) => handleCustomChange('surfaceColor', e.target.value)}
                      className="text-xs font-mono px-3 py-2 rounded-lg border theme-border theme-surface theme-text w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Radius Slider */}
              <div className="pt-2">
                <div className="flex justify-between items-center text-xs font-semibold theme-text mb-1.5">
                  <span>Border Radius Geometry</span>
                  <span className="font-mono text-xs">{themeSettings.radius}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="16"
                  value={themeSettings.radius}
                  onChange={(e) => handleCustomChange('radius', parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t theme-border flex items-center justify-between theme-surface-subtle">
          <button
            onClick={() => setThemeSettings(DEFAULT_THEME)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Corporate Indigo</span>
          </button>
          <button
            onClick={() => setThemeModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
            style={{ backgroundColor: themeSettings.primaryColor }}
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
