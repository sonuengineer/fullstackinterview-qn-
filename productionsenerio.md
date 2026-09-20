# 🔥 Production Scenarios — Lead Engineer Edition

## 30 Real Interview Scenarios + How To Answer

---

# 0. 🧠 HOW TO ANSWER ANY PRODUCTION SCENARIO

Ye file un questions ke liye hai jahan interviewer ek **story** deta hai:

> "Production mein ye ho gaya. Ab tum kya karoge?"

Blindly solution mat do. Har scenario mein ye 6-step framework use karo:

```text
1. IMPACT      → Kitne users affected? Kitna business impact?
2. PRIORITY    → Restore first, RCA later
3. ISOLATE     → Frontend? Network? App? Cache? DB?
4. MITIGATE    → Rollback / feature flag / scale / disable
5. ROOT CAUSE  → Logs + metrics + trace + request ID
6. PREVENT     → Fix + monitoring + test + runbook
```

Golden line jo har answer mein use kar sakte ho:

> "My first priority is restoring service and limiting customer impact. Root-cause analysis comes after the system is stable."

Aur ek aur:

> "I would not restart or change production blindly. I'd first identify which layer is failing using metrics, logs and request traces."

⚠️ Interviewer ye nahi dekh raha ki tumhe exact answer aata hai.
Wo dekh raha hai: **structure, ownership, trade-offs aur communication.**

---

# 1. 🌐 "API SUDDENLY SLOW"

**Scenario:**

> Monday morning, P95 latency 300ms se 4s ho gayi. Error rate normal hai. What will you do?

**Answer flow:**

```text
Is it all APIs or one endpoint?   → blast radius
        ↓
Recent deployment?                → highest probability
        ↓
P95/P99 + RPS graph              → sharp change or gradual?
        ↓
DB latency / slow queries        → most common root cause
        ↓
Redis hit rate / latency
        ↓
External API latency
        ↓
Connection pool saturation
```

**Lead-level answer:**

> "First I'd check whether it's a global slowdown or one endpoint, because that immediately narrows the layer. Then I'd correlate the timeline with the last deployment. After that I'd check DB query latency, Redis hit rate, connection pool usage, and external dependencies — in that order, because those cause most latency issues."

**If it started right after a deploy → rollback is the fastest mitigation.**

---

# 2. 🔴 "ERROR RATE SUDDENLY 20%"

**Scenario:**

> 500 error rate 0.1% se 20% ho gaya. Users complaint kar rahe hain.

```text
Error rate spike
      ↓
Recent deploy?          → rollback decision
      ↓
Which endpoint?         → one route or everything?
      ↓
Which error?            → 500 / timeout / connection refused
      ↓
App logs + request ID   → exact failure point
      ↓
Dependency down?        → DB / Redis / third-party
      ↓
Rollback / scale / fix
```

**Lead-level lines:**

> "I'd separate errors by endpoint and error type before doing anything else, because '20% errors' could be one broken route or a dependency failure."

> "If the errors correlate with a recent deployment, I'd roll back first and investigate the cause afterward — restoring service has priority."

---

# 3. 💀 "DATABASE CPU 100%"

**Scenario:**

> DB CPU 100% hai, API timeouts aa rahe hain. DB restart kar dein?

**Never blindly restart.** Restart is mitigation, not diagnosis.

```text
SHOW FULL PROCESSLIST
        ↓
Long-running queries?
        ↓
Missing index / full table scan?
        ↓
Lock waits / deadlock?
        ↓
Connection count at max?
        ↓
Sudden traffic or a bad query deployment?
```

**Answer:**

> "I would check the process list first to see if long-running queries are blocking resources, then use EXPLAIN on the expensive queries, verify index coverage, and check for lock contention. Restarting the DB would drop connections and could cause data consistency issues, so I'd treat it as a last resort, not a first step."

**Common real causes:**

