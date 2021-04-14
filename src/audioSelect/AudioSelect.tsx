import React, { ChangeEvent, useMemo } from 'react';
import { audioSources } from '../export/audioSources';

type Props = {
  selectedSrc: string;
  onSrcSelect: (event: ChangeEvent<HTMLSelectElement>) => void;
};

export const AudioSelect = ({ selectedSrc, onSrcSelect }: Props) => {
  const sourcesList = useMemo(
    () =>
      audioSources.map((item) => (
        <option key={item.src} value={item.src}>
          {item.name}
        </option>
      )),
    [],
  );

  return (
    <select value={selectedSrc} onChange={onSrcSelect}>
      {sourcesList}
    </select>
  );
};
