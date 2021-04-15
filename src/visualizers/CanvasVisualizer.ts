import { AudioProcessor } from '../audioProcessing/AudioProcessor';
import { AudioVisualizer } from './AudioVisualizer';

export abstract class CanvasVisualizer implements AudioVisualizer {
  protected canvasContext = this.canvas.getContext('2d');
  protected canvasWidth = this.canvas.width;
  protected canvasHeight = this.canvas.height;
  protected analyser = this.processor.getAnalyserNode();
  protected dataArray: Uint8Array;
  protected requestFrameCallback = () => this.draw();
  protected isStarted = false;
  protected requestID: number | null = null;

  constructor(
    protected fftSize: number,
    protected processor: AudioProcessor,
    protected canvas: HTMLCanvasElement,
  ) {
    this.processor.setFftSize(fftSize);
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
  }

  public start(): void {
    requestAnimationFrame(this.requestFrameCallback);
    this.isStarted = true;
  }

  public stop(): void {
    if (this.requestID) {
      cancelAnimationFrame(this.requestID);
      this.requestID = null;
    }
    this.isStarted = false;
  }

  protected abstract draw(): void;
}
