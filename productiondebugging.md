# 🚨 Production Debugging — One-Click Command Cheat Sheet

## 0. GOLDEN RULE

Production issue mein blindly restart mat karo.

```text
Symptom
  ↓
Metrics
  ↓
Logs
  ↓
Trace / Request ID
  ↓
Identify bottleneck
  ↓
Mitigate
  ↓
Root Cause
  ↓
Permanent Fix
```

---

# 1. 🌐 FRONTEND / BROWSER

### Network check

Chrome DevTools:

```text
F12 → Network
```

Check:

```text
Status Code
Request URL
Request Method
Request Payload
Request Headers
Response
Response Time
Size
Waterfall
```

### Quick interpretation

```text
200 → HTTP success
201 → Created
400 → Bad request
401 → Authentication issue
403 → Authorization / permission
404 → Resource/route not found
429 → Rate limited
500 → Backend error
502 → Proxy/upstream problem
503 → Service unavailable
504 → Upstream timeout
```

### Frontend console

```text
F12 → Console
```

Look for:

```text
TypeError
CORS
Failed to fetch
ChunkLoadError
Network Error
Unhandled Promise Rejection
```

### Performance

```text
F12 → Performance
```

Check:

```text
Long Tasks
Main-thread blocking
Large JS execution
Rendering
Layout
Paint
```

### Memory

```text
F12 → Memory
```

Take:

```text
Heap Snapshot
```

Compare snapshots to detect retained objects/leaks.

---

# 2. 🌍 NETWORK / DNS

### DNS

```bash
nslookup example.com
```

or:

```bash
dig example.com
```

Check:

```text
IP
DNS resolution
```

### Check connectivity

```bash
ping example.com
```

Note: ping failure doesn't necessarily mean HTTP is down because ICMP may be blocked.

### Check HTTP response

```bash
curl -I https://example.com
```

### Detailed HTTP debugging

```bash
curl -v https://example.com
```

### Measure request timing

```bash
curl -w "\nDNS: %{time_namelookup}\nConnect: %{time_connect}\nTTFB: %{time_starttransfer}\nTotal: %{time_total}\n" -o /dev/null -s https://example.com
```

Very useful to identify:

```text
DNS slow?
Connection slow?
Server response slow?
Total request slow?
```

---

# 3. 🔥 CHECK SERVER / LINUX

### CPU + Memory

```bash
top
```

Better if installed:

```bash
htop
```

### Load average

```bash
uptime
```

Example:

```text
load average: 2.1, 2.5, 3.0
```

Compare load with number of CPU cores.

### Memory

```bash
free -h
```

### Disk

```bash
df -h
```

### Find large directories

```bash
du -sh /var/* 2>/dev/null
```

### Find large files

```bash
find /var -type f -size +500M -exec ls -lh {} \; 2>/dev/null
```

---

# 4. 🔌 CHECK PORT / PROCESS

### Which process is using port 3000?

```bash
ss -ltnp | grep :3000
```

Example:

```text
LISTEN ... 127.0.0.1:3000 ... node
```

Meaning:

```text
Port 3000 is listening
Node process owns it
```

### Find process

```bash
ps aux | grep node
```

### Specific process

```bash
ps -fp <PID>
```

### Open files/connections

```bash
lsof -p <PID>
```

---

# 5. 🟢 NODE.JS PRODUCTION

### Check process

```bash
ps aux | grep node
```

### PM2 status

```bash
pm2 status
```

### PM2 logs

```bash
pm2 logs
```

Specific app:

```bash
pm2 logs app-name
```

### Last 100 lines

```bash
pm2 logs app-name --lines 100
```

### CPU / memory per PM2 process

```bash
pm2 monit
```

### Restart

```bash
pm2 restart app-name
```

⚠️ Restart is mitigation, not root-cause analysis.

---

# 6. 🧠 NODE EVENT LOOP

If API latency suddenly increases:

Check:

```text
CPU
Memory
Event-loop lag
GC
Sync operations
Large JSON processing
CPU-heavy code
```

Typical blockers:

```javascript
fs.readFileSync()
JSON.parse(hugePayload)
JSON.stringify(hugeObject)
crypto-heavy synchronous operation
large loops
```

Production question:

> "Why is Node API slow even though CPU isn't necessarily 100%?"

Answer:

> Event-loop blocking, slow I/O, DB wait, connection pool wait, external dependency latency or GC can increase request latency even when average CPU looks normal.

---

# 7. 🧵 CONNECTIONS / NETWORK SOCKETS

### All listening ports

```bash
ss -ltnp
```

### Active TCP connections

```bash
ss -tan
```

### Count connections to port

```bash
ss -tan | grep :3000 | wc -l
```

Useful for:

```text
Connection spike
Connection leak
Too many clients
```

---

# 8. 🔄 NGINX

### Check configuration

```bash
nginx -t
```

### Reload safely

```bash
systemctl reload nginx
```

### Status

```bash
systemctl status nginx
```

### Logs

```bash
tail -f /var/log/nginx/access.log
```

```bash
tail -f /var/log/nginx/error.log
```

### Search errors

```bash
grep "502\|503\|504" /var/log/nginx/access.log
```

Useful for identifying:

```text
502 → upstream communication issue
504 → timeout
```

---

# 9. ⚖️ LOAD BALANCER

Check:

```text
Healthy instances
Unhealthy instances
Target response time
5xx
Connection count
Traffic distribution
```

If one instance is unhealthy:

```text
LB
 ↓
Instance A ✅
Instance B ❌
Instance C ✅
```

Investigate:

```text
/health
CPU
Memory
Application logs
Port
Security Group
Network
```

---

# 10. 🧠 REDIS

### Check Redis

```bash
redis-cli ping
```

Expected:

```text
PONG
```

### Redis info

```bash
redis-cli INFO
```

### Memory

```bash
redis-cli INFO memory
```

Look at:

```text
used_memory
maxmemory
evicted_keys
```

### Stats

```bash
redis-cli INFO stats
```

Look at:

```text
keyspace_hits
keyspace_misses
```

### Calculate hit rate

Conceptually:

```text
hit rate =
hits / (hits + misses)
```

### Check keys

```bash
redis-cli DBSIZE
```

### TTL

```bash
redis-cli TTL <key>
```

### Check value

```bash
redis-cli GET <key>
```

For hash:

```bash
redis-cli HGETALL <key>
```

### Important Redis bottlenecks

```text
Memory pressure
Evictions
Low cache hit ratio
Hot key
Huge values
Slow commands
Connection saturation
Network latency
```

⚠️ Production mein blindly:

```bash
KEYS *
```

mat chalana.

Large Redis dataset mein ye blocking ho sakta hai.

Prefer:

```bash
SCAN 0
```

---

# 11. 🗄️ MYSQL

### Login

```bash
mysql -u <user> -p
```

### Current connections

```sql
SHOW PROCESSLIST;
```

Better:

```sql
SHOW FULL PROCESSLIST;
```

Look for:

```text
Sleep
Locked
Waiting
Long-running queries
```

### DB status

```sql
SHOW STATUS;
```

### Max connections

```sql
SHOW VARIABLES LIKE 'max_connections';
```

### Slow query investigation

```sql
EXPLAIN SELECT ...;
```

Look for:

```text
Full table scan
Bad join
Wrong index
Huge rows examined
```

### Indexes

```sql
SHOW INDEX FROM table_name;
```

### Tables

```sql
SHOW TABLES;
```

### Table size

```sql
SELECT
  table_name,
  ROUND((data_length + index_length)/1024/1024, 2) AS size_mb
FROM information_schema.tables
WHERE table_schema = 'your_db'
ORDER BY size_mb DESC;
```

---

# 12. 🐘 DATABASE BOTTLENECK IDENTIFICATION

If DB is slow, don't immediately say:

> "Add more CPU."

Check this flow:

```text
High API latency
      ↓
DB latency?
      ↓
Yes
      ↓
Slow Query?
 ┌────┴────┐
Yes        No
 ↓          ↓
EXPLAIN    Connections?
Index       Locks?
Query       CPU?
optimization I/O?
```

Main signals:

```text
CPU
Connections
Query latency
Slow queries
Locks
IOPS
Disk
Rows scanned
Replication lag
```

---

# 13. 📖 READ REPLICA

If reads are slow:

Check:

```text
Primary DB load
Replica load
Replica lag
Read/write ratio
```

Command depends on DB engine/provider.

Important interview point:

> Read replica improves read scalability; it does not automatically solve slow writes.

