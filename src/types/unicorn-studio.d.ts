interface UnicornScene {
  destroy: () => void;
  resize: () => void;
  paused: boolean;
}

interface UnicornStudioSDK {
  addScene: (config: {
    elementId: string;
    projectId?: string;
    filePath?: string;
    fps?: number;
    scale?: number;
    dpi?: number;
    lazyLoad?: boolean;
    production?: boolean;
    fixed?: boolean;
    altText?: string;
    ariaLabel?: string;
    interactivity?: {
      mouse?: { disableMobile?: boolean; disabled?: boolean };
    };
  }) => Promise<UnicornScene>;
  destroy: () => void;
  init: () => Promise<UnicornScene[]>;
}

declare global {
  interface Window {
    UnicornStudio: UnicornStudioSDK;
  }
  var UnicornStudio: UnicornStudioSDK;
}

export {};
