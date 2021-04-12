import React, { useCallback, useState } from 'react';

type Props = {
  audio: HTMLAudioElement;
};

export const AudioPlayer = ({ audio }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const onPlayPauseClick = useCallback(() => {
    if (isPlaying) {
      audio.pause();
      // TODO delete indirect pause;
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.warn('Failed to play audio', error);
        });
    }
  }, [isPlaying, audio]);

  return (
    <div>
      <button onClick={onPlayPauseClick}>{isPlaying ? 'Pause' : 'Play'}</button>
    </div>
  );
};
