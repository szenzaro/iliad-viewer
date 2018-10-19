import * as equal from 'fast-deep-equal';

/**
 * Declares a property stored in a subject.
 *
 * Read/write accesses to the property are automatically forwarded to the subject.
 *
 * `InSubject` takes an optional parameter that specifies the name
 * of the property in which the data should be stored. When not provided,
 * the name of the decorated property suffixed with `Change` is used.
 *
 */
export function InSubject(subjectKey?: string): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        subjectKey = subjectKey || `${propertyKey.toString()}Change`;
        const prop = Object.getOwnPropertyDescriptor(target, propertyKey);
        if (prop) {
            console.warn(`The field '${target.constructor.name}.${propertyKey.toString()}' has a non-trivial property definition`);
            return;
        }
        Object.defineProperty(target, propertyKey, {
            get() {
                if ('value' in this[subjectKey]) {
                    return this[subjectKey].value;
                } else {
                    throw new Error(`${propertyKey.toString()} can only be set on ${this}`);
                }
            },
            set(v) {
                if (!('value' in this[subjectKey]) || !equal(this[subjectKey].value, v)) {
                    this[subjectKey].next(v);
                }
            },
            enumerable: true,
            configurable: true,
        });
    };
}
