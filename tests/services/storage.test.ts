import { describe, expect, test } from 'vitest';
import { StorageKey, StorageService } from '../../src/services/storage';

describe('StorageService Test Suite.', () => {
  test('Should be able to store and retrieve data.', () => {
    const testText = 'test note';

    const storage = new StorageService(window.localStorage);
    storage.write(StorageKey.NOTES_STORAGE_KEY, testText);

    expect(storage.read(StorageKey.NOTES_STORAGE_KEY)).toBe(testText);
  });
});
