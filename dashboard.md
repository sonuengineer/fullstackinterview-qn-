# 📖 Interview Prep Dashboard

Ek page. Saare rounds, saare questions. Kindle ki tarah top se neeche padho, ya apne round par jump karo.

**Kaise use karein:** har question line apne answer par link hai. Neeche diya 3-pass order follow karo — Pass 1 se start karo.

---

## 🎯 3-Pass Reading Order (80/20)

```text
PASS 1
  Resume & Project Deep Dive    35 q
  Production Debugging          35 q
  Production Scenarios          31 q

PASS 2
  System Design                 35 q
  Distributed Systems           20 q
  Leadership & Behavioral       30 q
  Coding Round                  30 q

PASS 3
  JavaScript                    20 q
  Node.js                       20 q
  React                         20 q
  Next.js                       20 q
  Database & Redis              20 q
  AWS & Cloud                   20 q

```

---

## 📚 Contents

```text
 1. Resume & Project Deep Dive
 2. Production Debugging
 3. Production Scenarios
 4. System Design
 5. Distributed Systems
 6. Leadership & Behavioral
 7. Coding Round
 8. JavaScript
 9. Node.js
10. React
11. Next.js
12. Database & Redis
13. AWS & Cloud
```

---

## Resume & Project Deep Dive

[resumedeepdrive.md](resumedeepdrive.md) · **35 questions** · Banking project, CTS optimization, React/Node/Redis/DB/AWS drilling + STAR stories

