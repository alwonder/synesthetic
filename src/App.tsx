import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
// @ts-ignore
import abc from './samples/sample1.ogg';
import { AudioAnalyserFactory } from './utils/AudioContext';
import { BasicVisualizer } from './visualizers/BasicVisualizer';

const someAudio = new Audio(
  // 'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3',
  abc,
);

const WIDTH = 512;
const HEIGHT = 500;
const BUFFER_LENGTH = 1024;

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext>();
  const analyserRef = useRef<AnalyserNode>();
  const dataArrayRef = useRef<Uint8Array>();
  const visualizerRef = useRef<BasicVisualizer | null>(null);

  function play() {
    someAudio.play();
    setIsPlaying(true);
  }

  function pause() {
    someAudio.pause();
    setIsPlaying(false);
  }

  useEffect(() => {
    if (audioRef.current) {
      const { audioContext, audioAnalyser } = AudioAnalyserFactory.create();
      audioContextRef.current = audioContext;
      analyserRef.current = audioAnalyser;
      const source = audioContext.createMediaElementSource(someAudio);
      source.connect(audioAnalyser);
      audioAnalyser.connect(audioContext.destination);
      audioAnalyser.fftSize = BUFFER_LENGTH;
      const bufferLength = audioAnalyser.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      audioAnalyser.getByteTimeDomainData(dataArrayRef.current);
      if (!canvasRef.current) {
        console.warn('where canvas');
        return;
      }
      visualizerRef.current = new BasicVisualizer(
        dataArrayRef.current,
        analyserRef.current,
        canvasRef.current,
      );
      visualizerRef.current.start();
    }

    return () => {
      if (visualizerRef.current) {
        visualizerRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="App">
      <audio ref={audioRef} />
      {isPlaying ? <button onClick={pause}>pause</button> : <button onClick={play}>play</button>}
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
    </div>
  );
}

export default App;
