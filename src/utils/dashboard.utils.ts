export const getMonthIfNotSpecified = (month?: string) => {
  if (!month) {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }
  return month;
};

export const getDateRange = (month: string) => {
  const [year, monthNum] = month.split('-');
  const startDate = new Date(`${year}-${monthNum}-01`);
  const endDate = new Date(parseInt(year), parseInt(monthNum), 0); // Last day of the month
  return { startDate, endDate };
};
