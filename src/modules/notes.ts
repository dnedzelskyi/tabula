import { AlertUserEvent } from './events/alert';
import { NoteComponent } from '../components';
import { StorageKey, StorageService } from '../services/storage';
import App from './application';

export default class NotesModule {
  private static CONSTANTS = {
    AUTO_SAVE_TIMEOUT: 15000,
    MSG_LOADING: 'Loading notes ...',
    MSG_SAVING: 'Saving notes ...',
    MSG_SAVED: 'Notes saved.',
  };

  private isDirty: boolean = false;

  private get noteComponent() {
    return document.querySelector(NoteComponent.tagName) as InstanceType<
      typeof NoteComponent
    >;
  }
  private get storage() {
    return this.app.resolveService(StorageService)!;
  }

  constructor(private app: App) {
    void this.init();
  }

  private async init() {
    this.noteComponent.value = await this.readNotes();

    // Refresh on incoming updates.
    this.storage.addEventListener('storage', async (event: Event) => {
      if ((event as StorageEvent).key === StorageKey.NOTES_STORAGE_KEY) {
        this.noteComponent.value = await this.readNotes();
      }
    });

    // Mark as dirty on edit.
    this.noteComponent.addEventListener('input', () => (this.isDirty = true));

    // Autosave.
    setInterval(
      () => void this.autoSaveHandler(),
      NotesModule.CONSTANTS.AUTO_SAVE_TIMEOUT,
    );
  }

  private async readNotes(): Promise<string> {
    this.app.dispatchEvent(
      AlertUserEvent.create(NotesModule.CONSTANTS.MSG_LOADING),
    );

    const noteText = await this.storage.read(StorageKey.NOTES_STORAGE_KEY);
    if (!noteText) {
      await this.saveNotes('');
    }

    return noteText ?? '';
  }

  private async saveNotes(notes: string) {
    this.app.dispatchEvent(
      AlertUserEvent.create(NotesModule.CONSTANTS.MSG_SAVING),
    );
    await this.storage.write(StorageKey.NOTES_STORAGE_KEY, notes);
    this.app.dispatchEvent(
      AlertUserEvent.create(NotesModule.CONSTANTS.MSG_SAVED),
    );
  }

  private async autoSaveHandler() {
    if (this.isDirty) {
      await this.saveNotes(this.noteComponent.value);
      this.isDirty = false;
    }
  }
}
