import { describe, expect, test } from 'vitest';
import { StorageKey, StorageService } from '../../src/services/storage';

describe('StorageService Test Suite.', () => {
  test('Should be able to store and retrieve data.', async () => {
    const testText = 'test note';

    const storage = new StorageService(window.localStorage);
    await storage.write(StorageKey.NOTES_STORAGE_KEY, testText);

    await expect(storage.read(StorageKey.NOTES_STORAGE_KEY)).resolves.toBe(
      testText,
    );
  });
});
