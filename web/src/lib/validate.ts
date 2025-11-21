export function isValidEmail(s: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.endsWith("@ohsu.edu");
}