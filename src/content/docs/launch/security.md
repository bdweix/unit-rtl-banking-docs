---
title: Security model
description: How tokens and sessions work in Ready-to-Launch, your responsibilities, and a pre-launch security checklist.
sidebar:
  order: 2
---

This page describes how authentication and session state work in Ready-to-Launch and the practices to follow before you ship. None of it is heavy lifting — it's the standard hygiene for an embedded financial flow.

## The two tokens

| Token | Minted by | Lives where | Purpose |
| --- | --- | --- | --- |
| **Your JWT** | You (RS256, your private key) | Passed to the embed; mint just-in-time | Identifies the end-user *to Unit*. |
| **Unit customer token(s)** | Unit (after the embed authenticates) | Browser `localStorage` (`unitCustomerToken`, `unitVerifiedCustomerToken`) on web | The end-user's *banking session* inside the embed. |

Mint your JWT **server-side** and keep it **short-lived** — generate it just before rendering the embed rather than caching a long-lived token in the browser.

## Session cleanup on web

On web, the embed keeps the end-user's banking session in `localStorage`. Clear it when the user logs out, and after 24 hours of inactivity:

```js
localStorage.removeItem('unitCustomerToken');
localStorage.removeItem('unitVerifiedCustomerToken');
```

This keeps sessions from carrying over on shared devices and avoids stale-state issues. A few supporting practices:

- **Keep a strict [CSP](/build/embed-the-app/#content-security-policy-web)** on the banking page and follow your usual front-end hygiene (input escaping, dependency updates).
- **Keep the banking page lean.** Minimize third-party scripts (analytics, chat, A/B tools) on the page that hosts the embed.
- **Use separate browser profiles** when testing to avoid session bleed.
- **On native, use the SDK's cleanup method** on logout — the SDKs manage session storage for you.

## Your API token

The backend bearer token for the [RtL API](/api/overview/) can read customer data and move money via book payments — treat it as a high-value secret.

- **Server-side only.** Never expose it to the browser or ship it in client code.
- **Scope it down.** Request only the [scopes](/api/overview/#scopes) you use.
- **Per environment.** Separate tokens for sandbox and production; never reuse.
- **Rotate** on a schedule and on suspected exposure.
- **Store in a secrets manager**, not in source or committed env files.

## Callback endpoints (prefill & user-list)

Your [prefill](/build/prefilling/) and [user-list](/build/multi-user-access/) endpoints return PII to Unit, so:

- **Validate the JWT on every request** — issuer, audience, signature, expiry. The bearer token is the authorization.
- Serve over **HTTPS only**.
- **Don't log PII.**
- Be **allowlisted** with Unit before they go live.

## Working with resource identifiers

RtL resources use integer ids (e.g. account `10020`, customer `10014`). As with any vendor ids, keep them server-side:

- **Map Unit ids to your own identifiers** at your boundary rather than exposing them to end-users.
- Always enforce **your own authorization** on any request keyed by a Unit id.

## Pre-launch security checklist

- [ ] JWTs are short-lived and minted server-side.
- [ ] Logout clears both `localStorage` keys; native uses the SDK cleanup method.
- [ ] Strict CSP on the banking page; third-party scripts minimized.
- [ ] API token is server-side, scoped, per-environment, in a secrets manager, and rotatable.
- [ ] Callback endpoints validate the JWT, are HTTPS-only, and don't log PII.
- [ ] Unit ids are mapped to your own identifiers before reaching end-users.

## Next step

→ [Launch checklist](/launch/production-checklist/)
