# System Design & Distributed Systems

## 20 Lead Engineer Interview Questions & Answers

## Q1. HLD aur LLD kya hai?

### HLD — High Level Design

System ke major components aur unke interactions.

Example:

```text
User
↓
Load Balancer
↓
API Servers
↓
Redis
↓
Database
```

HLD focuses on:

* architecture
* scalability
* availability
* databases
* cache
* queues
* networking

### LLD — Low Level Design

Individual components ki detailed implementation.

Example:

* classes
* interfaces
* methods
* DB schema
* API contracts
* design patterns

Simple:

```text
HLD → Big picture
LLD → Implementation details
```

---

## Q2. System Design interview ka approach kya hoga?

Strong framework:

1. Clarify requirements
2. Define functional requirements
3. Define non-functional requirements
4. Estimate traffic/storage
5. Design APIs
6. Design high-level architecture
7. Database design
8. Cache
9. Scaling
10. Failure handling
11. Security
12. Trade-offs

Interview line:

“Before jumping into architecture, I would clarify the requirements and estimate the scale.”

---

## Q3. RPS kya hai aur traffic estimate kaise karoge?

RPS = Requests Per Second.

Example:

```text
10M requests/day
```

Average RPS:

10,000,000 / 86,400
≈ 116 RPS

If peak factor = 5:

```text
Peak RPS
```
≈ 580

Always distinguish:

* average traffic
* peak traffic

---

## Q4. Concurrency kaise estimate karoge?

Little's Law:

Concurrency ≈ RPS × latency(seconds)

Example:

2,000 RPS

```text
Latency = 100ms = 0.1 sec
```

Concurrency:

2,000 × 0.1
= 200

Important:
100ms ko 100 seconds nahi samajhna.

---

## Q5. Horizontal vs Vertical Scaling?

### Vertical

Machine bigger:

```text
2 CPU
→ 8 CPU
→ 32 CPU
```

### Horizontal

More machines:

```text
Server
→ Server + Server + Server
```

Horizontal scaling generally distributed systems ke liye more scalable approach hai, but adds operational complexity.

---

## Q6. Load Balancer kya karta hai?

Traffic ko multiple healthy servers mein distribute karta hai.

```text
User
↓
Load Balancer
├── Server 1
├── Server 2
└── Server 3
```

Functions:

* traffic distribution
* health checks
* failover
* TLS termination
* routing

---

## Q7. Stateless server kyun important hai?

Suppose:

```text
Request 1 → Server A
Request 2 → Server B
```

Agar application stateless hai, Server B request handle kar sakta hai.

State external systems mein:

```text
Redis
Database
Object Storage
```

Benefit:

* easy horizontal scaling
* easier failover
* simpler deployments

---

## Q8. Cache kab use karoge?

Use cache when:

* data frequently read
* data reused
* database read load high
* low latency required

Pattern:

```js
Request
↓
Cache
├── HIT → return
└── MISS → DB → Cache → return
```

Trade-offs:

* stale data
* invalidation
* memory cost
* cache failure
* stampede

---

## Q9. Message Queue kyun use karte hain?

Synchronous:

```text
API
↓
Email provider
↓
Response
```

User waits.

Asynchronous:

```text
API
↓
Queue
↓
Worker
↓
Email provider
```

API quickly respond kar sakti hai.

Benefits:

* decoupling
* spike absorption
* retries
* background processing
* resilience

---

## Q10. Queue vs Kafka?

Traditional queue systems:

* RabbitMQ
* SQS

Useful for:

* task processing
* work queues
* background jobs

Kafka:

* distributed event streaming/log
* high throughput
* partitioning
* replay
* multiple consumers

Simple:

```text
Queue → work distribution
Kafka → event streaming/history/replay
```

Actual choice depends on workload and delivery requirements.

---

## Q11. Retry kaise design karoge?

Never retry immediately forever.

Use exponential backoff:

```text
1 sec
→ 2 sec
→ 4 sec
→ 8 sec
```

Add jitter to avoid synchronized retry spikes.

After max attempts:

```text
Queue
↓
DLQ
```

DLQ = Dead Letter Queue.

---

## Q12. At-least-once delivery mein duplicate messages kaise handle karoge?

Message:

```text
notificationId = 123
```

Worker processes:

```text
123 → send notification
```

Worker crashes before acknowledging queue.

Queue retries:

```text
123 → send again
```

Duplicate possible.

Solution:

