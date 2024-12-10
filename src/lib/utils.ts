type SafeTryResult<T> = [T, null] | [null, unknown];

export async function safeTry<T>(
    fn: () => T | Promise<T>
): Promise<SafeTryResult<T>> {
    try {
        const result = await fn();
        return [result, null];
    } catch (error) {
        console.error('SafeTryLogger: ', error);
        return [null, error];
    }
}

// Function to check if a string is a valid date string
export function isValidDateString(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime()); // Validates if the date is not an invalid date (NaN)
}

// Function to check if a string is a date range in the format {date}-{date}
export function isDateRange(dateRange: string): boolean {
    const dateRangePattern = /^\s*(.+)\s*-\s*(.+)\s*$/; // Matches the pattern {date}-{date}
    const match = dateRange.match(dateRangePattern);

    if (match) {
        const [_, startDate, endDate] = match; // Extract the two date parts
        return isValidDateString(startDate) && isValidDateString(endDate); // Check if both parts are valid dates
    }

    return false; // If the pattern doesn't match
}
