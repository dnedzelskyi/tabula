import { initClock } from './modules/clock';
import { initAlert } from './modules/common/alert';
import { initNotes } from './modules/notes';

const CONSTANTS = {
  ALERT_MODULE_ELEMENT_ID: 'alert',
  CLOCK_MODULE_ELEMENT_ID: 'clock',
  NOTES_MODULE_ELEMENT_ID: 'notes-module',
};

export const app = {
  init: () => {
    initAlert(CONSTANTS.ALERT_MODULE_ELEMENT_ID);
    initNotes(CONSTANTS.NOTES_MODULE_ELEMENT_ID);
    initClock(CONSTANTS.CLOCK_MODULE_ELEMENT_ID);
  },
};
