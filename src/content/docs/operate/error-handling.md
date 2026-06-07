---
title: Error handling & troubleshooting
description: How to diagnose failures in a Ready-to-Launch integration — the common causes of generic 500s, what to capture for support, and a symptom-to-fix table.
sidebar:
  order: 3
---

When something goes wrong in onboarding, the end-user often sees a generic message — *"Something went wrong with your application. Please contact support."* — or a `500`. The underlying cause is usually one of a small number of known issues. This page helps you find it fast, capture the right details, and know what to escalate.

## First: capture these on every failure

Whether the error is yours, Unit's, Stripe's, or the user's, you want the same evidence. Capture it on your side at the moment of failure so you're never debugging blind:

| Capture | Why |
| --- | --- |
| **Your user id / JWT `sub`** | The only id that exists before any Unit resource does — your correlation key. |
| **Timestamp (UTC)** | To line up with Unit/Stripe logs. |
| **Environment** | Sandbox vs. production. |
| **The request or callback** | Which step failed (embed load, prefill call, user-list call, book payment, etc.). |
| **Application/customer/account id** | If one exists yet. |
| **Any correlation/request id** | From response headers or bodies, if present. |
| **Raw error body** | Don't discard it behind a friendly message — log the original. |

:::tip
Surface a **support reference** to the end-user that maps back to your captured `sub` + timestamp. Then a Slack/email escalation to Unit starts with "user `sub=abc123` at `2026-06-07T14:22Z` in sandbox" instead of "a customer got an error."
:::

## Common causes of generic errors

### Duplicate phone number

Each application requires a **unique phone number**. Reusing one (very common in sandbox testing) can surface as a generic `500` or "contact support" rather than a clear validation error.

- **Fix:** use a fresh phone number per application. In sandbox, generate unique test numbers.
- **Tell:** the failure happens at/after the phone step of onboarding.

### Stripe key permissions

For [unified onboarding](/build/unified-onboarding/), a Stripe **restricted key missing required permissions** causes failures during onboarding. The integration needs **Write** on Connect Accounts, Connect Persons, Core Files, and Identity Verification Sessions.

- **Fix:** grant all four permissions on the restricted key, re-save it in **Settings → Payment Processing**, and retry.
- **Tell:** failures begin only once the payment-processor (Stripe) leg of unified onboarding runs.

### Stale browser session

Leftover `unitCustomerToken` / `unitVerifiedCustomerToken` in `localStorage` can cause the embed to behave inconsistently — including demo/account state leaking into your local environment.

- **Fix:** clear both keys and reload (this is also your mandatory [logout cleanup](/build/embed-the-app/#logout-cleanup-web)).

### Wrong environment / token mismatch

A sandbox JWT with the production CDN (or vice versa) fails, often silently.

- **Fix:** match the [environment](/launch/environments/) end to end — script URL, JWT keys, API base URL.

### CSP blocking third parties

If your `Content-Security-Policy` doesn't allow Plaid, the identity vendors, or Zendesk, parts of onboarding fail to load with no obvious error.

- **Fix:** apply the [CSP allowances](/build/embed-the-app/#content-security-policy-web).

## Symptom → likely cause

| Symptom | Look at |
| --- | --- |
| Embed renders blank / parts missing | CSP blocking third parties; wrong env script; token not set before mount |
| "Token invalid" / embed won't authenticate | JWT claims (`iss`/`sub`/`exp`), wrong key/`kid`, env mismatch — see [Auth troubleshooting](/build/authentication/#troubleshooting-the-embed-wont-load-or-rejects-the-token) |
| Generic 500 / "contact support" mid-onboarding | Duplicate phone number; Stripe key permissions (if unified) |
| Onboarding errors with no webhook and no resource | Failure occurred before an application was created — see [visibility gaps](/operate/application-states/#the-visibility-gaps--read-this-before-you-scope-support) |
| Prefill not populating | Endpoint not allowlisted by Unit; JWT validation failing; wrong response `type` |
| User-list / team not working | Endpoint not allowlisted; multi-user not enabled by Unit |
| Webhooks stopped arriving | Subscription marked `Unavailable` after inactivity — re-enable; check IP allowlist |
| Dashboard counts ≠ visible accounts | Denied/failed applications counted in aggregates but filtered from lists |

## API errors

The RtL API returns JSON:API-style errors. Always read the response body — it carries more than the status code. Handle at minimum:

- `401 / 403` — bad or unscoped bearer token (check the token's [scopes](/api/overview/#scopes)).
- `404` — wrong id or wrong environment (a sandbox id won't exist in production).
- `422` — validation (e.g. a malformed book payment).
- `5xx` — retry idempotently (use an `idempotencyKey` on writes) and capture the body for escalation.

## When to escalate to Unit

If you've ruled out the common causes above and still see a failure, open a ticket with your Unit solution engineer. Lead with the context you captured — `sub`, timestamp, environment, the failing step, any ids, and the raw error body. That turns a back-and-forth into a single, quickly-resolvable report.

## Next step

→ [The Unit Dashboard](/operate/dashboard/)
