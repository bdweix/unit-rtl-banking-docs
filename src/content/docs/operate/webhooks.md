---
title: Webhooks
description: Subscribe to real-time, server-to-server events for applications, accounts, cards, transactions, and users — with the full event catalog, delivery behavior, and idempotency guidance.
sidebar:
  order: 1
---

Webhooks are how Unit tells your **backend** that something happened — an application was submitted, an account was created, a transaction posted. They are the durable, server-verified backbone of your integration. Browser [events](/build/end-user-events/) drive UI; webhooks drive everything you must not miss.

**Effort:** ~2–3 hours.

## Set up

<ol>
<li><strong>Create an endpoint</strong> on your server that accepts <code>POST</code> requests with a JSON body.</li>
<li><strong>Subscribe</strong> to events: in <strong>sandbox</strong> via the Unit Dashboard; in <strong>production</strong> by contacting your solution engineer.</li>
<li><strong>Verify</strong> each delivery (signature and/or source IP) before trusting it.</li>
<li><strong>Return 2xx quickly.</strong> Acknowledge fast, then process asynchronously.</li>
</ol>

:::note[Sandbox vs. production setup]
You manage webhook subscriptions yourself in the dashboard in sandbox. For production, your Unit solution engineer sets up the subscription and signing secret — include that step in your launch plan.
:::

## Verifying deliveries

**Source IP allowlist.** Unit sends from a fixed set of IPs — allowlist them and reject anything else:

| Environment | Source IPs |
| --- | --- |
| Sandbox | `54.81.62.38`, `35.169.213.205`, `3.234.105.75` |
| Live | `3.209.193.26`, `54.156.65.95`, `54.165.224.37` |

**Signature.** Verify the delivery signature in addition to the IP check, so a spoofed source can't inject events. Confirm the current signing scheme/secret for your account with Unit, and store the secret per environment.

## Make handlers idempotent

> Unit highly recommends that you make your webhook handlers idempotent, to ensure events are only handled once.

Deliveries can repeat (retries, at-least-once delivery). De-duplicate on the event `id` and make processing safe to run twice — e.g. upsert by event id, and guard side effects (don't double-send an email or double-credit a ledger).

## Event catalog

### Application events

| Event | Meaning |
| --- | --- |
| `application.created` | A new application was submitted. |
| `application.awaitingDocuments` | Additional documents are required. |
| `application.pendingReview` | The application is under review. |
| `application.denied` | The application was rejected. |
| `application.canceled` | The application was canceled. |

### Customer & account events

| Event | Meaning |
| --- | --- |
| `customer.created` | A customer was created after approval. |
| `account.created` | A new deposit account was created. |
| `account.frozen` | Account access was restricted. |
| `account.unfrozen` | Account access was restored. |
| `account.closed` | An account was closed. |
| `account.reopened` | A closed account was reopened. |

### Card events

| Event | Meaning |
| --- | --- |
| `card.created` | A new card was created. |
| `card.activated` | A card was activated for first use. |

### Transaction events

| Event | Meaning |
| --- | --- |
| `transaction.created` | A transaction posted (deposit, withdrawal, transfer). Amounts are in **cents**. |

### Multi-user events

| Event | Meaning |
| --- | --- |
| `whiteLabelAppUser.created` | A new white-label app user was added. |
| `whiteLabelAppUser.disabled` | An app user was disabled. |

### Unified onboarding events

If you use [unified onboarding](/build/unified-onboarding/): `unifiedApplication.created`, `unifiedApplication.approved`, `unifiedApplication.partiallyApproved`, `unifiedApplication.rejected`.

:::note[Transaction webhooks may require extra due diligence]
Access to `transaction.created` (and to transaction data generally) can require completing **Enhanced Information Security** / advanced due diligence with Unit. If you don't see transaction events, this is the likely reason — raise it with your solution engineer.
:::

## Delivery, retries, and "Unavailable"

- Delivery is **at-least-once** with retries — hence the idempotency requirement.
- If your endpoint goes quiet, Unit marks the subscription **`Unavailable`** and stops sending:
  - **Sandbox:** after **2 days** of inactivity.
  - **Live:** after **7 days** of inactivity.
- Re-enable it from the dashboard (sandbox) or via Unit (production). Monitor your subscription status so a silent outage doesn't become days of lost events.

## Replaying missed events

You can pull events you may have missed via the API:

```bash
curl -X GET 'https://api.s.unit.sh/ready-to-launch/webhook-events?filter[since]=2026-01-13T16:01:19.346Z&filter[until]=2026-01-15T20:06:23.486Z&page[limit]=100' \
  -H "Authorization: Bearer ${TOKEN}"
```

Filter by `type[]`, `since`/`until` (RFC3339), and paginate with `page[limit]` (max 1000) / `page[offset]`. See [`GET /ready-to-launch/webhook-events`](/api/overview/) in the API reference.

## A minimal handler

```js title="Express"
import express from 'express';
const app = express();

app.post('/unit/webhooks', express.json({ type: '*/*' }), async (req, res) => {
  // 1. verify source IP + signature here; 401 if invalid
  // 2. ack immediately
  res.sendStatus(200);

  // 3. process out of band, idempotently
  for (const event of req.body.data ?? []) {
    if (await alreadyHandled(event.id)) continue;
    await handle(event);                 // upsert/guard side effects
    await markHandled(event.id);
  }
});
```

## Pair webhooks with your own funnel logging

Webhooks are your source of truth for state changes, and the [`webhook-events`](#replaying-missed-events) endpoint lets you backfill anything you missed. For full coverage of the onboarding journey — including attempts that don't complete — pair webhooks with your own logging keyed by the JWT `sub`. See [Application & onboarding states](/operate/application-states/) for the recommended pattern.

## Next step

→ [Application & onboarding states](/operate/application-states/)
