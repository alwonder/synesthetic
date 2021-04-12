import sample1 from '../samples/sample1.ogg';
import sample2 from '../samples/sample2.mp3';

export type AudioSourceItem = {
  name: string;
  src: string;
};

export const audioSources: AudioSourceItem[] = [
  { name: 'Local Sample 1', src: sample1 },
  { name: 'Local Sample 2', src: sample2 },
  {
    name: 'Online Sample 1',
    src: 'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3',
  },
];
