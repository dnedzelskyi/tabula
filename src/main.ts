import { initClock } from './modules/clock';

const CONSTANTS = {
  CLOCK_OUTPUT_ELEMENT_ID: 'clock',
};

export const app = {
  init: () => {
    initClock(CONSTANTS.CLOCK_OUTPUT_ELEMENT_ID);
  },
};
