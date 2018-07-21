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
        this._configuration = {
            registry: {},
            getEmptyAction: "null"
        };
    }

    get configuration() {
        return this._configuration;
    }

    get getEmptyAction() {
        return this.configuration.getEmptyAction;
    }

    set getEmptyAction(newAction) {
        this.configuration.getEmptyAction = newAction;
    }

    execute(key, ...args) {
        const method = this.get(key) || NOOP;
        const boundThis =
            this.configuration.registry[key] && this.configuration.registry[key].boundThis !== null
                ? this.configuration.registry[key].boundThis
                : null;
        return method.apply(boundThis, args);
    }

    get(key) {
        const item = this.configuration.registry[key];
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
        if (this.configuration.registry[key] && this.configuration.registry[key].final) {
            throw new Error(`Failed patching '${key}': Method marked as being final`);
        }
        if (typeof method !== "function") {
            throw new Error(`Failed patching '${key}': Provided method is not a function`);
        }
        this.configuration.registry[key] = createNewItem(method, boundThis);
        return this;
    }

    setFinal(key) {
        if (!this.configuration.registry.hasOwnProperty(key)) {
            throw new Error(`Failed marking '${key}' as final: No method found for key`);
        }
        this.configuration.registry[key].final = true;
        return this;
    }
}

module.exports = HotPatch;
