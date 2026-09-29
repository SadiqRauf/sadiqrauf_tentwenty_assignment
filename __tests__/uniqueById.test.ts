import { uniqueById } from '../src/utils/uniqueById';

describe('uniqueById', () => {
  it('keeps the first occurrence and preserves order', () => {
    const items = [
      { id: 1, v: 'a' },
      { id: 2, v: 'b' },
      { id: 1, v: 'c' },
      { id: 3, v: 'd' },
    ];
    expect(uniqueById(items)).toEqual([
      { id: 1, v: 'a' },
      { id: 2, v: 'b' },
      { id: 3, v: 'd' },
    ]);
  });

  it('returns an empty array for empty input', () => {
    expect(uniqueById([])).toEqual([]);
  });
});
