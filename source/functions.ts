import { PatchFn } from "./types.js";

export function sequence<T>(...methods: Array<PatchFn<T>>): (...args: Array<any>) => T {
    if (methods.length === 0) {
        throw new Error("Failed creating sequence: No functions provided");
    }
    return function __executeSequence(...args: Array<any>): T {
        let result = args;
        const _this = this;
        while (methods.length > 0) {
            const method = methods.shift();
            result = [method.apply(_this, result)];
        }
        return result[0];
    };
}
