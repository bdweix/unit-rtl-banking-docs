---
title: Environment model
description: How sandbox and production differ in Ready-to-Launch — base URLs, what carries over and what doesn't, and how to structure local, staging, and production cleanly.
sidebar:
  order: 1
---

Ready-to-Launch has two Unit-hosted environments: **sandbox** and **production (live)**. Getting the mental model right early prevents the most common late-stage surprises — mismatched URLs, config that didn't carry over, and "it worked in sandbox."

## The two environments

| | Sandbox | Production (Live) |
| --- | --- | --- |
| **Component script** | `https://ui.s.unit.sh/release/latest/components-extended.es.js` | `https://ui.unit.co/release/latest/components-extended.es.js` |
| **API base URL** | `https://api.s.unit.sh/` | `https://api.unit.co/` |
| **Dashboard** | `https://app.s.unit.sh` | `https://app.unit.co` |
| **Branding editor** | `https://app.s.unit.sh/ready-to-launch/branding` | `https://app.unit.co/ready-to-launch/branding` |
| **Webhook source IPs** | `54.81.62.38`, `35.169.213.205`, `3.234.105.75` | `3.209.193.26`, `54.156.65.95`, `54.165.224.37` |
| **OTP** | Always `000001` | Real OTP delivery |
| **Webhook idle → `Unavailable`** | 2 days | 7 days |

Everything is environment-specific: keys, tokens, webhook secrets, and the data itself.

## Map environments to one config object

Don't scatter URLs through your codebase. Select an environment from a single config keyed off your own environment variable:

```ts title="unit-env.ts"
type UnitEnv = 'sandbox' | 'production';

const CONFIG = {
  sandbox: {
    componentScript: 'https://ui.s.unit.sh/release/latest/components-extended.es.js',
    apiBaseUrl: 'https://api.s.unit.sh',
    dashboard: 'https://app.s.unit.sh',
  },
  production: {
    componentScript: 'https://ui.unit.co/release/latest/components-extended.es.js',
    apiBaseUrl: 'https://api.unit.co',
    dashboard: 'https://app.unit.co',
  },
} as const;

export const unit = CONFIG[(process.env.UNIT_ENV ?? 'sandbox') as UnitEnv];
```

This guarantees the **script URL, API base, JWT keys, and webhook secret always match** — the single most common source of "works in sandbox, fails in prod."

## What carries over between environments — and what doesn't

| Carries over? | Item |
| --- | --- |
| ❌ **No** | Customers, accounts, transactions, applications (data is isolated per environment — by design). |
| ⚠️ **Re-create manually** | JWKS / public keys, branding/theme, prefill & user-list callback URLs (+ allowlisting), webhook subscriptions, API tokens, Stripe config, multi-user enablement, banking page URL. |

:::note[Set production configuration up deliberately]
Configuration doesn't automatically copy from sandbox to production — you recreate it in the live environment (JWKS/public keys, branding, callbacks, webhooks, API tokens, Stripe config, multi-user enablement). Some of those steps are done with your solution engineer, so plan production setup as its own step with a little lead time. The [Launch checklist](/launch/production-checklist/) walks through every item.
:::

## Structuring local / staging / production

Unit provides two hosted environments — map your deploy targets onto them deliberately:

- **Local & staging → sandbox.** Point both at Unit sandbox, and isolate *your* state (separate JWT `sub` namespaces, separate webhook endpoints per deploy) so local testing doesn't collide with staging.
- **Production → live.**
- **Avoid shared browser state.** Because the web embed keeps its session in `localStorage`, switching between local and a deployed environment in the same browser can surface [stale state](/operate/error-handling/#stale-browser-session). Use separate browser profiles or clear storage between environments.

If you'd like stronger isolation between local and staging, ask your solution engineer about a separate sandbox org.

## Next step

→ [Security model](/launch/security/)
