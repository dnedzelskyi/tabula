import { AlertComponent, NoteComponent } from '../components';
import { StorageKey, StorageService } from '../services/storage';
import { AlertUserEvent } from './events/alert';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Class<T> = {
  new (...args: any[]): T;
};

type InjectableComponent = {
  register: () => void;
};

export default class App extends EventTarget {
  private static AppBuilder = class AppBuilder {
    private services = new Map<Class<any>, any>();

    registerComponents(components: InjectableComponent[]) {
      components.forEach((component) => component.register());
      return this;
    }

    registerService<T>(dependency: Class<T>, instance: T) {
      this.services.set(dependency, instance);
      return this;
    }

    create() {
      return new App(this.services);
    }
  };

  private constructor(private services: Map<Class<any>, any>) {
    super();
  }

  static get builder() {
    return new App.AppBuilder();
  }

  resolveService<T>(dependency: Class<T>): T | null {
    return this.services.get(dependency) ?? null;
  }

  // TODO: Refactor run() and related methods.
  run() {
    this.addEventListener(AlertUserEvent.typeName, (event) => {
      const alertComponent = document.querySelector(
        AlertComponent.tagName
      ) as AlertComponent;

      if (alertComponent) {
        const userEvent = event as AlertUserEvent;
        alertComponent.broadcast(userEvent.detail.alertMessage);
      }
    });

    const noteComponent = document.querySelector(
      'tabula-note'
    ) as NoteComponent;
    noteComponent.value = this.readNotes();
    let isNoteDirty = false;
    noteComponent.addEventListener('input', () => {
      isNoteDirty = true;
    });
    const autoSave = () => {
      if (!isNoteDirty) {
        return;
      }

      const noteComponent = document.querySelector(
        NoteComponent.tagName
      ) as NoteComponent;
      this.saveNotes(noteComponent.value);

      isNoteDirty = false;
    };
    setInterval(autoSave, 15000);
  }

  private readNotes(): string {
    const storage = this.resolveService(StorageService)!;

    this.dispatchEvent(AlertUserEvent.create('Loading notes ...'));
    if (!storage.read(StorageKey.NOTES_STORAGE_KEY)) {
      this.saveNotes('');
    }
    const notes: string = storage.read(StorageKey.NOTES_STORAGE_KEY) ?? '';

    return notes;
  }

  private saveNotes(notes: string): void {
    const storage = this.resolveService(StorageService)!;

    this.dispatchEvent(AlertUserEvent.create('Saving notes ...'));
    storage.write(StorageKey.NOTES_STORAGE_KEY, notes);
    this.dispatchEvent(AlertUserEvent.create('Notes saved.'));
  }
}
