# JavaScript Lead Engineer — 20 Interview Questions & Answers

## Q1. JavaScript Event Loop kya hai?

JavaScript execution primarily single-threaded hota hai, meaning ek main call stack hota hai.

Event Loop asynchronous work ko coordinate karta hai.

Basic flow:

```text
Call Stack
→ Async operation
→ Web/Node APIs
→ Queue
→ Event Loop
→ Call Stack
```

Example:

```js
console.log("A");
setTimeout(() => {
console.log("B");
}, 0);
console.log("C");
```

Output:

```text
A
C
B
```

Reason:
setTimeout callback immediately execute nahi hota. Current synchronous code complete hone ke baad callback queue se process hota hai.

---

## Q2. Microtask vs Macrotask?

Microtasks:

* Promise.then/catch/finally
* queueMicrotask
* MutationObserver browser mein

Macrotasks:

* setTimeout
* setInterval
* setImmediate in Node.js
* I/O callbacks

General execution:

```text
Synchronous code
→ Microtasks
→ Macrotask
→ Microtasks
→ Next macrotask
```

Example:

```js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
```

Output:

```text
A
D
C
B
```

---

## Q3. Node.js mein process.nextTick kya hai?

process.nextTick() callback ko current operation ke immediately baad schedule karta hai.

Example:

```js
console.log("A");
process.nextTick(() => console.log("B"));
Promise.resolve().then(() => console.log("C"));
console.log("D");
```

Node.js mein output generally:

```text
A
D
B
C
```

Important:
nextTick queue ko overuse karne se I/O starvation ho sakta hai.

Interview line:

“process.nextTick has very high priority in Node's scheduling behavior and excessive use can starve the event loop.”

---

## Q4. setImmediate vs setTimeout(0)?

setTimeout(fn, 0):
Timer phase mein eligible hone ke baad callback execute hota hai.

setImmediate(fn):
Node.js event loop ke check phase mein execute hota hai.

Important:
Exact ordering context-dependent ho sakti hai.

Especially I/O callback ke andar:

```text
I/O callback
→ setImmediate
→ setTimeout(0)
```

often observed.

Interview mein blindly mat bolo ki setImmediate always setTimeout se pehle execute hota hai.

---

## Q5. Closure kya hai?

Closure means function apne outer lexical scope ko remember karta hai, even after outer function execution complete ho jaye.

Example:

```js
function counter() {
let count = 0;
return function () {
count++;
return count;
};
}
const increment = counter();
increment(); // 1
increment(); // 2
```

Inner function `count` ko remember karta hai.

Uses:

* data privacy
* function factories
* callbacks
* memoization
* currying

---

## Q6. var, let, const difference?

```text
var:
```

* function scoped
* hoisted
* redeclaration allowed

```js
let:
```

* block scoped
* temporal dead zone
* reassignment allowed

```js
const:
```

* block scoped
* temporal dead zone
* reassignment not allowed

Important:

const object immutable nahi banata.

```js
const user = {
name: "Sonu"
};
user.name = "Engineer";
```

Valid hai.

Reference change nahi kar sakte, object properties modify kar sakte ho.

---

## Q7. Hoisting kya hai?

JavaScript declarations ko execution se pehle environment mein register karta hai.

Example:

```js
console.log(a);
var a = 10;
```

Output:

```text
undefined
```

`let`/`const` bhi hoisted hote hain, but initialization se pehle access karne par Temporal Dead Zone ki wajah se error hota hai.

```js
console.log(a);
let a = 10;
```

ReferenceError.

Function declarations can be called before their declaration:

```js
sayHello();
function sayHello() {
console.log("Hello");
}
```

---

## Q8. `this` JavaScript mein kaise work karta hai?

`this` ka value mainly **how a function is called** par depend karta hai.

Object method:

```js
const user = {
name: "Sonu",
greet() {
console.log(this.name);
}
};
user.greet();
```

`this` → user.

Arrow functions ka apna `this` nahi hota. They capture lexical `this`.

Important:
Arrow function ko `call`, `apply`, `bind` se normal function ki tarah `this` rebind nahi kar sakte.

---

## Q9. call vs apply vs bind?

call:

```text
fn.call(obj, arg1, arg2);
```

apply:

```text
fn.apply(obj, [arg1, arg2]);
```

bind:

```js
const newFn = fn.bind(obj);
```

Difference:

```js
call → immediately execute
apply → immediately execute, arguments array mein
bind → new function return karta hai
```

---

## Q10. Promise kya hai?

Promise asynchronous operation ka eventual result represent karta hai.

States:

```text
Pending
→ Fulfilled
or
→ Rejected
```

Example:

```js
const promise = fetch("/api/users");
promise
.then(data => ...)
.catch(error => ...);
```

Promise itself asynchronous operation nahi hai; it represents the result/state of an asynchronous operation.

---

## Q11. async/await internally kya karta hai?

async function Promise return karti hai.

await Promise ko consume karne ka cleaner syntax provide karta hai.

Example:

```js
async function getUser() {
const response = await fetch("/api/user");
const user = await response.json();
return user;
}
```

Important:
await JavaScript thread ko block nahi karta.

It pauses that async function's continuation while allowing the event loop to handle other work.

---

## Q12. Promise.all vs Promise.allSettled?

