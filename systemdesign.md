# 🏗️ System Design Round — Lead Engineer Edition

## 34 High-ROI Designs + How To Answer

---

# 0. 🧠 THE FRAMEWORK — NEVER JUMP TO ARCHITECTURE

Jab interviewer bole:

> "Design a system for X."

Turant boxes aur arrows mat banao. Pehle ye 8 steps follow karo:

```text
1. REQUIREMENTS      → functional + non-functional
2. SCALE             → users, QPS, data size, latency budget
3. HIGH-LEVEL DESIGN → components + data flow
4. API CONTRACT      → endpoints, request/response
5. DATA MODEL        → tables/collections + access patterns
6. DEEP DIVE         → the actually hard part
7. FAILURE MODES     → what breaks, what happens then
8. TRADE-OFFS        → what I chose and why
```

**Functional vs non-functional:**

```text
Functional      → What the system does
Non-functional  → Scale, latency, consistency, availability, security, cost
```

**Lead-level golden lines (use these):**

> "Before designing, I'd like to confirm the requirements and expected scale, because those drive most of the decisions."

> "I'd start with a simple design that works, identify the bottleneck, and evolve it — rather than designing for 100 million users on day one."

> "There's no single correct architecture here. I'll explain the trade-offs of the options I considered."

---

## ⭐ WHAT INTERVIEWER ACTUALLY CHECKS

```text
Requirements clarification      ← very important
Scale estimation
Component boundaries
Data model correctness
Failure handling
Trade-off reasoning
Communication
Not: how many fancy tools you can name
```

⚠️ **Common mistake:** Naming Kafka, Kubernetes and microservices before knowing the scale.

---

## 📐 BACK-OF-ENVELOPE NUMBERS — MUST REMEMBER

```text
1 million requests/day        ≈ 12 requests/second
100 million requests/day      ≈ 1,200 requests/second
1 KB × 1M records             ≈ 1 GB
1 KB × 1B records             ≈ 1 TB
Read : Write in most systems  ≈ 100 : 1
```

**Latency reference (order of magnitude):**

```text
In-memory cache      < 1 ms
SSD read             ~ 0.1 ms
Same-region network  ~ 1 ms
DB indexed query     ~ 1–10 ms
Cross-region call    ~ 50–150 ms
Disk seek (HDD)      ~ 10 ms
```

Use these in answers — it makes the estimate look real instead of hand-waved.

---

# 🔧 PART 1 — CORE BUILDING BLOCKS

## 1. SQL vs NoSQL

**Question:** Kaunsa database choose karoge?

**Answer framework:**

```text
Structured data + relationships + transactions?   → SQL
Flexible schema + huge write throughput?          → NoSQL
Massive read scale + simple access pattern?       → Cache / KV store
Full-text search?                                 → Search engine
```

**Lead-level answer:**

> "I'd choose based on access patterns and consistency requirements, not popularity. For banking and transactional data I'd stay with a relational database because we need transactions, constraints and referential integrity. NoSQL is a good fit when the schema is genuinely flexible or when we need very high write throughput with simple key-based access."

**Say this to win points:**

> "The database choice is the hardest thing to change later, so I'd validate it against real query patterns before committing."

---

## 2. Caching Strategy

**Question:** How would you add caching here?

```text
Cache-aside (most common)
  App → Redis? → HIT: return
              → MISS: DB → set cache → return

Write-through   → write DB + cache together
Write-behind    → write cache, flush DB later (risk of data loss)
```

**Must mention:**

```text
TTL + jitter                → avoid mass expiry
Invalidation strategy       → what happens on update
Cache stampede protection   → lock / single-flight
Do NOT cache everything     → only hot, expensive, reusable data
```

**Lead-level line:**

> "Caching solves latency but creates a correctness problem: the cache can be stale. So the important question isn't 'should we cache?', it's 'how and when do we invalidate?'"

---

## 3. Consistency vs Availability

**Question:** Sab data real-time consistent chahiye?

```text
Strong consistency   → slower, simpler mental model
Eventually consistent → faster, more available, app must handle staleness
```

**Lead-level answer:**

> "I'd decide per data type rather than for the whole system. Money movements need strong consistency with transactions. A like count, a view count or a notification badge can be eventually consistent. Mixing these requirements into one design is where most systems get unnecessarily complex."