```text
Missing index after a query change
N+1 queries from a new feature
A reporting job running during peak hours
Connection pool not configured
Accidental full table scan
```

---

# 4. 🧵 "REDIS DOWN"

**Scenario:**

> Redis cluster down hai. Application Redis par depend karti hai. Kya hoga?

**First question (this is what interviewer wants):**

> "Is Redis a cache or a source of truth?"

```text
Redis is only a CACHE
        ↓
Fallback to DB
        ↓
BUT: protect DB from cache-miss storm
        ↓
Rate limit / circuit breaker / reduce load

Redis stores SESSION / critical STATE
        ↓
This is an availability problem
        ↓
Need HA, failover, replica
```

**Lead-level answer:**

> "If Redis is a cache, the application should degrade gracefully — fall back to the database with protection like rate limiting or a circuit breaker, because a cache-miss storm can take down the DB too. If Redis holds sessions or critical state, then losing it directly affects users and we need high availability, replication and failover."

---

# 5. 💥 "CACHE STAMPEDE"

**Scenario:**

> Popular cache key expire ho gaya. 50,000 requests ek saath DB par gayi. DB nearly down.

```text
Key expires
    ↓
Thousands of misses
    ↓
All hit DB simultaneously
    ↓
DB overload
```

**Solutions:**

```text
Lock / mutex on cache rebuild   → only one request hits DB
Staggered TTL + jitter          → keys expire at different times
Serve stale value while refreshing
Request coalescing / single-flight
Warm cache before traffic peak
```

**Lead-level line:**

> "Cache expiry timing is a system design concern, not just a caching detail. I'd add TTL jitter and single-flight rebuild so that one popular key can't take down the database."

---

# 6. 🧠 "MEMORY KEEPS INCREASING"

**Scenario:**

> Node process ki memory 2 din mein steadily 300MB se 2.5GB chali gayi. Ab OOM kill ho raha hai.

```text
free -h
   ↓
Which process?
   ↓
Memory continuously increasing?     → leak, not load
   ↓
Heap snapshot (before)
   ↓
Load test / wait
   ↓
Heap snapshot (after)
   ↓
Compare retained objects
   ↓
Find the reference holding them
   ↓
Fix + verify with load test
```

**Answer:**

> "If memory grows continuously even when traffic is flat, that's a leak rather than capacity. I'd take heap snapshots at intervals and compare retained objects to identify what is being kept alive. Common causes are unbounded caches, event listeners not removed, growing arrays/maps, or large payloads held in closures."

**Real-world causes:**

```text
Unbounded in-memory cache
setInterval / listeners never cleaned
Global arrays used as queues
Large response objects retained
Streams not closed
```

**Interviewer check:** Don't say "increase memory" without explaining why it's leaking.

---

# 7. 💸 "DOUBLE PAYMENT / DUPLICATE ORDER"

**Scenario:**

> User ne ek baar pay kiya, but order 2 baar create ho gaya. Ya client retry se duplicate charge hua.

This is a **correctness + idempotency** scenario.

```text
Client retry / double click / network timeout
        ↓
Same request 2 baar application tak pahunchi
        ↓
2 orders / 2 charges
```

**Solution:**

```text
Idempotency key        → client generates, server stores
Unique DB constraint   → final safety net
Transaction            → charge + order atomically
Check-then-insert      → risky without unique constraint
Retry-safe API design
```

**Lead-level answer:**

> "I'd make the operation idempotent with a client-supplied idempotency key and a unique constraint in the database as the final guarantee. Application-level checks alone are not reliable under concurrency because two requests can both pass the check before either inserts."

**Strong follow-up line:**

> "The database constraint is the last line of defence. Application logic can be retried, restarted or scaled horizontally, but the constraint always holds."

---

# 8. 🚀 "BAD DEPLOYMENT"

**Scenario:**

> Deploy ke 10 minute baad users se errors aa rahe hain. Kya karoge?

