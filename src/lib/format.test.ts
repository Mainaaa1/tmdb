import { describe, expect, it } from 'vitest';
import { formatRating, formatRuntime } from '@/lib/format';

describe('format helpers', () => {
  it('formats runtime and ratings', () => {
    expect(formatRuntime(125)).toBe('2h 5m');
    expect(formatRating(7.34)).toBe('7.3');
  });
});
