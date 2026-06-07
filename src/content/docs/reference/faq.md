---
title: FAQ
description: Frequently asked questions about Unit Ready-to-Launch Banking — what it is, timelines, features, compliance, and the path to Custom.
sidebar:
  order: 1
---

## What is Ready-to-Launch Banking?

A pre-configured embedded banking solution that lets you deploy banking products quickly without building banking expertise in-house. You get a pre-built, customizable UI; rapid deployment; Unit-managed compliance and support; and a seamless embed. It's ideal when you prioritize speed and cohesive branding.

## How quickly can I launch?

Teams typically launch within **2 to 4 weeks**.

## What features are included?

Interest-bearing deposit accounts, instant payouts, physical and virtual debit cards with programmatic controls, mobile check deposits, ACH / same-day ACH / check / wire, free instant 24/7 book transfers, role-based multi-user access, fee-free nationwide ATM access, and integrations with Plaid and Intuit QuickBooks. See [Introduction](/start-here/introduction/).

## What technical resources do I need?

Typically **one engineer for up to two weeks**, which significantly reduces time and cost to launch.

## Can I customize the app to match my brand?

Yes. Customize colors, logo, typography, and card art via the dashboard branding editor or a `settings-json` attribute. See [Theming & branding](/build/theming/).

## Who handles compliance and risk management?

Unit fully manages compliance, risk, and customer support, which significantly reduces your operational burden.

## Am I responsible for fraud risk?

No — Unit fully owns fraud risk management.

## Does Unit provide marketing support?

Yes. Unit provides ready-to-use digital marketing assets, including branded emails, SMS messages, branded FAQ pages, and landing pages. See [Customer outreach](/outreach/overview/).

## What customer support is provided?

Unit's support agents manage all banking-related inquiries in-app and via dedicated email, so the volume doesn't land on your support team.

## Can I start with Ready-to-Launch and later move to Custom?

Yes. Unit's platform is designed to let you scale from Ready-to-Launch to a more customized, deeply integrated solution as you grow. See [Custom vs. Ready-to-Launch](/start-here/custom-vs-ready-to-launch/).

## How does Ready-to-Launch compare to Custom on customization?

Ready-to-Launch offers pre-built, configurable UIs. Custom provides fully customizable interfaces and deeper integration.

## What do I unlock by moving to Custom?

Deeper customization, advanced risk/fraud control, enhanced customer support, programmatic data access, and expansion into additional services.

## How do my users log in?

There's no separate Unit login. You authenticate users in your own app and mint a [JWT](/build/authentication/) that identifies each user to Unit.

## What's the sandbox OTP?

`000001`. Each application also needs a **unique phone number**. See [Error handling](/operate/error-handling/).

## How do I keep visibility into onboarding?

Onboarding state is delivered through [webhooks](/operate/webhooks/) (`application.*`, `customer.created`, `account.created`) and is viewable in the dashboard. For end-to-end visibility across the whole journey, pair those with your own funnel logging keyed by the JWT `sub`. See [Application & onboarding states](/operate/application-states/) for the recommended pattern.

## How do I move money from my backend?

With [book payments](/operate/operational-accounts/) (`POST /ready-to-launch/book-payments`) between accounts on Unit. ACH, wire, and card spend happen inside the embedded app, not via your server.
