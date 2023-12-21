import { initNotes } from './modules/notes';
import { ClockComponent, AlertComponent } from './components';

const CONSTANTS = {
  NOTES_MODULE_ELEMENT_ID: 'notes-module',
};

document.addEventListener('DOMContentLoaded', async () => {
  ClockComponent.register();
  AlertComponent.register();

  const appAlert = document.getElementById('app-alert') as AlertComponent;
  initNotes(CONSTANTS.NOTES_MODULE_ELEMENT_ID, (message: string) => {
    if (!appAlert) {
      return;
    }
    appAlert.broadcast(message);
  });
});
