export class BasicVisualizer {
  private canvasContext = this.canvas.getContext('2d');
  private canvasWidth = this.canvas.width;
  private canvasHeight = this.canvas.height;
  private bufferSize = this.dataArray.byteLength;
  private requestFrameCallback = () => this.draw();
  private isStarted = false;
  private requestID: number | null = null;

  constructor(
    private dataArray: Uint8Array,
    private analyser: AnalyserNode,
    private canvas: HTMLCanvasElement,
  ) {}

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

    this.analyser.getByteTimeDomainData(this.dataArray);

    this.canvasContext.fillStyle = 'rgb(200, 200, 200)';
    this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.canvasContext.lineWidth = 2;
    this.canvasContext.strokeStyle = 'rgb(0, 0, 0)';
    this.canvasContext.beginPath();

    const sliceWidth = this.canvasWidth / this.bufferSize;
    let x = 0;

    for (let i = 0; i < this.bufferSize; i++) {
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