---

# 14. 🔐 API DIRECTLY TEST KARNA

Frontend ko bypass karke:

```bash
curl https://api.example.com/users
```

POST:

```bash
curl -X POST https://api.example.com/login \
-H "Content-Type: application/json" \
-d '{"email":"test@example.com","password":"xxx"}'
```

Authenticated:

```bash
curl https://api.example.com/profile \
-H "Authorization: Bearer <TOKEN>"
```

Why?

```text
Frontend problem?
       OR
Backend problem?
```

quickly isolate kar sakte ho.

---

# 15. ⏱️ API LATENCY BREAKDOWN

```bash
curl -w "\n\
DNS: %{time_namelookup}\n\
Connect: %{time_connect}\n\
TLS: %{time_appconnect}\n\
TTFB: %{time_starttransfer}\n\
Total: %{time_total}\n" \
-o /dev/null -s https://api.example.com
```

Interpretation:

```text
DNS high       → DNS issue
Connect high   → Network/server connection
TLS high       → TLS/handshake
TTFB high      → Backend processing
Total high     → Overall request slow
```

---

# 16. 📜 LOG SEARCH

### Last 100 lines

```bash
tail -n 100 app.log
```

### Live logs

```bash
tail -f app.log
```

### Search error

```bash
grep -i "error" app.log
```

### Search specific request ID

```bash
grep "request-id-123" app.log
```

### Count errors

```bash
grep -i "error" app.log | wc -l
```

---

# 17. 🆔 REQUEST ID — VERY IMPORTANT

Production debugging mein har request ke saath:

```text
X-Request-ID
```

jaisa ID useful hai.

Flow:

```text
Frontend
   ↓ request-id
Nginx
   ↓
Node API
   ↓
Redis
   ↓
DB
   ↓
External API
```

Same ID logs mein search karke **one request ka complete journey** trace kar sakte ho.

---

# 18. 📊 P95/P99 DEBUGGING

Never look only at average.

Example:

```text
Average = 100ms
P50     = 80ms
P95     = 300ms
P99     = 2s
```

Meaning:

```text
Most users → okay
Tail users → very slow
```

Investigate:

```text
Slow DB queries
Connection pool waits
External API
GC
Large payload
Specific endpoint
Specific customer/data pattern
```

---

# 19. 🚦 ERROR RATE

Basic production dashboard:

```text
RPS
Error Rate
P50
P95
P99
CPU
Memory
DB latency
DB connections
Redis hit rate
Queue depth
```

Agar ye 8–10 metrics available hain, debugging kaafi easy ho jati hai.

---

# 20. 📦 QUEUE DEBUGGING

If queue backlog increasing:

Check:

```text
Producer rate
Consumer rate
Queue depth
Processing latency
Worker count
Worker errors
DLQ count
```

Example:

```text
Incoming = 1000 msg/s
Processing = 600 msg/s
```

Backlog increase hoga.

Fix:

```text
More workers
Optimize consumer
Batch processing
Fix downstream bottleneck
Rate-limit producer
```

---

# 21. 💀 PROCESS CRASH

Check:

```bash
pm2 status
```

```bash
pm2 logs
```

Then:

```bash
dmesg | tail
```

Possible:

```text
OOM
Segmentation fault
Unhandled exception
Container killed
```

Memory:

```bash
free -h
```

Process:

```bash
ps aux --sort=-%mem | head
```

---

# 22. 💾 OOM — OUT OF MEMORY

Check:

```bash
free -h
```

```bash
dmesg | grep -i "out of memory"
```

Node process:

```bash
ps aux --sort=-%mem | head
```

Possible causes:

```text
Memory leak
Huge payload
Unbounded cache
Too many concurrent requests
Large in-memory data
```

Don't simply increase memory without finding why.

---

# 23. 🐳 DOCKER

Containers:

```bash
docker ps
```

All:

```bash
docker ps -a
```

Logs:

```bash
docker logs <container>
```

Live:

```bash
docker logs -f <container>
```

Resource usage:

```bash
docker stats
```

Inspect:

```bash
docker inspect <container>
```

---

# 24. ☁️ AWS PRODUCTION

### EC2

Check:

```text
CPU
Memory
Disk
Network
Status checks
```

### CloudWatch

Look at:

```text
CPUUtilization
NetworkIn
NetworkOut
StatusCheckFailed
Application metrics
Logs
```

### ALB

Check:

```text
RequestCount
TargetResponseTime
HTTPCode_Target_5XX
HealthyHostCount
UnHealthyHostCount
```

### RDS

Check:

```text
CPU
Database connections
Free storage
Read/Write latency
IOPS
Replica lag
```

---

# 25. 🔥 "API SLOW" — COMPLETE DEBUG FLOW

Agar interviewer bole:

> Production API suddenly slow hai. What will you do?

Answer:

```text
1. Check P95/P99
        ↓
2. Check error rate
        ↓
3. Check recent deployment
        ↓
4. Check frontend/network
        ↓
5. curl API directly
        ↓
6. Check LB/Nginx
        ↓
7. Check Node CPU/memory/event-loop
        ↓
8. Check Redis latency/hit rate
        ↓
9. Check DB latency/connections/slow queries
        ↓
10. Check external APIs
        ↓
11. Identify bottleneck
        ↓
12. Mitigate
        ↓
13. Fix root cause
        ↓
14. Monitor
```

---

# 26. 🔥 "500 ERROR" — COMPLETE DEBUG FLOW

```text
Frontend
   ↓
Network tab
   ↓
Request/Response
   ↓
curl
   ↓
Nginx/LB logs
   ↓
Node logs
   ↓
Request ID
   ↓
DB/Redis dependency
   ↓
Recent deployment
```

---

# 27. 🔥 "HIGH CPU" — COMPLETE DEBUG FLOW

```text
top / htop
    ↓
Find process
    ↓
ps
    ↓
Node process?
    ↓
CPU profile / event-loop
    ↓
Find expensive operation
    ↓
Large loop?
Sync operation?
JSON?
Crypto?
Regex?
    ↓
Optimize / Worker Thread
```

---

# 28. 🔥 "HIGH MEMORY" — COMPLETE DEBUG FLOW

```text
free -h
   ↓
Which process?
   ↓
ps --sort=-%mem
   ↓
Memory continuously increasing?
   ↓
Heap snapshot
   ↓
Compare snapshots
   ↓
Retained objects
   ↓
Find reference
   ↓
Fix leak
   ↓
Load test + verify
```

---

# 29. 🔥 "DB SLOW" — COMPLETE DEBUG FLOW

```text
API latency
    ↓
DB latency
    ↓
Connections?
    ↓
Slow queries?
    ↓
SHOW PROCESSLIST
    ↓
EXPLAIN
    ↓
Index?
    ↓
Lock?
    ↓
CPU / I/O?
    ↓
Replication lag?
    ↓
Fix appropriate bottleneck
```

---

# 30. 🔥 "REDIS SLOW / DOWN"

```text
redis-cli ping
      ↓
INFO
      ↓
Memory?
Evictions?
Hit rate?
Connections?
      ↓
Hot key?
Huge value?
Slow command?
      ↓
Cache fallback?
      ↓
Protect DB
```

---

# 31. 🔥 "LOGIN NOT WORKING FOR SOME USERS"

```text
Working user
      vs
Failing user
      ↓
Browser Network
      ↓
Status code
      ↓
Request payload
      ↓
Cookies
      ↓
Authorization
      ↓
CORS
      ↓
Backend logs
      ↓
User-specific data
      ↓
Token/session
      ↓
DB/Redis
      ↓
CDN/WAF
```

Never assume:

```text
"It's browser cache."
```

Test:

```text
Normal browser
Incognito
Different browser
Different device
curl
```

---

# 32. 🧠 FRONTEND → BACKEND → DB FULL DEBUG MAP

```text
USER
 │
 ▼
BROWSER
 │
 ├─ Console
 ├─ Network
 ├─ Performance
 └─ Memory
 │
 ▼
DNS
 │
 ▼
CDN / WAF
 │
 ▼
LOAD BALANCER
 │
 ├─ Health
 ├─ 4xx
 └─ 5xx
 │
 ▼
NGINX
 │
 ├─ access.log
 └─ error.log
 │
 ▼
NODE.JS
 │
 ├─ CPU
 ├─ Memory
 ├─ Event Loop
 ├─ Logs
 └─ PM2
 │
 ├──────────────┐
 ▼              ▼
REDIS           EXTERNAL API
 │
 ├─ Hit rate    ├─ Latency
 ├─ Memory      ├─ Timeout
 ├─ Eviction    └─ Errors
 └─ Latency
 │
 ▼
DATABASE
 │
 ├─ CPU
 ├─ Connections
 ├─ Locks
 ├─ Slow queries
 ├─ EXPLAIN
 └─ I/O
 │
 ▼
STORAGE
```

