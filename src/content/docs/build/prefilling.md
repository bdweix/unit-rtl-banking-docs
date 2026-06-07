---
title: Pre-fill user information
description: Reduce onboarding friction by serving known customer data to Unit from a callback endpoint on your backend.
sidebar:
  order: 4
---

You already know a lot about your user — their name, email, maybe their business type. Pre-filling lets Unit pull that data from **your backend** to pre-populate the onboarding form, so the user types less and drops off less.

**Effort:** ~1–2 days. **Optional** — onboarding works without it.

## How it works

Pre-fill is a **callback**: Unit calls *you*. You expose one HTTPS `GET` endpoint; when a user starts onboarding, Unit calls it (once per user per session), authenticates as that user via the JWT, and uses your response to seed the form.

```
 user starts onboarding
        │
        ▼
   Unit embed ──► GET https://yourdomain.com/unit/prefill
                  Authorization: Bearer <the user's JWT>
        ▲                          │
        │   prefilled form         │ your backend looks up the user
        └──────────────────────────┘ (sub claim) and returns their data
```

## Configure it

<ol>
<li>In the <strong>Unit Dashboard</strong>, go to <strong>Settings → Ready to Launch → Callbacks</strong>.</li>
<li>Enter your HTTPS URL in the <strong>Application Prefill Endpoint</strong> field and save.</li>
<li><strong>Contact Unit to allowlist your endpoint.</strong> It won't be called until they do.</li>
</ol>

:::note[Allowlisting]
After you save the URL, contact Unit to allowlist your endpoint — pre-fill begins working once it's allowlisted. Repeat the step for your production URL when you launch.
:::

## The request Unit sends you

```http
GET /unit/prefill HTTP/1.1
Host: yourdomain.com
Authorization: Bearer <JWT_TOKEN>
```

- Always `GET` over HTTPS.
- The JWT's `sub` claim identifies which user to return data for.
- Unit calls it **once per user per session**.
- **You must validate the JWT** on every request — issuer, audience, signature, and expiry — exactly as your own auth would. Don't trust the call blindly.

## The response Unit expects

Return `200 OK` with a JSON:API document of type `whiteLabelAppEndUserConfig`:

```json
{
  "data": {
    "type": "whiteLabelAppEndUserConfig",
    "attributes": {
      "allowedApplicationTypes": ["Individual", "SoleProprietorship"],
      "requestedProducts": ["Banking"],
      "applicantDetails": {
        "applicationType": "Individual",
        "email": "user@example.com"
      }
    }
  }
}
```

| Field | Required | Notes |
| --- | --- | --- |
| `type` | Yes | Must be `whiteLabelAppEndUserConfig`. |
| `allowedApplicationTypes` | Yes | Which entity types this user may apply as. Any of `Individual`, `SoleProprietorship`, `SingleMemberBusiness`, `MultipleMemberBusiness`. |
| `requestedProducts` | Yes | Array including `"Banking"`. |
| `applicantDetails` | Yes | The actual prefill values. Always includes `applicationType`; the remaining supported fields depend on the application type. |

:::note[Field coverage varies by application type]
`applicantDetails` accepts different fields for an individual vs. a business. The exact, exhaustive field map per type isn't fully enumerated in Unit's public docs — start with the common ones (`applicationType`, `email`, name fields) and confirm the complete set for your application types with your solution engineer. Returning an unknown field is generally ignored rather than fatal, but verify in sandbox.
:::

## Pre-filling payment-processor info (unified onboarding)

If you use [unified onboarding](/build/unified-onboarding/), `applicantDetails` also accepts:

- `hasPaymentProcessorAccount` (boolean) — the user already has a Stripe account.
- `paymentProcessorAccountId` (string) — that account's id, so Unit links instead of creating a duplicate.

## Security & privacy

- **Validate the JWT every time** — this endpoint returns PII to a caller, so treat the bearer token as the authorization, not a formality.
- **HTTPS only.**
- **Don't log PII.** Scrub names, emails, DOB, etc. from request/response logs.
- Handle the data per your own privacy policy and data-retention rules.

## Test it in sandbox

<ol>
<li>Deploy your endpoint and ask Unit to register/allowlist the <strong>sandbox</strong> URL.</li>
<li>Validate it yourself with curl and a sandbox JWT:
<pre><code>curl -H "Authorization: Bearer $SANDBOX_JWT" https://yourdomain.com/unit/prefill</code></pre>
</li>
<li>Start onboarding in the embed and confirm the fields are pre-populated.</li>
</ol>

## Next step

Support business teams → [Multi-user access & roles](/build/multi-user-access/).
