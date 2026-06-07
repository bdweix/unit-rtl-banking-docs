---
title: Glossary
description: Key terms used across Ready-to-Launch Banking — defined once, in plain language.
sidebar:
  order: 2
---

Definitions for the terms used throughout these docs. When a term has a dedicated page, it's linked.

### Application
A customer's onboarding submission (KYC for individuals/sole props, KYB for businesses). Moves through statuses like `Pending`, `AwaitingDocuments`, `PendingReview`, `Approved`, `Denied`, `Canceled`. See [Application & onboarding states](/operate/application-states/).

### Book payment
A free, instant, 24/7 transfer between two accounts on Unit. The only money-movement primitive available to your backend. See [Operational accounts](/operate/operational-accounts/).

### Bearer token (API token)
A server-side secret used to authenticate RtL **API** calls. Scoped per resource. Distinct from the end-user JWT. See [API overview](/api/overview/#authentication).

### Cardholder
A [multi-user role](/build/multi-user-access/) limited to a single debit card: view its details/transactions and freeze/unfreeze it.

### Customer
The underlying Unit record for an approved applicant — an `individual` or a `business`. Owns accounts.

### Custom
Unit's full, build-it-yourself platform — a different product and API surface from Ready-to-Launch. See [Custom vs. Ready-to-Launch](/start-here/custom-vs-ready-to-launch/).

### Embed / web component
The Unit-hosted custom element (`unit-elements-white-label-app`, or onboarding-only `unit-elements-application-form`) that renders the banking experience inside your page. See [Embed the app](/build/embed-the-app/).

### JSON:API
The response format the RtL API uses: documents with `data`, `attributes`, `relationships`, and `meta`.

### JWT
A JSON Web Token *you* mint (RS256) to identify an end-user to Unit. The `sub` claim is the user's stable id. See [Authentication & JWT](/build/authentication/).

### Operational account
Your own treasury deposit account within RtL, used to fund and disburse to end-user accounts via book payments. Shown under **Org Accounts**. See [Operational accounts](/operate/operational-accounts/).

### OTP
One-time passcode used in the embed's onboarding/auth flow. In sandbox it's always `000001`.

### Pre-fill
A callback where Unit fetches known customer data from *your* backend to pre-populate onboarding. See [Pre-fill user information](/build/prefilling/).

### Ready-to-Launch (RtL)
Unit's hosted, white-labeled banking app you embed — a deliberate subset of Custom.

### Scope
A permission on an API token (e.g. `accounts`, `payments-write`). See [Scopes](/api/overview/#scopes).

### Unified onboarding
A single application that onboards into both Unit Banking and a payment processor (Stripe). See [Unified onboarding](/build/unified-onboarding/).

### Webhook
A server-to-server `POST` Unit sends your backend on state changes. See [Webhooks](/operate/webhooks/).

### whiteLabelAppUser
The RtL resource representing an end-user of the banking app, with a role (`Owner`, `Admin`, `ReadOnly`, `Cardholder`) and a `userId` matching the JWT `sub`.