**Good line to add:**

> "CAP is a trade-off during a network partition — the more practical question is what the product can tolerate: stale reads, or failed writes?"

---

## 4. Stateless Services + Horizontal Scaling

**Question:** App traffic 10x badh gaya. Kya karoge?

```text
Stateless app servers
        ↓
Load balancer
        ↓
N × app instances
        ↓
Shared state: DB / Redis / object storage
```

**What must move out of the process:**

```text
Sessions        → Redis
Uploaded files  → object storage
Cache          → shared cache
Scheduled jobs → distributed lock / external scheduler
```

**Lead-level line:**

> "The first step to scaling is making the application stateless. If sessions live in process memory, horizontal scaling breaks the moment the load balancer sends the next request to another instance."

---

## 5. Queues & Async Processing

**Question:** Kaam slow hai, user ko wait karana zaroori hai?

```text
Synchronous  → user waits (use only when necessary)
Asynchronous → accept request, queue work, return fast
```

```text
API
 ↓
Queue (durable)
 ↓
Worker(s)
 ↓
Downstream systems
```

**Always mention:**

```text
Retries with backoff
Dead-letter queue for poison messages
Idempotent consumers (messages can be delivered twice)
Ordering guarantees (only if required)
Backpressure when consumers fall behind
```

**Lead-level line:**

> "Queues don't remove work, they absorb bursts and decouple systems. If the consumer is slower than the producer over the long run, the backlog just grows — so the consumer's throughput has to scale too."

---

## 6. Rate Limiting & Backpressure

**Question:** Ek client poora system choke kar raha hai.

```text
Redis
  INCR user:123
  EXPIRE user:123 60
       ↓
count > limit → 429 Too Many Requests
```

**Variants:**

```text
Fixed window       → simple, boundary spikes
Sliding window     → smoother
Token bucket       → allows bursts
```

**Lead-level line:**

> "Rate limiting is not only about protecting against abuse — it's about protecting your own database. In-memory counters don't work with multiple instances, so the counter has to live in a shared store."

---

# 🧩 PART 2 — CLASSIC DESIGNS

## 7. Design a URL Shortener

**Requirements first:**

```text
Create short URL
Redirect to original
Custom alias? Expiry? Analytics? Rate limiting?
Scale: 100M URLs, read-heavy (100:1)
```

```text
Client → API → ID generator → DB
                    ↑
            Base62 encode counter or random ID
Client → short code → cache? → DB → 301/302 redirect
```

**Key decisions to discuss:**

```text
ID generation     → counter / snowflake / random + collision check
Storage           → KV store is enough
Caching           → hot URLs in Redis
301 vs 302        → 301 cached by browser (no analytics), 302 lets you track
Analytics         → async, queue-based, never on the redirect path
```

**Lead-level line:**

> "The redirect path must stay extremely fast and must not depend on analytics. I'd push click tracking to a queue or log stream so it can never slow down the redirect."

---

## 8. Design a Rate Limiter Service

```text
Client
  ↓
API Gateway / Middleware
  ↓
Redis (atomic INCR + EXPIRE, or Lua for multi-step atomicity)
  ↓
Allow / Deny (429) + Retry-After header
```

**Deep-dive points:**

```text
Atomicity           → INCR + EXPIRE must not race → Lua script
Distributed         → shared Redis, not per-instance memory
Failure behaviour   → Redis down: fail-open or fail-closed?
   fail-open  → availability, but abuse possible
   fail-closed → safety, but you may block valid users
Failure decision    → depends on what the endpoint protects
```

**Lead-level line:**

> "The interesting question is what happens when the rate limiter itself fails. For a login endpoint I'd rather fail closed; for a low-risk read endpoint I'd fail open and log it."

---

## 9. Design Autocomplete / Search Suggestions

```text
Prefix → suggestions in < 100 ms

Options:
  Simple count-based trie
  Search engine with prefix queries
  Precomputed top-N per prefix (batch job + cache)
```

**Key points:**

```text
Precompute popularity offline → serve from cache
Debounce on the client
Cap results, avoid huge payloads
Ranking: frequency + recency + personalization (optional)
```

**Lead-level line:**

> "Autocomplete is a read-dominated problem, so the win comes from precomputing the top results per prefix and serving them from a fast store — not from querying the database on every keystroke."

---

