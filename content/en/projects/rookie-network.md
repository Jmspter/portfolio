---
postId: rookie-network
title: Rookie Network
description: A Ruby on Rails app for training new employees in companies. It organizes onboarding into content tracks, tracks each participant's progress and gives managers visibility into performance and pending items.
stack: [Ruby on Rails, PostgreSQL]
cover: rookie-01
coverAlt: Rookie Network cover
gallery: [rookie-01]
---

## Problem

Onboarding a new hire is often grueling: scattered content, no clear learning path and no way for managers to track progress. Every company ends up paying, in practice, the cost of a poor onboarding.

## Solution

I built Rookie Network, a Ruby on Rails app for training new employees. The platform organizes onboarding into content tracks (videos, documents and quizzes), records each participant's progress and lets managers follow performance and pending items closely, with simple reports per employee and per cohort.

## What I learned

I learned to model content hierarchies (tracks → modules → items) and to design access control between the admin, manager and new hire roles, as well as to build status progression as each step is completed.