export function isValidEmail(s: string): boolean {
    return /^[^\s@]+@ohsu.edu$/.test(s);
}