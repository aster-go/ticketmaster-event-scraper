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
