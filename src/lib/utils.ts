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
