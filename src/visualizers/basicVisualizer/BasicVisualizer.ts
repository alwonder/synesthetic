import { AudioProcessor } from '../../audioProcessing/AudioProcessor';
import { CanvasVisualizer } from '../CanvasVisualizer';

export class BasicVisualizer extends CanvasVisualizer {
  constructor(protected processor: AudioProcessor, protected canvas: HTMLCanvasElement) {
    super(1024, processor, canvas);
  }

  protected draw(): void {
    if (!this.canvasContext) {
      console.warn('No canvas context found');
      return;
    }
    if (this.isStarted) {
      this.requestID = requestAnimationFrame(this.requestFrameCallback);
    }

    this.analyser.getByteTimeDomainData(this.dataArray);

    this.canvasContext.fillStyle = 'rgb(0, 0, 0)';
    this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.drawWave(3, 'rgb(0, 255, 0)');
    this.drawWave(2, 'rgb(255, 255, 255)');
    this.canvasContext.filter = 'blur(2px)';
  }

  private drawWave(lineWidth: number, strokeStyle: string): void {
    if (!this.canvasContext) return;

    this.canvasContext.lineWidth = lineWidth;
    this.canvasContext.strokeStyle = strokeStyle;
    this.canvasContext.beginPath();

    const sliceWidth = this.canvasWidth / this.dataArray.byteLength;
    let x = 0;

    for (let i = 0; i < this.dataArray.byteLength; i++) {
      const v = this.dataArray[i] / 128;
      const y = (v * this.canvasHeight) / 2;

      if (i === 0) {
        this.canvasContext.moveTo(x, y);
      } else {
        this.canvasContext.lineTo(x, y);
      }

      x += sliceWidth;
    }

    this.canvasContext.lineTo(this.canvasWidth, this.canvasHeight / 2);
    this.canvasContext.stroke();
  }
}
