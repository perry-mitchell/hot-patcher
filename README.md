# Hot-Patch
> Hot method patching framework for handling environmental method differences

[![Build Status](https://travis-ci.org/perry-mitchell/hot-patch.svg?branch=master)](https://travis-ci.org/perry-mitchell/hot-patch)

## About
Hot-Patch provides a simple API to manage patched methods. I found while writing [Buttercup](https://buttercup.pw) that managing overwritten methods between environments (Node/Browser/React-Native) was becoming cumbersome, and having a single _agreed-upon_ method of doing so was the best way to go.

## Usage
Hot-Patch is a class and can simply be instantiated:

```javascript
const HotPatch = require("hot-patch");

const hp = new HotPatch();
```

Of course, it'd be more useful if it were centrally located to allow for easy patching (such as with a library):

```javascript
const HotPatch = require("hot-patch");

let __sharedPatcher;

function getSharedPatcher() {
    if (!__sharedPatcher) {
        __sharedPatcher = new HotPatch();
    }
    return __sharedPatcher;
}

module.exports = {
    getSharedPatcher
};
```

Patch methods when required:

```javascript
// Get the patcher instance (the following is just an example, and a new instance
// could just as easily have been created here):
const { getSharedPatcher } = require("./patching.js");

/**
 * Generate a random string
 * This should be overridden/patched on different platforms
 */
function generateRandomString(length) {
    // ... implementation skipped
}

getSharedPatcher().patch("randomString", generateRandomString);

// Still export such methods for testing etc.
module.exports = {
    generateRandomString
};
```

Patched methods can easily be fetched later:

```javascript
const { getSharedPatcher } = require("./patching.js");

const randomString = getSharedPatcher().get("randomString");
randomString(5); // Generates a random string

// Or, execute the method directly:
getSharedPatcher().execute("randomString", 5) // Generates a random string
```

### Use Sparingly
The intention of Hot-Patch is not to push every method into a patching instance, but to provide a common API for specific methods which _require_ patching in some specific environments or in situations where users/consumers are expected to provide their own custom implementations.
