import { Alert } from './common/alert';

const CONSTANTS = {
  NOTES_STORAGE_KEY: 'tabula.notes',
  TEXTAREA_PLACEHOLDER: 'Enter your notes here.',
  AUTOSAVE_INTERVAL: 15000,
};

let isDirty = false;

export function initNotes(moduleElementId: string): void {
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
  notesTextAreaElement.value = readNotes();

  // Autosave
  notesTextAreaElement.addEventListener('input', function () {
    isDirty = true;
  });

  setInterval(() => {
    if (!isDirty) {
      return;
    }

    saveNotes(notesTextAreaElement.value);
    isDirty = false;
  }, CONSTANTS.AUTOSAVE_INTERVAL);
}

function readNotes(): string {
  Alert.send('Loading notes ...');

  // Init storage if needed.
  if (!localStorage.getItem(CONSTANTS.NOTES_STORAGE_KEY)) {
    saveNotes('');
  }

  const notes: string = localStorage.getItem(CONSTANTS.NOTES_STORAGE_KEY) ?? '';

  return notes;
}

function saveNotes(notes: string): void {
  Alert.send('Saving notes ...');
  localStorage.setItem(CONSTANTS.NOTES_STORAGE_KEY, notes);
  Alert.send('Notes saved.');
}