## 10. Design a News Feed / Activity Feed

```text
Fan-out on read   → build feed when user opens app (simple, slower reads)
Fan-out on write  → push to followers' feeds (fast reads, expensive writes)
Hybrid            → push for normal users, pull for celebrities
```

**Lead-level answer:**

> "I'd start with fan-out on read because it's simpler and cheap to operate, and move to a hybrid model only when read latency or read volume becomes the bottleneck. The celebrity case is what usually breaks pure fan-out on write."

---

## 11. Design Chat / Real-time Notifications

```text
WebSocket connections (persistent)
        ↓
Connection registry (which user is on which server)
        ↓
Message broker
        ↓
Presence + delivery + read receipts
```

**Failure points to mention:**

```text
Sticky vs stateless websockets
Reconnection + missed messages (sequence numbers)
Message ordering per conversation
Offline delivery → store and push on reconnect
Horizontal scaling → broker pub/sub across servers
```

**Lead-level line:**

> "With WebSockets the server holds state, so scaling needs either sticky routing or a broker that lets any server deliver to any user. I'd also always plan for reconnection and message replay, because networks drop connections constantly."

---

## 12. Design a File Upload / Storage Service

```text
Client → API (metadata) → signed URL → direct upload to object storage
                 ↓
        store metadata + status in DB
                 ↓
        queue → virus scan / thumbnail / processing
```

**Key points:**

```text
Never proxy large files through the app server
Presigned URLs, size + type limits
Chunked / resumable uploads for big files
Separate metadata (DB) from bytes (object storage)
Access control via signed URLs, not public buckets
```

**Lead-level line:**

> "Passing large files through the application server wastes CPU and memory and makes scaling harder. The app's job is to authorise and hand out a signed URL; the object storage handles the bytes."

---

## 13. Design a Webhook Delivery System

**Question:** Customer ko events reliably deliver karne hain.

```text
Event occurs
      ↓
Persist event + delivery record (DB)
      ↓
Queue
      ↓
Worker → customer endpoint
      ↓
Success? mark delivered
Failure? retry with exponential backoff
         ↓
exhausted → DLQ + alert + dashboard
```

**Must mention:**

```text
At-least-once delivery → customer must dedupe (event ID)
Signature (HMAC) so receiver can verify authenticity
Per-customer isolation → one slow endpoint shouldn't block others
Timeout on every outgoing call
```

**Lead-level line:**

> "The receiver's reliability is not under my control, so the design has to assume failures: signed payloads, retries with backoff, and deduplication so a duplicate delivery can't corrupt the customer's system."

---

## 14. Design a Job Scheduler at Scale

```text
Scheduler
    ↓
Job definition + schedule (DB)
    ↓
Due jobs → queue
    ↓
Workers (idempotent, retryable)
```

**Critical points:**

```text
Multiple instances → never run the same job twice
   → distributed lock / leader election / DB claim with status
Long jobs → checkpoint / resumable
Retries + alert if a job exceeds expected duration
Missed runs → catch-up policy or skip policy (must be explicit)
```

**Lead-level line:**

> "The most common production bug after scaling is a cron job that runs once per instance. Jobs must claim work atomically — a distributed lock or a conditional update — not assume a single server."

---

## 15. Design a Distributed Lock

```text
SET lock:resource <token> NX PX 30000
```

**Must mention:**

```text
TTL           → lock must expire, otherwise a crash deadlocks everything
Unique token  → release only your own lock (compare-and-delete)
Renewal       → for long jobs, extend carefully
Fencing token → prevents an expired-holder from writing stale data
```

**Lead-level line:**

> "A lock without a TTL is a future outage. And releasing a lock by simply deleting the key is unsafe — you might delete someone else's lock, so the release has to verify ownership."

---

## 16. Design a Banking Audit Log

```text
Every sensitive action
      ↓
Append-only audit record (who, what, when, before → after, request ID)
      ↓
Durable store (same transaction where possible)
      ↓
Read-only access for auditors
```

**Must mention:**

```text
Append-only, not editable
Correlated with request ID
Sensitive fields masked
Immutability + retention policy
Must not be lost if the main operation succeeded
```

**Lead-level line:**

> "In banking, auditability is a requirement, not a feature. The audit record and the business change should be written in the same transaction, otherwise you can end up with money moved and no proof of who did it."

---

