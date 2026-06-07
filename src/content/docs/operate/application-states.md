---
title: Application & onboarding states
description: The onboarding lifecycle, what each status means, and how each state surfaces to you via webhooks, browser events, and the dashboard.
sidebar:
  order: 2
---

Onboarding is where most real-world support tickets originate, so it's worth understanding the lifecycle precisely: every status, and — just as important — **how (or whether) you can observe it**.

## The lifecycle

```
                ┌─────────────────────┐
  user applies  │   Pending           │
   ───────────► │   (submitted)       │
                └──────────┬──────────┘
                           │
        ┌──────────────────┼───────────────────┐
        ▼                  ▼                   ▼
 AwaitingDocuments    PendingReview        Approved ──► customer + account created
 (need more docs)     (under review)
        │                  │
        └────────┬─────────┘
                 ▼
          Denied | Canceled
```

## Status reference

| Status | Meaning | Surfaced by |
| --- | --- | --- |
| `Pending` | Application submitted, processing. | `application.created` webhook; `unitApplicationFormCompleted` event |
| `AwaitingDocuments` | More documents required from the applicant. | `application.awaitingDocuments` webhook; browser event |
| `PendingReview` | Under manual/automated review. | `application.pendingReview` webhook; browser event |
| `Approved` | Approved. A `customer` and `account` are created. | `application.created`→ then `customer.created`, `account.created` webhooks; browser event |
| `Denied` | Rejected. | `application.denied` webhook; browser event |
| `Canceled` | Canceled before completion. | `application.canceled` webhook |

For the **unified** (Banking + Stripe) flow, statuses differ — see [Unified onboarding](/build/unified-onboarding/#status-lifecycle) (`Pending → AwaitingDocuments → AwaitingIdentityVerification → Submitted → InReview → Approved | PartiallyApproved | Rejected | Cancelled | Error`).

## How to observe onboarding, in order of reliability

1. **Webhooks** (server, durable) — your source of truth for state changes. [Subscribe](/operate/webhooks/) to all `application.*` events plus `customer.created` and `account.created`.
2. **Browser event** (`unitApplicationFormCompleted`) — drives the *user's* next screen in the moment. Don't rely on it for backend state.
3. **Dashboard** — humans can view customers and accounts (transaction visibility may require advanced due diligence). See [The Unit Dashboard](/operate/dashboard/).

## Track the full onboarding journey

Webhooks and the dashboard cover applications once they exist. To get end-to-end visibility — including users who start onboarding but don't finish — pair Unit's signals with a little logging of your own. This is a good practice for any embedded flow and makes support fast:

1. **Log your onboarding funnel.** Record on your side every time a user starts onboarding (the moment you mint a JWT), with a timestamp and your user id. Now you have a trail for the whole journey, not just the parts that reach a resource.
2. **Use the JWT `sub` as your correlation key.** It exists from the very first moment, before any Unit resource does. Stamp it on every log line so you can line up your funnel with Unit's webhooks.
3. **Reconcile webhooks against your funnel.** A user who started onboarding but hasn't produced `application.created` / `customer.created` within your expected window is a clear signal to follow up.
4. **Capture browser events too.** `unitApplicationFormCompleted` (and the [unified events](/build/end-user-events/#unified-onboarding-events)) give you an in-session signal to drive the user's next screen.

:::tip
The combination — webhooks for durable state, the [`webhook-events`](/operate/webhooks/#replaying-missed-events) endpoint for backfill, your own `sub`-keyed funnel log for everything in between — gives you a complete, reconcilable picture of onboarding.
:::

## Next step

Turn issues into something actionable → [Error handling & troubleshooting](/operate/error-handling/).
