import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { AudioPlayer } from './audioPlayer/AudioPlayer';
import { AudioProcessor } from './audioProcessor/AudioProcessor';
import { AudioSelect } from './audioSelect/AudioSelect';
import { audioSources } from './export/audioSources';
import { VisualizerView } from './visualizers/VisualizerView';

function createAudio() {
  const someAudio = new Audio();
  someAudio.crossOrigin = 'anonymous';
  return someAudio;
}

function App() {
  const audio = useRef<HTMLAudioElement>(createAudio());
  const [audioSrc, setAudioSrc] = useState(audioSources[0].src);
  const [processor, setProcessor] = useState<AudioProcessor | null>(null);

  useEffect(() => {
    const currentAudio = audio.current;

    currentAudio.pause();
    currentAudio.src = audioSrc;

    return () => {
      currentAudio.src = '';
    };
  }, [audioSrc]);

  useEffect(() => {
    setProcessor(new AudioProcessor(audio.current));
  }, []);

  const onSrcSelect = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setAudioSrc(event.target.value);
  }, []);

  return (
    <div className="App">
      <VisualizerView processor={processor} />
      <AudioPlayer audio={audio.current} />
      <AudioSelect selectedSrc={audioSrc} onSrcSelect={onSrcSelect} />
    </div>
  );
}

export default App;
