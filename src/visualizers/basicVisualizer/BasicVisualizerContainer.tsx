import React, { memo, useEffect, useRef } from 'react';
import { AudioProcessor } from '../../audioProcessor/AudioProcessor';
import { BasicVisualizer } from './BasicVisualizer';

type Props = {
  processor: AudioProcessor;
};

export const BasicVisualizerContainer = memo(({ processor }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visualizerRef = useRef<BasicVisualizer | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      console.warn('No canvas');
      return;
    }
    visualizerRef.current = new BasicVisualizer(processor, canvasRef.current);
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
