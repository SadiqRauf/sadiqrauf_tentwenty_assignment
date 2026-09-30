
jest.mock('react-native-mmkv', () => ({
  createMMKV: () => {
    const values = new Map();
    return {
      getString: key => values.get(key),
      set: (key, value) => values.set(key, value),
      remove: key => values.delete(key),
    };
  },
}));
