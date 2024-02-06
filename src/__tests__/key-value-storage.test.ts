import KeyValueStorage from '../key-value-storage';

describe('KeyValueStorage', () => {
  const keyValueStorage = new KeyValueStorage({});

  it('should set and get value', async () => {
    const key = 'key';
    const value = 'value';

    await keyValueStorage.set(key, value);
    expect(await keyValueStorage.get(key)).toBe(value);
  });
});
