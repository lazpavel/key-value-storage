import SharedKeyValueStorage from '../shared-key-value-storage';

describe('SharedKeyValueStorage', () => {
  const sharedKeyValueStorage = new SharedKeyValueStorage({});

  it('should set and get value', async () => {
    const key = 'key';
    const value = 'value';

    await sharedKeyValueStorage.set(key, value);
    expect(await sharedKeyValueStorage.get(key)).toBe(value);
  });
});
