# Lead Engineer Coding Round

## 30 High-ROI Questions + What Interviewer Expects

---

# 🔥 PART 1 — JavaScript Coding

## 1. Implement Debounce

**Question:** Search input ke liye debounce function implement karo.

**Expected:**

```js
function debounce(fn, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

**Interviewer checks:**

* Closure
* `setTimeout`
* `clearTimeout`
* `this`
* arguments

**Real use:** Search API.

---

## 2. Implement Throttle

```js
function throttle(fn, delay) {
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}
```

**Use case:**

```text
Scroll
Mouse move
Resize
```

Remember:

> Debounce = wait until activity stops.

> Throttle = maximum once per interval.

---

## 3. Implement Promise.all()

Conceptually:

```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;

    if (promises.length === 0) {
      resolve([]);
      return;
    }

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = value;
          completed++;

          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}
```

**Important:**

* Preserve order
* Resolve only when all complete
* Reject when one rejects

---

## 4. Flatten Nested Array

Input:

```js
[1, [2, [3, 4]], 5]
```

Output:

```js
[1, 2, 3, 4, 5]
```

Recursive solution:

```js
function flatten(arr) {
  const result = [];

  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flatten(item));
    } else {
      result.push(item);
    }
  }

  return result;
}
```

---

## 5. Remove Duplicates

```js
const unique = [...new Set([1, 2, 2, 3, 3, 4])];

console.log(unique);
// [1, 2, 3, 4]
```

Follow-up:

> Objects ke duplicates kaise remove karoge?

Use a unique key with `Map`.

---

## 6. Group Array of Objects

Input:

```js
const users = [
  { name: "A", department: "IT" },
  { name: "B", department: "HR" },
  { name: "C", department: "IT" }
];
```

Expected:

```js
{
  IT: [
    { name: "A", department: "IT" },
    { name: "C", department: "IT" }
  ],
  HR: [
    { name: "B", department: "HR" }
  ]
}
```

Solution:

```js
const result = users.reduce((acc, user) => {
  const key = user.department;

  if (!acc[key]) {
    acc[key] = [];
  }

  acc[key].push(user);

  return acc;
}, {});
```

---

# 🔥 PART 2 — DSA HIGH ROI

## 7. Two Sum

```js
function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const required = target - nums[i];

    if (map.has(required)) {
      return [map.get(required), i];
    }

    map.set(nums[i], i);
  }

  return [];
}
```

Complexity:

```text
Time: O(n)
Space: O(n)
```

**Pattern:** HashMap.

---

## 8. Longest Substring Without Repeating Characters

Use **Sliding Window**.

```js
function lengthOfLongestSubstring(s) {
  const set = new Set();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }

    set.add(s[right]);

    maxLength = Math.max(
      maxLength,
      right - left + 1
    );
  }

  return maxLength;
}
```

Complexity:

```text
O(n)
```

---

## 9. Valid Parentheses

```js
function isValid(s) {
  const stack = [];
  const pairs = {
    ')': '(',
    ']': '[',
    '}': '{'
  };

  for (const char of s) {
    if (char === '(' || char === '[' || char === '{') {
      stack.push(char);
    } else {
      if (stack.pop() !== pairs[char]) {
        return false;
      }
    }
  }

  return stack.length === 0;
}
```

**Pattern:** Stack.

---

## 10. Binary Search

```js
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;

    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}
```

Complexity:

```text
O(log n)
```

Requirement:

> Array must be sorted.

---

## 11. Merge Intervals

Input:

```text
[1,3], [2,6], [8,10]
```

Output:

```text
[1,6], [8,10]
```

Approach:

```text
Sort by start
↓
Compare current with previous
↓
Overlap → merge
↓
No overlap → new interval
```

Complexity:

```text
O(n log n)
```

because of sorting.

---

## 12. Top K Frequent Elements

Pattern:

```text
Frequency Map
      ↓
Heap / Bucket
      ↓
Top K
```

Important concept:

> First count frequency, then find the highest-frequency elements.

---

# 🔥 PART 3 — LRU / SYSTEM-STYLE CODING

## 13. Implement LRU Cache

Classic Lead-level question.

Need:

```text
HashMap + Doubly Linked List
```

Why?

```text
HashMap → O(1) lookup

