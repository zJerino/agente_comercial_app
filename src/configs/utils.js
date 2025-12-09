/**
 * Manejador json
 * Esto se encarga de manejar json
 */
export function tryParseJSON(value) {
    if (typeof value !== "string") {
        return null;
    }
    try {
        const parsed = JSON.parse(value);
        return parsed;
    } catch (e) {
        return null;
    }
}