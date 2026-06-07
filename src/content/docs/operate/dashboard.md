---
title: The Unit Dashboard
description: What you can see and do in the Ready-to-Launch dashboard — branding, JWT and webhook config, customers and accounts, transaction export, SSO, and dashboard roles.
sidebar:
  order: 4
---

The Ready-to-Launch Dashboard is your console for configuration and human-in-the-loop visibility. Some setup that isn't yet exposed via API lives here.

| Environment | Dashboard |
| --- | --- |
| Sandbox | [`app.s.unit.sh`](https://app.s.unit.sh) |
| Production | [`app.unit.co`](https://app.unit.co) |

## What you can do here

- **Authentication** — configure your identity provider's JWKS / register custom public keys (**Developer → Settings → Authentication**). See [Authentication](/build/authentication/).
- **Branding** — customize the look and feel of the white-label experience. See [Theming](/build/theming/).
- **Webhooks & API tokens** — manage subscriptions (sandbox) and create API tokens.
- **Callbacks** — set your [prefill](/build/prefilling/) endpoint and banking page URL (**Settings → Ready to Launch → Callbacks**).
- **Customers & accounts** — view customers and their accounts.
- **Transactions** — view transaction history and **export to CSV** *(requires advanced due diligence — see below)*.
- **Org Accounts** — view your [operational account(s)](/operate/operational-accounts/).
- **Payment processing** — configure Stripe for [unified onboarding](/build/unified-onboarding/).

## Dashboard roles

Access is governed by three role tiers:

| Role | Transaction access | Due diligence |
| --- | --- | --- |
| **Ready to Launch Banking Admin** | All customer transactions | Requires advanced due diligence |
| **Ready to Launch Operational Account Admin** | Operational account transactions only | Requires advanced due diligence |
| **Ready to Launch Basic** | None | Not required |

:::note[Transaction visibility is gated]
Viewing customer transactions (in the dashboard *and* via the API) requires completing **advanced due diligence** with Unit. If transactions aren't visible, this is the most likely reason. Plan for it early — it's a prerequisite, not a toggle.
:::

## SSO / SAML

Sign in with your organization's identity provider via **SAML 2.0**. Configure under **Settings → Developer → SAML**. Supported providers include Okta, Azure Active Directory, and Google Workspace.

## Actions handled with your solution engineer

The dashboard covers configuration and review. A few operations are handled together with your Unit solution engineer rather than from the dashboard:

- **Closing an account.**
- **Enabling multi-user access** (after you implement the [user-list endpoint](/build/multi-user-access/)).
- Some **production branding** changes.
- **Production webhook** subscription setup.

Each is noted on its relevant page; reach out to your solution engineer when you need one.

## Next step

→ [Operational accounts](/operate/operational-accounts/)
