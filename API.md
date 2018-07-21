<a name="HotPatcher"></a>

## HotPatcher
Hot patching manager class

**Kind**: global class  

* [HotPatcher](#HotPatcher)
    * [.configuration](#HotPatcher+configuration) : <code>Object</code>
    * [.getEmptyAction](#HotPatcher+getEmptyAction) : <code>String</code>
    * [.control(target, [allowTargetOverrides])](#HotPatcher+control) ⇒ [<code>HotPatcher</code>](#HotPatcher)
    * [.execute(key, ...args)](#HotPatcher+execute) ⇒ <code>\*</code>
    * [.get(key)](#HotPatcher+get) ⇒ <code>function</code> \| <code>null</code>
    * [.patch(key, method, [boundThis])](#HotPatcher+patch) ⇒ [<code>HotPatcher</code>](#HotPatcher)
    * [.setFinal(key)](#HotPatcher+setFinal) ⇒ [<code>HotPatcher</code>](#HotPatcher)

<a name="HotPatcher+configuration"></a>

### hotPatcher.configuration : <code>Object</code>
Configuration object reference

**Kind**: instance property of [<code>HotPatcher</code>](#HotPatcher)  
**Read only**: true  
<a name="HotPatcher+getEmptyAction"></a>

### hotPatcher.getEmptyAction : <code>String</code>
The action to take when a non-set method is requested
Possible values: null/throw

**Kind**: instance property of [<code>HotPatcher</code>](#HotPatcher)  
<a name="HotPatcher+control"></a>

### hotPatcher.control(target, [allowTargetOverrides]) ⇒ [<code>HotPatcher</code>](#HotPatcher)
Control another hot-patcher instance
Force the remote instance to use patched methods from calling instance

**Kind**: instance method of [<code>HotPatcher</code>](#HotPatcher)  
**Returns**: [<code>HotPatcher</code>](#HotPatcher) - Returns self  
**Throws**:

- <code>Error</code> Throws if the target is invalid


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| target | [<code>HotPatcher</code>](#HotPatcher) |  | The target instance to control |
| [allowTargetOverrides] | <code>Boolean</code> | <code>false</code> | Allow the target to override patched methods on the controller (default is false) |

<a name="HotPatcher+execute"></a>

### hotPatcher.execute(key, ...args) ⇒ <code>\*</code>
Execute a patched method

**Kind**: instance method of [<code>HotPatcher</code>](#HotPatcher)  
**Returns**: <code>\*</code> - The output of the called method  
**See**: HotPatcher#get  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The method key |
| ...args | <code>\*</code> | Arguments to pass to the method (optional) |

<a name="HotPatcher+get"></a>

### hotPatcher.get(key) ⇒ <code>function</code> \| <code>null</code>
Get a method for a key

**Kind**: instance method of [<code>HotPatcher</code>](#HotPatcher)  
**Returns**: <code>function</code> \| <code>null</code> - Returns the requested function or null if the function
does not exist and the host is configured to return null (and not throw)  
**Throws**:

- <code>Error</code> Throws if the configuration specifies to throw and the method
does not exist
- <code>Error</code> Throws if the `getEmptyAction` value is invalid


| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The method key |

<a name="HotPatcher+patch"></a>

### hotPatcher.patch(key, method, [boundThis]) ⇒ [<code>HotPatcher</code>](#HotPatcher)
Patch a method name

**Kind**: instance method of [<code>HotPatcher</code>](#HotPatcher)  
**Returns**: [<code>HotPatcher</code>](#HotPatcher) - Returns self  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| key | <code>String</code> |  | The method key to patch |
| method | <code>function</code> |  | The function to set |
| [boundThis] | <code>\*</code> | <code></code> | The 'this' value to use for the method invocation (optional) |

<a name="HotPatcher+setFinal"></a>

### hotPatcher.setFinal(key) ⇒ [<code>HotPatcher</code>](#HotPatcher)
Set a method as being final
This sets a method as having been finally overridden. Attempts at overriding
again will fail with an error.

**Kind**: instance method of [<code>HotPatcher</code>](#HotPatcher)  
**Returns**: [<code>HotPatcher</code>](#HotPatcher) - Returns self  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The key to make final |

