---
title: Custom vs. Ready-to-Launch
description: Unit ships two distinct products with two distinct API surfaces. Here's how to tell them apart and choose.
sidebar:
  order: 2
---

Unit offers **two different products**, with **two different documentation sets** and **two different API surfaces**. Confusing them is the single most common source of wasted time, because a snippet copied from the wrong doc set simply won't work.

## The two products

| | **Ready-to-Launch** | **Custom** |
| --- | --- | --- |
| **What it is** | A hosted, white-labeled banking *app* you embed. | A set of banking *APIs and UI components* you assemble yourself. |
| **You build** | A page that renders one web component. | The entire UX, onboarding flow, and money-movement logic. |
| **UI** | Unit-hosted, themed to your brand. | Yours, end to end (optionally using Unit white-label elements). |
| **Onboarding** | Managed application flow, run by Unit. | You orchestrate applications via the API. |
| **Time to launch** | ~2–4 weeks, ~1 engineer. | Months, a dedicated team. |
| **API surface** | Small, read-oriented: `/ready-to-launch/*`. | Full platform: accounts, cards, payments, statements, disputes, etc. |
| **Docs** | `unit.co/docs/ready-to-launch/` | `unit.co/docs/` (the "Custom Builds" / API docs) |
| **Control** | Theming + a handful of config options. | Full programmatic control. |

:::note[Ready-to-Launch is a focused subset]
Ready-to-Launch exposes a focused slice of Unit's platform. The RtL API can *read* accounts, customers, transactions, and check deposits, and can *create book payments* and *disable users*. Capabilities beyond the [RtL API reference](/api/overview/) live in the Custom API or happen inside the hosted UI — by design, so the embedded app stays simple to integrate.
:::

## How to tell which doc set you're reading

A few reliable tells:

- **URL.** Ready-to-Launch lives under `/docs/ready-to-launch/`. Everything else is Custom.
- **API base path.** RtL endpoints are prefixed `/ready-to-launch/` (e.g. `GET /ready-to-launch/accounts/:id`). Custom endpoints are not (e.g. `GET /accounts/:id`).
- **Component names.** RtL uses the bundled `unit-elements-white-label-app` and `unit-elements-application-form`. Custom uses granular elements like `unit-elements-account`, `unit-elements-card`, etc.
- **Auth.** RtL identifies end-users with a **JWT you mint**. Custom uses **customer bearer tokens / verified tokens** issued by Unit.

:::tip
If a tutorial tells you to call `POST /payments` to originate an ACH, or to create accounts and cards directly, you're reading **Custom** docs. Ready-to-Launch does money movement *inside the embedded app*; your server only initiates **book payments** (internal transfers) via `POST /ready-to-launch/book-payments`.
:::

## When to choose which

**Choose Ready-to-Launch if** you want banking as a feature, fast, with compliance handled and a small eng footprint — and Unit's hosted UI (themed) meets your needs.

**Choose Custom if** you need a bespoke UI, programmatic control over every primitive, advanced risk/fraud tooling, or banking *is* your core product.

## Graduating from RtL to Custom

Unit positions the two as a path, not a fork: you can start on Ready-to-Launch and migrate to Custom as you grow. Moving up unlocks deeper customization, advanced risk/fraud control, enhanced support tiers, and full programmatic data access.

If a future migration to Custom matters to your decision, talk it through with your Unit solution engineer so you can plan the transition with confidence.
