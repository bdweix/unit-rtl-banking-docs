---
title: Unified onboarding (Banking + Stripe)
description: One application that onboards a customer into both Unit Banking and a payment processor like Stripe, with synchronized status tracking.
sidebar:
  order: 7
---

Unified onboarding lets a single application flow onboard a customer into **both** Unit Banking **and** a configured payment processor (Stripe) at once — instead of making them fill out two separate applications. Unit tracks both child applications and keeps their statuses in sync via webhooks.

**Effort:** ~2–3 hours to configure.

## What it does

- One unified application kicks off onboarding in **Unit Banking** and **Stripe** simultaneously.
- Centralized status tracking across both systems.
- Automatic document management/sync and event-driven synchronization via webhooks.
- Supports business entities and sole proprietors.

## Application types

| Type | For |
| --- | --- |
| `businessUnifiedApplication` | LLCs, corporations, partnerships. |
| `solePropUnifiedApplication` | Individual business owners (sole props). |

## Status lifecycle

**Unified (parent) application statuses:**

```
Pending → AwaitingDocuments → AwaitingIdentityVerification → Submitted
        → InReview → Approved | PartiallyApproved | Rejected | Cancelled | Error
```

**Child application statuses** (tracked independently for Unit Banking and for the payment processor):

```
Pending → AwaitingDocuments → AwaitingIdentityVerification → InReview → Approved | Rejected
```

`PartiallyApproved` is the important one: it means the children diverged — e.g. **payment processing approved but banking denied**, or vice versa. Handle it explicitly (see [events](#browser-events)).

## Configure Stripe

In the **Unit Dashboard → Settings → Payment Processing**:

1. Select the vendor (**Stripe**).
2. Enter the **Secret/Restricted API key**.
3. Enter the **Publishable API key**.
4. Enter the **Webhook secret**.
5. Set the **Business profile MCC code**.
6. Optionally set a custom **Hostname / Files Hostname**.

### Required Stripe permissions (restricted key)

For a restricted key (recommended for production), enable **Write** on:

| Resource | Permission |
| --- | --- |
| Connect Accounts | Write |
| Connect Persons | Write |
| Core Files | Write |
| Identity Verification Sessions | Write |

:::caution[Missing Stripe permissions surface as opaque errors]
A restricted key missing one of these permissions is a known cause of generic failures during onboarding (e.g. a 500 or "contact support"). Grant all four before testing. See [Error handling](/operate/error-handling/#stripe-key-permissions).
:::

### Required Stripe webhook events

Configure Stripe to send these so Unit can keep child statuses in sync:

- `account.updated` — updates requirements/status.
- `account.application.authorized` — initializes the child application.
- `person.created`, `person.updated`, `person.deleted` — manages verification status.
- `identity.verification_session.*` — tracks the identity-verification flow.

## Stripe identity-verification flow

When Stripe needs extra identity verification, the embed handles it inline:

1. Stripe sets `additional_verifications.document.status` to `unverified`.
2. Unit detects it via webhook and moves the child app to `AwaitingIdentityVerification`.
3. Unit creates a Stripe Identity verification session for embedded verification.
4. The customer uploads ID and a selfie in the flow.
5. Stripe confirms completion via webhook.
6. If that was the final requirement, the child app moves to `Approved`.

## Pre-filling payment-processor info

In your [pre-fill](/build/prefilling/) `applicantDetails`, you can include:

- `hasPaymentProcessorAccount` (boolean) — the customer already has a Stripe account.
- `paymentProcessorAccountId` (string) — that account's id, so Unit links it instead of creating a duplicate.

## Webhook events

Server-side [webhook](/operate/webhooks/) events for the unified flow:

- `unifiedApplication.created`
- `unifiedApplication.approved` — all children approved.
- `unifiedApplication.partiallyApproved` — mixed approval.
- `unifiedApplication.rejected`

```json title="unifiedApplication.created"
{
  "data": [{
    "id": "12345678",
    "type": "unifiedApplication.created",
    "attributes": {
      "userIds": ["user-abc123"],
      "createdAt": "2026-01-15T10:30:00.000Z",
      "childApplications": [
        { "id": "1234567", "type": "Unit", "status": "Pending" },
        { "id": "acct_1ABCDefGHIJKLMNO", "type": "PaymentProcessor", "status": "Pending" }
      ]
    }
  }]
}
```

```json title="unifiedApplication.approved"
{
  "data": [{
    "id": "12345679",
    "type": "unifiedApplication.approved",
    "attributes": {
      "userIds": ["user-abc123"],
      "childApplications": [
        { "id": "acct_1ABCDefGHIJKLMNO", "type": "PaymentProcessor", "status": "Approved" },
        { "id": "1234567", "type": "Unit", "status": "Approved" }
      ]
    }
  }]
}
```

## Browser events

The `unit-elements-application-form` also dispatches client-side events for the unified status screen — most importantly for the **partial approval** case. See [Handling end-user events](/build/end-user-events/#unified-onboarding-events) for `unitUnifiedClose` and `unitUnifiedExploreAccount`.

## Next step

Wire up the UI events → [Handling end-user events](/build/end-user-events/).
