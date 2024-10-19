export const createSuccessResponse = <T extends any>(data: T | null = null, message: string = 'Operation successful') => {
    return {
        success: true,
        data,
        message
    };
};

export const createErrorResponse = (message: string = 'Operation failed') => {
    return {
        success: false,
        data: null,
        message
    };
};
