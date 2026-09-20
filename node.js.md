# Node.js Lead Engineer — 20 Interview Questions & Answers

## Q1. Node.js kya hai? JavaScript runtime ka kya meaning hai?

Node.js JavaScript ko browser ke bahar run karne ka runtime environment hai.

Node.js uses:

* V8 JavaScript engine
* Event Loop
* libuv
* OS/networking APIs

Simple architecture:

```text
JavaScript
↓
V8
↓
Node.js APIs
↓
libuv
↓
OS
```

Important:

V8 JavaScript execute karta hai.

Node.js sirf V8 nahi hai; it provides runtime APIs, event-loop integration, networking, filesystem access, etc.

---

## Q2. Node.js single-threaded hai?

JavaScript execution ka main thread single-threaded hai.

But Node.js internally:

* OS asynchronous I/O
* libuv
* thread pool
* worker threads

use kar sakta hai.

So:

“Node.js is single-threaded” incomplete statement hai.

Better:

“Node.js runs JavaScript execution primarily on a single event-loop thread, while I/O and some expensive operations can be handled outside that thread.”

---

## Q3. Node.js Event Loop kya hai?

Event Loop asynchronous callbacks ko execute karne ka mechanism hai.

Simplified:

```text
Call Stack
↓
Node/libuv
↓
Async operation
↓
Callback ready
↓
Event Loop
↓
Call Stack
```

Example:

```text
fs.readFile(...)
setTimeout(...)
HTTP request
```

Node.js current JavaScript execution ko block kiye bina I/O handle kar sakta hai.

---

## Q4. libuv kya hai?

libuv Node.js ke asynchronous I/O architecture ka important component hai.

It provides:

* Event loop
* Async I/O abstraction
* Thread pool
* timers
* networking support

Important:

```text
V8 → JavaScript execute karta hai.
libuv → asynchronous I/O/event-loop infrastructure provide karta hai.
```

---

## Q5. Node.js Thread Pool kya hai?

libuv thread pool kuch operations ko event-loop thread ke bahar execute karne mein help karta hai.

Common examples can include:

* certain filesystem operations
* DNS operations depending on API/path
* crypto operations
* compression

Concept:

```text
Event Loop
↓
Thread Pool
├── Worker
├── Worker
├── Worker
└── Worker
```

Important:
Thread pool ka purpose HTTP requests ke liye normally “one thread per request” model nahi hai.

---

## Q6. CPU-intensive task Node.js mein problem kyun hai?

Agar main event-loop thread par CPU-heavy calculation chale:

```text
calculateHugeThing();
```

to event loop busy ho jayega.

Meanwhile:

```text
Request 1 → processing
Request 2 → waiting
Request 3 → waiting
Request 4 → waiting
```

Result:

* latency increases
* throughput drops
* event-loop lag increases

Solutions:

* Worker Threads
* separate worker service
* background jobs/queue
* move computation to specialized service

---

## Q7. Worker Threads kya hain?

Worker Threads Node.js mein JavaScript CPU-intensive work ko separate threads par run karne dete hain.

Useful for:

* CPU-heavy calculations
* image processing
* parsing large data
* CPU-intensive transformations

Concept:

```text
Main Thread
↓
Worker Thread
↓
Heavy computation
```

Important:
Worker Threads database/API I/O ko magically faster nahi banate.

---

## Q8. process.nextTick vs Promise vs setImmediate?

High-level Node scheduling:

```js
process.nextTick()
→ very high priority queue
Promise microtasks
→ microtask queue
setImmediate()
→ check phase
setTimeout()
→ timers phase
```

Important:
Overusing process.nextTick can starve I/O.

Interview line:

“nextTick should be used carefully because continuously scheduling nextTick callbacks can delay the event loop from progressing to I/O phases.”

---

## Q9. Express middleware kya hai?

Middleware request-response lifecycle ke beech execute hota hai.

Example:

```text
Request
↓
Logger
↓
Authentication
↓
Validation
↓
Controller
↓
Response
```

Example:

```js
app.use(authMiddleware);
```

Middleware can:

* modify request
* validate/authenticate
* log
* handle errors
* terminate request
* call next()

---

## Q10. Express mein error handling kaise karoge?

Centralized error middleware:

```js
app.use((err, req, res, next) => {
console.error(err);
res.status(500).json({
message: "Internal Server Error"
});
});
```

Architecture:

```text
Controller
↓
throw/next(error)
↓
Central Error Handler
↓
Response
```

Benefits:

* consistent responses
* centralized logging
* less duplicate error handling
* easier monitoring

Production mein sensitive stack traces client ko expose nahi karna chahiye.

---

## Q11. Node.js application ko horizontally scale kaise karoge?

Instead of:

```text
One Node process
```

Use:

```text
Load Balancer
├── Node Instance 1
├── Node Instance 2
├── Node Instance 3
└── Node Instance 4
```

Important:
Application servers preferably stateless hone chahiye.

Don't rely on:

* local in-memory sessions
* local filesystem for shared state
* process-local cache as source of truth

Use external systems:

```text
Redis
Database
Object Storage
```

---

## Q12. Node.js Cluster vs Worker Threads?

Cluster:
Multiple Node.js processes.

Useful for:

* utilizing multiple CPU cores
* running multiple application processes

Worker Threads:
Multiple threads inside Node.js process.

