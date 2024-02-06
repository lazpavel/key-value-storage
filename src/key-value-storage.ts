import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { logger } from './utils/logger';

export type KeyValueStorageOptions = {
  // The path to the storage directory
  storagePath?: string;
};

export default class KeyValueStorage {
  private storagePath: string;

  constructor(_opts: KeyValueStorageOptions) {
    this.storagePath = path.join(os.tmpdir(), 'hosting-cache');
  }

  async set(key: string, value: NonNullable<unknown> | null): Promise<void> {
    await fs.ensureDir(this.storagePath);

    if (value === null) {
      logger.info(`[key-value-storage] Delete ${key}`);
      await fs.unlink(path.join(this.storagePath, key));
      return;
    }

    const data = JSON.stringify({
      lastModified: Date.now(),
      value,
    });

    logger.info(`[key-value-storage] Set ${key}`);
    await fs.writeFile(path.join(this.storagePath, key), data, 'utf8');
  }

  async get(key: string): Promise<NonNullable<unknown> | null> {
    logger.info(`[key-value-storage] Get ${key}`);

    try {
      await fs.access(path.join(this.storagePath, key));
      const raw = await fs.readFile(path.join(this.storagePath, key), 'utf8');
      return JSON.parse(raw);
    } catch (error: unknown) {
      logger.error(`[key-value-storage] Get ${key} failed`, error);
      return null;
    }
  }

  async revalidateTag(tag: string): Promise<void> {
    logger.info(`[key-value-storage] Revalidate tag ${tag}`);
    await fs.unlink(path.join(this.storagePath, tag));
  }
}
