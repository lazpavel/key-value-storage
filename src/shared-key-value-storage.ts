import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { logger } from './utils/logger';

export type SharedKeyValueStorageOptions = {
  // The path to the storage directory
  storagePath?: string;
};

export default class SharedKeyValueStorage {
  private storagePath: string;

  constructor(_opts: SharedKeyValueStorageOptions) {
    this.storagePath = path.join(os.tmpdir(), 'hosting-cache');
  }

  async set(key: string, value: string): Promise<void> {
    await fs.ensureDir(this.storagePath);
    await fs.writeFile(path.join(this.storagePath, key), value);

    logger.info(`[shared-key-value-storage] Set ${key} to ${value}`);
  }

  async get(key: string): Promise<string> {
    logger.info(`[shared-key-value-storage] Get ${key}`);
    return fs.readFile(path.join(this.storagePath, key), 'utf8');
  }

  async revalidateTag(tag: string): Promise<void> {
    logger.info(`[shared-key-value-storage] Revalidate tag ${tag}`);
    await fs.unlink(path.join(this.storagePath, tag));
  }
}
