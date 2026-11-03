/**
 * Dark-mode background softening: render the shader at a low DPI and let the
 * browser upscale it. Fewer pixels to shade, so it's cheaper than sharp — not
 * more expensive like a CSS/backdrop blur would be.
 */
export interface DarkBlurSettings {
  /** Render DPI in dark mode. Lower = softer/blockier and cheaper. */
  dpiDesktop: number;
  dpiPhone: number;
  /** Soft motion doesn't need 60fps. */
  fpsDesktop: number;
  fpsPhone: number;
  /** Crisp pixel blocks instead of smooth upscaling. Free — no extra GPU work. */
  pixelated: boolean;
  /** Shader opacity in dark mode, per surface. */
  opacityHome: number;
  opacityInner: number;
}

/** Tuned dark-mode background settings. */
export const DARK_BLUR: DarkBlurSettings = {
  dpiDesktop: 0.8,
  dpiPhone: 0.4,
  fpsDesktop: 30,
  fpsPhone: 24,
  pixelated: false,
  opacityHome: 0.45,
  opacityInner: 0.1,
};

export interface SceneQuality {
  dpi: number;
  fps: number;
}

const SHARP = {
  desktop: { dpi: 1.5, fps: 60 },
  phone: { dpi: 1, fps: 30 },
} as const;

export function getSceneQuality(
  theme: 'light' | 'dark',
  isPhone: boolean,
  settings: DarkBlurSettings = DARK_BLUR,
): SceneQuality {
  if (theme !== 'dark') return SHARP[isPhone ? 'phone' : 'desktop'];

  return {
    dpi: isPhone ? settings.dpiPhone : settings.dpiDesktop,
    fps: isPhone ? settings.fpsPhone : settings.fpsDesktop,
  };
}