Linked List → O(1) remove/add
```

Operations:

```text
get() → O(1)
put() → O(1)
```

Be prepared to explain the design even if you don't fully code it.

---

## 14. Implement a Rate Limiter

Simple version:

```text
userId → request count
```

Redis approach:

```text
INCR user:123
EXPIRE user:123 60
```

If:

```text
count > limit
```

return:

```text
429 Too Many Requests
```

Lead-level follow-up:

> Multiple Node instances mein in-memory counter kyun nahi?

Because each server would have a different counter.

Use shared Redis.

---

## 15. Promise Concurrency Limiter

Suppose:

```text
100 API calls
```

but only:

```text
5 at a time
```

allowed.

Concept:

```text
Queue
 ↓
5 concurrent workers
 ↓
Next task when one finishes
```

Interviewer checks:

* Promise
* async/await
* concurrency control
* queue thinking

---

# ⚛️ PART 4 — REACT CODING

## 16. Build Search with Debounce

Expected:

```text
Input
 ↓
onChange
 ↓
Debounce
 ↓
API
 ↓
Loading
 ↓
Data
 ↓
Error
```

Important:

```text
Don't call API on every keystroke.
```

Also handle:

```text
Race conditions
Cleanup
Loading
Error
Empty state
```

---

## 17. Build Pagination

State:

```js
const [page, setPage] = useState(1);
```

API:

```text
GET /users?page=1&limit=20
```

Need:

```text
Previous
Next
Loading
Error
Empty
```

Lead-level follow-up:

> Server-side pagination is preferred for large datasets.

---

## 18. Build Infinite Scroll

Concept:

```text
User scrolls
 ↓
Near bottom?
 ↓
Fetch next page
 ↓
Append results
```

Better implementation:

> `IntersectionObserver`

instead of constantly listening to scroll events.

---

## 19. Build Todo Application

Don't just make:

```text
Add
Delete
```

Think about:

```text
Add
Edit
Delete
Complete
Filter
Loading
Error
Persistence
Optimistic update
```

Interviewer is checking component/state design.

---

## 20. Build Data Table

Requirements:

```text
Search
Sort
Pagination
Loading
Error
Empty state
```

For huge data:

```text
Server-side pagination
Server-side filtering
Virtualization
```

---

## 21. Fix Unnecessary Re-render

Example:

```jsx
<Child data={{ name: "Sonu" }} />
```

Every parent render creates a new object.

Possible:

```js
const data = useMemo(
  () => ({ name: "Sonu" }),
  []
);
```

And:

```js
const Child = React.memo(...)
```

But explain:

> “I would first verify the re-render is actually a performance problem before adding memoization.”

---

# 🟢 PART 5 — NODE.JS CODING

## 22. Create REST API

Typical:

```text
POST   /users
GET    /users
GET    /users/:id
PUT    /users/:id
DELETE /users/:id
```

Must include:

```text
Validation
Authentication
Authorization
Error handling
Correct status codes
Database interaction
```

---

## 23. Create Express Error Handler

Pattern:

```js
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error"
  });
});
```

Important:

> Don't expose stack traces or sensitive internal errors to clients.

---

## 24. Create Authentication Middleware

Concept:

```js
function auth(req, res, next) {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  // verify token

  req.user = user;

  next();
}
```

Then separate:

```text
Authentication
        ↓
Authorization
```

---

## 25. Implement Redis Cache

Cache-aside:

```js
const cached = await redis.get(key);

if (cached) {
  return JSON.parse(cached);
}

const data = await db.getUser(id);

await redis.set(
  key,
  JSON.stringify(data),
  { EX: 300 }
);

return data;
```

Follow-up:

> What happens if Redis is down?

Application should have an appropriate fallback strategy rather than taking the whole API down unnecessarily.

---

# 🗄️ PART 6 — SQL CODING

## 26. Find Employees With Highest Salary

```sql
SELECT *
FROM employees
ORDER BY salary DESC
LIMIT 1;
```

Follow-up:

> Second highest?

```sql
SELECT MAX(salary)
FROM employees
WHERE salary < (
  SELECT MAX(salary)
  FROM employees
);
```

---

## 27. GROUP BY + HAVING

Question:

> Departments having more than 5 employees.

```sql
SELECT department_id, COUNT(*) AS total
FROM employees
GROUP BY department_id
HAVING COUNT(*) > 5;
```

Remember:

```text
WHERE  → filter rows
HAVING → filter groups
```

---

## 28. JOIN

Example:

```sql
SELECT
  u.name,
  o.order_id
FROM users u
JOIN orders o
  ON u.id = o.user_id;
