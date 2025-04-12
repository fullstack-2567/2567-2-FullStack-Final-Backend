export const getMonthIfNotSpecified = (month?: string) => {
  if (!month) {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }
  return month;
};
