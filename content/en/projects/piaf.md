---
postId: piaf
title: PIAF
description: REST API for PIAF – Programa Institucional de Atividade Física (COESPE/UFRN). Manages users (students, instructors and admins), classes, enrollments with a waiting list, attendance, renewals and reports, with JWT authentication and transactional emails.
stack: ["Ruby", "Rails 8 (API)", "PostgreSQL", "Devise + JWT", "Pundit", "Pagy"]
cover: piaf-03
coverAlt: PIAF cover
gallery: [piaf-01, piaf-02, piaf-03]
---

## Problem

The COESPE/UFRN program offers physical activities to the community, but management was manual: enrollments through forms and email, printed attendance lists and error-prone renewal tracking. With a waiting list and many students, scaling without a system wasn't feasible.

## Solution

I developed the PIAF REST API with Ruby 4.0.6 and Rails 8.1.3 (API), with clear roles for students, instructors and admins. Authentication uses JWT with denylist revocation (Devise 5 + devise-jwt), role-based authorization is handled by Pundit and serialization by Blueprinter. Enrollments respect the waiting list, attendance feeds paginated reports with Pagy 9, and transactional emails run in the background with Delayed Job and scheduling via Whenever. Auditing with paper_trail, rate limiting with Rack::Attack and CORS with rack-cors.

## What I learned

I learned to design an API with well-defined roles from modeling onwards and the value of choosing the right tool for each concern: JWT for sessions, Pundit for authorization and async jobs for email. The enrollment waiting list was a good exercise in transactions and consistency under concurrent scenarios.