const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Returns true if the value is a non-empty string that matches UUID v4 format.
 */
export function isValidUUID(value: unknown): value is string {
    return typeof value === 'string' && value.length > 0 && UUID_REGEX.test(value);
}
