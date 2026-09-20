# Database & Redis — Lead Engineer

## 20 Interview Questions & Answers

## Q1. SQL vs NoSQL — kab kya choose karoge?

### SQL

Good when:

* structured data
* relationships
* transactions
* strong consistency
* complex queries

Examples:

* PostgreSQL
* MySQL

### NoSQL

Good when:

* flexible schema
* very large scale
* specific access patterns
* high throughput
* distributed workloads

Examples:

* MongoDB
* DynamoDB
* Cassandra

Lead-level:

> “I don't choose SQL or NoSQL based on popularity. I choose based on data model, access patterns, consistency requirements, transaction requirements and scalability.”

---

## Q2. Database Index kya hai?

Index database ko rows efficiently find karne mein help karta hai.

Without index:

```text
Query
↓
Scan many rows
```

With index:

```text
Query
↓
Index
↓
Required rows
```

Example:

```sql
SELECT * FROM users
WHERE email = 'user@example.com';
```

Index:

```sql
CREATE INDEX idx_users_email
ON users(email);
```

---

## Q3. Har column par index kyun nahi lagate?

Because indexes have costs.

More indexes:

* increase storage
* slow INSERT
* slow UPDATE
* require maintenance
* increase write overhead

Rule:

> Index columns based on actual query/access patterns.

---

## Q4. Composite Index kya hai?

Multiple columns ka combined index.

Example:

```sql
CREATE INDEX idx_orders_user_status
ON orders(user_id, status);
```

Useful for queries like:

WHERE user_id = ?
AND status = ?

Important:

Column order matters.

Index `(user_id, status)` and `(status, user_id)` are not always interchangeable.

---

## Q5. Database normalization kya hai?

Normalization data duplication reduce karne aur data consistency improve karne ka technique hai.

Example:

Instead of repeating customer information in every order:

```text
Customer
↓
Orders
```

Use relationships.

Benefits:

* less duplication
* better consistency
* easier updates

But extreme normalization can increase joins.

---

## Q6. Denormalization kab karoge?

Read performance ya specific access patterns ke liye related data duplicate/store kar sakte ho.

Example:

Order document mein customerName bhi store karna.

Benefits:

* fewer joins
* faster reads

Cost:

* duplicate data
* consistency maintenance

Lead-level:

> “I would denormalize intentionally based on measured read performance and access patterns, not by default.”

---

## Q7. Transaction kya hai?

Multiple operations ko one logical unit treat karna.

Example bank transfer:

```text
Account A
↓
```
Debit ₹100

```text
↓
Credit Account B
```

Either:

```text
Both succeed
or
```

Both rollback.

ACID:

```text
A → Atomicity
C → Consistency
I → Isolation
D → Durability
```

---

## Q8. Isolation levels kya hain?

Common levels:

* Read Uncommitted
* Read Committed
* Repeatable Read
* Serializable

Higher isolation generally gives stronger consistency but can reduce concurrency/increase locking or contention.

Trade-off:

Consistency ↔ Concurrency

Choose based on business requirements.

---

## Q9. Optimistic vs Pessimistic Locking?

### Pessimistic

Assume conflict likely.

Lock row:

```sql
UPDATE ...
```

while holding lock.

Good when contention is high and conflicts must be controlled directly.

### Optimistic

Assume conflicts are rare.

Use version:

```text
id = 10
version = 5
```

Update only if version still 5.

If someone already changed it:

```text
version mismatch → retry/fail.
```

Good for many low-conflict workloads.

---

## Q10. Primary DB + Read Replica kaise work karta hai?

Primary:

```text
Writes
↓
Replication
↓
Read Replicas
```

Application:

```text
Write → Primary
Read → Replica
```

Benefits:

* read scaling
* distribute read traffic

Problem:

Replication lag.

Recently written data may not immediately appear on replica.

---

## Q11. Replication vs Backup?

Replication:

Same data ki additional copies.

Purpose:

* availability
* read scaling
* failover

Backup:

Historical recoverable copy.

Purpose:

* accidental deletion
* corruption
* disaster recovery

Important:

> Replication is not a replacement for backups.

---

## Q12. Sharding kya hai?

