// columnSizeUtils.js

/**
 * Validates column sizes stored in localStorage against the provided columns.
 * Removes any entries that do not correspond to a valid column field.
 */
export const validateColumnSizes = (defaultColumns) => {
    const savedSizesRaw = localStorage.getItem("columnSizes");
    if (!savedSizesRaw) return;

    try {
        const savedSizes = JSON.parse(savedSizesRaw);
        const validFields = new Set(
            defaultColumns.map((column) => column.field),
        );
        const validatedSizes = Object.entries(savedSizes).reduce(
            (acc, [field, size]) => {
                if (validFields.has(field)) {
                    acc[field] = size;
                }
                return acc;
            },
            {},
        );

        localStorage.setItem("columnSizes", JSON.stringify(validatedSizes));
    } catch (error) {
        console.error("Error validating column sizes:", error);
        localStorage.removeItem("columnSizes"); // Optionally clear if corrupt
    }
};

/**
 * Applies saved column sizes to the default columns.
 */
export const applySavedColumnSizes = (defaultColumns) => {
    const savedSizesRaw = localStorage.getItem("columnSizes");
    if (!savedSizesRaw) return defaultColumns;

    try {
        const savedSizes = JSON.parse(savedSizesRaw);
        return defaultColumns.map((column) => ({
            ...column,
            width: savedSizes[column.field] || column.width,
        }));
    } catch (error) {
        console.error(
            "Failed to apply saved column sizes, using default:",
            error,
        );
        return defaultColumns;
    }
};
