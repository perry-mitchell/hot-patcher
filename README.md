# Hot-Patcher
> Hot method patching framework for handling environmental method differences

[![Build Status](https://travis-ci.org/perry-mitchell/hot-patcher.svg?branch=master)](https://travis-ci.org/perry-mitchell/hot-patcher)

## About
Hot-Patcher provides a simple API to manage patched methods. I found while writing [Buttercup](https://buttercup.pw) that managing overwritten methods between environments (Node/Browser/React-Native) was becoming cumbersome, and having a single _agreed-upon_ method of doing so was the best way to go.

Check out the [API documentation](API.md).

## Installation
Install Hot-Patcher from [npm](https://www.npmjs.com/package/hot-patcher):

```shell
npm install hot-patcher --save
```

## Usage
Hot-Patcher is a class and can simply be instantiated:

```javascript
const HotPatcher = require("hot-patcher");

const hp = new HotPatcher();
```

Of course, it'd be more useful if it were centrally located to allow for easy patching (such as with a library):

```javascript
const HotPatch = require("hot-patcher");

let __sharedPatcher;

function getSharedPatcher() {
    if (!__sharedPatcher) {
        __sharedPatcher = new HotPatcher();
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
The intention of Hot-Patcher is not to push every method into a patching instance, but to provide a common API for specific methods which _require_ patching in some specific environments or in situations where users/consumers are expected to provide their own custom implementations.
