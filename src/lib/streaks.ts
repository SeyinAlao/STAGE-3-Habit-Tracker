export function calculateCurrentStreak(completions: string[], today?: string): number {
  const todayStr = today || new Date().toISOString().split('T')[0];
  const uniqueDates = Array.from(new Set(completions));

  if (!uniqueDates.includes(todayStr)) {
    return 0;
  }

  uniqueDates.sort((a, b) => b.localeCompare(a));

  let streak = 0;
  
  const currentDate = new Date(`${todayStr}T00:00:00Z`);

  while (true) {
    const dateToCheck = currentDate.toISOString().split('T')[0];
    
    if (uniqueDates.includes(dateToCheck)) {
      streak++;
      currentDate.setUTCDate(currentDate.getUTCDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}