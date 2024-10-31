interface APIResponse {
    success: boolean;
    message: string;
    data: unknown;
}

export const createSuccessResponse = <T extends any>(
    data: T | null = null,
    message: string = 'Operation successful'
): APIResponse => {
    return {
        success: true,
        data,
        message
    };
};

export const createErrorResponse = (
    message: string = 'Operation failed',
    data: unknown = null
): APIResponse => {
    return {
        success: false,
        data,
        message
    };
};