```text
Stop further rollout
      ↓
Confirm correlation with deploy
      ↓
Rollback (fastest safe mitigation)
      ↓
Service restored
      ↓
Then investigate the actual bug
      ↓
Fix + test + re-deploy with canary
```

**Answer:**

> "Rolling back is the fastest way to restore service, so I wouldn't spend time debugging forward while customers are impacted. Once service is restored, I'd reproduce the issue, add a regression test, and re-deploy through a canary or staged rollout."

**Prevention (this is the Lead part):**

```text
Canary / percentage rollout
Automated smoke tests post-deploy
Feature flags for risky changes
One-command rollback
Deployment monitoring window
```

---

# 9. 🧨 "DATA CORRUPTION"

**Scenario:**

> Production data mein galat values aa gayi hain. 10,000 records affected.

**Order of thinking matters:**

```text
STOP the bleeding first
      ↓
Is the bug still writing bad data?   → stop it
      ↓
Is data recoverable from backup / audit log?
      ↓
Identify exact affected rows + scope
      ↓
Correct with verified script on a copy first
      ↓
Verify + monitor
```

**Lead-level answer:**

> "First I'd stop anything that is still writing incorrect data, because correcting records while the bug is live would be wasted effort. Then I'd define the exact scope of affected records, verify the fix on a copy, and only then apply it in production with proper validation and logging."

> "For banking systems I'd rely on audit trails, since we need to know not just what the correct value is, but what it was and who changed it."

---

# 10. ⏳ "QUEUE BACKLOG GROWING"

**Scenario:**

> Order-processing queue depth constantly badh rahi hai. Emails 3 hours late ja rahe hain.

```text
Producer rate > Consumer rate
        ↓
Why?
        ↓
Worker crashed?      → check worker status
Slow consumer?       → measure processing time
Downstream slow?     → DB / external API inside worker
Traffic spike?       → temporary or permanent
```

**Answer:**

> "I'd compare incoming and processing rates first to confirm the backlog is real and growing. Then I'd check whether we have enough healthy workers, whether consumer processing became slower due to a downstream dependency, or whether this is a genuine traffic spike."

**Fixes:**

```text
Scale workers (if downstream can handle it)
Batch processing
Optimize the slow step
Fix downstream bottleneck
Rate limit / throttle producer
Dead-letter queue for poison messages
```

⚠️ **Important nuance:** Scaling consumers when the *downstream* is the bottleneck makes it worse.

---

# 11. 🔌 "THIRD-PARTY API DOWN"

**Scenario:**

> Payment gateway / SMS provider / external API down hai. Ye hamari critical flow mein use hota hai.

```text
External dependency down
        ↓
Timeout configured?      → requests piling up
        ↓
Circuit breaker?         → fail fast
        ↓
Fallback / retry policy? → bounded retries only
        ↓
Graceful degradation?    → can we still serve user?
```

**Answer:**

> "I'd make sure requests fail fast with timeouts and a circuit breaker instead of piling up and consuming our own resources. Then I'd check whether we can degrade gracefully — for example queue the operation for later retry instead of failing the whole user flow."

**Rules:**

```text
Always set timeouts on external calls
Retry with exponential backoff + jitter
Retries must be idempotent
Circuit breaker to stop hammering a dead service
Never retry endlessly
```

---

# 12. 🔊 "HIGH CPU IN NODE PROCESS"

**Scenario:**

> Node process CPU 100% par stuck hai, requests process nahi ho rahi.

```text
top / htop
      ↓
Node process confirmed
      ↓
Event loop blocked?      → latency high even at moderate CPU
      ↓
CPU profile
      ↓
Expensive operation:
  Large loop
  sync fs call
  JSON.parse of huge payload
  crypto sync
  catastrophic regex
      ↓
Move to worker thread / optimize / fix regex
```

**Lead-level line:**

