import { AlertUserEvent } from "./events/alert";
import { NoteComponent } from "../components";
import { StorageKey, StorageService } from "../services/storage";
import App from "./application";


export default class NotesModule {
    private static CONSTANTS = {
        AUTO_SAVE_TIMEOUT: 15000,
        MSG_LOADING: 'Loading notes ...',
        MSG_SAVING: 'Saving notes ...',
        MSG_SAVED: 'Notes saved.'
    };

    private isDirty: boolean = false;

    private get noteComponent() {
        return document.querySelector(
            NoteComponent.tagName
        ) as InstanceType<typeof NoteComponent>;
    }
    private get storage() {
        return this.app.resolveService(StorageService)!
    }

    constructor(private app: App) {
        this.noteComponent.value = this.readNotes();

        // Refresh on incoming updates.
        this.storage.addEventListener('storage', (event: Event) => {
            if ((event as StorageEvent).key === StorageKey.NOTES_STORAGE_KEY) {
                this.noteComponent.value = this.readNotes();
            }
        });

        // Mark as dirty on edit.
        this.noteComponent.addEventListener(
            'input',
            () => this.isDirty = true
        );

        // Autosave.
        setInterval(
            () => this.autoSaveHandler(),
            NotesModule.CONSTANTS.AUTO_SAVE_TIMEOUT
        );
    }

    private readNotes(): string {
        this.app.dispatchEvent(AlertUserEvent.create(NotesModule.CONSTANTS.MSG_LOADING));

        if (!this.storage.read(StorageKey.NOTES_STORAGE_KEY)) {
            this.saveNotes('');
        }

        return this.storage.read(StorageKey.NOTES_STORAGE_KEY) ?? '';
    }

    private saveNotes(notes: string): void {
        this.app.dispatchEvent(AlertUserEvent.create(NotesModule.CONSTANTS.MSG_SAVING));
        this.storage.write(StorageKey.NOTES_STORAGE_KEY, notes);
        this.app.dispatchEvent(AlertUserEvent.create(NotesModule.CONSTANTS.MSG_SAVED));
    }

    private autoSaveHandler() {
        if (this.isDirty) {
            this.saveNotes(this.noteComponent.value);
            this.isDirty = false;
        }
    }
}