1. [Tell me about your current/most recent project.](resumedeepdrive.md#1-tell-me-about-your-currentmost-recent-project)
2. [What exactly was your role in the project?](resumedeepdrive.md#2-what-exactly-was-your-role-in-the-project)
3. [Explain the architecture of your banking application.](resumedeepdrive.md#3-explain-the-architecture-of-your-banking-application)
4. [You mentioned CTS optimization. What exactly did you improve?](resumedeepdrive.md#4-you-mentioned-cts-optimization-what-exactly-did-you-improve)
5. [How did you identify the bottleneck?](resumedeepdrive.md#5-how-did-you-identify-the-bottleneck)
6. [Was the CTS problem frontend or backend?](resumedeepdrive.md#6-was-the-cts-problem-frontend-or-backend)
7. [How do you prove your optimization actually worked?](resumedeepdrive.md#7-how-do-you-prove-your-optimization-actually-worked)
8. [What if optimization makes one API faster but increases DB load?](resumedeepdrive.md#8-what-if-optimization-makes-one-api-faster-but-increases-db-load)
9. [Why did you choose React?](resumedeepdrive.md#9-why-did-you-choose-react)
10. [How do you optimize a slow React application?](resumedeepdrive.md#10-how-do-you-optimize-a-slow-react-application)
11. [What was the biggest React performance issue you handled?](resumedeepdrive.md#11-what-was-the-biggest-react-performance-issue-you-handled)
12. [Why Node.js for backend?](resumedeepdrive.md#12-why-nodejs-for-backend)
13. [How do you handle high traffic in Node.js?](resumedeepdrive.md#13-how-do-you-handle-high-traffic-in-nodejs)
14. [What happens if one Node.js server crashes?](resumedeepdrive.md#14-what-happens-if-one-nodejs-server-crashes)
15. [What is your approach to Node.js production debugging?](resumedeepdrive.md#15-what-is-your-approach-to-nodejs-production-debugging)
16. [How do you identify a slow database query?](resumedeepdrive.md#16-how-do-you-identify-a-slow-database-query)
17. [Why not create indexes on every column?](resumedeepdrive.md#17-why-not-create-indexes-on-every-column)
18. [What if DB becomes the bottleneck?](resumedeepdrive.md#18-what-if-db-becomes-the-bottleneck)
19. [Why did you use Redis?](resumedeepdrive.md#19-why-did-you-use-redis)
20. [Explain cache-aside.](resumedeepdrive.md#20-explain-cache-aside)
21. [What happens if Redis goes down?](resumedeepdrive.md#21-what-happens-if-redis-goes-down)
22. [How have you used AWS?](resumedeepdrive.md#22-how-have-you-used-aws)
23. [Explain your EC2 production architecture.](resumedeepdrive.md#23-explain-your-ec2-production-architecture)
24. [Why use Nginx in front of Node.js?](resumedeepdrive.md#24-why-use-nginx-in-front-of-nodejs)
25. [What is PM2 used for?](resumedeepdrive.md#25-what-is-pm2-used-for)
26. [Tell me about a production issue you handled.](resumedeepdrive.md#26-tell-me-about-a-production-issue-you-handled)
27. [Production is down. What do you do?](resumedeepdrive.md#27-production-is-down-what-do-you-do)
28. [How do you secure a banking application?](resumedeepdrive.md#28-how-do-you-secure-a-banking-application)
29. [How do you prevent unauthorized access to APIs?](resumedeepdrive.md#29-how-do-you-prevent-unauthorized-access-to-apis)
30. [What was the hardest technical problem you solved?](resumedeepdrive.md#30-what-was-the-hardest-technical-problem-you-solved)
31. [Tell me about a technical decision you made.](resumedeepdrive.md#31-tell-me-about-a-technical-decision-you-made)
32. [Tell me about a mistake you made.](resumedeepdrive.md#32-tell-me-about-a-mistake-you-made)
33. [What is something you don't know well?](resumedeepdrive.md#33-what-is-something-you-dont-know-well)
34. [What would you improve in your current system?](resumedeepdrive.md#34-what-would-you-improve-in-your-current-system)
35. [If you join us as Lead Engineer, what value will you bring?](resumedeepdrive.md#35-if-you-join-us-as-lead-engineer-what-value-will-you-bring)

---

## Production Debugging

[productiondebugging.md](productiondebugging.md) · **35 questions** · Layer-by-layer debug flows + one-click commands (browser to DB)

1. [GOLDEN RULE](productiondebugging.md#0-golden-rule)
2. [🌐 FRONTEND / BROWSER](productiondebugging.md#1--frontend--browser)
3. [🌍 NETWORK / DNS](productiondebugging.md#2--network--dns)
4. [🔥 CHECK SERVER / LINUX](productiondebugging.md#3--check-server--linux)
5. [🔌 CHECK PORT / PROCESS](productiondebugging.md#4--check-port--process)
6. [🟢 NODE.JS PRODUCTION](productiondebugging.md#5--nodejs-production)
7. [🧠 NODE EVENT LOOP](productiondebugging.md#6--node-event-loop)
8. [🧵 CONNECTIONS / NETWORK SOCKETS](productiondebugging.md#7--connections--network-sockets)
9. [🔄 NGINX](productiondebugging.md#8--nginx)
10. [⚖️ LOAD BALANCER](productiondebugging.md#9--load-balancer)
11. [🧠 REDIS](productiondebugging.md#10--redis)
12. [🗄️ MYSQL](productiondebugging.md#11--mysql)
13. [🐘 DATABASE BOTTLENECK IDENTIFICATION](productiondebugging.md#12--database-bottleneck-identification)
14. [📖 READ REPLICA](productiondebugging.md#13--read-replica)
15. [🔐 API DIRECTLY TEST KARNA](productiondebugging.md#14--api-directly-test-karna)
16. [⏱️ API LATENCY BREAKDOWN](productiondebugging.md#15--api-latency-breakdown)
17. [📜 LOG SEARCH](productiondebugging.md#16--log-search)
18. [🆔 REQUEST ID — VERY IMPORTANT](productiondebugging.md#17--request-id--very-important)
19. [📊 P95/P99 DEBUGGING](productiondebugging.md#18--p95p99-debugging)
20. [🚦 ERROR RATE](productiondebugging.md#19--error-rate)
21. [📦 QUEUE DEBUGGING](productiondebugging.md#20--queue-debugging)
22. [💀 PROCESS CRASH](productiondebugging.md#21--process-crash)
23. [💾 OOM — OUT OF MEMORY](productiondebugging.md#22--oom--out-of-memory)
24. [🐳 DOCKER](productiondebugging.md#23--docker)
25. [☁️ AWS PRODUCTION](productiondebugging.md#24--aws-production)
26. [🔥 "API SLOW" — COMPLETE DEBUG FLOW](productiondebugging.md#25--api-slow--complete-debug-flow)
27. [🔥 "500 ERROR" — COMPLETE DEBUG FLOW](productiondebugging.md#26--500-error--complete-debug-flow)
28. [🔥 "HIGH CPU" — COMPLETE DEBUG FLOW](productiondebugging.md#27--high-cpu--complete-debug-flow)
29. [🔥 "HIGH MEMORY" — COMPLETE DEBUG FLOW](productiondebugging.md#28--high-memory--complete-debug-flow)
30. [🔥 "DB SLOW" — COMPLETE DEBUG FLOW](productiondebugging.md#29--db-slow--complete-debug-flow)
31. [🔥 "REDIS SLOW / DOWN"](productiondebugging.md#30--redis-slow--down)
32. [🔥 "LOGIN NOT WORKING FOR SOME USERS"](productiondebugging.md#31--login-not-working-for-some-users)
33. [🧠 FRONTEND → BACKEND → DB FULL DEBUG MAP](productiondebugging.md#32--frontend--backend--db-full-debug-map)
34. [⭐ TOP 15 COMMANDS — MUST REMEMBER](productiondebugging.md#33--top-15-commands--must-remember)
35. [⭐ LEAD ENGINEER KA MOST IMPORTANT DEBUGGING MINDSET](productiondebugging.md#34--lead-engineer-ka-most-important-debugging-mindset)

---

## Production Scenarios

[productionsenerio.md](productionsenerio.md) · **31 questions** · Incidents: impact, isolate, mitigate, root cause, prevent

1. [🧠 HOW TO ANSWER ANY PRODUCTION SCENARIO](productionsenerio.md#0--how-to-answer-any-production-scenario)
2. [🌐 "API SUDDENLY SLOW"](productionsenerio.md#1--api-suddenly-slow)
3. [🔴 "ERROR RATE SUDDENLY 20%"](productionsenerio.md#2--error-rate-suddenly-20)
4. [💀 "DATABASE CPU 100%"](productionsenerio.md#3--database-cpu-100)
5. [🧵 "REDIS DOWN"](productionsenerio.md#4--redis-down)
6. [💥 "CACHE STAMPEDE"](productionsenerio.md#5--cache-stampede)
7. [🧠 "MEMORY KEEPS INCREASING"](productionsenerio.md#6--memory-keeps-increasing)
8. [💸 "DOUBLE PAYMENT / DUPLICATE ORDER"](productionsenerio.md#7--double-payment--duplicate-order)
9. [🚀 "BAD DEPLOYMENT"](productionsenerio.md#8--bad-deployment)
10. [🧨 "DATA CORRUPTION"](productionsenerio.md#9--data-corruption)
11. [⏳ "QUEUE BACKLOG GROWING"](productionsenerio.md#10--queue-backlog-growing)
12. [🔌 "THIRD-PARTY API DOWN"](productionsenerio.md#11--third-party-api-down)
13. [🔊 "HIGH CPU IN NODE PROCESS"](productionsenerio.md#12--high-cpu-in-node-process)
14. [📈 "TRAFFIC SPIKE / FLASH SALE"](productionsenerio.md#13--traffic-spike--flash-sale)
15. [⚖️ "ONE SERVER UNHEALTHY BEHIND LOAD BALANCER"](productionsenerio.md#14--one-server-unhealthy-behind-load-balancer)
16. [💾 "DISK FULL"](productionsenerio.md#15--disk-full)
17. [🔐 "SEARCHING FOR A SECURITY ISSUE"](productionsenerio.md#16--searching-for-a-security-issue)
18. [🔄 "CRON JOBS OVERLAPPING"](productionsenerio.md#17--cron-jobs-overlapping)
19. [🕐 "TIMEZONE / DATE BUG"](productionsenerio.md#18--timezone--date-bug)
20. [📊 "READ REPLICA LAG"](productionsenerio.md#19--read-replica-lag)
21. [👥 "LOGIN FAILING FOR SOME USERS ONLY"](productionsenerio.md#20--login-failing-for-some-users-only)
22. [📦 "FILE UPLOAD FAILING"](productionsenerio.md#21--file-upload-failing)
23. [🔁 "SESSIONS LOST AFTER DEPLOY"](productionsenerio.md#22--sessions-lost-after-deploy)
24. [🌍 "STATIC ASSETS / CDN BROKEN"](productionsenerio.md#23--static-assets--cdn-broken)
25. [🧮 "SLOW REPORT BLOCKING PRODUCTION"](productionsenerio.md#24--slow-report-blocking-production)
26. [⚡ "RETRY STORM"](productionsenerio.md#25--retry-storm)
27. [🔍 "MONITORING SHOWS NOTHING"](productionsenerio.md#26--monitoring-shows-nothing)
28. [🧱 "DEPLOYMENT STUCK / PARTIAL ROLLOUT"](productionsenerio.md#27--deployment-stuck--partial-rollout)
29. [🔀 "RACE CONDITION IN PRODUCTION"](productionsenerio.md#28--race-condition-in-production)
30. [🗂️ "DATA MIGRATION FAILED MIDWAY"](productionsenerio.md#29--data-migration-failed-midway)
31. [📣 "INCIDENT COMMUNICATION"](productionsenerio.md#30--incident-communication)

---

## System Design

[systemdesign.md](systemdesign.md) · **35 questions** · Designs incl. money transfer, payment API, CTS batch processing

1. [🧠 THE FRAMEWORK — NEVER JUMP TO ARCHITECTURE](systemdesign.md#0--the-framework--never-jump-to-architecture)
2. [SQL vs NoSQL](systemdesign.md#1-sql-vs-nosql)
3. [Caching Strategy](systemdesign.md#2-caching-strategy)
4. [Consistency vs Availability](systemdesign.md#3-consistency-vs-availability)
5. [Stateless Services + Horizontal Scaling](systemdesign.md#4-stateless-services--horizontal-scaling)
6. [Queues & Async Processing](systemdesign.md#5-queues--async-processing)
7. [Rate Limiting & Backpressure](systemdesign.md#6-rate-limiting--backpressure)
8. [Design a URL Shortener](systemdesign.md#7-design-a-url-shortener)
9. [Design a Rate Limiter Service](systemdesign.md#8-design-a-rate-limiter-service)
10. [Design Autocomplete / Search Suggestions](systemdesign.md#9-design-autocomplete--search-suggestions)
11. [Design a News Feed / Activity Feed](systemdesign.md#10-design-a-news-feed--activity-feed)
12. [Design Chat / Real-time Notifications](systemdesign.md#11-design-chat--real-time-notifications)
13. [Design a File Upload / Storage Service](systemdesign.md#12-design-a-file-upload--storage-service)
14. [Design a Webhook Delivery System](systemdesign.md#13-design-a-webhook-delivery-system)
15. [Design a Job Scheduler at Scale](systemdesign.md#14-design-a-job-scheduler-at-scale)
16. [Design a Distributed Lock](systemdesign.md#15-design-a-distributed-lock)
17. [Design a Banking Audit Log](systemdesign.md#16-design-a-banking-audit-log)
18. [Design a Reporting / Analytics Service](systemdesign.md#17-design-a-reporting--analytics-service)
19. [Design a Session Store](systemdesign.md#18-design-a-session-store)
20. [Design an Idempotency Service](systemdesign.md#19-design-an-idempotency-service)
21. [Design Feature Flags](systemdesign.md#20-design-feature-flags)
22. [Design a Money Transfer](systemdesign.md#21-design-a-money-transfer)
23. [Design a Payment API (create order / pay)](systemdesign.md#22-design-a-payment-api-create-order--pay)
24. [Design a Wallet Balance (No Oversell / No Double Spend)](systemdesign.md#23-design-a-wallet-balance-no-oversell--no-double-spend)
25. [Design Transaction Reversal / Refund](systemdesign.md#24-design-transaction-reversal--refund)
26. [Design a Statement / Ledger Report](systemdesign.md#25-design-a-statement--ledger-report)
27. [Design Role-Based Access Control for a Banking App](systemdesign.md#26-design-role-based-access-control-for-a-banking-app)
28. [Design a Fraud / Risk Check Hook](systemdesign.md#27-design-a-fraud--risk-check-hook)
29. [Design a Cheque Clearing / Batch File Processing Flow](systemdesign.md#28-design-a-cheque-clearing--batch-file-processing-flow)
30. [Monolith vs Microservices](systemdesign.md#29-monolith-vs-microservices)
31. [Zero-Downtime Schema Migration](systemdesign.md#30-zero-downtime-schema-migration)
32. [API Versioning & Backward Compatibility](systemdesign.md#31-api-versioning--backward-compatibility)
33. [Design Observability](systemdesign.md#32-design-observability)
34. [Scale Estimation in Practice](systemdesign.md#33-scale-estimation-in-practice)
35. [What Breaks First? (Very Common Follow-up)](systemdesign.md#34-what-breaks-first-very-common-follow-up)

---

## Distributed Systems

[systemdestri.md](systemdestri.md) · **20 questions** · HLD/LLD, capacity, CAP, queues, idempotency, RTO/RPO

1. [HLD aur LLD kya hai?](systemdestri.md#q1-hld-aur-lld-kya-hai)
2. [System Design interview ka approach kya hoga?](systemdestri.md#q2-system-design-interview-ka-approach-kya-hoga)
3. [RPS kya hai aur traffic estimate kaise karoge?](systemdestri.md#q3-rps-kya-hai-aur-traffic-estimate-kaise-karoge)
4. [Concurrency kaise estimate karoge?](systemdestri.md#q4-concurrency-kaise-estimate-karoge)
5. [Horizontal vs Vertical Scaling?](systemdestri.md#q5-horizontal-vs-vertical-scaling)
6. [Load Balancer kya karta hai?](systemdestri.md#q6-load-balancer-kya-karta-hai)
7. [Stateless server kyun important hai?](systemdestri.md#q7-stateless-server-kyun-important-hai)
8. [Cache kab use karoge?](systemdestri.md#q8-cache-kab-use-karoge)
9. [Message Queue kyun use karte hain?](systemdestri.md#q9-message-queue-kyun-use-karte-hain)
10. [Queue vs Kafka?](systemdestri.md#q10-queue-vs-kafka)
11. [Retry kaise design karoge?](systemdestri.md#q11-retry-kaise-design-karoge)
12. [At-least-once delivery mein duplicate messages kaise handle karoge?](systemdestri.md#q12-at-least-once-delivery-mein-duplicate-messages-kaise-handle-karoge)
13. [Idempotency kya hai?](systemdestri.md#q13-idempotency-kya-hai)
14. [Strong vs Eventual Consistency?](systemdestri.md#q14-strong-vs-eventual-consistency)
15. [CAP theorem kya hai?](systemdestri.md#q15-cap-theorem-kya-hai)
16. [SPOF kya hai?](systemdestri.md#q16-spof-kya-hai)
17. [P50, P95, P99 kya hain?](systemdestri.md#q17-p50-p95-p99-kya-hain)
18. [Availability vs Reliability?](systemdestri.md#q18-availability-vs-reliability)
19. [RTO vs RPO?](systemdestri.md#q19-rto-vs-rpo)
20. [Design a scalable production architecture.](systemdestri.md#q20-design-a-scalable-production-architecture)

---

## Leadership & Behavioral

[leadership.md](leadership.md) · **30 questions** · Behavioral Q&A + golden Lead mindset

1. [Tell me about yourself as a Lead Engineer candidate.](leadership.md#1-tell-me-about-yourself-as-a-lead-engineer-candidate)
2. [What does a Lead Engineer mean to you?](leadership.md#2-what-does-a-lead-engineer-mean-to-you)
3. [How do you handle disagreement with another developer?](leadership.md#3-how-do-you-handle-disagreement-with-another-developer)
4. [What if a senior developer disagrees with your architecture?](leadership.md#4-what-if-a-senior-developer-disagrees-with-your-architecture)
5. [What if your manager asks you to use a technology you don't agree with?](leadership.md#5-what-if-your-manager-asks-you-to-use-a-technology-you-dont-agree-with)
6. [How do you prioritize technical debt?](leadership.md#6-how-do-you-prioritize-technical-debt)
7. [How do you handle a developer who repeatedly misses deadlines?](leadership.md#7-how-do-you-handle-a-developer-who-repeatedly-misses-deadlines)
8. [How do you mentor junior developers?](leadership.md#8-how-do-you-mentor-junior-developers)
9. [How do you conduct a good code review?](leadership.md#9-how-do-you-conduct-a-good-code-review)
10. [What if a developer takes your code review comments personally?](leadership.md#10-what-if-a-developer-takes-your-code-review-comments-personally)
11. [How do you delegate work?](leadership.md#11-how-do-you-delegate-work)
12. [What if you are the only person who understands a critical system?](leadership.md#12-what-if-you-are-the-only-person-who-understands-a-critical-system)
13. [What do you do when requirements are unclear?](leadership.md#13-what-do-you-do-when-requirements-are-unclear)
14. [Product manager asks for a feature tomorrow that normally takes one week. What do you do?](leadership.md#14-product-manager-asks-for-a-feature-tomorrow-that-normally-takes-one-week-what-do-you-do)
15. [How do you balance speed vs code quality?](leadership.md#15-how-do-you-balance-speed-vs-code-quality)
16. [What if you discover a serious production bug just before release?](leadership.md#16-what-if-you-discover-a-serious-production-bug-just-before-release)
17. [What if business wants to release despite a known critical bug?](leadership.md#17-what-if-business-wants-to-release-despite-a-known-critical-bug)
18. [How do you make architecture decisions?](leadership.md#18-how-do-you-make-architecture-decisions)
19. [How do you know whether a technical decision was correct?](leadership.md#19-how-do-you-know-whether-a-technical-decision-was-correct)
20. [What if your architecture works today but may not scale tomorrow?](leadership.md#20-what-if-your-architecture-works-today-but-may-not-scale-tomorrow)
21. [How do you handle production incidents as a Lead?](leadership.md#21-how-do-you-handle-production-incidents-as-a-lead)
22. [Two developers are blaming each other for a production issue. What do you do?](leadership.md#22-two-developers-are-blaming-each-other-for-a-production-issue-what-do-you-do)
23. [How do you handle pressure?](leadership.md#23-how-do-you-handle-pressure)
24. [What if you don't know the answer to a technical problem?](leadership.md#24-what-if-you-dont-know-the-answer-to-a-technical-problem)
25. [How do you deal with a strong developer who doesn't collaborate?](leadership.md#25-how-do-you-deal-with-a-strong-developer-who-doesnt-collaborate)
26. [How do you improve team engineering quality?](leadership.md#26-how-do-you-improve-team-engineering-quality)
27. [How do you decide whether to build or use an existing solution?](leadership.md#27-how-do-you-decide-whether-to-build-or-use-an-existing-solution)
28. [What is your approach to technical ownership?](leadership.md#28-what-is-your-approach-to-technical-ownership)
29. [What would you do in your first 30 days as Lead Engineer?](leadership.md#29-what-would-you-do-in-your-first-30-days-as-lead-engineer)
30. [Why should we hire you as a Lead Engineer?](leadership.md#30-why-should-we-hire-you-as-a-lead-engineer)

---

## Coding Round

[codinground.md](codinground.md) · **30 questions** · JS, DSA, LRU cache, React, Node, SQL

1. [Implement Debounce](codinground.md#1-implement-debounce)
2. [Implement Throttle](codinground.md#2-implement-throttle)
3. [Implement Promise.all()](codinground.md#3-implement-promiseall)
4. [Flatten Nested Array](codinground.md#4-flatten-nested-array)
5. [Remove Duplicates](codinground.md#5-remove-duplicates)
6. [Group Array of Objects](codinground.md#6-group-array-of-objects)
7. [Two Sum](codinground.md#7-two-sum)
8. [Longest Substring Without Repeating Characters](codinground.md#8-longest-substring-without-repeating-characters)
9. [Valid Parentheses](codinground.md#9-valid-parentheses)
10. [Binary Search](codinground.md#10-binary-search)
11. [Merge Intervals](codinground.md#11-merge-intervals)
12. [Top K Frequent Elements](codinground.md#12-top-k-frequent-elements)
13. [Implement LRU Cache](codinground.md#13-implement-lru-cache)
14. [Implement a Rate Limiter](codinground.md#14-implement-a-rate-limiter)
15. [Promise Concurrency Limiter](codinground.md#15-promise-concurrency-limiter)
16. [Build Search with Debounce](codinground.md#16-build-search-with-debounce)
17. [Build Pagination](codinground.md#17-build-pagination)
18. [Build Infinite Scroll](codinground.md#18-build-infinite-scroll)
19. [Build Todo Application](codinground.md#19-build-todo-application)
20. [Build Data Table](codinground.md#20-build-data-table)
21. [Fix Unnecessary Re-render](codinground.md#21-fix-unnecessary-re-render)
22. [Create REST API](codinground.md#22-create-rest-api)
23. [Create Express Error Handler](codinground.md#23-create-express-error-handler)
24. [Create Authentication Middleware](codinground.md#24-create-authentication-middleware)
25. [Implement Redis Cache](codinground.md#25-implement-redis-cache)
26. [Find Employees With Highest Salary](codinground.md#26-find-employees-with-highest-salary)
27. [GROUP BY + HAVING](codinground.md#27-group-by--having)
28. [JOIN](codinground.md#28-join)
29. [Design a Production-Ready API](codinground.md#29-design-a-production-ready-api)
30. [Debug This Production Code](codinground.md#30-debug-this-production-code)

---

## JavaScript

[js.md](js.md) · **20 questions** · Event loop, closures, promises, this, memory

1. [JavaScript Event Loop kya hai?](js.md#q1-javascript-event-loop-kya-hai)
2. [Microtask vs Macrotask?](js.md#q2-microtask-vs-macrotask)
3. [Node.js mein process.nextTick kya hai?](js.md#q3-nodejs-mein-processnexttick-kya-hai)
4. [setImmediate vs setTimeout(0)?](js.md#q4-setimmediate-vs-settimeout0)
5. [Closure kya hai?](js.md#q5-closure-kya-hai)
6. [var, let, const difference?](js.md#q6-var-let-const-difference)
7. [Hoisting kya hai?](js.md#q7-hoisting-kya-hai)
8. [`this` JavaScript mein kaise work karta hai?](js.md#q8-this-javascript-mein-kaise-work-karta-hai)
9. [call vs apply vs bind?](js.md#q9-call-vs-apply-vs-bind)
10. [Promise kya hai?](js.md#q10-promise-kya-hai)
11. [async/await internally kya karta hai?](js.md#q11-asyncawait-internally-kya-karta-hai)
12. [Promise.all vs Promise.allSettled?](js.md#q12-promiseall-vs-promiseallsettled)
13. [Sequential vs Parallel async operations?](js.md#q13-sequential-vs-parallel-async-operations)
14. [Shallow copy vs Deep copy?](js.md#q14-shallow-copy-vs-deep-copy)
15. [Prototype aur Prototype Chain kya hai?](js.md#q15-prototype-aur-prototype-chain-kya-hai)
16. [Garbage Collection kya hai?](js.md#q16-garbage-collection-kya-hai)
17. [Debounce vs Throttle?](js.md#q17-debounce-vs-throttle)
18. [Event Delegation kya hai?](js.md#q18-event-delegation-kya-hai)
19. [CommonJS vs ES Modules?](js.md#q19-commonjs-vs-es-modules)
20. [JavaScript application production mein slow hai. How will you debug?](js.md#q20-javascript-application-production-mein-slow-hai-how-will-you-debug)

---

## Node.js

[node.js.md](node.js.md) · **20 questions** · Event loop internals, libuv, scaling, graceful shutdown

1. [Node.js kya hai? JavaScript runtime ka kya meaning hai?](node.js.md#q1-nodejs-kya-hai-javascript-runtime-ka-kya-meaning-hai)
2. [Node.js single-threaded hai?](node.js.md#q2-nodejs-single-threaded-hai)
3. [Node.js Event Loop kya hai?](node.js.md#q3-nodejs-event-loop-kya-hai)
4. [libuv kya hai?](node.js.md#q4-libuv-kya-hai)
5. [Node.js Thread Pool kya hai?](node.js.md#q5-nodejs-thread-pool-kya-hai)
6. [CPU-intensive task Node.js mein problem kyun hai?](node.js.md#q6-cpu-intensive-task-nodejs-mein-problem-kyun-hai)
7. [Worker Threads kya hain?](node.js.md#q7-worker-threads-kya-hain)
8. [process.nextTick vs Promise vs setImmediate?](node.js.md#q8-processnexttick-vs-promise-vs-setimmediate)
9. [Express middleware kya hai?](node.js.md#q9-express-middleware-kya-hai)
10. [Express mein error handling kaise karoge?](node.js.md#q10-express-mein-error-handling-kaise-karoge)
11. [Node.js application ko horizontally scale kaise karoge?](node.js.md#q11-nodejs-application-ko-horizontally-scale-kaise-karoge)
12. [Node.js Cluster vs Worker Threads?](node.js.md#q12-nodejs-cluster-vs-worker-threads)
13. [Node.js mein graceful shutdown kya hai?](node.js.md#q13-nodejs-mein-graceful-shutdown-kya-hai)
14. [Connection Pool kya hai?](node.js.md#q14-connection-pool-kya-hai)
15. [Node.js mein authentication kaise design karoge?](node.js.md#q15-nodejs-mein-authentication-kaise-design-karoge)
16. [Node.js API ko secure kaise karoge?](node.js.md#q16-nodejs-api-ko-secure-kaise-karoge)
17. [Node.js API high traffic par slow ho gayi. Kaise debug karoge?](node.js.md#q17-nodejs-api-high-traffic-par-slow-ho-gayi-kaise-debug-karoge)
18. [Node.js memory leak kaise debug karoge?](node.js.md#q18-nodejs-memory-leak-kaise-debug-karoge)
19. [Node.js mein synchronous code avoid kyun karte hain?](node.js.md#q19-nodejs-mein-synchronous-code-avoid-kyun-karte-hain)
20. [Production Node.js architecture kaise design karoge?](node.js.md#q20-production-nodejs-architecture-kaise-design-karoge)

---

## React

[react.md](react.md) · **20 questions** · Rendering, state, performance, memory leaks

1. [useMemo vs useCallback?](react.md#q1-usememo-vs-usecallback)
2. [Production React app slow hai. Kya check karoge?](react.md#q2-production-react-app-slow-hai-kya-check-karoge)
3. [100,000 rows ka table browser freeze kar raha hai. What will you do?](react.md#q3-100000-rows-ka-table-browser-freeze-kar-raha-hai-what-will-you-do)
4. [React performance optimize kaise karoge?](react.md#q4-react-performance-optimize-kaise-karoge)
5. [React reconciliation kya hai? Virtual DOM ka role?](react.md#q5-react-reconciliation-kya-hai-virtual-dom-ka-role)
6. [Unnecessary re-renders kaise identify/prevent karoge?](react.md#q6-unnecessary-re-renders-kaise-identifyprevent-karoge)
7. [useEffect kab use karna chahiye?](react.md#q7-useeffect-kab-use-karna-chahiye)
8. [useEffect dependency array galat ho to?](react.md#q8-useeffect-dependency-array-galat-ho-to)
9. [Controlled vs Uncontrolled components?](react.md#q9-controlled-vs-uncontrolled-components)
10. [Context vs Redux?](react.md#q10-context-vs-redux)
11. [Redux mein unnecessary re-renders kaise reduce karoge?](react.md#q11-redux-mein-unnecessary-re-renders-kaise-reduce-karoge)
12. [State kahan rakhna chahiye?](react.md#q12-state-kahan-rakhna-chahiye)
13. [React key prop kyun use karte hain?](react.md#q13-react-key-prop-kyun-use-karte-hain)
14. [React.memo kya karta hai?](react.md#q14-reactmemo-kya-karta-hai)
15. [Code Splitting / Lazy Loading kya hai?](react.md#q15-code-splitting--lazy-loading-kya-hai)
16. [Error Boundary kya hai?](react.md#q16-error-boundary-kya-hai)
17. [React Authentication Architecture kaise design karoge?](react.md#q17-react-authentication-architecture-kaise-design-karoge)
18. [Large React application ka architecture?](react.md#q18-large-react-application-ka-architecture)
19. [React production mein memory leak kaise debug karoge?](react.md#q19-react-production-mein-memory-leak-kaise-debug-karoge)
20. [Production React app slow hai. How will you investigate?](react.md#q20-production-react-app-slow-hai-how-will-you-investigate)

---

## Next.js

[nextjs.md](nextjs.md) · **20 questions** · App Router, server/client components, caching, SEO

1. [Next.js kya hai aur React se kya difference hai?](nextjs.md#q1-nextjs-kya-hai-aur-react-se-kya-difference-hai)
2. [App Router vs Pages Router?](nextjs.md#q2-app-router-vs-pages-router)
3. [Server Component vs Client Component?](nextjs.md#q3-server-component-vs-client-component)
4. [`"use client"` kya karta hai?](nextjs.md#q4-use-client-kya-karta-hai)
5. [Server Component ke andar Client Component use kar sakte hain?](nextjs.md#q5-server-component-ke-andar-client-component-use-kar-sakte-hain)
6. [Next.js mein data fetching kaise karoge?](nextjs.md#q6-nextjs-mein-data-fetching-kaise-karoge)
7. [SSR vs SSG vs ISR?](nextjs.md#q7-ssr-vs-ssg-vs-isr)
8. [Next.js caching kaise work karti hai?](nextjs.md#q8-nextjs-caching-kaise-work-karti-hai)
9. [Dynamic Rendering vs Static Rendering?](nextjs.md#q9-dynamic-rendering-vs-static-rendering)
10. [Next.js Middleware kya hai?](nextjs.md#q10-nextjs-middleware-kya-hai)
11. [Next.js Route Handlers kya hain?](nextjs.md#q11-nextjs-route-handlers-kya-hain)
12. [Server Actions kya hain?](nextjs.md#q12-server-actions-kya-hain)
13. [Next.js authentication kaise design karoge?](nextjs.md#q13-nextjs-authentication-kaise-design-karoge)
14. [Next.js application mein secrets kaha rakhenge?](nextjs.md#q14-nextjs-application-mein-secrets-kaha-rakhenge)
15. [Next.js mein loading.tsx aur error.tsx kya hain?](nextjs.md#q15-nextjs-mein-loadingtsx-aur-errortsx-kya-hain)
16. [Next.js mein SEO kaise improve karoge?](nextjs.md#q16-nextjs-mein-seo-kaise-improve-karoge)
17. [Next.js Image Optimization kya hai?](nextjs.md#q17-nextjs-image-optimization-kya-hai)
18. [Next.js performance kaise optimize karoge?](nextjs.md#q18-nextjs-performance-kaise-optimize-karoge)
19. [Next.js application scale kaise karoge?](nextjs.md#q19-nextjs-application-scale-kaise-karoge)
20. [Next.js production app slow hai. How will you debug it?](nextjs.md#q20-nextjs-production-app-slow-hai-how-will-you-debug-it)

---

## Database & Redis

[db.md](db.md) · **20 questions** · Indexes, transactions, isolation, sharding, cache patterns

1. [SQL vs NoSQL — kab kya choose karoge?](db.md#q1-sql-vs-nosql--kab-kya-choose-karoge)
2. [Database Index kya hai?](db.md#q2-database-index-kya-hai)
3. [Har column par index kyun nahi lagate?](db.md#q3-har-column-par-index-kyun-nahi-lagate)
4. [Composite Index kya hai?](db.md#q4-composite-index-kya-hai)
5. [Database normalization kya hai?](db.md#q5-database-normalization-kya-hai)
6. [Denormalization kab karoge?](db.md#q6-denormalization-kab-karoge)
7. [Transaction kya hai?](db.md#q7-transaction-kya-hai)
8. [Isolation levels kya hain?](db.md#q8-isolation-levels-kya-hain)
9. [Optimistic vs Pessimistic Locking?](db.md#q9-optimistic-vs-pessimistic-locking)
10. [Primary DB + Read Replica kaise work karta hai?](db.md#q10-primary-db--read-replica-kaise-work-karta-hai)
11. [Replication vs Backup?](db.md#q11-replication-vs-backup)
12. [Sharding kya hai?](db.md#q12-sharding-kya-hai)
13. [Good Shard Key kya hota hai?](db.md#q13-good-shard-key-kya-hota-hai)
14. [Cache-aside pattern kya hai?](db.md#q14-cache-aside-pattern-kya-hai)
15. [Cache invalidation kaise handle karoge?](db.md#q15-cache-invalidation-kaise-handle-karoge)
16. [Cache stampede kya hai?](db.md#q16-cache-stampede-kya-hai)
17. [Redis kab use karoge?](db.md#q17-redis-kab-use-karoge)
18. [Redis data structures kaunse important hain?](db.md#q18-redis-data-structures-kaunse-important-hain)
19. [Database slow query kaise debug karoge?](db.md#q19-database-slow-query-kaise-debug-karoge)
20. [Database production mein bottleneck ban gayi. What will you do?](db.md#q20-database-production-mein-bottleneck-ban-gayi-what-will-you-do)

---

## AWS & Cloud

[aws.md](aws.md) · **20 questions** · EC2, ALB, S3, RDS, VPC, IAM, deployment

1. [EC2 kya hai?](aws.md#q1-ec2-kya-hai)
2. [EC2 ko horizontally scale kaise karoge?](aws.md#q2-ec2-ko-horizontally-scale-kaise-karoge)
3. [ALB kya hai?](aws.md#q3-alb-kya-hai)
4. [Health Check kya hai?](aws.md#q4-health-check-kya-hai)
5. [S3 kya hai?](aws.md#q5-s3-kya-hai)
6. [S3 + CloudFront kyun use karenge?](aws.md#q6-s3--cloudfront-kyun-use-karenge)
7. [RDS kya hai?](aws.md#q7-rds-kya-hai)
8. [RDS Read Replica vs Multi-AZ?](aws.md#q8-rds-read-replica-vs-multi-az)
9. [Redis / ElastiCache kyun use karenge?](aws.md#q9-redis--elasticache-kyun-use-karenge)
10. [VPC kya hai?](aws.md#q10-vpc-kya-hai)
11. [Public vs Private Subnet?](aws.md#q11-public-vs-private-subnet)
12. [Security Group kya hai?](aws.md#q12-security-group-kya-hai)
13. [IAM kya hai?](aws.md#q13-iam-kya-hai)
14. [Secrets kaha store karoge?](aws.md#q14-secrets-kaha-store-karoge)
15. [AWS Lambda kya hai?](aws.md#q15-aws-lambda-kya-hai)
16. [ECS/EKS vs EC2?](aws.md#q16-ecseks-vs-ec2)
17. [AWS application highly available kaise banaoge?](aws.md#q17-aws-application-highly-available-kaise-banaoge)
18. [AWS application suddenly 10× traffic receive kare to?](aws.md#q18-aws-application-suddenly-10-traffic-receive-kare-to)
19. [Production AWS system ka monitoring kaise karoge?](aws.md#q19-production-aws-system-ka-monitoring-kaise-karoge)
20. [Production deployment architecture kaise design karoge?](aws.md#q20-production-deployment-architecture-kaise-design-karoge)

---

## 📊 Total: 336 questions across 13 files

```text
Resume & Project Deep Dive  35   resumedeepdrive.md
Production Debugging        35   productiondebugging.md
Production Scenarios        31   productionsenerio.md
System Design               35   systemdesign.md
Distributed Systems         20   systemdestri.md
Leadership & Behavioral     30   leadership.md
Coding Round                30   codinground.md
JavaScript                  20   js.md
Node.js                     20   node.js.md
React                       20   react.md
Next.js                     20   nextjs.md
Database & Redis            20   db.md
AWS & Cloud                 20   aws.md
---------------------------------------------
TOTAL                      336
```

## ⚠️ Notes

* Saare 13 files mein code fences lag chuke hain — markdown preview aur `dashboard.html` dono consistent render hote hain.
* Browser/Kindle me padhne ke liye `dashboard.html` kholo — same index + saare answers, ek hi file me. Rebuild: `node build-html.js`.
* `dashboard.md` `node build-dashboard.js` se banta hai — kisi bhi file mein question add/remove karne ke baad script dobara chalao, warna index purana rehta hai.
* Round ka poora answer file ke andar hai; yahan sirf questions ka index hai (mock practice ke liye).

> Mock dete waqt sirf question padho aur answer band rakho. Self-test ke baad hi file kholo.
