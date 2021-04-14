import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { AudioPlayer } from './audioPlayer/AudioPlayer';
import { AudioProcessor } from './audioProcessor/AudioProcessor';
import { AudioSelect } from './audioSelect/AudioSelect';
import { audioSources } from './export/audioSources';
import { BasicVisualizer } from './visualizers/BasicVisualizer';

const someAudio = new Audio();
someAudio.crossOrigin = 'anonymous';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visualizerRef = useRef<BasicVisualizer | null>(null);
  const [audioSrc, setAudioSrc] = useState(audioSources[0].src);

  useEffect(() => {
    someAudio.pause();
    someAudio.src = audioSrc;

    return () => {
      someAudio.src = '';
    };
  }, [audioSrc]);

  useEffect(() => {
    if (!canvasRef.current) {
      console.warn('where canvas');
      return;
    }
    const audioProcessor = new AudioProcessor(someAudio);
    visualizerRef.current = new BasicVisualizer(audioProcessor, canvasRef.current);
    visualizerRef.current.start();

    return () => {
      if (visualizerRef.current) {
        visualizerRef.current.stop();
      }
    };
  }, []);

  const onSrcSelect = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setAudioSrc(event.target.value);
  }, []);

  return (
    <div className="App">
      <canvas ref={canvasRef} width={512} height={512} />
      <AudioPlayer audio={someAudio} />
      <AudioSelect selectedSrc={audioSrc} onSrcSelect={onSrcSelect} />
    </div>
  );
}

export default App;
