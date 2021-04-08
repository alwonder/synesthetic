import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
// @ts-ignore
import abc from './samples/sample1.ogg';
import { AudioAnalyserFactory } from './utils/AudioContext';

const someAudio = new Audio(
  // 'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3',
  abc,
);

const WIDTH = 512;
const HEIGHT = 512;
const BUFFER_LENGTH = 1024;

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext>();
  const analyserRef = useRef<AnalyserNode>();
  const dataArrayRef = useRef<Uint8Array>();

  function play() {
    someAudio.play();
    setIsPlaying(true);
    draw();
  }

  function pause() {
    someAudio.pause();
    setIsPlaying(false);
  }

  const draw = useCallback(() => {
    if (
      !canvasRef.current ||
      !analyserRef.current ||
      !audioContextRef.current ||
      !dataArrayRef.current
    )
      return;

    // TODO requestAnimationFrame
    requestAnimationFrame(draw);
    analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

    const canvasCtx = canvasRef.current.getContext('2d');

    if (!canvasCtx) {
      console.warn('No canvas context');
      return;
    }

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
    canvasCtx.beginPath();

    const sliceWidth = WIDTH / BUFFER_LENGTH;
    let x = 0;

    for (let i = 0; i < BUFFER_LENGTH; i++) {
      const v = dataArrayRef.current[i] / 128;
      const y = (v * HEIGHT) / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(WIDTH, canvasRef.current.height / 2);
    canvasCtx.stroke();
  }, []);

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
      draw();
    }
  }, [draw]);

  return (
    <div className="App">
      <audio ref={audioRef} />
      {isPlaying ? <button onClick={pause}>pause</button> : <button onClick={play}>play</button>}
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
    </div>
  );
}

export default App;
