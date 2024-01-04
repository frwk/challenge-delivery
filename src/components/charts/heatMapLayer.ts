import type { LayerProps } from 'react-map-gl';

export const heatmapLayer: LayerProps = {
  id: 'heatmap',
  type: 'heatmap',
  paint: {
    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 11, 10, 15, 15],
    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 11, 1, 15, 4],
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,
      'rgba(33,102,172,0)',
      0.2,
      'rgb(103,169,207)',
      0.4,
      'rgb(2,136,209)',
      0.6,
      'rgb(255,160,0)',
      0.8,
      'rgb(255,87,34)',
      1,
      'rgb(183,28,28)',
    ],
    'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 11, 0.8, 15, 0.6],
  },
};
