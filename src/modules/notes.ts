import { StorageKey, StorageService } from '../services/storage';
import App from './application';
import { AlertUserEvent } from './events/alert';

const CONSTANTS = {
  TEXTAREA_PLACEHOLDER: 'Enter your notes here.',
  AUTOSAVE_INTERVAL: 15000,
};

let isDirty = false;

export function initNotes(moduleElementId: string, app: App): void {
  const module = document.getElementById(moduleElementId);

  if (!module) {
    console.error(
      `Unable to initialize "Notes Module".
       UI module element with Id: ${moduleElementId} does not exist.`
    );
    return;
  }

  const notesTextAreaElement = module?.querySelector(
    'textarea'
  ) as HTMLTextAreaElement;

  if (!notesTextAreaElement) {
    return;
  }

  // Init UI
  notesTextAreaElement.placeholder = CONSTANTS.TEXTAREA_PLACEHOLDER;

  // Init data
  notesTextAreaElement.value = readNotes(app);

  // Autosave
  notesTextAreaElement.addEventListener('input', function () {
    isDirty = true;
  });

  setInterval(() => {
    if (!isDirty) {
      return;
    }

    saveNotes(notesTextAreaElement.value, app);
    isDirty = false;
  }, CONSTANTS.AUTOSAVE_INTERVAL);
}

function readNotes(app: App): string {
  const storage = app.resolveService(StorageService)!;

  app.dispatchEvent(AlertUserEvent.create('Loading notes ...'));

  // Init storage if needed.
  if (!storage.read(StorageKey.NOTES_STORAGE_KEY)) {
    saveNotes('', app);
  }

  const notes: string = storage.read(StorageKey.NOTES_STORAGE_KEY) ?? '';

  return notes;
}

function saveNotes(notes: string, app: App): void {
  const storage = app.resolveService(StorageService)!;

  app.dispatchEvent(AlertUserEvent.create('Saving notes ...'));
  storage.write(StorageKey.NOTES_STORAGE_KEY, notes);
  app.dispatchEvent(AlertUserEvent.create('Notes saved.'));
}