---

# 33. ⭐ TOP 15 COMMANDS — MUST REMEMBER

Agar interview se pehle sirf commands yaad karne hain:

```bash
top
htop
free -h
df -h
du -sh
ps aux
ps -fp <PID>
ss -ltnp
ss -tan
lsof -p <PID>
curl -v <URL>
curl -I <URL>
tail -f <log>
grep "error" <log>
pm2 monit
```

Plus:

```bash
nginx -t
redis-cli ping
redis-cli INFO
```

MySQL:

```sql
SHOW FULL PROCESSLIST;
EXPLAIN SELECT ...;
SHOW INDEX FROM table_name;
```

---

# 34. ⭐ LEAD ENGINEER KA MOST IMPORTANT DEBUGGING MINDSET

Don't say:

> "Server restart kar deta hoon."

Say:

> "First I want to identify where the latency or failure is coming from."

Don't say:

> "DB slow hai."

Say:

> "I'll verify DB latency, slow queries, connection pool, locks and resource utilization."

Don't say:

> "Redis issue hai."

Say:

> "I'll check Redis latency, hit/miss ratio, memory pressure, evictions and connection health."

Don't say:

> "Frontend issue hai."

Say:

> "I'll use browser Network and Console to isolate whether the request is failing before reaching the backend or the backend response is incorrect."

---

# 🏆 ONE-LINE PRODUCTION DEBUGGING FORMULA

```text
USER
→ BROWSER
→ NETWORK
→ DNS/CDN/WAF
→ LB
→ NGINX
→ NODE
→ REDIS
→ DB
→ EXTERNAL SERVICES
→ AWS/OS
```

Har layer par 4 questions:

```text
1. Is it healthy?
2. Is it slow?
3. Is it overloaded?
4. Is it throwing errors?
```

Aur Lead Engineer ke liye final formula:

```text
MEASURE
→ ISOLATE
→ MITIGATE
→ ROOT CAUSE
→ FIX
→ VERIFY
→ PREVENT
```

**Ye production debugging ka sabse important 80/20 framework hai.**

---

# 🎯 80/20 PRIORITY RANKING

Agar interview se pehle time kam hai, to ye order follow karo.

```text
This file's weight in overall prep: ~18%
Reason: Lead Engineer ko mid-level se differentiate karne wala yahi round hai — aur scenario round bhi isi par based hai
Overall prep order: resume deep dive → production debugging → system design → production scenarios → leadership → coding round
```

## 🥇 TIER 1 — MUST DO (60% time)

```text
Full debug map (USER → BROWSER → ... → DB → STORAGE)
"API slow" complete flow
"500 error" complete flow
top / htop / free -h / df -h
ps aux / ps -fp <PID>
ss -ltnp
curl -v / curl -I / curl -w timing breakdown
tail -f + grep "error"
pm2 status / logs / monit
MySQL: SHOW FULL PROCESSLIST / EXPLAIN / SHOW INDEX
Redis: redis-cli ping / INFO memory / INFO stats
X-Request-ID end-to-end tracing
P95 / P99 (never trust average)
```

## 🥈 TIER 2 — HIGH ROI (30%)

```text
nginx -t + access/error log grep for 502/503/504
Load balancer healthy vs unhealthy instance checks
Redis hit rate, evictions, TTL, DBSIZE
DB bottleneck flow (queries vs connections vs locks vs IO)
Read replica lag
Queue debugging (producer rate vs consumer rate)
High CPU flow + event-loop blocking causes
High memory flow + heap snapshot comparison
docker ps / logs / stats
CloudWatch + ALB + RDS metrics
```

## 🥉 TIER 3 — KNOW IT EXISTS (10%)

```text
Browser Performance / Memory tab deep dive
OOM specifics (dmesg)
Process crash investigation
Large file/directory hunting (du, find)
AWS EC2 status checks
DB table size query
"Login not working for some users" comparison checklist
```
