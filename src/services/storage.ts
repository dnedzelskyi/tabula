export enum StorageKey {
  NOTES_STORAGE_KEY = 'tabula.notes',
}

export class StorageService extends EventTarget {
  constructor(private storageProvider: Storage) {
    super();

    // Propagate onchange StorageEvent.
    window.addEventListener('storage', (event: StorageEvent) =>
      this.dispatchEvent(
        new StorageEvent('storage', {
          key: event.key,
          oldValue: event.oldValue,
          newValue: event.newValue,
          url: event.url,
          storageArea: event.storageArea
        })
      )
    );
  }

  read(key: StorageKey): string | null {
    return this.storageProvider.getItem(key);
  }

  write(key: StorageKey, value: string) {
    this.storageProvider.setItem(key, value);
  }
}
