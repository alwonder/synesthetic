import React, { useMemo, useState } from 'react';
import { AudioProcessor } from '../audioProcessor/AudioProcessor';
import { BarVisualizerContainer } from './barVisualizer/BarVisualizerContainer';
import { BasicVisualizerContainer } from './basicVisualizer/BasicVisualizerContainer';
import { BasicVisualizer2Container } from './basicVisualizer2/BasicVisualizer2Container';
import { VisualizerKey, visualizersList } from './visualizersList';

type Props = {
  processor: AudioProcessor | null;
};

export const VisualizerView = ({ processor }: Props) => {
  const [currentVisualizer, setCurrentVisualizer] = useState<VisualizerKey>('basic');

  const visualizer = useMemo<JSX.Element | null>(() => {
    if (!processor) return null;

    const viz: Record<VisualizerKey, () => JSX.Element> = {
      basic: () => <BasicVisualizerContainer processor={processor} />,
      basic2: () => <BasicVisualizer2Container processor={processor} />,
      bar: () => <BarVisualizerContainer processor={processor} />,
    };

    if (!viz[currentVisualizer]) {
      console.warn(`Visualizer "${currentVisualizer}" not found.`);
      return null;
    }

    return viz[currentVisualizer]();
  }, [processor, currentVisualizer]);

  return (
    <div>
      <select
        value={currentVisualizer}
        onChange={(event) => setCurrentVisualizer(event.target.value as VisualizerKey)}>
        {visualizersList.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      {visualizer}
    </div>
  );
};