Promise.all:

```js
const results = await Promise.all([
fetchUsers(),
fetchOrders(),
fetchProducts()
]);
```

Agar ek reject hua, Promise.all reject ho jayega.

Use when:
All operations successful hona required hai.

Promise.allSettled:

```js
const results = await Promise.allSettled([
fetchUsers(),
fetchOrders(),
fetchProducts()
]);
```

Sab promises complete hone ka wait karta hai.

Use when:
Har operation ka independent result chahiye.

---

## Q13. Sequential vs Parallel async operations?

Bad when independent:

```js
const users = await getUsers();
const products = await getProducts();
```

Total time roughly:

```text
users + products
```

If independent:

```js
const [users, products] = await Promise.all([
getUsers(),
getProducts()
]);
```

Total time roughly:

max(users, products)

Lead-level point:
“Independent I/O operations should generally be parallelized when there is no dependency between them.”

---

## Q14. Shallow copy vs Deep copy?

Shallow copy:

```js
const copy = { ...user };
```

Nested objects still share references.

Example:

```js
const user = {
name: "Sonu",
address: {
city: "Mumbai"
}
};
const copy = { ...user };
copy.address.city = "Pune";
```

Original user ka address bhi change ho sakta hai because nested object reference shared hai.

Deep copy creates independent nested structures.

Possible approaches:

* structuredClone()
* specialized serialization/transform depending on data
* libraries when necessary

JSON stringify/parse is not a universal deep-clone solution because it loses certain types and cannot handle some structures.

---

## Q15. Prototype aur Prototype Chain kya hai?

JavaScript objects inheritance prototype chain ke through implement karte hain.

Example:

```js
const user = {};
user.toString();
```

`toString()` directly user object mein defined nahi ho sakta, but prototype chain se inherited hai.

Concept:

```text
Object
↓
Object.prototype
↓
null
```

When property is not found on object, JavaScript prototype chain mein search karta hai.

---

## Q16. Garbage Collection kya hai?

JavaScript automatically unreachable objects ko memory se clean karta hai.

Basic idea:

```text
Object reachable hai
→ memory retained
Object unreachable ho gaya
→ garbage collector eventually reclaim kar sakta hai
```

Memory leak tab ho sakta hai jab object logically unnecessary hone ke baad bhi kisi reference chain ki wajah se reachable rahe.

Common causes:

* event listeners
* timers
* global references
* caches without eviction
* closures retaining large objects

---

## Q17. Debounce vs Throttle?

Debounce:

“User rukne ke baad execute karo.”

Example:
Search box.

User types:

```text
S
So
Son
Sonu
```

API only after typing stops.

Throttle:

“Fixed interval mein maximum ek baar execute karo.”

Example:
scroll/resize events.

Simple:

```text
Debounce → after activity stops
Throttle → at controlled frequency during activity
```

---

## Q18. Event Delegation kya hai?

Instead of every child element par event listener:

Parent par ek listener lagao.

Example:

```text
<ul id="users">
  <li>User 1</li>
  <li>User 2</li>
  <li>User 3</li>
</ul>
```

Parent ke click handler mein event.target identify kar sakte ho.

Benefits:

* fewer event listeners
* dynamic elements handle karna easier
* memory/performance benefits in appropriate cases

Works because of event bubbling.

---

## Q19. CommonJS vs ES Modules?

CommonJS:

```js
const express = require("express");
module.exports = router;
```

ES Modules:

```js
import express from "express";
export default router;
```

ESM is the standardized JavaScript module system.

Modern Node.js supports ESM as well as CommonJS, with behavior depending on project configuration/package settings.

Lead-level point:
“Choose one module strategy consistently in a project and understand interoperability boundaries.”

---

## Q20. JavaScript application production mein slow hai. How will you debug?

Don't immediately optimize code.

Flow:

```text
Problem reproduce
→ Measure
→ Identify bottleneck
→ Optimize
→ Measure again
```

Check:

1. CPU-heavy JavaScript
2. Large bundle
3. Excessive rendering
4. Memory growth
5. Network requests
6. API latency
7. Database latency
8. Event-loop blocking
9. Large JSON parsing
10. Third-party dependencies

For Node.js specifically:

Check:

* event-loop lag
* CPU profiling
* synchronous/blocking operations
* memory/heap
* GC pressure
* slow database queries
* external API latency

Strong Lead Engineer answer:

“First I would identify whether the bottleneck is CPU, memory, event loop, network, or downstream services. I would use profiling and observability data to locate the bottleneck, fix the responsible layer, and then validate the improvement with measurements.”

---

# JavaScript Lead Engineer Mental Model

```js
JavaScript
│
├── Execution
│   ├── Call Stack
│   ├── Event Loop
│   ├── Microtasks
│   └── Macrotasks
│
├── Async Programming
│   ├── Promise
│   ├── async/await
│   ├── Promise.all
│   └── Concurrency
│
├── Language Fundamentals
│   ├── Closure
│   ├── Scope
│   ├── Hoisting
│   ├── this
│   └── Prototype
│
├── Performance
│   ├── Debounce
│   ├── Throttle
│   ├── Memory
│   └── Garbage Collection
│
└── Production
├── Event-loop blocking
├── CPU
├── Memory
├── Network
└── Database
```