> "Node is single-threaded for JavaScript execution, so one CPU-heavy synchronous operation blocks every other request. That's why CPU-heavy work belongs in worker threads, a queue, or a separate service — not on the main event loop."

**Classic interview examples:**

```text
fs.readFileSync() in a request handler
JSON.parse(hugePayload)
Badly written regex (catastrophic backtracking)
Sorting/filtering a very large array per request
```

---

# 13. 📈 "TRAFFIC SPIKE / FLASH SALE"

**Scenario:**

> Kal flash sale hai, expected traffic 10x. Ab kya karoge?

**This is a planning scenario, not an incident scenario.**

```text
Expected load
      ↓
Load test at 10x
      ↓
Find breaking point
      ↓
App servers      → horizontally scale
DB               → biggest risk, plan reads/writes
Redis            → warm cache, capacity headroom
Queue            → absorb bursts
Rate limiting    → protect from abuse
Monitoring       → dashboards + alerts ready
Rollback plan    → ready before the sale
```

**Answer:**

> "I'd load test at the expected peak to find the real bottleneck before the event. Usually the database becomes the limit before the application servers, so I'd plan capacity, caching and connection pools around that. I'd also add rate limiting and queue-based buffering so a burst doesn't translate directly into DB pressure."

---

# 14. ⚖️ "ONE SERVER UNHEALTHY BEHIND LOAD BALANCER"

**Scenario:**

> 3 instances hain, 1 instance unhealthy hai. Load balancer traffic bhej raha hai usko?

```text
LB health check
      ↓
Instance removed from rotation?
      ↓
Investigate only that instance:
   /health endpoint
   CPU / memory
   Application logs
   Disk
   Network / security group
   Recent deploy on that node only
```

**Lead-level line:**

> "The first thing I'd verify is whether the load balancer actually removed it, because availability should not depend on a single instance. After that, the fact that only one instance is unhealthy often points to node-specific causes — a bad deploy, resource exhaustion, or local configuration."

---

# 15. 💾 "DISK FULL"

**Scenario:**

> Server ka disk 100% full hai, application logs likh nahi pa rahi.

```bash
df -h
du -sh /var/* 2>/dev/null
find /var -type f -size +500M -exec ls -lh {} \; 2>/dev/null
```

**Common causes:**

```text
Log files never rotated
Old deployments / releases accumulating
Temp files
Database files growing
Docker images / containers / volumes
Core dumps
```

**Answer:**

> "I'd identify what's consuming the space before deleting anything, because deleting the wrong file in production can make things worse. Most commonly it's logs without rotation or old releases. The permanent fix is log rotation, retention policies and disk-space alerting."

---

# 16. 🔐 "SEARCHING FOR A SECURITY ISSUE"

**Scenario:**

> Suspicious traffic / possible credential leak / unusual API access pattern mila.

```text
Immediate:
  Revoke / rotate leaked credentials
  Block abusive IPs at WAF / LB
  Check audit logs
  Determine scope of access

Then:
  Force password/session invalidation if needed
  Patch the exposure
  Notify per policy
  RCA + prevention
```

**Lead-level answer:**

> "For a security incident, containment comes before investigation — rotating credentials and revoking access first, then understanding the scope. Unlike a performance incident, I wouldn't wait for full root cause before containing, because the exposure is ongoing."

**Prevention:**

```text
Never commit secrets → use secret manager
Least-privilege IAM
Rotate secrets regularly
Audit logging
Rate limiting
Dependency scanning
```

---

# 17. 🔄 "CRON JOBS OVERLAPPING"

**Scenario:**

> Nightly report job 2 hours lagta hai, but 1 hour interval par schedule hai. Ab multiple instances chal rahe hain.

```text
Job duration > schedule interval
        ↓
Overlapping executions
        ↓
Duplicate data / DB load spike / race conditions
```

**Solutions:**

