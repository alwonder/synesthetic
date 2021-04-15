import { AudioProcessor } from '../../audioProcessing/AudioProcessor';
import { CanvasVisualizer } from '../CanvasVisualizer';

export class BarVisualizer extends CanvasVisualizer {
  constructor(protected processor: AudioProcessor, protected canvas: HTMLCanvasElement) {
    super(64, processor, canvas);
  }

  protected draw(): void {
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
