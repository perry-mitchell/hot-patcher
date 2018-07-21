const NOOP = () => {};

function createNewItem(method, boundThis) {
    return {
        method,
        boundThis,
        final: false
    };
}

class HotPatch {
    constructor() {
        this._registry = {};
        this.getEmptyAction = "null";
    }

    execute(key, ...args) {
        const method = this.get(key) || NOOP;
        const boundThis =
            this._registry[key] && this._registry[key].boundThis !== null
                ? this._registry[key].boundThis
                : null;
        return method.apply(boundThis, args);
    }

    get(key) {
        const item = this._registry[key];
        if (!item) {
            switch (this.getEmptyAction) {
                case "null":
                    return null;
                case "throw":
                    throw new Error(
                        `Failed handling method request: No method provided for override: ${key}`
                    );
                default:
                    throw new Error(
                        `Failed handling request which resulted in an empty method: Invalid empty-action specified: ${
                            this.getEmptyAction
                        }`
                    );
            }
        }
        return item.method;
    }

    patch(key, method, boundThis = null) {
        if (this._registry[key] && this._registry[key].final) {
            throw new Error(`Failed patching '${key}': Method marked as being final`);
        }
        if (typeof method !== "function") {
            throw new Error(`Failed patching '${key}': Provided method is not a function`);
        }
        this._registry[key] = createNewItem(method, boundThis);
        return this;
    }

    setFinal(key) {
        if (!this._registry.hasOwnProperty(key)) {
            throw new Error(`Failed marking '${key}' as final: No method found for key`);
        }
        this._registry[key].final = true;
        return this;
    }
}

module.exports = HotPatch;
