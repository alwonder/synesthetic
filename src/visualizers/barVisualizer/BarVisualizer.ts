import { AudioProcessor } from '../../audioProcessor/AudioProcessor';
import { AudioVisualizer } from '../AudioVisualizer';

export class BarVisualizer implements AudioVisualizer {
  private canvasContext = this.canvas.getContext('2d');
  private canvasWidth = this.canvas.width;
  private canvasHeight = this.canvas.height;
  private analyser = this.processor.getAnalyserNode();
  private dataArray: Uint8Array;
  private requestFrameCallback = () => this.draw();
  private isStarted = false;
  private requestID: number | null = null;

  constructor(private processor: AudioProcessor, private canvas: HTMLCanvasElement) {
    this.processor.setFftSize(64);
    this.dataArray = this.processor.getDataArray();
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

  private draw(): void {
    if (!this.canvasContext) {
      console.warn('No canvas context found');
      return;
    }
    if (this.isStarted) {
      this.requestID = requestAnimationFrame(this.requestFrameCallback);
    }

    this.analyser.getByteFrequencyData(this.dataArray);

    this.canvasContext.fillStyle = 'rgb(0, 0, 0)';
    this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    const barWidth = this.canvasWidth / this.dataArray.byteLength;
    let barHeight: number;
    let x = 0;

    for (let i = 0; i < this.dataArray.byteLength; i++) {
      barHeight = (this.dataArray[i] * this.canvasHeight) / 256;

      this.canvasContext.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
      this.canvasContext.fillRect(x, this.canvasHeight - barHeight / 2, barWidth, barHeight);

      x += barWidth + 1;
    }
  }
}
