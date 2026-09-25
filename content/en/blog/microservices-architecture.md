---
title: "Microservices: When They Make Sense (and When They're Just Expensive Headaches)"
excerpt: "The decomposition of monolithic systems into distributed services. An analysis of adoption criteria, implementation strategies and anti-pattern mitigation."
image: "/blog/microservices.webp"
category: "Software Architecture"
author:
  name: "James"
  avatar: "/about-photo.jpg"
date: "15 Dec 2024"
readTime: "12 min read"
featured: false
tags:
  - Microservices
  - Architecture
  - Design Patterns
---

If you follow the industry hype, you've probably noticed that microservices became almost a mantra. There are companies that haven't even solved the basic problems of their monolith and already want to break everything into 27 independent services running on distributed clusters with fully automated CI/CD. Spoiler: that usually goes wrong.

The truth is that **microservices aren't about technology. They're about organization.**
Historically, they emerged because companies like Amazon, Netflix and Google had grown so much that a single monolithic repository could no longer handle it, either technically or socially.

Let's talk about when this architecture makes sense, which principles actually matter and where almost everyone slips up.

---

## **1. Why Microservices Became a Trend (and Why That Isn't Enough For You to Use Them)**

Back in the 2010s, while startups raced to scale, tech giants faced an unprecedented problem:
**how could dozens of teams ship features without constantly blocking each other?**

The modular monolith worked up to a point, but when you have 200 devs committing daily to the same repository, any global refactor becomes a military operation.

Microservices emerged as a response to that organizational chaos. The problem is that:

> *Most companies adopt microservices without having the problem that originally created them.*

And that's how unnecessarily complex distributed systems are born.

---

## **2. When It REALLY Makes Sense to Consider Microservices**

Let's get to the criteria with no illusions and no romanticizing:

### **Organizational scalability**

When you have multiple teams that need autonomy to version, test, deploy and break things without taking down the rest of the company.

If your company has a five-dev team, splitting into twelve services doesn't give you autonomy, it gives you fatigue.

### **Granular scaling**

Not every module grows the same way.

* Recommendation system → CPU and memory
* Upload and processing → I/O intensive
* Public API → latency-bound

If each part demands very different resources, microservices can be an advantage.

### **Technological heterogeneity**

This is the famous "each problem with the best tool".

Want to run machine learning in Python, critical backend in Go and dashboards in Node? Microservices allow that without throwing everything into the same bag.

---

## **3. The Three Principles Every Architect Should Print and Paste on the Wall**

Here's the part that seems trivial but keeps being ignored by giant companies:

### **3.1 Single Responsibility (For Real)**

SRP (Single Responsibility Principle) isn't just for classes.
Architecture also has a single responsibility.

If your service does:

* login
* user management
* billing
* notifications
* PDF

… then it isn't a service, it's a condominium.

### **3.2 Low Coupling**

The biggest mistake when migrating to microservices is creating hidden dependencies.

* services that only work if another one is alive
* huge payloads
* breakable contracts
* absent versioning

If changing a service requires opening PRs in four others, you just distributed the monolith.
You didn't solve anything.

### **3.3 High Cohesion**

This should be the golden rule:

> *Things that change together, stay together.*

A public API calling five internal services to assemble a response?
Your design is probably charging you interest.

---

## **4. Synchronous, Asynchronous and How Teams Get It Wrong Every Day**

Service communication is where the distributed system shows its teeth.

### **4.1 Synchronous Communication (REST/gRPC)**

Simple, familiar, but dangerous:

* blocks the caller
* spreads latency
* creates temporal coupling

This is the gateway to the classic:
"service X is slow → everything is slow".

### **4.2 Asynchronous Communication (Events and Messaging)**

RabbitMQ, Kafka, NATS… the ecosystem is vast.

Advantages:

* resilience
* decoupling
* peak tolerance
* reprocessing

But of course: few people know how to model events properly.
What was meant to be EDA turns into a tangle of duplicated messages and flows that are hard to trace.

---

## **5. The Three Biggest Architectural Crimes Committed with Microservices**

These are classics. Any experienced architect has seen them all, sometimes in the same project.

### **1. The Distributed Monolith**

People go around opening services, but everything depends on everything.
Changing one function requires a community effort.

You get:

* network latency
* more expensive infrastructure
* harder deploys

… and **zero** real benefit.

### **2. Shared Database**

This one is almost a capital sin.

If multiple services write to the same database, you:

* break isolation
* lose autonomy
* create invisible dependencies
* weld schema evolutions together

A database per service isn't a fad, it's the foundation of the architecture.

### **3. Nanoservices (the famous over-engineering)**

If you have services so small they look like distributed functions, you created accidental complexity.

But it's always the same speech:

> "We're being more scalable."
> No.
> You're being more miserable.

---

## **6. Settling the Score: Microservices Aren't a Silver Bullet**

Every company that has minimally studied the history reaches the same conclusion:

> **Start with a modular monolith and extract services when there's a real reason.**

Microservices demand maturity in:

* DevOps
* observability
* fault tolerance
* automation
* versioning culture
* domain modeling

Either you come in prepared, or you become a hostage of your own architecture.