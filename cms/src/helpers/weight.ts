export function weight(value: number) {
    return `${Math.floor(value / 100) / 10}Ko`;
}