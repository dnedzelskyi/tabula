export enum StorageKey {
  NOTES_STORAGE_KEY = 'tabula.notes',
}

type StorageProvider = Pick<Storage, 'getItem' | 'setItem'>;
interface AsyncStorageProvider {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

export class StorageService extends EventTarget {
  constructor(private storageProvider: StorageProvider | AsyncStorageProvider) {
    super();

    // Propagate onchange StorageEvent.
    window.addEventListener('storage', (event: StorageEvent) =>
      this.dispatchEvent(
        new StorageEvent('storage', {
          key: event.key,
          oldValue: event.oldValue,
          newValue: event.newValue,
          url: event.url,
          storageArea: event.storageArea,
        }),
      ),
    );
  }

  async read(key: StorageKey): Promise<string | null> {
    return this.storageProvider.getItem(key);
  }

  async write(key: StorageKey, value: string) {
    await this.storageProvider.setItem(key, value);
  }
}
