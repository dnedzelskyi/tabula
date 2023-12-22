export enum StorageKey {
  NOTES_STORAGE_KEY = 'tabula.notes',
}

export class StorageService {
  constructor(private storageProvider: Storage) {}

  read(key: StorageKey): string | null {
    return this.storageProvider.getItem(key);
  }

  write(key: StorageKey, value: string) {
    localStorage.setItem(key, value);
  }
}
