declare module 'scramble-text' {
  interface ScrambleTextOptions {
    timeOffset?: number;
    fps?: number;
    chars?: string[];
    callback?: () => void;
  }

  interface ScrambleTextInstance {
    play(): ScrambleTextInstance;
    start(): ScrambleTextInstance;
    stop(): ScrambleTextInstance;
  }

  interface ScrambleTextConstructor {
    new (
      element: HTMLElement,
      options?: ScrambleTextOptions
    ): ScrambleTextInstance;
  }

  const ScrambleText: ScrambleTextConstructor;
  export default ScrambleText;
}
