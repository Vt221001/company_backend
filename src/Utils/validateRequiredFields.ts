export const validateRequiredFields = (
    body: Record<string, any>,
    requiredFields: string[]
) => {
    return requiredFields.filter((field) => {
        const value = body[field];

        if (Array.isArray(value)) {
            return value.length === 0;
        }

        return (
            value === undefined ||
            value === null ||
            value === ""
        );
    });
};