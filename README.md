# Mutually Exclusive Functions
Mutually exclusive execution of your JavaScript functions.

## Why?

>*Please note that all these examples are for illustration of concepts and functionality only, and not provided as valid use cases. You have to come up with your own use cases.*

Consider the following situation:

```js

function mockAsyncOperation() {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 1000);
  });
}

let resource = 0;

async function f() {
  let snapshot = resource;
  
  await mockAsyncOperation();
  
  if (snapshot !== resource) {
    throw new Error("race condition");
  }
}

function inc() {
  resource++;
}

f();
inc();
```

here, `f` reads a copy of `resource`, awaits an async operation, then compares its copy with the original; they don't match and a race condition error is thrown. 

Why did this happen? While JavScript is single threaded, any `await` statement is a window for JavaScript to execute other code while your code is awaiting; In this case, the other code was `inc`.

In other words, for any `async` function, inbetween an `await` statement and the next statement, any code can execute:

```js
async function f() {
  ...
  await something;
  //<any code can execute here...>
  rest_of_code();
  //...
}
```
and this "interleaving" of code can lead to race conditions, as seen before.

Furthermore, it is impractical (and frequently impossible) to predict what code is going to execute at that window.

Consider another example:

```js

// starting value is 1

async function inc() {
  let value = await readFromDataBase({id: 1}); 
  await writeToDataBase({id: 1}, ++value);
}

async function dec() {
  let value = await readFromDataBase({id: 1});
  await writeToDataBase({id: 1}, --value);
}

inc();
dec();
```
Here, `inc` is trying to increment a value in the database, while `dec` is trying to decrement it. Both will compete and it is very possible that the following order of operations happens:

```
inc reads 1
dec reads 1
inc writes 2
dec writes 0
```

and this is not what we wanted to happen.


In these cases, it *might* be the solution to make sure that competing functions execute one at a time, or what can be called *mutually exclusive execution of the functions*. This is the solution offered by this package.



## Installation

```
npm i mutually-exclusive-functions
```

## How to Use

### Basic Usage

```js
const { exclude } = require("mutually-exclusive-functions");

async function f1() {};
async function f2() {};
async function f3() {};

[f1, f2, f3] = exclude([f1, f2, f3]);
```
the versions of f1, f2, and f3 returned will execute in a mutually exclusive way.

### Advanced Usage

*Documentation coming soon, covering cases including functions belonging to two or more exclusion sets, execution dependencies between excluded functions, and cases of recursion.*

## API

| export | in | desc | out | desc |
|-|-|-|-|-|
| exclude | `[Function]` | The functions to be excluded. | `[Function]` | The excluded version of the functions, ordered the same as in `in`.
| unexclude | `Function` or `[Function]` | The excluded function(s) to be reverted to its(their) state before the last exclude was applied. | `Function` or `[Function]` | The unexcluded (or reverted) version of the function(s) (ordered the same as in `in`).


## Notes

* Uses the JavaScript [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) API under the hood.
* It is worth mentioning that this library is tiny, using only 32 lines of code.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.