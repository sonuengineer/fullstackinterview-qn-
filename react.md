# React Lead Engineer — 20 Interview Questions & Answers

## Q1. useMemo vs useCallback?

```js
useMemo → value memoize karta hai.
useCallback → function reference memoize karta hai.
```

Example:

```js
const filteredUsers = useMemo(
() => users.filter(u => u.active),
[users]
);
const handleClick = useCallback(
(id) => selectUser(id),
[selectUser]
);
```

Lead-level point:
“I don't use memoization everywhere. I use it when there is an expensive calculation or when referential equality matters, such as preventing unnecessary renders of memoized children.”

---

## Q2. Production React app slow hai. Kya check karoge?

Ye Q20 ka short version hai. Detailed Lead-level answer **Q20** par hai — usko primary answer maano.

Quick checklist:

* React DevTools Profiler / profiling
* unnecessary re-renders
* expensive calculations
* API/network latency
* JS bundle size
* large DOM
* images/assets
* pagination/virtualization
* code splitting/lazy loading

---

## Q3. 100,000 rows ka table browser freeze kar raha hai. What will you do?

Virtualization use karunga.

Instead of rendering 100,000 DOM nodes, only visible rows render karunga.

Also consider:

* server-side pagination
* server-side sorting/filtering
* debounced search
* avoiding unnecessary re-renders

---

## Q4. React performance optimize kaise karoge?

Flow:

```text
Measure
→ Find bottleneck
→ Optimize
→ Measure again
```

Possible optimizations:

* React.memo
* useMemo
* useCallback
* proper state placement
* virtualization
* lazy loading
* code splitting
* pagination
* API optimization

Important:
“Optimization should be based on profiling, not assumptions.”

---

## Q5. React reconciliation kya hai? Virtual DOM ka role?

State/props change hone par React new UI representation create karta hai aur previous representation se compare karta hai.

Flow:

```text
State change
→ Render
→ New Virtual DOM
→ Reconciliation
→ Required DOM updates
```

Virtual DOM actual browser DOM nahi hai.

Interview answer:
“Reconciliation is React's process of determining what changed between renders and what needs to be updated in the actual DOM.”

Don't say:
“Virtual DOM always makes React faster.”

---

## Q6. Unnecessary re-renders kaise identify/prevent karoge?

Identify:

* React DevTools Profiler
* Browser Performance tools

Prevent:

* React.memo
* useMemo
* useCallback
* proper state placement
* stable references
* component decomposition

Lead-level:
“First I would profile the application and identify why the component is rendering. Then I'd apply the appropriate optimization rather than blindly memoizing everything.”

---

## Q7. useEffect kab use karna chahiye?

Main rule:
External system ke saath synchronization ke liye.

Examples:

* API calls
* WebSocket
* event listeners
* timers
* browser APIs
* third-party libraries

Example:

```js
useEffect(() => {
fetchUsers();
}, []);
```

Derived value ke liye unnecessary useEffect mat lagao.

Example:

```js
const fullName = `${firstName} ${lastName}`;
```

Instead of setting derived state through useEffect.

---

## Q8. useEffect dependency array galat ho to?

```text
Missing dependency → stale data/closure problem.
```

Example:

```js
useEffect(() => {
fetchUser(userId);
}, []);
```

Agar userId change ho sakta hai, dependency missing hai.

Better:

```js
useEffect(() => {
fetchUser(userId);
}, [userId]);
```

Unnecessary changing dependency → effect repeatedly run → unnecessary API calls/performance issues.

---

## Q9. Controlled vs Uncontrolled components?

Controlled:
React state source of truth hai.

Example:

```jsx
<input
value={name}
onChange={e => setName(e.target.value)}
/>
```

Uncontrolled:
DOM value maintain karta hai, usually ref se access karte hain.

Example:

```text
<input ref={inputRef} />
```

Interview line:
“Controlled means React owns the input state; uncontrolled means the DOM maintains the value.”

---

## Q10. Context vs Redux?

Context:
Simple shared data ke liye:

* theme
* language
* current user

Redux:
Complex application-wide state management with centralized state and predictable state transitions.

Important:
“Context is primarily a dependency/value distribution mechanism; Redux provides a broader state-management architecture.”

Har cheez Redux mein rakhna necessary nahi.

---

## Q11. Redux mein unnecessary re-renders kaise reduce karoge?

Avoid:

```js
const state = useSelector(state => state);
```

Prefer granular selectors:

```js
const userName = useSelector(
state => state.user.name
);
```

Other techniques:

* memoized selectors
* normalized state
* local state where appropriate
* avoid putting every UI state in Redux

Lead-level:
“I keep state close to where it is consumed, use granular selectors, and use memoized selectors for expensive derived data.”

---

## Q12. State kahan rakhna chahiye?

Rule:
State ko sabse low level par rakho jahan uski zarurat hai.

Examples:

```text
Input state → Component
Modal state → Component
Shared UI state → Context/state management
Server data → Server-state/cache layer
Global session → Shared/global state
```

Important distinction:

UI state ≠ Server state

Example:

```text
Modal open → UI state
Products API → Server state
```

---

## Q13. React key prop kyun use karte hain?

React ko list items ki identity track karne ke liye.

Example:

```jsx
users.map(user => ( <User key={user.id} user={user} />
))
```

