import React, { useCallback, useEffect, useState } from 'react';

type Props = {
  audio: HTMLAudioElement;
};

export const AudioPlayer = ({ audio }: Props) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const onCanPlay = useCallback(() => {
    setIsDisabled(false);
    setDuration(audio.duration);
  }, [audio]);
  const onTimeUpdate = useCallback(() => setCurrentTime(audio.currentTime), [audio]);
  const onPlaying = useCallback(() => setIsPlaying(true), []);
  const onPause = useCallback(() => setIsPlaying(false), []);
  const onEnded = useCallback(() => setCurrentTime(0), []);
  const onEmptied = useCallback(() => {
    setIsDisabled(true);
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  useEffect(() => {
    const listeners: Record<string, () => void> = {
      canplay: onCanPlay,
      timeupdate: onTimeUpdate,
      playing: onPlaying,
      pause: onPause,
      ended: onEnded,
      emptied: onEmptied,
    };
    Object.keys(listeners).forEach((event) => audio.addEventListener(event, listeners[event]));

    return () => {
      Object.keys(listeners).forEach((event) => audio.removeEventListener(event, listeners[event]));
    };
  }, [audio, onCanPlay, onTimeUpdate, onPlaying, onPause, onEnded, onEmptied]);

  const onPlayPauseClick = useCallback(() => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  }, [isPlaying, audio]);

  return (
    <div>
      <button disabled={isDisabled} onClick={onPlayPauseClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <p>
        {formatTime(currentTime)}/{formatTime(duration)}
      </p>
    </div>
  );
};

function formatTime(timestamp: number): string {
  const hours = Math.floor(timestamp / 60 / 60);
  const minutes = Math.floor(timestamp / 60) - hours * 60;
  const seconds = Math.floor(timestamp % 60);
  return hours > 0
    ? `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