## 17. Design a Reporting / Analytics Service

**Question:** Heavy reports production DB slow kar deti hain.

```text
OLTP DB (transactions)
      ↓
Read replica / CDC stream
      ↓
Reporting / analytics store
      ↓
Report API
```

**Lead-level answer:**

> "I'd separate analytical workload from transactional workload so a heavy report can never degrade user-facing transactions. Read replicas or an ETL/CDC pipeline handle reporting, with query timeouts and resource limits as a safety net."

---

## 18. Design a Session Store

```text
Stateless app + Redis session
   ↓
sessionId cookie (httpOnly, secure, sameSite)
   ↓
Redis GET session → user context
```

**Must mention:**

```text
External store → survives deploy and restart
TTL / sliding expiry
Revocation on logout or password change
Never store sensitive data client-side in a JWT you can't revoke
```

**Lead-level line:**

> "In-memory sessions work perfectly until you deploy or scale to two instances. Externalising sessions is one of the first things I look at when reviewing an application for production readiness."

---

## 19. Design an Idempotency Service

```text
Client sends Idempotency-Key
        ↓
Server checks key store
   new → process + store result
   seen → return stored result (no reprocessing)
```

**Must mention:**

```text
Key stored with result + status, with TTL
Concurrent duplicate → lock or unique constraint, not just a read check
Applies to POST/payment/order creation
```

**Lead-level line:**

> "Idempotency has to be enforced with a unique constraint or atomic insert, because under concurrency two requests can both see 'key not found' and both proceed."

---

## 20. Design Feature Flags

```text
Flag config
     ↓
Cache (avoid a remote call per request)
     ↓
App evaluates: user, region, percentage, role
     ↓
Kill switch → instant rollback without deploy
```

**Lead-level line:**

> "Feature flags let me separate deployment from release, which is how you make risky changes safe. The flag must be evaluated from a cached config with a safe default, because the flag service going down shouldn't take the application down."

---

# 🏦 PART 3 — FINTECH / BANKING DESIGNS

## 21. Design a Money Transfer

```text
Client → API (auth + idempotency key)
           ↓
      Validate (limits, balance, KYC, fraud hook)
           ↓
      Transaction (atomic)
        debit A
        credit B
        write ledger entries
        write audit log
           ↓
      Commit → response
           ↓
      Async: notification, statement update, reconciliation
```

**Must mention:**

```text
Double-entry ledger → every movement has a debit and a credit
Never update a balance alone — balances are derived or reconciled
Same DB transaction for debit + credit (or a saga if across services)
Idempotency key → retries must not double-charge
Audit trail → who, when, why
```

**Lead-level line:**

> "For money movement I'd keep the debit, credit and ledger entries inside one transaction, and treat notifications, statements and reporting as asynchronous follow-up work. Correctness first, everything else after."

---

## 22. Design a Payment API (create order / pay)

```text
POST /payments  (Idempotency-Key required)
      ↓
Auth → validation → idempotency check
      ↓
Business rules + limits
      ↓
DB transaction → payment record (status: PENDING)
      ↓
Call payment provider (external, timeout + retry policy)
      ↓
Update status (SUCCESS / FAILED / UNKNOWN)
      ↓
Async: notify, ledger entry, reconciliation
```

**Very important nuance to mention:**

```text
Never assume a timeout means failure
  → status may be UNKNOWN → reconcile via provider status API
```

**Lead-level line:**

> "The hardest part of payment integration isn't the happy path, it's the unknown state — the provider timed out and we don't know whether money moved. That's why reconciliation and a status check exist, and why the operation must be idempotent."

---

## 23. Design a Wallet Balance (No Oversell / No Double Spend)

```text
Wrong approach:
   read balance → check → write balance
   (two concurrent requests both pass the check)

Correct approach:
   atomic conditional update
     UPDATE wallet SET balance = balance - 100
      WHERE id = ? AND balance >= 100
     → 0 rows affected means insufficient balance

Or: row lock inside a transaction
Or: optimistic locking with a version column
```

**Lead-level line:**

> "Balance checks must be atomic at the database level. Application-level check-then-write is exactly where double spending comes from, and it only shows up under concurrency."

---

## 24. Design Transaction Reversal / Refund

```text
Original transaction
      ↓
Reversal request (idempotent, with reference to original)
      ↓
Create reversal entry — never edit the original
      ↓
Ledger gets compensating entries
      ↓
Audit trail preserved
```

