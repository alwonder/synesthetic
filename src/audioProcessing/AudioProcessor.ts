import { AudioContextProvider } from './AudioContextProvider';

export class AudioProcessor {
  private readonly audioContext: AudioContext;
  private readonly analyserNode: AnalyserNode;
  private readonly sourceNode: MediaElementAudioSourceNode;

  constructor(private readonly audio: HTMLAudioElement) {
    this.audioContext = AudioContextProvider.getInstance();
    this.analyserNode = this.audioContext.createAnalyser();
    this.sourceNode = this.audioContext.createMediaElementSource(audio);
    this.sourceNode.connect(this.analyserNode);
    this.analyserNode.connect(this.audioContext.destination);
  }

  public getAnalyserNode(): AnalyserNode {
    return this.analyserNode;
  }
}
