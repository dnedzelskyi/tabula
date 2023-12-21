// import { initClock } from './modules/clock';
import { initAlert } from './modules/common/alert';
import { initNotes } from './modules/notes';
import { ClockComponent } from './components';

const CONSTANTS = {
  ALERT_MODULE_ELEMENT_ID: 'alert',
  NOTES_MODULE_ELEMENT_ID: 'notes-module',
};

document.addEventListener('DOMContentLoaded', async () => {
  ClockComponent.register();

  initAlert(CONSTANTS.ALERT_MODULE_ELEMENT_ID);
  initNotes(CONSTANTS.NOTES_MODULE_ELEMENT_ID);
});
