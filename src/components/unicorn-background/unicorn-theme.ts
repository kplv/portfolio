export type UnicornTheme = 'light' | 'dark';

export interface UnicornSceneInstance {
  paused: boolean;
  destroy: () => void;
  setPreset?: (idOrName: string) => UnicornSceneInstance;
}

export function getThemePreset(theme: UnicornTheme): string {
  return theme === 'dark' ? 'dark-mode' : 'light-mode';
}

export function applyUnicornTheme(
  scene: UnicornSceneInstance,
  theme: UnicornTheme,
): void {
  scene.setPreset?.(getThemePreset(theme));
}
