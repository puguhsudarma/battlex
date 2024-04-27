import {
  SQUARES_AMOUNT_HORIZONTAL,
  SQUARES_AMOUNT_VERTICAL,
} from '@/constants/values';

export const generatePlayerDimensions = () => {
  return Array.from({length: SQUARES_AMOUNT_HORIZONTAL}, (_, i) => {
    return Array.from({length: SQUARES_AMOUNT_VERTICAL}, (_, j) => {
      return Math.random() > 0.5 ? 1 : 0;
    });
  });
};