**Lead-level line:**

> "Financial records are append-only. A reversal is a new compensating entry, not an update to history — otherwise the audit trail is destroyed and reconciliation becomes impossible."

---

## 25. Design a Statement / Ledger Report

```text
Transactions (source of truth, append-only)
      ↓
Batch/stream aggregation
      ↓
Statement snapshot per period
      ↓
API + download (paginated, cached)
```

**Must mention:**

```text
Immutable transactions → reports are derived, not stored as truth
Pagination + server-side filtering for large periods
Read replicas / separate path so reporting never blocks transactions
Timezone and cut-off handling (statement period boundaries)
```

---

## 26. Design Role-Based Access Control for a Banking App

```text
User → Roles → Permissions → Resources
                    ↓
        Checked in backend middleware (never only in UI)
                    ↓
        Branch / account-level scoping (data isolation)
```

**Lead-level line:**

> "Authorization must be enforced on the server, per request, per resource. Hiding a button in the UI is not access control. In banking I'd also make sure users can only see data for their branch or account scope."

---

## 27. Design a Fraud / Risk Check Hook

```text
Transaction request
      ↓
Synchronous rules (fast, deterministic limits)
      ↓
Risk engine (may be slower → strict timeout)
      ↓
Decision: allow / block / review
      ↓
Async: model scoring + investigation queue
```

**Lead-level line:**

> "Risk checks sit on the critical path, so they need a hard timeout and a defined fallback. If the risk engine is slow, we decide upfront whether the default is to allow, block, or hold for review — never leave that to chance."

---

## 28. Design a Cheque Clearing / Batch File Processing Flow

**Question:** Bank ka batch processing — large files, clearing cycle, strict timelines.

```text
Incoming file (large)
      ↓
Validate format + checksum
      ↓
Store raw file (immutable, for audit)
      ↓
Parse in batches (streaming, not whole-file in memory)
      ↓
Stage records (temp status)
      ↓
Validate business rules per record
      ↓
Process in batches with checkpointing
      ↓
Post valid → ledger ; reject invalid → return file/report
      ↓
Reconciliation report + audit
```

**Must mention:**

```text
Never load a huge file fully into memory → stream / batch
Idempotent + resumable from checkpoint (file may be reprocessed)
Per-record error handling → one bad record shouldn't fail the batch
Reconciliation counts → total in = processed + rejected
Strict time window → performance matters, so batch sizes + parallel workers + DB tuning
```

**Lead-level line:**

> "Batch systems live and die by reconciliation and reprocessing. I'd always store the original file immutably, make processing resumable from a checkpoint, and produce reconciliation totals so we can prove nothing was lost or double-posted."

---

# 📈 PART 4 — EVOLUTION, RELIABILITY & SCALE

## 29. Monolith vs Microservices

```text
Monolith            → simple deploy, simple transactions, hard to scale teams
Modular monolith    → clear boundaries, one deploy
Microservices       → independent scaling + teams, distributed complexity
```

**Lead-level answer:**

> "For a banking system I would not start with microservices. I'd build a modular monolith with clear module boundaries, and extract a service only when there's a real reason — different scaling needs, separate release cadence, or team ownership. Microservices move complexity from code into infrastructure and operations."

**Strong closing line:**

> "The cost of microservices is paid in operational complexity and distributed transactions, so it should be justified by a specific problem, not by fashion."

---

## 30. Zero-Downtime Schema Migration

```text
EXPAND    → add new column (nullable), deploy code that writes both
MIGRATE   → backfill in batches, verify
CONTRACT  → stop writing old, drop old column later
```

**Must mention:**

```text
Never rename/drop in one step while old code is running
Backfill in batches to avoid locking the table
Adding index on large tables → consider concurrent index creation
Rollback plan at every step
```

**Lead-level line:**

> "During a rolling deploy, old and new code run at the same time, so the database must support both versions. That's why migrations are expand-migrate-contract rather than a single breaking change."

---

## 31. API Versioning & Backward Compatibility

```text
Additive changes      → safe (new optional field)
Breaking changes      → new version + deprecation window
Never reuse a field with new meaning
Client must tolerate unknown fields
```

**Lead-level line:**