```

Know:

```text
INNER JOIN
LEFT JOIN
RIGHT JOIN
```

Most practical interviews focus heavily on:

> `INNER JOIN` vs `LEFT JOIN`.

---

# 🧠 PART 7 — LEAD-LEVEL PRACTICAL CODING

## 29. Design a Production-Ready API

Suppose interviewer says:

> “Create an API to create an order.”

Don't jump directly to code.

First discuss:

```text
Authentication
Authorization
Validation
Idempotency
Database transaction
Error handling
Logging
Monitoring
Rate limiting
```

Flow:

```text
Client
 ↓
Auth
 ↓
Validation
 ↓
Idempotency check
 ↓
Business logic
 ↓
DB transaction
 ↓
Response
 ↓
Async notification
```

This is where you differentiate yourself from a mid-level candidate.

---

## 30. Debug This Production Code

Interviewer gives:

```js
app.get("/users", async (req, res) => {
  const users = await User.findAll();

  users.forEach(async user => {
    await sendEmail(user.email);
  });

  res.json(users);
});
```

What's wrong?

### Problem 1

`forEach()` doesn't await async callbacks.

### Problem 2

Potentially thousands of emails can start simultaneously.

### Problem 3

API response doesn't wait for email operations.

### Better architecture:

```text
Create request
 ↓
Save DB
 ↓
Queue email job
 ↓
Return response
 ↓
Worker sends emails
```

This is a **Lead Engineer-level answer** because you're solving both correctness and scalability.

---

# ⭐ CODING ROUND — WHAT INTERVIEWER ACTUALLY CHECKS

Don't focus only on:

```text
"Did he get the final answer?"
```

They also evaluate:

```text
Problem understanding
        ↓
Approach
        ↓
Edge cases
        ↓
Complexity
        ↓
Code quality
        ↓
Testing
        ↓
Trade-offs
        ↓
Communication
```

## Before writing code, ALWAYS do this:

```text
1. Clarify requirements
2. Give example
3. Explain approach
4. Mention edge cases
5. State complexity
6. Code
7. Test with examples
8. Discuss optimization
```

---

# 🔥 TOP 10 — MUST PRACTICE TONIGHT

If time is very limited:

```text
1. Debounce
2. Throttle
3. Promise.all
4. Two Sum
5. Longest Substring
6. Valid Parentheses
7. LRU Cache
8. React Search + Debounce
9. Node REST API + middleware
10. SQL JOIN + GROUP BY
```

### And 5 Lead-level follow-ups:

```text
1. How will this scale?

2. What happens if Redis goes down?

3. What happens if the API is called twice?

4. What happens if 10,000 users call it simultaneously?

5. How would you monitor/debug this in production?
```

**These follow-ups are extremely important for a Lead Engineer interview.**

---

# 🎯 80/20 PRIORITY RANKING

Agar time kam hai, to saare 30 questions equal effort se mat karo.

```text
This file's weight in overall prep: ~15%
Reason: coding round mostly pass/fail hota hai — Lead role resume, production aur leadership rounds se decide hota hai
Overall prep order: resume deep dive → production debugging → system design → production scenarios → leadership → coding round
```

## 🥇 TIER 1 — MUST DO (60% of coding prep time)

```text
1. Debounce
2. Throttle
3. Promise.all
4. Two Sum
5. Longest Substring Without Repeating Characters
6. Valid Parentheses
7. LRU Cache
8. React Search + Debounce
9. Node REST API + middleware
10. SQL JOIN + GROUP BY
```

Ye 10 cleanly code kar pao aur complexity explain kar pao, to most coding rounds cover ho jate hain.

## 🥈 TIER 2 — HIGH ROI (30%)

Ye commonly second question ya follow-up ke roop mein aate hain.

```text
- Flatten array / Remove duplicates / Group array of objects
- Promise concurrency limiter (queue + 5 workers)
- Debug the forEach(async) production code
- Pagination (server-side reasoning)
- Redis cache-aside
- Express error handler + authentication middleware
- Binary search
- Production-ready create-order API (code se pehle discuss karo)
```

## 🥉 TIER 3 — CONCEPT ONLY (10%)

Inhe grind mat karo — approach explain kar pao, that's enough.

```text
- Merge Intervals (sort + merge idea)
- Top K Frequent Elements (frequency map + bucket/heap)
- Rate limiter (Redis INCR + EXPIRE, 429)
- Todo app / Data table / Infinite scroll (state design)
- Fix unnecessary re-render (memo/useMemo — but verify it's a real problem first)
- Second highest salary (subquery / window function)
```