```text
Distributed lock (Redis)     → only one instance runs it
Job-level lock with TTL
Run once per schedule, not per instance
Split long jobs into batches
Alert if job exceeds expected duration
```

**Also important:**

> "In a multi-instance deployment, a cron on every instance runs the job N times. That's a very common production bug after scaling."

---

# 18. 🕐 "TIMEZONE / DATE BUG"

**Scenario:**

> Reports mein dates off-by-one aa rahi hain. Sirf kuch regions mein problem hai.

```text
Store everything in UTC       → source of truth
Convert only at display layer  → frontend / report
Never rely on server local time
Beware date-only vs datetime
Beware DST transitions
```

**Lead-level line:**

> "Time bugs often survive testing because they only appear around midnight boundaries, DST changes or specific regions. I'd standardise on UTC in the database and handle conversion at the presentation layer."

---

# 19. 📊 "READ REPLICA LAG"

**Scenario:**

> Write karke immediately read karne par purana data dikh raha hai.

```text
Write → Primary
Read  → Replica (lagging)
        ↓
User sees stale data
```

**Answer:**

> "This is read-after-write consistency. For flows where the user must see their own write immediately, I'd read from the primary for a short window, or make the client optimistic and reconcile. Read replicas improve read scalability but don't give you strong consistency."

**Lead-level line:**

> "Read replicas help with read scaling, not with correctness. Any flow that needs immediate consistency has to account for replication lag by design."

---

# 20. 👥 "LOGIN FAILING FOR SOME USERS ONLY"

**Scenario:**

> 90% users login kar pa rahe hain, 10% nahi kar pa rahe. Sab ke liye server up hai.

**Working user vs failing user compare karo:**

```text
Different browser / device?
Different region / network?
Different user role / data?
Token/session expired?
Cookies / CORS / sameSite?
CDN or WAF blocking?
Token validation against another node?
```

**Answer:**

> "When only some users are affected, I'd compare a working case against a failing case rather than assuming it's a global issue. I'd check browser network details, request payload, cookies, and backend logs for that specific user before making any infrastructure change."

**Never assume "browser cache"** — verify it.

---

# 21. 📦 "FILE UPLOAD FAILING"

**Scenario:**

> Chhote files upload ho rahi hain, badi files fail ho rahi hain (timeout / 413).

```text
Check status code:
  413 → payload too large (nginx / app limit)
  504 → gateway timeout (upload too slow for proxy timeout)
  400 → multipart parsing / size limit
  500 → storage / permissions
```

**Check layers:**

```text
Client
Nginx client_max_body_size + proxy timeouts
Application body limit
Object storage permissions
Disk space
```

**Lead-level line:**

> "A size-dependent failure usually points to a limit or timeout in the chain, so I'd check each layer's configured maximum instead of only looking at application code."

---

# 22. 🔁 "SESSIONS LOST AFTER DEPLOY"

**Scenario:**

> Deploy ke baad sab users logout ho gaye.

```text
Sessions stored in-memory?
        ↓
Deploy restarts process
        ↓
Sessions gone
        ↓
Users logged out
```

**Answer:**

> "That happens when sessions live in the application process memory. The fix is to externalise session storage to Redis or a database so that deployments or restarts don't invalidate user sessions. The same problem appears with multiple instances — in-memory sessions simply don't work behind a load balancer."

---

# 23. 🌍 "STATIC ASSETS / CDN BROKEN"

**Scenario:**

> Deployment ke baad kuch users ko purani JS file mil rahi hai, ya 404 aa raha hai.

```text
Stale CDN cache / long TTL
        ↓
New HTML referencing old hashed chunk (or reverse)
        ↓
ChunkLoadError / white screen
```

**Answer:**

> "Usually it's a CDN cache or versioning mismatch between the HTML and hashed asset filenames. I'd verify cache TTLs, ensure cache invalidation on deploy, and make sure index.html isn't cached aggressively while hashed assets are."

