import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { logger } from './utils/logger';
import * as crypto from 'crypto';

type Framework = 'next' | 'nuxt';

export type KeyValueStorageOptions = {
  // The path to the storage directory
  storagePath?: string;
  framework?: Framework;
};

export default class KeyValueStorage {
  private storagePath: string;
  private opts: KeyValueStorageOptions;

  constructor(opts: KeyValueStorageOptions) {
    this.storagePath = path.join(os.tmpdir(), 'hosting-cache');
    this.opts = opts;
  }

  async set(key: string, value: NonNullable<unknown> | null): Promise<void> {
    await fs.ensureDir(this.storagePath);

    const keyHash = crypto.createHash('sha256').update(key).digest('hex');

    if (value === null) {
      logger.info(`[key-value-storage] Delete ${keyHash}`);
      await fs.unlink(path.join(this.storagePath, keyHash));
      return;
    }

    const data = this.wrapData(value);

    logger.info(`[key-value-storage] Set ${keyHash}`);
    await fs.writeFile(path.join(this.storagePath, keyHash), data, 'utf8');
  }

  async get(key: string): Promise<NonNullable<unknown> | null> {
    logger.info(`[key-value-storage] Get ${key}`);
    const keyHash = crypto.createHash('sha256').update(key).digest('hex');
    try {
      await fs.access(path.join(this.storagePath, keyHash));
      const raw = await fs.readFile(path.join(this.storagePath, keyHash), 'utf8');
      return JSON.parse(raw);
    } catch (error: unknown) {
      logger.error(`[key-value-storage] Get ${keyHash} failed`, error);
      return null;
    }
  }

  async revalidateTag(tag: string): Promise<void> {
    logger.info(`[key-value-storage] Revalidate tag ${tag}`);
    await fs.unlink(path.join(this.storagePath, tag));
  }

  private wrapData(data: unknown): string {
    if (this.opts.framework === 'next') {
      return JSON.stringify({
        lastModified: Date.now(),
        value: data,
      });
    } else {
      return JSON.stringify(data);    
    }
  }
}
