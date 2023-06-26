import { initClock } from './modules/clock';
import { initNotes } from './modules/notes';

const CONSTANTS = {
  CLOCK_MODULE_ELEMENT_ID: 'clock',
  NOTES_MODULE_ELEMENT_ID: 'notes-module',
};

export const app = {
  init: () => {
    initNotes(CONSTANTS.NOTES_MODULE_ELEMENT_ID);
    initClock(CONSTANTS.CLOCK_MODULE_ELEMENT_ID);
  },
};