Useful for:

* CPU-intensive JavaScript work

Simple:

```text
Cluster → scale application processes
Worker Threads → execute CPU-heavy work in separate threads
```

In modern deployments, containers/process managers/orchestrators are also commonly used for horizontal scaling.

---

## Q13. Node.js mein graceful shutdown kya hai?

Server ko suddenly kill karne ke bajay:

```text
SIGTERM
↓
Stop accepting new requests
↓
Finish in-flight requests
↓
Close DB connections
↓
Close Redis connections
↓
Stop workers
↓
Exit
```

Example:

```js
process.on("SIGTERM", async () => {
await server.close();
await db.close();
process.exit(0);
});
```

Important for:

* Kubernetes
* Docker
* deployments
* rolling updates

---

## Q14. Connection Pool kya hai?

Har request par new DB connection create karna expensive hai.

Without pool:

```text
Request
→ Create DB connection
→ Query
→ Close
```

With pool:

```text
Connection Pool
├── Connection 1
├── Connection 2
├── Connection 3
└── Connection N
```

Requests reuse connections.

Benefits:

* lower connection overhead
* better throughput
* controlled DB connections

But pool too large bhi problem hai because DB can get overloaded.

---

## Q15. Node.js mein authentication kaise design karoge?

Typical:

```text
Client
↓
Login
↓
Authentication service
↓
Session/token
↓
Protected API
```

JWT approach:

```text
Authorization: Bearer <token>
```

Backend:

1. Verify signature
2. Validate expiry
3. Identify user
4. Check authorization/permissions

Important:

Authentication:
“Who are you?”

Authorization:
“What can you do?”

Sensitive operations should always be authorized server-side.

---

## Q16. Node.js API ko secure kaise karoge?

Important areas:

* input validation
* authentication
* authorization
* rate limiting
* HTTPS
* secure headers
* CORS configuration
* parameterized queries
* secrets management
* request size limits
* dependency security
* logging/monitoring

Avoid:

Client input directly trusted.

Example:

```text
req.body.amount
```

must be validated before business logic.

---

## Q17. Node.js API high traffic par slow ho gayi. Kaise debug karoge?

Flow:

```text
User reports latency
↓
Metrics
↓
Identify layer
↓
Profile
↓
Fix
↓
Verify
```

Check:

1. Event-loop lag
2. CPU
3. Memory
4. GC
5. DB latency
6. Connection pool
7. Redis latency
8. External API latency
9. Network
10. Queue backlog

Useful metrics:

* RPS
* P50/P95/P99 latency
* error rate
* CPU
* memory
* event-loop lag
* DB latency

---

## Q18. Node.js memory leak kaise debug karoge?

Symptoms:

Memory:

```text
100MB
→ 200MB
→ 400MB
→ 800MB
```

and doesn't return after traffic decreases.

Approach:

```text
Reproduce
↓
Heap snapshot
↓
Compare snapshots
↓
Find retained objects
↓
Identify reference
↓
Fix
↓
Verify
```

Common causes:

* global arrays/caches
* unbounded cache
* event listeners
* timers
* closures
* connections not released

Important:
Increasing memory limit is not a real fix if the application has a leak.

---

## Q19. Node.js mein synchronous code avoid kyun karte hain?

Example:

```text
fs.readFileSync(...)
```

Large/slow synchronous operation event-loop thread ko block kar sakta hai.

While blocked:

```text
Request A → processing
Request B → waiting
Request C → waiting
```

For server request paths, prefer asynchronous APIs when appropriate.

Also avoid CPU-heavy synchronous computation on the event loop.

Important:
Not every synchronous operation is automatically bad. The concern is blocking work on latency-sensitive paths.

---

## Q20. Production Node.js architecture kaise design karoge?

Example:

```text
Users
↓
CDN / Load Balancer
↓
Node.js API Servers
↓
Redis
↓
Database
```

Async work:

```text
Node.js API
↓
Queue
↓
Workers
↓
External services
```

Observability:

```text
Node.js
↓
Logs
Metrics
Traces
Alerts
```

Scaling:

```text
Load Balancer
├── Node 1
├── Node 2
├── Node 3
└── Node N
```

Important principles:

* stateless API servers
* horizontal scaling
* caching
* connection pooling
* async processing
* rate limiting
* graceful shutdown
* retries/timeouts
* observability
* proper error handling

Strong Lead Engineer answer:

“I would keep the API layer stateless and horizontally scalable, use Redis for appropriate caching, a relational or NoSQL database depending on access patterns, queues for asynchronous workloads, and proper observability for latency, errors, event-loop health and downstream dependencies.”

---

# Node.js Lead Engineer Mental Model

```text
Node.js
│
├── V8
│   └── Executes JavaScript
│
├── Event Loop
│   └── Coordinates async work
│
├── libuv
│   ├── Event Loop
│   ├── Async I/O
│   └── Thread Pool
│
├── CPU Heavy Work
│   ├── Worker Threads
│   └── Background Workers
│
├── API Layer
│   ├── Express
│   ├── Middleware
│   └── Error Handling
│
├── Scalability
│   ├── Load Balancer
│   ├── Multiple Instances
│   ├── Redis
│   └── Database
│
└── Production
├── Graceful Shutdown
├── Connection Pool
├── Security
├── Monitoring
├── Logging
└── Performance
```