**Symptom to watch:**

```text
ChunkLoadError
Users on the app during deploy getting a white screen
Older HTML + newer assets
```

---

# 24. 🧮 "SLOW REPORT BLOCKING PRODUCTION"

**Scenario:**

> Ek manager ne heavy report chalayi, aur production API slow ho gayi.

```text
Heavy analytical query on production DB
        ↓
CPU / IO consumed
        ↓
OLTP requests affected
```

**Answer:**

> "Analytical and transactional workloads should not compete for the same resources. I'd move reporting to a read replica or a separate analytics path, and add query timeouts and resource limits so no single query can degrade the whole system."

**Practices:**

```text
Query timeout
Statement time limit
Run heavy jobs off-peak
Read replica for reporting
Query review / approval for ad-hoc queries
```

---

# 25. ⚡ "RETRY STORM"

**Scenario:**

> Ek dependency 30 seconds ke liye fail hui, but uske baad system recover nahi hua.

```text
Dependency fails briefly
        ↓
Clients/app retry aggressively
        ↓
Retries keep the dependency overloaded
        ↓
System never recovers
```

**Answer:**

> "Aggressive retries can turn a short outage into a prolonged one. The fix is exponential backoff with jitter, a retry budget, and a circuit breaker so we stop sending traffic when the dependency is clearly unhealthy."

**Rules:**

```text
Timeout every dependency
Exponential backoff + jitter
Cap retries
Circuit breaker
Retries must be safe (idempotent)
```

---

# 26. 🔍 "MONITORING SHOWS NOTHING"

**Scenario:**

> Users complaints kar rahe hain, but dashboards par sab green hai.

```text
Dashboards green ≠ system healthy
        ↓
What are we NOT measuring?
        ↓
Business metrics (logins, orders, payments)
Specific endpoints not instrumented
One region / one customer affected
Client-side errors not captured
Average hiding tail latency
```

**Lead-level answer:**

> "If users report a problem but dashboards look healthy, that usually means we're not measuring the right thing — most often the failure is in a specific endpoint, region or user segment. I'd look at business-level metrics and then drill into per-endpoint P95/P99 instead of relying on averages."

> "I'd rather add a metric that would have caught this than just fix the symptom."

---

# 27. 🧱 "DEPLOYMENT STUCK / PARTIAL ROLLOUT"

**Scenario:**

> Rolling deploy halfway atka hua hai. Kuch instances new code, kuch old code chal rahe hain.

```text
Mixed versions running
        ↓
Is the new version compatible with old?
   API contract
   DB schema
   Shared cache format
   Message format
        ↓
Pause rollout
        ↓
Roll back or roll forward — pick one, fast
```

**Answer:**

> "Mixed versions must be compatible during a rolling deploy. That's why backward-compatible migrations matter — expand, migrate, then contract — and why the API and message formats need to tolerate both versions. I'd decide quickly whether to roll back or complete the rollout rather than leaving it half-applied."

---

# 28. 🔀 "RACE CONDITION IN PRODUCTION"

**Scenario:**

> Kabhi kabhi galat data create ho raha hai — same resource ke liye duplicate ya lost update. Load kam ho to problem nahi aati.

```text
Load spike → concurrency → interleaving
        ↓
Check-then-act without atomicity
        ↓
Duplicate / lost update
```

**Solutions:**

```text
Unique DB constraint
Atomic UPDATE ... WHERE
Transaction with correct isolation
Row-level locking (SELECT ... FOR UPDATE)
Optimistic locking (version column)
```

**Lead-level line:**

> "Race conditions show up under concurrency, not under normal testing. When I see a bug that only appears under load, I look at check-then-act patterns and verify atomicity at the database level."

---

# 29. 🗂️ "DATA MIGRATION FAILED MIDWAY"

**Scenario:**

> Migration 60% par fail ho gayi. Aadha data new format mein, aadha purane mein.

