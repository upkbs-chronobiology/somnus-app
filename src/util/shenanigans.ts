/**
 * Force casting if `x as Y` doesn't work because types are actually incompatible.
 * This is a dark hack and not recommended unless you know what you're doing.
 * Don't try this at home.
 */
export function cast<T>(obj): T {
    return obj as T;
}
