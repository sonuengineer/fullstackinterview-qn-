# AWS & Cloud — 20 Interview Questions & Answers

## Q1. EC2 kya hai?

EC2 = virtual server in AWS.

Use:

* Node.js application
* backend services
* custom server workloads

Basic architecture:

```text
User
↓
Load Balancer
↓
EC2 instances
↓
Database
```

EC2 gives control over:

* CPU
* memory
* OS
* networking
* application runtime

---

## Q2. EC2 ko horizontally scale kaise karoge?

Instead of one large server:

```text
EC2
↓
EC2 + EC2 + EC2
```

Architecture:

```text
User
↓
ALB
├── EC2-1
├── EC2-2
├── EC2-3
└── EC2-N
```

Use Auto Scaling Group to automatically add/remove instances based on demand.

---

## Q3. ALB kya hai?

ALB = Application Load Balancer.

It distributes HTTP/HTTPS traffic across healthy targets.

```text
User
↓
ALB
├── Server 1
├── Server 2
└── Server 3
```

Benefits:

* load distribution
* health checks
* high availability
* TLS termination
* path/host-based routing

---

## Q4. Health Check kya hai?

Load balancer periodically checks whether an instance is healthy.

Example:

```text
GET /health
```

Response:

```text
200 OK
```

If instance stops responding correctly:

```text
ALB
↓
removes unhealthy instance from traffic
```

This prevents users from being routed to a broken server.

---

## Q5. S3 kya hai?

S3 = object storage.

Good for:

* images
* videos
* PDFs
* backups
* logs
* static assets

Architecture:

```text
Application
↓
S3
```

Don't use EC2 local disk as shared permanent storage when horizontally scaling.

---

## Q6. S3 + CloudFront kyun use karenge?

S3 stores the objects.

CloudFront is the CDN layer that serves/cache content closer to users.

```text
User
↓
CloudFront
↓
S3
```

Benefits:

* lower latency
* reduced origin load
* better global delivery
* caching

Simple:

```text
S3 stores → CloudFront serves/caches.
```

---

## Q7. RDS kya hai?

RDS = managed relational database service.

Supports engines such as:

* PostgreSQL
* MySQL
* MariaDB
* SQL Server
* Oracle

AWS handles much of:

* provisioning
* backups
* patching
* monitoring
* high availability options

```text
Application
↓
RDS
```

---

## Q8. RDS Read Replica vs Multi-AZ?

Read Replica:

```text
Primary
├── Read Replica 1
└── Read Replica 2
```

Purpose:

* read scaling

Multi-AZ:

```text
Primary
↓
Standby in another AZ
```

Purpose:

* high availability/failover

Simple:

```text
Read Replica → scale reads
Multi-AZ → improve availability
```

They solve different problems.

---

## Q9. Redis / ElastiCache kyun use karenge?

Frequently accessed data ko memory mein cache karne ke liye.

```text
Application
↓
Redis
↓ cache miss
Database
```

Use cases:

* caching
* sessions
* rate limiting
* counters
* temporary data
* distributed locks in appropriate cases

Important:
Redis should not automatically become the source of truth for every business-critical dataset.

---

## Q10. VPC kya hai?

VPC = Virtual Private Cloud.

It provides an isolated network environment in AWS.

Concept:

```text
VPC
├── Public Subnet
└── Private Subnet
```

Typical architecture:

```text
Internet
↓
ALB (Public)
↓
Private EC2
↓
Private RDS
```

Database ko directly public internet par expose nahi karna chahiye.

---

## Q11. Public vs Private Subnet?

Public subnet:
Has route to Internet Gateway.

Typically:

* Load Balancer
* Bastion/access components where appropriate

Private subnet:
No direct inbound internet route.

Typically:

* application servers
* databases
* internal services

Internet access for private resources can be provided through NAT Gateway when needed.

---

## Q12. Security Group kya hai?

Security Group acts like a stateful virtual firewall around AWS resources.

Example:

ALB:

```text
80/443 → Internet
```

EC2:

```text
8080 → only from ALB security group
```

RDS:

```text
5432 → only from EC2/application security group
```

This creates controlled communication.

---

## Q13. IAM kya hai?

IAM = Identity and Access Management.

