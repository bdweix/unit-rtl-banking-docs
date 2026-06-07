---
title: Handling end-user events
description: The browser events the embedded components dispatch so your app can react to onboarding completion, modal close, and partial-approval flows.
sidebar:
  order: 8
---

The embedded components dispatch **browser (DOM) events** so your page can react to what the user does inside them — onboarding completing, a modal closing, or a partially-approved user wanting to continue. These are *client-side* events; for *server-side* notifications, use [webhooks](/operate/webhooks/).

## `unitApplicationFormCompleted`

Fires when the application form completes, carrying the resulting application.

- **Dispatched by:** `unit-elements-application-form`
- **Fires for statuses:** `Pending`, `AwaitingDocuments`, `PendingReview`, `Approved`, `Denied`
- **Payload:** `e.detail` resolves to an `ApplicationForm` object; the status is at `data.attributes.applicationStatus`.

```js
document
  .querySelector('unit-elements-application-form')
  .addEventListener('unitApplicationFormCompleted', async (e) => {
    const applicationForm = await e.detail;
    const status = applicationForm.data.attributes.applicationStatus;
    // route the user based on status
  });
```

## Unified onboarding events

These power the [unified onboarding](/build/unified-onboarding/) status screen. Note they're dispatched by the inner `unit-elements-application-form`, which lives **inside the shadow root** of the full app — so you reach it through `shadowRoot`:

```js
const form = document
  .querySelector('unit-elements-white-label-app')
  .shadowRoot
  .querySelector('unit-elements-application-form');

form.addEventListener('unitUnifiedClose', () => {
  // close/unmount the modal hosting the unified onboarding form
});

form.addEventListener('unitUnifiedExploreAccount', () => {
  // navigate the user to your "link external account" (or next-step) flow
});
```

### `unitUnifiedClose`

- **Trigger:** the user dismisses the unified status screen (close icon or Close button).
- **Payload:** `{}` (empty).
- **Do:** close or unmount the modal that hosts the onboarding form.

### `unitUnifiedExploreAccount`

- **Trigger:** from the unified summary screen when onboarding was **partially approved** (e.g. payment processing approved but banking denied).
- **Payload:** `{}` (empty).
- **Do:** route the user to their next step — for example, a "link an external bank account" experience.

:::tip[Reaching events inside the shadow DOM]
If `querySelector('unit-elements-application-form')` returns `null`, the form is likely nested inside another component's shadow root (as with the full white-label app). Traverse `.shadowRoot` as shown above, and attach the listener *after* the component has mounted.
:::

## Client events vs. webhooks — when to use which

| Use **browser events** for… | Use **webhooks** for… |
| --- | --- |
| Driving your **UI** in real time (close a modal, navigate). | Updating your **backend/database** (provisioning, emails, ledgers). |
| Reacting to what the user did in the embed *right now*. | Durable, retryable, server-verified state changes. |
| Things that don't need to survive a page reload. | Anything you must not miss. |

Don't rely on a browser event for anything critical — the user can close the tab. Treat events as UX glue and [webhooks](/operate/webhooks/) as the source of truth.

## Next step

Make state durable on your backend → [Webhooks](/operate/webhooks/).
