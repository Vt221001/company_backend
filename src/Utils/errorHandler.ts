class ApiError extends Error {
    statusCode: number;
    errors: unknown[];
    success: boolean;

    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        errors: unknown[] = [],
        stack: string = ""
    ) {
        super(message);

        this.statusCode = statusCode;
        this.errors = errors;
        this.success = false;

        // Set the prototype explicitly
        Object.setPrototypeOf(this, ApiError.prototype);

        // Check if a custom stack trace is provided, else capture the default stack trace
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };