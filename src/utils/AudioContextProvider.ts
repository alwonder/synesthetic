export class AudioContextProvider {
  private static contextInstance: AudioContext | null = null;

  public static getInstance(): AudioContext {
    if (!this.contextInstance) {
      // @ts-ignore
      this.contextInstance = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.contextInstance;
  }
}
