import { columnsFor } from '../src/hooks/useResponsiveLayout';

describe('columnsFor', () => {
  it('fits as many columns as the minimum width allows, within bounds', () => {
    expect(columnsFor(335, 320, 3)).toBe(1); // phone portrait
    expect(columnsFor(678, 320, 3)).toBe(2); // phone landscape
    expect(columnsFor(1300, 320, 3)).toBe(3); // tablet, capped
  });

  it('never returns zero or a non-number', () => {
    expect(columnsFor(100, 320, 3)).toBe(1);
    expect(columnsFor(NaN, 320, 3)).toBe(1);
    expect(columnsFor(500, 0, 3)).toBe(3);
  });
});
