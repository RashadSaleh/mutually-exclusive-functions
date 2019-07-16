# Mutually Exclusive Functions
Mutually exclusive execution of your JavaScript functions.

## Usage

### Basic Example

*setting things up*

```js
const exclude = require("mutually-exclusive-functions");

async function slow() {
  console.log("slow started...");
  await delay(4);  //delay of 4 seconds.
  console.log("...slow finished");
}

async function fast() {
  console.log("fast started...");
  await delay(2); //delay of 2 seconds.
  console.log("...fast finished");
}

async function very_fast() {
  console.log("very fast started...");
  await delay(0.5); //delay of 0.5 seconds.
  console.log("...very fast finished");
}
```

Now if you execute:

```js
slow();
fast();
very_fast();
```

You will get:

```
slow started...
fast started...
very fast started...
...very fast finished
...fast finished
...slow finished
```

This means that all 3 are executing together. But if we:

```js
[slow, fast, very_fast] = exclude([slow, fast, very_fast]);

slow();
fast();
very_fast();
```

You will get:

```
slow started...
...slow finished
fast started...
...fast finished
very fast started...
...very fast finished
```

meaning all other functions wait for the one executing to finish before they start to execute.


