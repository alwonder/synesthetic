import React, { memo, useEffect, useRef } from 'react';
import { AudioProcessor } from '../../audioProcessor/AudioProcessor';
import { BasicVisualizer2 } from './BasicVisualizer2';

type Props = {
  processor: AudioProcessor;
};

export const BasicVisualizer2Container = memo(({ processor }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visualizerRef = useRef<BasicVisualizer2 | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    visualizerRef.current = new BasicVisualizer2(processor, canvasRef.current);
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