Controls:

* who can access AWS
* what they can access
* what actions are allowed

Concept:

```text
Principal
↓
IAM Policy
↓
AWS Resource
```

Principle:

**Least privilege**

Give only permissions actually required.

Avoid giving every service/admin-level permissions.

---

## Q14. Secrets kaha store karoge?

Don't hardcode:

```text
DB_PASSWORD=abc123
```

Don't commit secrets to Git.

Use:

* AWS Secrets Manager
* SSM Parameter Store
* appropriate IAM roles

Application retrieves secrets securely.

Important:
Secrets should not be exposed to frontend/browser bundles.

---

## Q15. AWS Lambda kya hai?

Serverless compute.

You provide function code; AWS manages server infrastructure.

Useful for:

* event-driven workloads
* small APIs
* background processing
* scheduled jobs
* file processing

Example:

```text
S3 upload
↓
Lambda
↓
Process image
```

But Lambda isn't automatically the best choice for every workload.

---

## Q16. ECS/EKS vs EC2?

EC2:
You manage servers.

ECS:
AWS container orchestration service.

EKS:
Managed Kubernetes control plane.

Simple:

```text
EC2 → VM/server management
ECS → container orchestration with AWS-managed experience
EKS → Kubernetes ecosystem/control plane
```

Choose based on:

* team expertise
* operational complexity
* workload requirements
* portability
* scaling needs

Don't choose Kubernetes just because it sounds advanced.

---

## Q17. AWS application highly available kaise banaoge?

Avoid single point of failure.

Architecture:

```text
Internet
↓
ALB
├── AZ-1 → EC2
├── AZ-2 → EC2
└── AZ-3 → EC2
```

Database:

```text
Multi-AZ where appropriate
```

Other considerations:

* health checks
* auto scaling
* backups
* monitoring
* graceful deployments

Key idea:

**Don't depend on one server/AZ.**

---

## Q18. AWS application suddenly 10× traffic receive kare to?

Don't immediately add huge servers manually.

Use:

```text
ALB
↓
Auto Scaling
↓
Multiple instances
```

Then identify bottlenecks:

* CPU
* DB
* Redis
* network
* external APIs
* queue backlog

For read-heavy workloads:

* caching
* CDN
* read replicas where appropriate

For background work:

* queues + workers

Important:
Scaling application servers alone doesn't solve a database bottleneck.

---

## Q19. Production AWS system ka monitoring kaise karoge?

Monitor:

### Infrastructure

* CPU
* memory
* disk
* network

### Application

* RPS
* P50/P95/P99 latency
* error rate
* throughput
* event-loop lag

### Database

* connections
* CPU
* slow queries
* latency
* storage

### Business

* successful orders
* failed payments
* conversion
* queue backlog

Use appropriate AWS observability services such as CloudWatch, plus application-level logs/metrics/traces.

---

## Q20. Production deployment architecture kaise design karoge?

Typical:

```text
Developer
↓
Git
↓
CI/CD
↓
Build/Test
↓
Container/Artifact
↓
Deployment
↓
ALB
↓
Multiple instances
```

For safer deployments:

* rolling deployment
* blue/green deployment
* canary deployment

Important:

Before deployment:

* tests
* health checks
* rollback strategy

After deployment:

* monitor errors
* latency
* CPU/memory
* business metrics

Lead-level answer:

“I would design deployments to be automated, observable and reversible. A deployment should have health checks, monitoring and a clear rollback strategy rather than relying on manual recovery.”

---

# AWS Lead Engineer Mental Model

```text
AWS
│
├── Compute
│   ├── EC2
│   ├── ECS
│   ├── EKS
│   └── Lambda
│
├── Networking
│   ├── VPC
│   ├── Subnets
│   ├── ALB
│   ├── Security Groups
│   └── NAT
│
├── Storage
│   ├── S3
│   └── EBS
│
├── Database
│   ├── RDS
│   ├── Read Replicas
│   └── Multi-AZ
│
├── Cache
│   └── ElastiCache / Redis
│
├── Security
│   ├── IAM
│   └── Secrets Manager
│
└── Operations
├── Auto Scaling
├── CloudWatch
├── CI/CD
└── Disaster Recovery
```
