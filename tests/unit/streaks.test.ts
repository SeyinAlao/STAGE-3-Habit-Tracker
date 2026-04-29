import { describe, it, expect } from 'vitest';
import { calculateCurrentStreak } from '@/lib/streaks';

describe('calculateCurrentStreak', () => {
  it('returns 0 when completions is empty', () => {
    expect(calculateCurrentStreak([], '2023-10-15')).toBe(0);
  });

  it('returns 0 when today is not completed', () => {
    expect(calculateCurrentStreak(['2023-10-14'], '2023-10-15')).toBe(0);
  });

  it('returns the correct streak for consecutive completed days', () => {
    expect(calculateCurrentStreak(['2023-10-15', '2023-10-14', '2023-10-13'], '2023-10-15')).toBe(3);
  });

  it('ignores duplicate completion dates', () => {
    expect(calculateCurrentStreak(['2023-10-15', '2023-10-15', '2023-10-14'], '2023-10-15')).toBe(2);
  });

  it('breaks the streak when a calendar day is missing', () => {
    expect(calculateCurrentStreak(['2023-10-15', '2023-10-13'], '2023-10-15')).toBe(1);
  });
});