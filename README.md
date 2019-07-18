# Mutually Exclusive Functions
Mutually exclusive execution of your JavaScript functions.

## Why?

Consider the following situation:

```js

function mockAsyncOperation({seconds}) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 1000);
  });
}

let resource = 0;

async function f() {
  let snapshot = resource;
  
  await mockAsyncOperation({seconds: 1});
  
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

Why did this happen? While JavScript is single threaded, any `await` statement is a window for JavaScript to execute other code while the async operation is awaiting completion; In this case, it was `inc`.

In other words, for any `async` function, between an `await` statement and the next statement, any code can execute:

```js
async function f() {
  ...
  await something;
  <any code can execute here...>
  rest_of_code();
  ...
}
```
and this "interleaving" of code can lead to race conditions, as seen before. Furthermore, it is impossible in practice to predict what code is going to execute at that window.

Consider a more real-world example:

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
here, `inc` is trying to increment a value in the database, while `dec` is trying to decrement it. Both will compete and it is very possible that the following order of operations happens:

```
inc reads 1
dec reads 1
inc writes 2
dec writes 0
```
while the intended behavior would be that the two `inc` and `dec` operations cancel out, leaving `value` with `1` as it started.


In this case and other cases it can be the solution to make sure that competing functions execute one at a time, or what can be called *mutually exclusive execution* of the functions. This is the solution offered by this library.

## Installation

```
npm i mutually-exclusive-functions
```

## Usage

```js
const { exclude, unexclude } require("mutually-exclusive-functions");

async function f1() {};
async function f2() {};
async function f3() {};

[f1, f2, f3] = exclude([f1, f2, f3]);

//and now f1, f2, f3 will execute one at a time, 
//making them safe from race conditions as described above
