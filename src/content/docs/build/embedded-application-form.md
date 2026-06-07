---
title: Embedded application form
description: Embed just the onboarding flow with unit-elements-application-form, then run your own banking UI afterward.
sidebar:
  order: 6
---

Sometimes you don't want the full hosted banking app — you only want to drop the **onboarding flow** into your existing signup, then take the user back into your own product afterward. That's what `unit-elements-application-form` is for.

**Effort:** ~30 minutes to embed.

## When to use it

| Use the full app (`unit-elements-white-label-app`) when… | Use the form (`unit-elements-application-form`) when… |
| --- | --- |
| You want Unit to host accounts, cards, and payments UI too. | You only want the application/KYC step embedded. |
| You're fine handing users the hosted banking dashboard. | You'll build (or already have) your own post-onboarding UI, or use the [API](/api/overview/) + your own screens. |
| Fastest path to a complete product. | You want onboarding inside an existing registration funnel. |

The two share the same auth, theming, pre-fill, and events — the form is simply scoped to onboarding and does **not** transition the user into the banking dashboard when finished. What happens next is up to you.

## Embed it

```html
<unit-elements-application-form
  jwt-token="{{JwtToken}}"
></unit-elements-application-form>
```

Its only required attribute is `jwt-token` (see [Authentication](/build/authentication/)). It honors the same [theme](/build/theming/) and [pre-fill](/build/prefilling/) configuration as the full app.

## Knowing when onboarding finishes

The form dispatches a browser event when the user completes the flow, carrying the resulting application status. Listen for it to drive your own next screen:

```js
document
  .querySelector('unit-elements-application-form')
  .addEventListener('unitApplicationFormCompleted', async (e) => {
    const applicationForm = await e.detail;
    const status = applicationForm.data.attributes.applicationStatus;

    switch (status) {
      case 'Approved':       /* send them into your banking UI */ break;
      case 'PendingReview':  /* show a "we're reviewing" screen */ break;
      case 'AwaitingDocuments': /* prompt for documents */ break;
      case 'Denied':         /* show a denial / next-steps screen */ break;
      default:               /* Pending, etc. */ break;
    }
  });
```

The event fires for statuses `Pending`, `AwaitingDocuments`, `PendingReview`, `Approved`, and `Denied`. See [Handling end-user events](/build/end-user-events/) for the full event catalog and [Application & onboarding states](/operate/application-states/) for what each status means.

## After onboarding

Once a user is approved, build your post-onboarding experience by:

- Reading their accounts, customers, and transactions via the [RtL API](/api/overview/).
- Reacting to [webhooks](/operate/webhooks/) (`customer.created`, `account.created`, `card.created`, `transaction.created`).
- Initiating internal transfers with [book payments](/api/overview/).

:::note
The form embeds onboarding, but **money movement and card management UI are not part of it**. If you don't want to build those screens, use the full `unit-elements-white-label-app` instead.
:::

## Next step

Combine banking + payments onboarding → [Unified onboarding](/build/unified-onboarding/).
