---
title: How it works
description: The architecture of a Ready-to-Launch integration — the embed, the JWT, the API, and webhooks — and how data flows between you and Unit.
sidebar:
  order: 3
---

A Ready-to-Launch integration has four moving parts. Understand how they fit together and the rest of these docs will read as variations on a theme.

## The four parts

1. **Your app** — authenticates the user, mints a JWT, and renders the embed.
2. **The embed** — a Unit-hosted web component (or native SDK) that renders the entire banking experience inside your page.
3. **The RtL API** — a small HTTPS API your *backend* calls to read banking data and initiate book payments.
4. **Webhooks** — server-to-server events Unit sends your backend when things happen (applications, accounts, cards, transactions).

## The request flow

```
                          ┌──────────────────────────────────────────┐
                          │                Your product               │
                          │                                           │
   1. user logs in  ───►  │  Your auth / IdP                          │
                          │      │                                    │
                          │      ▼  2. mint JWT (sub = your user id)   │
                          │  Your backend  ───────────────────┐       │
                          │      ▲                             │       │
                          │      │ 5. webhooks (POST)          │ 3. pass JWT
                          │      │ 6. REST reads / book pmts   │       │
                          │      │                             ▼       │
                          │      │              Your banking page      │
                          │      │              <unit-elements-        │
                          │      │               white-label-app       │
                          │      │               jwt-token="…">        │
                          └──────┼─────────────────────┬───────────────┘
                                 │                      │ 4. component talks
                                 │                      │    to Unit directly
                                 ▼                      ▼
                          ┌──────────────────────────────────────────┐
                          │                   Unit                    │
                          │   Hosted UI · Onboarding · Accounts ·     │
                          │   Cards · Payments · Compliance · Risk    │
                          └──────────────────────────────────────────┘
```

<div class="field-meta">

1. The user signs in to **your** product using **your** identity provider.
2. Your backend mints a short-lived **JWT** whose `sub` claim is your stable user identifier.
3. You pass that JWT to the embed as the `jwt-token` attribute.
4. The component authenticates to Unit and renders onboarding or the banking app. From here, most user actions (applying, moving money, managing cards) happen **inside the component**, talking to Unit directly — not through your servers.
5. Unit notifies **your backend** of state changes via **webhooks**.
6. Your backend reads banking data and initiates **book payments** through the **RtL API**.

</div>

## What runs where

| Concern | Runs in… | Notes |
| --- | --- | --- |
| User authentication | **Your app** | You own login; Unit trusts your JWT. |
| Onboarding (KYC/KYB) | **The embed** | Unit's hosted flow; you can pre-fill it. |
| Account / card / payment UI | **The embed** | Unit-hosted, themed to your brand. |
| Money movement by end-users | **The embed** | ACH, wire, cards, etc. happen in-app. |
| Reading banking data | **Your backend** → RtL API | Accounts, customers, transactions, check deposits. |
| Internal transfers (e.g. sweeps, payouts) | **Your backend** → RtL API | `POST /ready-to-launch/book-payments`. |
| State change notifications | **Unit** → your webhook endpoint | Applications, accounts, cards, transactions, users. |
| Compliance, risk, fraud, support | **Unit** | Managed for you. |

## Two ways the user authenticates *into* the embed

There are two distinct identities at play — don't conflate them:

- **Your JWT** identifies the user *to Unit* so the right banking data loads. You mint it. See [Authentication & JWT](/build/authentication/).
- **Unit's own OTP / customer token** is what the *embedded app* uses internally for the end-user's banking session. Unit manages this; in sandbox the OTP is always `000001`.

:::note[Where state lives in the browser]
On web, the embed keeps the end-user's banking session in browser `localStorage` (`unitCustomerToken`, `unitVerifiedCustomerToken`), and your app clears those keys on logout. See the [Security model](/launch/security/) for the full handling guidance.
:::

## What Unit manages for you

Compliance, risk, fraud, the hosted UI, and end-user banking support are all managed by Unit — that's the core value of Ready-to-Launch. A few operations are handled with Unit rather than self-serve (for example enabling multi-user access, configuring production webhooks, or closing an account); these are noted on the relevant pages, and your solution engineer is your path for them.

## Next step

Now build it — start by rendering the component.

→ [Quickstart (5 minutes)](/start-here/quickstart/)
