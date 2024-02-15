import { logger } from './utils/logger';
import * as crypto from 'crypto';
import axios from 'axios';

type Framework = 'next' | 'nuxt';

export type KeyValueStorageOptions = {
  framework?: Framework;
};

export default class KeyValueStorage {
  private baseUrl: string;
  private opts: KeyValueStorageOptions;

  constructor(opts: KeyValueStorageOptions) {
    this.baseUrl = 'http://127.0.0.1:8888';
    this.opts = opts;
  }

  async set(key: string, value: NonNullable<unknown> | null): Promise<void> {
    const keyHash = crypto.createHash('sha256').update(key).digest('hex');
    const data = this.wrapData(value);

    logger.info(`[key-value-storage] Set ${key}`);
    await axios.post(`${this.baseUrl}/set`, {
      key: keyHash, 
      data
    });
  }

  async get(key: string): Promise<NonNullable<unknown> | null> {
    logger.info(`[key-value-storage] Get ${key}`);
    const keyHash = crypto.createHash('sha256').update(key).digest('hex');
    try {
      return JSON.parse((await axios.get(`${this.baseUrl}/get/${keyHash}`)).data);
    } catch (error: unknown) {
      logger.error(`[key-value-storage] Get ${key} failed`, error);
      return null;
    }
  }

  async revalidateTag(tag: string): Promise<void> {
    logger.info(`[key-value-storage] Revalidate tag ${tag}`);
  }

  private wrapData(data: unknown): string {
    return this.opts.framework === 'next' ? JSON.stringify({
      lastModified: Date.now(),
      value: data,
    }) : JSON.stringify(data);
  }
}
