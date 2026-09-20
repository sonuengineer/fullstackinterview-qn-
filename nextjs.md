# Next.js Lead Engineer — 20 Interview Questions & Answers

## Q1. Next.js kya hai aur React se kya difference hai?

React primarily UI library hai.

Next.js React ke upar production framework provide karta hai.

Next.js provides:

* Routing
* Server Components
* Server-side rendering
* Static generation
* API/Route Handlers
* Middleware
* Image optimization
* Code splitting
* Caching
* Streaming

Interview line:
“React mainly focuses on building UI, while Next.js provides the application framework and production capabilities around React.”

---

## Q2. App Router vs Pages Router?

Pages Router:

```text
pages/
├── index.tsx
├── about.tsx
└── api/
```

App Router:

```text
app/
├── page.tsx
├── about/
│   └── page.tsx
└── api/
└── route.ts
```

App Router is the modern Next.js architecture and provides:

* Server Components
* layouts
* nested routing
* loading UI
* error boundaries
* streaming
* better server/client separation

For a new project, I would generally prefer App Router unless there is a specific compatibility reason to use Pages Router.

---

## Q3. Server Component vs Client Component?

By default, App Router components are Server Components.

Server Component:

* runs on server
* can access server-side resources
* doesn't send component JavaScript to browser in the same way client components do
* good for data fetching and static/server-rendered UI

Client Component:

```text
"use client";
```

Used when we need:

* useState
* useEffect
* event handlers
* browser APIs
* client-side interactivity

Simple rule:

```text
Server Component → server/data
Client Component → interaction/browser APIs
```

---

## Q4. `"use client"` kya karta hai?

"use client" component ko Client Component boundary bana deta hai.

Example:

```jsx
"use client";
import { useState } from "react";
export default function Counter() {
const [count, setCount] = useState(0);
return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

Important:
“use client” ka matlab ye nahi ki entire application client-side ho jayega.

Sirf us component aur uske client-side dependency subtree ko client bundle mein include kiya jata hai.

---

## Q5. Server Component ke andar Client Component use kar sakte hain?

Yes.

Example:

Server Component:

```text
↓
Client Component
```

Server Component:

```jsx
export default function Page() {
return (
<> <ProductDetails /> <AddToCartButton />
</>
);
}
```

AddToCartButton:

```text
"use client";
```

Needs browser interaction/state.

Common architecture:

```text
Server Components → data fetching
Client Components → interactive UI
```

---

## Q6. Next.js mein data fetching kaise karoge?

Server Component mein directly fetch kar sakte ho:

```js
const res = await fetch("https://api.example.com/products");
const products = await res.json();
```

Then render.

Benefits:

* server-side data fetching
* less client-side JavaScript
* secrets/API credentials browser mein expose nahi karne padte
* better initial rendering

For client-side frequently changing data, client-side libraries/patterns such as React Query/SWR can be appropriate.

---

## Q7. SSR vs SSG vs ISR?

SSR:
Request ke time page/server output generate hota hai.

Useful for:

* frequently changing personalized data

SSG:
Build time par generate hota hai.

Useful for:

* static content
* documentation
* marketing pages

ISR:
Static page ko periodically/revalidation ke through update kar sakte ho.

Simple:

```text
SSR → request time
SSG → build time
ISR → static + periodic/on-demand revalidation
```

---

## Q8. Next.js caching kaise work karti hai?

Next.js mein caching multiple layers/context mein ho sakti hai.

Conceptually:

```text
Request
→ Server
→ Cached/revalidated data
→ Rendered output
```

You need to understand:

* fetch caching/revalidation behavior
* Full Route Cache
* Data Cache
* Router Cache

Important:
Next.js version ke according caching behavior/features change hue hain, so production project mein exact version/documentation ke behavior ko verify karna important hai.

Interview line:
“I would explicitly define the caching and revalidation strategy rather than assuming every fetch is cached.”

---

## Q9. Dynamic Rendering vs Static Rendering?

Static:
Output can be reused across requests.

Dynamic:
Output needs request-specific or dynamic data.

Dynamic rendering may be required when using things like:

* request-specific data
* cookies
* headers
* authentication context

Goal:
Static where possible, dynamic where necessary.

---

## Q10. Next.js Middleware kya hai?

Middleware request processing ke before/around routing logic ke liye use hota hai.

Common use cases:

* authentication checks
* redirects
* rewrites
* locale handling
* request-based routing logic

Example:

```text
User
→ Middleware
→ authenticated?
→ Dashboard / Login
```

Important:
Middleware ko heavy business logic ya database-heavy operations ka dumping ground nahi banana chahiye.

---

## Q11. Next.js Route Handlers kya hain?

App Router mein:

```text
app/api/users/route.ts
```

Example:

```js
export async function GET() {
return Response.json({ users: [] });
}
```

You can implement:

* GET
* POST
* PUT
* PATCH
* DELETE

Useful for lightweight backend/API endpoints within a Next.js application.

---

## Q12. Server Actions kya hain?

Server Actions allow client UI to invoke server-side functions.

Example concept:

```js
"use server";
async function createUser(formData) {
// server-side logic
}
```

Useful for:

* mutations
* form submissions
* server-side operations

Important:
Server Actions are not a replacement for every API architecture. For public APIs, external consumers, mobile apps, or independent backend services, a dedicated API may still be appropriate.

---

## Q13. Next.js authentication kaise design karoge?

Basic flow:

```text
User
↓
Login
↓
Authentication service
↓
Session/token
↓
Server-side authorization
↓
Protected page/API
```

Important:
Authentication ≠ Authorization.

Authentication:
“Who are you?”

Authorization:
“What are you allowed to do?”

For sensitive operations, authorization must be enforced server-side.

---

## Q14. Next.js application mein secrets kaha rakhenge?

Never expose secrets in client-side code.

Use environment variables:

```text
DATABASE_URL=...
API_SECRET=...
```

Server-side variables can remain private.

Variables exposed to browser typically use:

NEXT_PUBLIC_...

Important:

```text
NEXT_PUBLIC_API_SECRET=...
```

Aisa secret ke liye mat karo.

Interview line:
“Any credential that must remain secret should only be accessed server-side and should never be prefixed for public exposure.”

---

## Q15. Next.js mein loading.tsx aur error.tsx kya hain?

App Router supports special files.

loading.tsx:
Loading UI / streaming boundary ke liye.

error.tsx:
Route segment ke runtime errors ke liye error UI.

Example:

```text
app/dashboard/
├── page.tsx
├── loading.tsx
└── error.tsx
```

Concept:

```text
Request
→ Loading UI
→ Content
```

Error:

```text
→ Error UI
```

This improves user experience and isolates failures at route boundaries.

---

## Q16. Next.js mein SEO kaise improve karoge?

Use:

* Metadata API
* proper title/description
* semantic HTML
* Open Graph metadata
* sitemap
* robots.txt
* canonical URLs where appropriate
* server-rendered/static content when appropriate

Example concept:

```js
export const metadata = {
title: "Products",
description: "Browse products"
};
```

Also optimize:

* Core Web Vitals
* images
* loading performance

---

## Q17. Next.js Image Optimization kya hai?

Use:

```jsx
import Image from "next/image";
<Image
src="/product.jpg"
alt="Product"
width={800}
height={600}
/>
```

Benefits:

* optimized image delivery
* responsive sizing
* lazy loading where appropriate
* avoids unnecessarily large images

For production:
Don't blindly load original huge images to every device.

---

## Q18. Next.js performance kaise optimize karoge?

First measure.

Then check:

* Server vs Client Component boundary
* unnecessary "use client"
* bundle size
* code splitting
* image optimization
* caching/revalidation
* API latency
* database queries
* CDN
* streaming
* unnecessary client-side JavaScript

Important:

“Moving everything to Client Components is not automatically better.”

Prefer server rendering/data fetching where it makes sense.

---

## Q19. Next.js application scale kaise karoge?

Architecture:

```text
Users
↓
CDN
↓
Load Balancer
↓
Multiple Next.js instances
↓
API / Services
↓
Redis
↓
Database
```

Important principles:

* stateless application servers
* horizontal scaling
* caching
* CDN
* database scaling
* background jobs where needed

If file storage is required:

```text
Application → Object Storage
↓
CDN
```

Don't use application server's local disk as the primary shared file store in a horizontally scaled environment.

---

## Q20. Next.js production app slow hai. How will you debug it?

Lead-level approach:

```text
User reports slowness
↓
Define exactly what is slow
↓
Measure
↓
Identify layer
↓
Optimize
↓
Measure again
```

Check:

1. Browser rendering
2. Client JavaScript bundle
3. Server rendering time
4. Network latency
5. API latency
6. Database queries
7. Cache hit/miss
8. CDN
9. Image size
10. Third-party APIs

Strong interview answer:

“First I would identify whether the issue is client-side rendering, server rendering, network latency, backend processing, or database performance. I would use profiling and observability data to locate the bottleneck, optimize the responsible layer, and then validate the improvement with measurements.”

---

# Next.js Lead Engineer Mental Model

Next.js ko is tarah yaad rakho:

```text
Next.js
│
├── Routing
│
├── Server Components
│
├── Client Components
│
├── Data Fetching
│
├── Caching
│
├── Rendering
│   ├── Static
│   ├── Dynamic
│   └── Streaming
│
├── API
│   ├── Route Handlers
│   └── Server Actions
│
├── Security
│   ├── Authentication
│   └── Authorization
│
├── Performance
│   ├── Code Splitting
│   ├── Images
│   ├── CDN
│   └── Caching
│
└── Scaling
├── Stateless Servers
├── Load Balancer
├── Redis
└── Database
```
