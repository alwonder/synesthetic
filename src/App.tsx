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

  const onSrcSelect = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setAudioSrc(event.target.value);
  }, []);

  // Some browsers require audioContext initialization through the direct
  // user action (e.g. button click), Therefore we need to create
  // the audio processor only when the play button was pressed.
  const onPlayClick = useCallback(() => {
    if (!processor) {
      setProcessor(new AudioProcessor(audio.current));
    }
  }, [processor]);

  return (
    <div className="App">
      <VisualizerView processor={processor} />
      <AudioPlayer audio={audio.current} onPlayClick={onPlayClick} />
      <AudioSelect selectedSrc={audioSrc} onSrcSelect={onSrcSelect} />
    </div>
  );
}

export default App;
