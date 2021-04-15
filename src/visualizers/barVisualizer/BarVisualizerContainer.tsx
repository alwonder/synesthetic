import React, { memo, useEffect, useRef } from 'react';
import { AudioProcessor } from '../../audioProcessing/AudioProcessor';
import { BarVisualizer } from './BarVisualizer';

type Props = {
  processor: AudioProcessor;
};

export const BarVisualizerContainer = memo(({ processor }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visualizerRef = useRef<BarVisualizer | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      console.warn('No canvas');
      return;
    }
    visualizerRef.current = new BarVisualizer(processor, canvasRef.current);
    visualizerRef.current.start();

    return () => {
      if (visualizerRef.current) {
        visualizerRef.current.stop();
      }
    };
  }, [processor]);

  return (
    <div>
      <canvas ref={canvasRef} width={512} height={512} />
    </div>
  );
});
