export function getStableProgressEndDate() {
  const now = new Date();
  const endOfDayUtc = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999),
  );

  return endOfDayUtc.toISOString();
}

export function subtractMonths(dateIso: string, months: number) {
  const nextDate = new Date(dateIso);
  nextDate.setMonth(nextDate.getMonth() - months);
  return nextDate.toISOString();
}
