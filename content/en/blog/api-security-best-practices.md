---
title: "API Security: The Basics Everyone Should Know (But Doesn't)"
excerpt: "Protecting APIs against common vulnerabilities. OAuth2, JWT, rate limiting and modern security standards applied."
image: "/blog/api-security.webp"
category: "Security"
author:
  name: "James"
  avatar: "/about-photo.jpg"
date: "28 Oct 2025"
readTime: "9 min read"
featured: false
tags:
  - Security
  - API
  - OAuth2
  - JWT
---

If there's one thing that always amazes me, it's how, in 2025, I still have to repeat fundamental API security concepts. We live in a world where microservices talk to other microservices, which talk to external gateways, which trigger queues, which call serverless functions scattered across five providers. And yet, there are still developers storing JWTs in `localStorage` or exposing a login endpoint with no rate limiting.

Enough said. Let's tidy things up.

Everything I'll explain here isn't my opinion. It's in well-established documents like the **OWASP API Security Top 10**, the **NIST** recommendations, IETF RFCs and classic books on secure architecture. But I'll present it in the plain, direct tone I wish someone had used with me years ago.

---

## Authentication vs Authorization: the bread and butter everyone confuses

Every time someone says "my API uses JWT so it's secure", I already know there's a problem. Before talking about tokens, let's recap two concepts that should be tattooed onto every editor:

| Term              | Question                 | What it means in practice   |
| ----------------- | ------------------------ | --------------------------- |
| **Authentication** | Who are you?             | Login, password, PKCE, SSO  |
| **Authorization**  | What can you do?         | Permissions, scopes, roles  |

Authentication identifies.
Authorization restricts.

One doesn't replace the other. Many disastrous APIs are born precisely from the confusion between these two worlds.

---

## OAuth2 and OpenID Connect: the duo that became an industry standard

OAuth2 isn't exactly simple, and it wasn't meant to be. It was created to solve problems of delegated access between services, when nobody wanted to hand over credentials to third parties. On top of it came **OpenID Connect**, which added the missing piece: structured, signed, validated identity.

That's where the flows we see everywhere come from:

* **Authorization Code**: the classic flow for backends that can keep a secret.
* **PKCE**: the modern, secure version for SPAs and mobile apps.
* **Client Credentials**: microservice talking to microservice, with no humans around.
* **Well-defined scopes**: the equivalent of not handing over the master key just because someone wants to use the printer.

If you're building a public API today and you're not using OAuth2/OIDC, you're probably reinventing a wheel that has been round for over 10 years.

---

## JWT in Ruby: simple, direct and without frills

Generating a JWT is about as basic as it gets. But, as always, the devil is in the details.

```ruby
require 'jwt'

payload = {
  sub: user.id,
  role: user.role,
  exp: Time.now.to_i + 15 * 60 # expires in 15 minutes
}

secret_key = ENV['JWT_SECRET']

token = JWT.encode(payload, secret_key, 'HS256')
puts token
```

So far everything looks fine. But the problem isn't generating the token. It's **how** you treat it afterwards.

---

## JWT best practices that shouldn't be optional

Here's the checklist that separates professional APIs from dangerous experiments:

* Short-lived JWT. **15 minutes** is the sweet spot.
* Rotating refresh tokens. Always.
* Tokens always signed with an asymmetric key (RS256).
* Verify **every** claim. Never trust only `sub`.
* **Never**, under any circumstances, store sensitive tokens in `localStorage`.
* TLS is mandatory. A token over plain HTTP is an open invitation to theft.
* Active revocation. If there's a leak, kill the token without mercy.

All of this is literally described in the OWASP API Security Top 10 (2023). And still, every year we see incidents caused by poor token practices.

---

## Rate Limiting: either you add it, or someone takes you down

Every API exposed to the world needs to be able to say "calm down, breathe".
If you don't, someone will take you down with 3 lines of curl.

The traditional way is to use Redis, gateways, proxies. But if you're on a Ruby project using Rack, **Rack::Attack** is a life-saver:

```ruby
# config/initializers/rack_attack.rb

class Rack::Attack
  throttle("requests/by_ip", limit: 100, period: 15.minutes) do |req|
    req.ip
  end

  self.throttled_response = lambda do |_env|
    [429, { "Content-Type" => "text/plain" }, ["Too many requests. Try again later."]]
  end
end
```

This prevents everything from brute force to misbehaving clients.

---

## Input Validation: the number one cause of problems (since forever)

If there's one capital sin in APIs, it's trusting the input.

OWASP has repeated this for over a decade, and still there are serious applications that don't even validate field sizes.

The basic rules:

* Validate everything: type, format, length, range.
* Never concatenate SQL. Always use parameterized queries.
* Sanitize outputs depending on context (HTML ≠ JSON ≠ logs).
* Reject extra fields. Payloads should always be strictly defined.

Example:

```ruby
User.where(email: params[:email]) # ActiveRecord escapes it for you
```

But if you write:

```ruby
User.where("email = '#{params[:email]}'")
```

You just opened a direct gate to hell.

---

## TLS and Secure Transport: nothing less than mandatory

Today, an API without TLS 1.3 is like locking the front door and leaving the window open.
HTTPS isn't optional. An expired certificate isn't acceptable.

Enable HSTS. Renew certificates automatically. And monitor.

---

## Final checklist (so nobody can say we forgot)

```text
[ ] HTTPS/TLS active and configured
[ ] Solid authentication (OAuth2/OIDC)
[ ] JWT with short expiry and strong signature
[ ] Rotating refresh tokens
[ ] Working rate limiting
[ ] Mandatory input validation
[ ] Parameterized SQL queries
[ ] Response sanitization
[ ] CORS configured
[ ] Header security (CSP, HSTS, X-Frame-Options)
[ ] Real-time logs and auditing
[ ] Dependencies always up to date
```

---

## Conclusion

API security isn't an extra feature, an add-on, or a plugin.
It's architecture.

And bad architecture doesn't get fixed by throwing a JWT and a proxy in front of it.
It's either born secure, or born with problems.

Following these practices won't make your application "bulletproof", but it will put you far above average. And honestly, in 2025, this should be the baseline, not a differentiator.