/**
 * Validates date format (YYYY-MM-DD)
 */
export function isValidDateFormat(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        return false;
    }
    
    const parsedDate = new Date(date);
    return !Number.isNaN(parsedDate.getTime());
}

/**
 * Gets the first day of the previous month in YYYY-MM-DD format
 */
export function getPreviousMonthStart(): string {
    const now = new Date();
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const year = previousMonth.getFullYear();
    const month = String(previousMonth.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}-01`;
}

/**
 * Gets the last day of the next month in YYYY-MM-DD format
 */
export function getNextMonthEnd(): string {
    const now = new Date();
    // Get the last day of next month
    // nextMonth + 1, day 0 gives last day of nextMonth
    const nextMonthLastDay = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    const year = nextMonthLastDay.getFullYear();
    const month = String(nextMonthLastDay.getMonth() + 1).padStart(2, '0');
    const day = String(nextMonthLastDay.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
