export const visualizersList = ['basic', 'basic2', 'bar'] as const;

export type VisualizerKey = typeof visualizersList[number];
