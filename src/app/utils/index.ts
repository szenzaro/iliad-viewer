export interface Map<T> {
    [key: string]: T;
}

export function arrayToMap<T, K extends keyof T>(arr: T[], key: K): Map<T> {
    const map: Map<T> = {};
    arr.forEach((x) => map[x[`${key}`]] = x);
    return map;
}

export function uuid(prefix?: string): string {
    return !!prefix ? `${prefix}-${Math.random()}` : `${Math.random()}`;
}
