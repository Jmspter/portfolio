---
title: "From Docker to Kubernetes: The Path Every Dev Eventually Discovers the Hard Way"
excerpt: "An in-depth investigation into the paradigms of containerization and orchestration of distributed systems, with a practical guide to implementing Kubernetes clusters."
image: "/blog/kubernetes.webp"
category: "DevOps"
author:
  name: "James"
  avatar: "/about-photo.jpg"
date: "05 Nov 2025"
readTime: "15 min read"
featured: false
tags:
  - Docker
  - Kubernetes
  - DevOps
  - Software Architecture
---

Modern infrastructure wasn't born ready-made, and a lot of people forget that. Before containers, we lived in a world of monolithic bastions, "pet" servers we treated like pets. If something went wrong, we cared for them, fed them, cuddled them, patched them. The arrival of Docker turned that upside down, pulling the whole market into a "cattle" culture: if one dies, another comes up.

In this text, I want to take you through that transition, not only the technical part, but **the context**, the common stumbles, and the decisions that shaped how we run software today.

---

## **1. A Bit of History to Understand Why Docker Changed Everything**

For decades, traditional virtualization solved a real problem: isolating applications. The catch is that it did so *by emulating entire hardware*. Heavy. Slow. Inefficient. If you've ever spun up a stack on VMware or Hyper-V, you know what I'm talking about.

Containerization came with a bolder idea:

> *"What if, instead of pretending we have different computers, we just isolated processes within the same kernel?"*

Linux already had the ingredients (cgroups, namespaces, chroot), but nobody had tied it all together into something easy to use. When Docker appeared in 2013, it delivered that simplicity on a silver platter: `docker build`, `docker run`, done. Suddenly, dev teams no longer had to fight with "it works on my machine".

And look… to this day there are giant companies that only discovered Docker from 2020 onwards. And still getting the basics wrong.

---

## **2. Docker: The Modern Way to Freeze Your Environment**

The beauty of Docker is immutability. A container is a previously frozen environment, with dependencies and runtime always the same. That eliminates differences between machines, between staging and production, between your laptop and the server.

A well-made `Dockerfile` saves you from many problems. But what do we see in the real world?

* Devs copying the whole project before copying `package.json`
* Giant, slow images
* Builds that invalidate the cache for no reason
* `latest` used as if it were safe

The example below is already the "decent minimum" for Node.js:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
```

This looks basic, right? It is. But **most teams still get it wrong**. Especially the cache: installing dependencies before copying the code makes a huge difference in CI/CD builds.

---

## **3. And When the Application Grows? Docker Doesn't Orchestrate Anyone**

Docker solved one problem. But it created another: how do you manage dozens or hundreds of containers?

When you have:

* 1 app → Docker handles it
* 3 services → still controllable
* 30 microservices → chaos
* 300 services → you need help

Without orchestration, you end up manually:

* restarting services that crash
* distributing load by hand
* building internal DNS with prayer and duct tape
* rolling back like you're asking God not to break anything

It was in that chaos that Kubernetes shone.

---

## **4. Kubernetes: The Control Plane That Became a Global Standard**

Kubernetes (or K8s for friends) was born inside Google, inspired by Borg, the system that had been orchestrating millions of containers since the 2000s. In 2014 they decided to open it up to the world: "here, good luck".

The central idea is simple:

> *You declare the desired state; Kubernetes ensures the actual state.*

That's the famous **declarative** model. And that's exactly where many teams stumble, trying to use Kubernetes as if it were Docker on steroids.

K8s's main abilities:

### **Automatic scaling**

Increases or reduces replicas based on real metrics.

### **Self-healing**

Container crashed? Restarts.
Node died? Reschedules.
Buggy image? Tries rollback.

### **Smart load balancing**

None of that hack with duplicated Nginx and badly written rules.

### **Rolling updates**

Without downtime, that is, when they're not configured wrong.

And yes, to this day there are teams putting `replicas: 1` in production. Unbelievable.

---

## **5. Key Concepts Every Dev Should Know Before Saying "I Know K8s"**

Here's a quick taxonomy, no beating around the bush:

| Concept       | What it really means (without marketing)                 |
| ------------- | -------------------------------------------------------- |
| **Pod**       | Minimum unit. Can have 1+ containers stuck together.     |
| **Service**   | A stable address to reach volatile pods.                 |
| **Deployment** | The manager that ensures X replicas always exist.       |
| **ConfigMap** | Non-sensitive configuration (and lots of people misuse it). |
| **Secret**    | Sensitive configuration, and lots of people use it even worse. |

There are companies that put passwords in ConfigMap and think everything is fine. It's not.

---

## **6. Declarative Infra in Practice**

A Kubernetes manifest expresses your intent. The Control Plane takes care of the rest.

A direct example of a simple Deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app-container
        image: my-app:latest
        ports:
          - containerPort: 3000
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
```

The secret here is understanding that **this defines the desired state**.
If a pod crashes, Kubernetes doesn't even ask; it spins up another one.

---

## **7. Local Environment: Where Every Dev Should Have Started**

If you've never run Minikube or Kind locally, start tomorrow.
It's the safest way to break everything without taking down production.

```bash
minikube start
kubectl apply -f deployment.yaml
kubectl get pods -o wide
```

Understanding `kubectl` is half the game. Whoever masters the CLI masters Kubernetes.

---

## **8. Conclusion: Docker is the Brick, Kubernetes is the Architect**

Docker standardizes and packages.
Kubernetes orchestrates and scales.

One doesn't replace the other. They're different pieces of a bigger puzzle.

And honestly, as basic as it sounds, **most teams still stumble over fundamental practices**: huge images, insecure deployments, environments without resource limits, exposed secrets… all for lack of this foundation.

Mastering Docker and Kubernetes isn't optional in 2025, it's the minimum to work with modern systems.