**Idempotency / deduplication**

Store processed notification ID.

If already processed:
skip.

Important:

At-least-once delivery + non-idempotent operation = duplicate side effects risk.

---

## Q13. Idempotency kya hai?

Same operation multiple times execute karne par final effect same rahe.

Payment example:

```text
POST /payment
```

Idempotency-Key:

```text
abc123
```

Client retries:

```text
abc123
abc123
abc123
```

Backend ensures only one payment is created.

Critical for:

* payments
* orders
* provisioning
* notification workflows

---

## Q14. Strong vs Eventual Consistency?

Strong consistency:

Write ke immediately baad read → latest value.

Useful for:

* bank balance
* critical transaction state

Eventual consistency:

Write ke baad replicas temporarily stale ho sakte hain, eventually converge.

Useful for:

* social feeds
* analytics
* counters
* non-critical replicated data

Choice depends on business requirements.

---

## Q15. CAP theorem kya hai?

CAP:

```text
C → Consistency
A → Availability
P → Partition tolerance
```

Distributed system mein network partition ho sakta hai.

During partition, system generally has to trade:

```text
Consistency
vs
Availability
```

Important:

Don't explain CAP as:

“Choose any two of C/A/P.”

More accurate:

When a partition occurs, a distributed system must choose whether to prioritize consistency or availability for the affected operations.

---

## Q16. SPOF kya hai?

SPOF = Single Point of Failure.

Example:

```text
User
↓
Single Server
↓
DB
Server down → system down.
```

Remove SPOF:

```text
Load Balancer
├── Server 1
├── Server 2
└── Server 3
```

DB:

```text
Primary
+
Failover/replication strategy
```

Goal:

No single component failure should unnecessarily bring down the entire system.

---

## Q17. P50, P95, P99 kya hain?

Latency distribution.

P50:
50% requests are at or below this latency.

P95:
95% requests are at or below this latency.

P99:
99% requests are at or below this latency.

Example:

```text
P50 = 50ms
P95 = 150ms
P99 = 500ms
```

This means tail latency is much worse than typical latency.

Lead engineers care about tail latency because a small percentage of slow requests can still affect many users at scale.

---

## Q18. Availability vs Reliability?

Availability:

System accessible/working when requested.

Reliability:

System consistently performs correctly over time and handles failures.

Example:

99.99% availability
doesn't automatically mean
perfect reliability.

Reliability includes:

* fault handling
* recovery
* data correctness
* retries
* graceful degradation

---

## Q19. RTO vs RPO?

### RTO

Recovery Time Objective.

“How quickly must the system recover?”

Example:

```text
RTO = 30 minutes
```

### RPO

Recovery Point Objective.

“How much data loss is acceptable?”

Example:

```text
RPO = 5 minutes
```

If disaster happens:

```text
RTO → time to recover
RPO → acceptable data loss window
```

---

## Q20. Design a scalable production architecture.

Generic architecture:

```text
Users
↓
DNS
↓
CDN / Load Balancer
↓
Stateless API Servers
├── Redis
├── Primary DB
├── Read Replicas
└── Queue
↓
Workers
↓
External Services
```

Files:

```text
API
↓
Object Storage
↓
CDN
```

Observability:

```text
Services
↓
Logs + Metrics + Traces
↓
Monitoring + Alerts
```

Security:

```text
WAF / Rate Limiting
+
Authentication
+
Authorization
```

Scaling:

```text
Load Balancer
↓
Multiple API instances
```

Database:

* indexes
* caching
* replicas
* sharding only when required

---

# Lead Engineer System Design Framework

```text
Question
↓
Requirements
↓
Scale estimation
↓
API design
↓
HLD
↓
Database
↓
Cache
↓
Queue
↓
Scaling
↓
Reliability
↓
Security
↓
Observability
↓
Trade-offs
```

### Golden Lead Engineer principle

Don't say:

“Let's add Redis, Kafka, Kubernetes, sharding.”

Instead say:

> “First I'll identify the bottleneck and requirements. Then I'll introduce the simplest component that solves the problem. If the scale or reliability requirements increase, I'll evolve the architecture.”

That demonstrates **engineering judgment**, not just knowledge of technologies.


> “First I'll identify the bottleneck and requirements. Then I'll introduce the simplest component that solves the problem. If the scale or reliability requirements increase, I'll evolve the architecture.”

That demonstrates **engineering judgment**, not just knowledge of technologies.