Data ko multiple database nodes mein horizontally divide karna.

Example:

```text
Users A–F → Shard 1
Users G–M → Shard 2
Users N–S → Shard 3
Users T–Z → Shard 4
```

Benefits:

* storage scaling
* write scaling
* read scaling

But adds complexity:

* cross-shard queries
* rebalancing
* transactions
* routing
* hot shards

---

## Q13. Good Shard Key kya hota hai?

A good shard key should generally provide:

* even distribution
* high cardinality
* predictable routing
* minimal hotspots

Bad example:

Shard by country when one country contains 80% users.

That shard becomes hot.

Good shard key depends on workload.

---

## Q14. Cache-aside pattern kya hai?

Application first cache check karta hai.

Read:

```js
Application
↓
Redis
├── HIT → return
└── MISS
↓
DB
↓
Redis SET
↓
return
```

This is one of the most common caching strategies.

---

## Q15. Cache invalidation kaise handle karoge?

Problem:

DB updated.

Redis still has old value.

Solutions:

* TTL
* delete/update cache after DB update
* write-through/write-behind depending on architecture
* event-based invalidation

Simple approach:

```sql
DB update
↓
Delete cache
```

Next read:

```text
Cache miss
↓
DB
↓
Fresh value cached
```

Important:

> Cache invalidation is a consistency problem.

---

## Q16. Cache stampede kya hai?

Suppose popular key expire ho gayi.

At the same time:

10,000 requests

```text
↓
Cache MISS
↓
```
10,000 DB queries 😰

DB overloaded.

Solutions:

* request coalescing/single-flight
* jittered TTL
* locking
* early refresh
* stale-while-revalidate

Goal:

Only limited requests should hit DB for the same missing hot key.

---

## Q17. Redis kab use karoge?

Common use cases:

* caching
* sessions
* rate limiting
* counters
* distributed coordination/locks where appropriate
* temporary data
* queues/streams depending on requirements

Don't blindly use Redis as primary database.

Ask:

> Is this data reconstructable or does the DB remain the source of truth?

---

## Q18. Redis data structures kaunse important hain?

### String

Key-value:

```text
SET user:1 "Sonu"
```

### Hash

Object-like data:

```text
HSET user:1 name Sonu age 30
```

### List

Ordered collection / queue-like workloads.

### Set

Unique values.

### Sorted Set

Values + score.

Useful for:

* leaderboards
* ranking
* priority-like access patterns

---

## Q19. Database slow query kaise debug karoge?

Flow:

```sql
Slow API
↓
Identify DB latency
↓
Find query
↓
EXPLAIN / query plan
↓
Check indexes
↓
Check joins
↓
Check data volume
↓
Optimize
↓
Measure again
```

Also check:

* connection pool
* locks
* CPU
* disk I/O
* cache hit
* query frequency

Don't blindly add indexes.

---

## Q20. Database production mein bottleneck ban gayi. What will you do?

First identify the bottleneck.

Potential solutions:

### Read-heavy

```text
Redis
+
Read replicas
```

### Write-heavy

```text
Optimize queries
+
Batching
+
Partitioning/sharding where needed
```

### Large data

```text
Partitioning
+
Archival
+
Object storage where appropriate
```

### Slow queries

```text
Indexes
+
Query optimization
+
Schema/access-pattern changes
```

### Traffic spike

```text
Queue
+
Caching
+
Rate limiting
```

Lead-level answer:

> “I would first determine whether the bottleneck is reads, writes, connections, CPU, storage I/O, locks or query inefficiency. Then I would choose the appropriate solution rather than immediately adding replicas or sharding.”

---

# Database + Redis Mental Model

```text
Database
│
├── SQL / NoSQL
├── Index
├── Transactions
├── Isolation
├── Replication
├── Sharding
└── Backup
Redis
│
├── Cache
├── Session
├── Rate Limiting
├── Counters
├── Locks
└── Temporary/fast-access data
Scaling
│
├── Cache
├── Read Replica
├── Sharding
└── Partitioning
```

Golden Lead Engineer principle:

**“First understand the access pattern and bottleneck, then choose the scaling technique.”**
