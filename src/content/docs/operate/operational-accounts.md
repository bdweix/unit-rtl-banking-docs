---
title: Operational accounts
description: What an operational account is, what it's for, and how to move money between it and your end-users' accounts with book payments.
sidebar:
  order: 5
---

An **operational account** is a deposit account that belongs to **you** (the client), under your own customer record. It's your treasury account within Ready-to-Launch — the source and sink for money you move on behalf of the platform.

You can see it in the dashboard under **Org Accounts**.

## What it's for

- **Funding new accounts** with an initial balance.
- **Disbursing funds** to end-user accounts (payouts, rewards, refunds).
- **Receiving and distributing** incoming funds.

Movement to and from end-user accounts happens via **book payments** — free, instant, 24/7 internal transfers between accounts on Unit.

## Moving money: book payments

`POST /ready-to-launch/book-payments` transfers funds between two accounts on Unit. This is the **only** money-movement primitive exposed to your backend in Ready-to-Launch — ACH, wires, and card spend happen inside the embedded app, not through your server.

```bash
curl -X POST 'https://api.s.unit.sh/ready-to-launch/book-payments' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer ${TOKEN}' \
  --data-raw '{
    "data": {
      "type": "bookPayment",
      "attributes": {
        "amount": 1000,
        "description": "Payout for June",
        "tags": { "payoutId": "po_123" },
        "idempotencyKey": "po_123-attempt-1"
      },
      "relationships": {
        "account":            { "data": { "type": "account", "id": "10013" } },
        "operationalAccount": { "data": { "type": "account", "id": "10020" } }
      }
    }
  }'
```

| Attribute | Required | Notes |
| --- | --- | --- |
| `amount` | Yes | **Cents**. |
| `description` | Yes | Max 80 chars; appears on the counterparty statement. |
| `tags` | No | Copied onto the generated transaction — use them to reconcile. |
| `idempotencyKey` | No (use it) | Makes retries safe. Always send one for writes. |

| Relationship | Required | Notes |
| --- | --- | --- |
| `account` | Yes | The source deposit account. |
| `operationalAccount` | Yes | Your operational account (the destination). |

See [`POST /ready-to-launch/book-payments`](/api/overview/) for the full request/response, including the returned `status` and generated `transaction`.

:::tip[Reconcile with tags + idempotency keys]
Put your own identifiers in `tags` and a deterministic `idempotencyKey` on every book payment. You'll be able to match Unit transactions back to your records, and a retried request won't double-move money.
:::

## Direction and statements

- The generated transaction's `direction` is relative to the account it appears on.
- `description` (≤ 80 chars) is what the counterparty sees — keep it human-readable and free of secrets.

## Next step

Understand the bigger picture before launch → [Environment model](/launch/environments/).