```text
Migration not idempotent / not resumable
        ↓
Partial state
        ↓
App must still work with both shapes
```

**Answer:**

> "Migrations should be resumable and idempotent, and the schema change should be backward compatible. For a partial failure I'd first confirm the application can still read both old and new formats, then resume or correct the migration in a controlled way rather than restoring a full backup if avoidable."

**Pattern (very strong to mention):**

```text
EXPAND   → add new column, dual-write
MIGRATE  → backfill in batches
CONTRACT → remove old column after verification
```

---

# 30. 📣 "INCIDENT COMMUNICATION"

**Scenario:**

> Production down hai. Manager aur customer success team baar baar puch rahe hain status.

**Answer:**

> "During an incident my priority order is: restore service, communicate clearly, and only then investigate in depth. I'd give the stakeholders honest, regular updates with known impact, current status and next update time — I wouldn't go silent, and I wouldn't speculate about root cause before I know it."

**Communication structure:**

```text
What is broken
Who is affected
What we know so far
What we are doing
Next update in X minutes
```

**What not to do:**

```text
Go silent
Blame individuals
Guess root cause publicly
Announce a fix time you can't guarantee
```

---

# 🏆 SCENARIO DEBUG FORMULA — ONE LINE

```text
IMPACT
  ↓
ISOLATE (layer by layer)
  ↓
MITIGATE (rollback / flag / scale / degrade)
  ↓
RESTORE
  ↓
ROOT CAUSE (logs + metrics + trace)
  ↓
FIX + TEST
  ↓
PREVENT (monitoring + runbook + automation)
```

Har scenario mein 4 sawaal pucho:

```text
1. Ye kis layer ka problem hai?
2. Kitne users / kitna business impact?
3. Sabse fast safe mitigation kya hai?
4. Isse dobara hone se kaise rokenge?
```

Aur yaad rakho:

> **Amateur:** "Restart kar deta hoon."
>
> **Senior:** "Logs dekh leta hoon."
>
> **Lead:** "Pehle impact aur blast radius establish karta hoon, phir layer isolate karta hoon, service restore karta hoon, aur root cause ke baad prevention." 🚀

---

# 🎯 80/20 PRIORITY RANKING

Agar time kam hai, to saare 30 scenarios equal effort se mat padho.

```text
This file's weight in overall prep: ~15%
Reason: Scenario round production debugging aur leadership dono ko combine karta hai — isliye unhe pehle padho, phir yahan revise karo
Overall prep order: resume deep dive → production debugging → system design → production scenarios → leadership → coding round
```

## 🥇 TIER 1 — MUST DO (60% time)

In 8 ka poora answer flow yaad karo — ye lead round mein sabse zyada aate hain.

```text
1.  "API suddenly slow"
2.  "Error rate suddenly 20%"
3.  "DB CPU 100%"
4.  "Redis down"
6.  "Memory keeps increasing"
7.  "Double payment / duplicate order"
8.  "Bad deployment"
30. Incident communication
```

## 🥈 TIER 2 — HIGH ROI (30%)

```text
5.  Cache stampede
9.  Data corruption
10. Queue backlog growing
11. Third-party API down
12. High CPU in Node process
20. Login failing for some users
25. Retry storm
26. Monitoring shows nothing
28. Race condition in production
```

## 🥉 TIER 3 — CONCEPT + FRAMEWORK (10%)

Inhe poora ratna nahi hai — sirf ye yaad rakho ki pehla step kya hoga aur mitigation kya hai.

```text
13. Traffic spike / flash sale
14. One server unhealthy behind LB
15. Disk full
16. Security incident
17. Cron jobs overlapping
18. Timezone / date bug
19. Read replica lag
21. File upload failing
22. Sessions lost after deploy
23. CDN / static assets broken
24. Slow report blocking production
27. Deployment stuck / partial rollout
29. Data migration failed midway
```
