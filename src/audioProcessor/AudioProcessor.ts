import { AudioContextProvider } from '../utils/AudioContextProvider';

export class AudioProcessor {
  private readonly audioContext: AudioContext;
  private readonly analyserNode: AnalyserNode;
  private readonly sourceNode: MediaElementAudioSourceNode;
  private dataArray: Uint8Array;

  private fftSize = 1024;

  constructor(private readonly audio: HTMLAudioElement) {
    this.audioContext = AudioContextProvider.getInstance();
    this.analyserNode = this.audioContext.createAnalyser();
    this.sourceNode = this.audioContext.createMediaElementSource(audio);
    this.sourceNode.connect(this.analyserNode);
    this.analyserNode.connect(this.audioContext.destination);
    this.analyserNode.fftSize = this.fftSize;

    const bufferLength = this.analyserNode.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
  }

  public getDataArray(): Uint8Array {
    return this.dataArray;
  }

  public getAnalyserNode(): AnalyserNode {
    return this.analyserNode;
  }

  public setFftSize(size: number): void {
    this.fftSize = size;
    this.analyserNode.fftSize = this.fftSize;
    const bufferLength = this.analyserNode.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
  }
}
