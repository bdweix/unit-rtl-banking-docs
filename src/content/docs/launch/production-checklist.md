---
title: Launch checklist
description: Everything to verify and configure before taking a Ready-to-Launch Banking integration to production.
sidebar:
  order: 3
---

You'll recreate your sandbox configuration in the live environment (see [Environment model](/launch/environments/)), so this checklist exists to make sure nothing is missed. Work top to bottom. Items marked **🤝 Unit** are done together with your solution engineer — start those a little early.

## 1. Build is complete in sandbox

- [ ] Embed renders and the full onboarding → banking flow works end to end.
- [ ] JWT minted server-side; required claims (`sub`, `iss`, `exp`) correct; short-lived.
- [ ] Logout clears `unitCustomerToken` + `unitVerifiedCustomerToken` (native: SDK cleanup).
- [ ] Theme applied and reviewed across onboarding, accounts, cards, and mobile widths.
- [ ] (If used) Prefill, multi-user, unified onboarding, and end-user events all working.
- [ ] Book payments to/from your operational account succeed with `idempotencyKey` + `tags`.

## 2. Observability is in place

- [ ] Webhook endpoint live, verifying **source IP + signature**, returning 2xx fast, idempotent.
- [ ] Subscribed to all events you depend on (`application.*`, `customer.created`, `account.created`, `card.*`, `transaction.created`, `whiteLabelAppUser.*`).
- [ ] Webhook subscription **status monitoring** so an idle→`Unavailable` outage is caught.
- [ ] Your **own onboarding funnel logging** (JWT `sub` + timestamp) so pre-application failures are still visible. See [Application states](/operate/application-states/).
- [ ] Error capture records `sub`, timestamp, environment, step, ids, correlation id, raw body. See [Error handling](/operate/error-handling/).

## 3. Security is hardened

- [ ] Run the full [security hardening checklist](/launch/security/#pre-launch-hardening-checklist).
- [ ] Production API token is server-side, scoped, in a secrets manager, and rotatable.
- [ ] Unit ids mapped to your own opaque ids before reaching end-users.
- [ ] Token-storage concern reviewed with Unit; commitment/timeline recorded.

## 4. Production configuration (re-created from sandbox)

Each of these must be set up again in the **live** environment:

- [ ] Switch component script to `https://ui.unit.co/...` and API base to `https://api.unit.co/`.
- [ ] **🤝 Unit** — register production **JWKS / public key** (send JWT/public-key details).
- [ ] **🤝 Unit** — apply/confirm **production branding** changes.
- [ ] **🤝 Unit** — set up **production webhook** subscriptions and signing secret.
- [ ] **🤝 Unit** — allowlist production **prefill** and **user-list** callback URLs.
- [ ] **🤝 Unit** — **enable multi-user** (if used).
- [ ] **🤝 Unit** — complete **advanced due diligence** if you need transaction visibility.
- [ ] (If unified) Production **Stripe keys + permissions + webhooks** configured.
- [ ] Production **banking page URL** set.
- [ ] Production CSP deployed (as an HTTP header).

## 5. Operational readiness

- [ ] Runbook for the [common failure causes](/operate/error-handling/#common-causes-of-generic-errors) (duplicate phone, Stripe perms, stale session).
- [ ] A documented escalation path to Unit that includes your captured correlation details.
- [ ] A known process for actions handled with Unit (e.g. account closure) — who requests and how it's tracked on your side.
- [ ] Customer-facing support/FAQ wired up (Unit handles banking inquiries in-app + via email).
- [ ] (If used) [Outreach](/outreach/overview/) assets configured.

## 6. Smoke test in production

- [ ] One real application end to end (real OTP this time).
- [ ] Confirm webhooks arrive at the production endpoint and verify.
- [ ] Confirm a book payment moves money and a `transaction.created` (if entitled) lands.
- [ ] Confirm logout clears session and a second user can't see the first user's data.

## Coordinate the 🤝 Unit items early

The **🤝 Unit** items are quickest when you bundle them into a single request to your solution engineer so they can be handled together:

> Production JWKS/public key, branding, webhook setup + signing secret, prefill + user-list allowlisting, multi-user enablement, and (if you need transaction access) advanced due diligence.

## You're ready

With the boxes checked and the production smoke test green, you're live. Keep your [error-handling runbook](/operate/error-handling/) and escalation path handy for day-2 support.
