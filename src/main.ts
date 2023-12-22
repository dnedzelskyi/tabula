import { ClockComponent, AlertComponent } from './components';
import { initNotes } from './modules/notes';
import { StorageService } from './services/storage';
import TabulaApp from './modules/application';
import { AlertUserEvent } from './modules/events/alert';

const CONSTANTS = {
  NOTES_MODULE_ELEMENT_ID: 'notes-module',
};

document.addEventListener('DOMContentLoaded', async () => {
  const app = TabulaApp.builder
    .registerComponents([ClockComponent, AlertComponent])
    .registerService(StorageService, new StorageService(window.localStorage))
    .create();

  app.addEventListener(AlertUserEvent.typeName, (event) => {
    const appAlert = document.getElementById('app-alert') as AlertComponent;
    if (appAlert) {
      const userEvent = event as AlertUserEvent;
      appAlert.broadcast(userEvent.detail.alertMessage);
    }
  });

  initNotes(CONSTANTS.NOTES_MODULE_ELEMENT_ID, app);
});