Stable unique ID best hai.

Avoid:

```text
key={index}
```

Especially when list mein:

* insertion
* deletion
* reordering

ho sakta hai.

Interview line:
“Keys help React identify which list items are the same across renders.”

---

## Q14. React.memo kya karta hai?

Example:

```jsx
const User = React.memo(({ name }) => {
return <div>{name}</div>;
});
```

Agar parent re-render ho aur props same hon, React unnecessary child render skip kar sakta hai.

But if prop har render mein new object hai:

```text
<User user={{ name: "Sonu" }} />
```

to new object reference create hota hai, so memoization ka benefit nahi milega.

Important:
React.memo is an optimization, not a guarantee that a component will never render.

---

## Q15. Code Splitting / Lazy Loading kya hai?

Large application mein saara JavaScript initial load mein bhejne ke bajay modules ko demand par load karna.

Example:

```jsx
const Admin = lazy(() => import("./Admin"));
<Suspense fallback={<Loading />}> <Admin /> </Suspense>
```

Benefits:

* smaller initial bundle
* faster initial load
* less JavaScript upfront

Large applications mein route-level code splitting commonly useful hai.

---

## Q16. Error Boundary kya hai?

Component tree ke ek part mein rendering error aaye to fallback UI show kar sakte hain.

Example architecture:

```text
App
├── Header
├── ErrorBoundary
│     └── Dashboard
└── Footer
```

Fallback:

“Something went wrong.”

Lead-level:
“I would place error boundaries around important feature boundaries so one failing feature doesn't bring down the entire UI, and I would log the error for production debugging.”

Important:
Error boundaries traditionally render/lifecycle errors catch karte hain; event handlers aur most async errors automatically catch nahi hote.

---

## Q17. React Authentication Architecture kaise design karoge?

Basic flow:

```text
Login
→ Backend authentication
→ Session/token
→ Frontend
→ Protected routes
```

Protected route:

```text
Authenticated?
├── Yes → Dashboard
└── No → Login
```

Critical point:
Frontend route guard security nahi hai.

Backend ko every protected API request par:

* authentication
* authorization
* permissions

validate karna chahiye.

Lead-level:
“Frontend route guards are mainly for UX and navigation; authorization must ultimately be enforced on the backend.”

---

## Q18. Large React application ka architecture?

Feature/domain-based architecture useful ho sakta hai.

Example:

```text
src/
├── features/
│   ├── users/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── types/
│   │
│   ├── orders/
│   └── payments/
│
├── shared/
│   ├── components/
│   ├── hooks/
│   └── utils/
│
├── services/
├── routes/
└── app/
```

Benefits:

* feature isolation
* maintainability
* clear ownership
* easier team scaling

Lead-level:
“I would choose the architecture based on product and team complexity rather than over-engineering a small application.”

---

## Q19. React production mein memory leak kaise debug karoge?

Example:
Application 2–3 hours ke baad slow ho rahi hai.

First:

```text
Reproduce
→ Profile memory
→ Heap snapshots
→ Find retained objects
→ Fix
→ Verify
```

Common causes:

* event listeners not removed
* timers not cleared
* WebSocket/subscriptions not cleaned
* large objects retained
* stale references

Example cleanup:

```js
useEffect(() => {
window.addEventListener("resize", handler);
return () => {
window.removeEventListener("resize", handler);
};
}, []);
```

Lead-level:
“I would use memory profiling and heap snapshots to identify what objects are being retained instead of assuming the cause.”

---

## Q20. Production React app slow hai. How will you investigate?

Very important Lead Engineer question.

Don't immediately say:
“I'll use useMemo.”

Instead:

```text
User reports slowness
→ Define the symptom
→ Measure
→ Identify bottleneck
→ Fix
→ Measure again
```

### If initial page load is slow:

Check:

* JS bundle size
* code splitting
* lazy loading
* API/network requests
* image sizes
* CDN/cache
* server response time

### If interaction is slow:

Check:

* unnecessary re-renders
* expensive calculations
* large DOM
* React Profiler
* virtualization

### If API is slow:

Trace:

```text
React
→ Network
→ Backend
→ Database
```

Problem React mein hona zaroori nahi hai.

Strong Lead Engineer answer:

“First I would define exactly what is slow and measure it. Then I would determine whether the bottleneck is rendering, JavaScript execution, network, backend latency, or database latency. Once I identify the bottleneck, I would optimize that specific layer and verify the improvement with measurements.”

---

# React Lead Engineer Mental Model

React Lead Engineer preparation ko 6 areas mein socho:

1. Rendering

   * Reconciliation
   * Virtual DOM
   * Re-renders

2. State Management

   * Local state
   * Context
   * Redux
   * Server state

3. Performance

   * Memoization
   * Virtualization
   * Code splitting
   * Lazy loading

4. Architecture

   * Feature-based structure
   * Component design
   * State ownership

5. Production Debugging

   * Profiling
   * Memory leaks
   * Network/API bottlenecks
   * Performance measurement

6. Security

   * Authentication
   * Authorization
   * Backend enforcement

Golden Lead Engineer principle:

“Don't optimize or introduce complexity based on assumptions. First understand the problem, measure it, identify the bottleneck, choose the appropriate solution, and verify the result.”
