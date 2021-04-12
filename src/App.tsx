import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { AudioPlayer } from './audioPlayer/AudioPlayer';
import sample1 from './samples/sample1.ogg';
import { AudioAnalyserFactory } from './utils/AudioContext';
import { BasicVisualizer } from './visualizers/BasicVisualizer';

const someAudio = new Audio(
  'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3',
  // sample1,
);
someAudio.crossOrigin = 'anonymous';
const WIDTH = 512;
const HEIGHT = 500;
const FFT_SIZE = 1024;

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext>();
  const analyserRef = useRef<AnalyserNode>();
  const dataArrayRef = useRef<Uint8Array>();
  const visualizerRef = useRef<BasicVisualizer | null>(null);

  useEffect(() => {
    const { audioContext, audioAnalyser } = AudioAnalyserFactory.create();
    audioContextRef.current = audioContext;
    analyserRef.current = audioAnalyser;
    const source = audioContext.createMediaElementSource(someAudio);
    source.connect(audioAnalyser);
    audioAnalyser.connect(audioContext.destination);
    audioAnalyser.fftSize = FFT_SIZE;
    const bufferLength = audioAnalyser.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);
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

    return () => {
      if (visualizerRef.current) {
        visualizerRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="App">
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
      <AudioPlayer audio={someAudio} />
    </div>
  );
}

export default App;