> "I'd design APIs so that additive changes are always safe, because you can never upgrade every client at the same time — especially with mobile apps and third-party integrations."

---

## 32. Design Observability

```text
Metrics   → RPS, error rate, P50/P95/P99, CPU, memory, DB, Redis, queue depth
Logs      → structured, with request ID
Traces    → one request across services
Alerts    → symptom-based (user impact), not every metric threshold
```

**Lead-level line:**

> "I care more about whether users are affected than whether a metric moved. So alerts should be based on symptoms like error rate and latency, with dashboards available for the underlying causes."

---

## 33. Scale Estimation in Practice

**Question:** 1 million users, design the capacity.

```text
1M users, 10% DAU        = 100K daily active
100K users × 20 requests = 2M requests/day
2M / 86400                ≈ 23 req/s average
Peak ≈ 5–10× average      ≈ 120–230 req/s

Read:write 100:1          → cache reads aggressively
Storage: record size × volume × retention
```

**Lead-level line:**

> "The point of the estimate isn't exact numbers, it's identifying where the pressure will be. Here reads dominate, which tells me caching matters more than write throughput."

---

## 34. What Breaks First? (Very Common Follow-up)

```text
Almost always, in this order:
1. Database (queries, connections, locks)
2. Cache (stampede, hot key, memory)
3. Slow downstream dependency
4. Single instance / single point of failure
5. Unbounded queue growth
```

**Lead-level line:**

> "In most systems the database is the first real bottleneck, so I'd rather design for read reduction and connection discipline early than discover it in production."

---

# 🏆 SYSTEM DESIGN — ONE-LINE ANSWER FORMULA

```text
REQUIREMENTS
  ↓
SCALE ESTIMATE
  ↓
SIMPLE DESIGN
  ↓
DATA MODEL + API
  ↓
BOTTLENECK
  ↓
CACHE / QUEUE / SHARD
  ↓
FAILURE MODES
  ↓
TRADE-OFFS
```

Har design mein ye 4 sawaal:

```text
1. Data kahan store hoga? (source of truth)
2. Read path fast kaise hoga?
3. Write path reliable kaise hoga?
4. Failure par kya hoga?
```

Aur yaad rakho:

> **Weak candidate:** tools ka naam leta hai.
>
> **Strong candidate:** requirements puchta hai, scale estimate karta hai, simple design se start karta hai, bottleneck identify karta hai, aur trade-offs explain karta hai. 🚀

---

# 🎯 80/20 PRIORITY RANKING

System design mein breadth se zyada important hai framework aur trade-off reasoning.

```text
This file's weight in overall prep: ~15%
Reason: Lead round mein design discussion hota hai, lekin wahi 5-6 patterns baar baar repeat hote hain
Overall prep order: resume deep dive → production debugging → system design → production scenarios → leadership → coding round
```

## 🥇 TIER 1 — MUST DO (60% time)

```text
0. The framework (requirements → scale → design → deep dive → failures → trade-offs)
3. Consistency vs availability
5. Queues & async processing
7. URL shortener (classic warm-up, sab isse start karte hain)
21. Money transfer (double-entry ledger)
22. Payment API (idempotency + unknown state)
23. Wallet balance (atomic update, no oversell)
```

Tier 1 ka asli maqsad: framework aur banking designs fluent hona chahiye.

## 🥈 TIER 2 — HIGH ROI (30%)

```text
1. SQL vs NoSQL
2. Caching strategy (invalidation + stampede)
4. Stateless services + horizontal scaling
6. Rate limiting & backpressure
8. Rate limiter service (fail-open vs fail-closed)
19. Idempotency service
28. Cheque clearing / batch file processing
29. Monolith vs microservices
33. Scale estimation in practice
34. "What breaks first?"
```

## 🥉 TIER 3 — BE ABLE TO SKETCH IT (10%)

```text
9.  Autocomplete / search suggestions
10. News feed (fan-out on read vs write)
11. Chat / real-time notifications
12. File upload service
13. Webhook delivery system
14. Job scheduler at scale
15. Distributed lock
16. Banking audit log
17. Reporting / analytics service
18. Session store
20. Feature flags
24. Transaction reversal / refund
25. Statement / ledger report
26. RBAC for a banking app
27. Fraud / risk check hook
30. Zero-downtime schema migration
31. API versioning & backward compatibility
32. Design observability
```
