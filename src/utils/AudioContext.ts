// // @ts-ignore
// export const audioContext: AudioContext = new (window.AudioContext || window.webkitAudioContext)();
//
// export const audioAnalyser = audioContext.createAnalyser();

export class AudioAnalyserFactory {
  public static create(): { audioContext: AudioContext; audioAnalyser: AnalyserNode } {
    // @ts-ignore
    const audioContext: AudioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioAnalyser = audioContext.createAnalyser();
    return { audioContext, audioAnalyser };
  }
}
