const HOT_PATCHER_TYPE = "@@HOTPATCHER";
const NOOP = () => {};

function createNewItem(method, boundThis) {
    return {
        method,
        boundThis,
        final: false
    };
}

/**
 * Hot patching manager class
 */
class HotPatcher {
    constructor() {
        this._configuration = {
            registry: {},
            getEmptyAction: "null"
        };
        this.__type__ = HOT_PATCHER_TYPE;
    }

    /**
     * Configuration object reference
     * @type {Object}
     * @memberof HotPatcher
     * @readonly
     */
    get configuration() {
        return this._configuration;
    }

    /**
     * The action to take when a non-set method is requested
     * Possible values: null/throw
     * @type {String}
     * @memberof HotPatcher
     */
    get getEmptyAction() {
        return this.configuration.getEmptyAction;
    }

    set getEmptyAction(newAction) {
        this.configuration.getEmptyAction = newAction;
    }

    /**
     * Control another hot-patcher instance
     * Force the remote instance to use patched methods from calling instance
     * @param {HotPatcher} target The target instance to control
     * @param {Boolean=} allowTargetOverrides Allow the target to override patched methods on
     * the controller (default is false)
     * @memberof HotPatcher
     * @returns {HotPatcher} Returns self
     * @throws {Error} Throws if the target is invalid
     */
    control(target, allowTargetOverrides = false) {
        if (!target || target.__type__ !== HOT_PATCHER_TYPE) {
            throw new Error(
                "Failed taking control of target HotPatcher instance: Invalid type or object"
            );
        }
        Object.keys(target.configuration.registry).forEach(foreignKey => {
            if (this.configuration.registry.hasOwnProperty(foreignKey)) {
                if (allowTargetOverrides) {
                    this.configuration.registry[foreignKey] = Object.assign(
                        {},
                        target.configuration.registry[foreignKey]
                    );
                }
            } else {
                this.configuration.registry[foreignKey] = Object.assign(
                    {},
                    target.configuration.registry[foreignKey]
                );
            }
        });
        target._configuration = this.configuration;
        return this;
    }

    /**
     * Execute a patched method
     * @param {String} key The method key
     * @param {...*} args Arguments to pass to the method (optional)
     * @memberof HotPatcher
     * @see HotPatcher#get
     * @returns {*} The output of the called method
     */
    execute(key, ...args) {
        const method = this.get(key) || NOOP;
        const boundThis =
            this.configuration.registry[key] && this.configuration.registry[key].boundThis !== null
                ? this.configuration.registry[key].boundThis
                : null;
        return method.apply(boundThis, args);
    }

    /**
     * Get a method for a key
     * @param {String} key The method key
     * @returns {Function|null} Returns the requested function or null if the function
     * does not exist and the host is configured to return null (and not throw)
     * @memberof HotPatcher
     * @throws {Error} Throws if the configuration specifies to throw and the method
     * does not exist
     * @throws {Error} Throws if the `getEmptyAction` value is invalid
     */
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

    /**
     * Patch a method name
     * @param {String} key The method key to patch
     * @param {Function} method The function to set
     * @param {*=} boundThis The 'this' value to use for the method invocation (optional)
     * @memberof HotPatcher
     * @returns {HotPatcher} Returns self
     */
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

    /**
     * Set a method as being final
     * This sets a method as having been finally overridden. Attempts at overriding
     * again will fail with an error.
     * @param {String} key The key to make final
     * @memberof HotPatcher
     * @returns {HotPatcher} Returns self
     */
    setFinal(key) {
        if (!this.configuration.registry.hasOwnProperty(key)) {
            throw new Error(`Failed marking '${key}' as final: No method found for key`);
        }
        this.configuration.registry[key].final = true;
        return this;
    }
}

module.exports = HotPatcher;
