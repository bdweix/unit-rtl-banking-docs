---
title: Multi-user access & roles
description: Give business customers a team — Owner, Admin, ReadOnly, and Cardholder roles — by assigning roles in the JWT and serving a user list to Unit.
sidebar:
  order: 5
---

Business customers rarely have a single user touching the bank account. Multi-user access lets a business invite teammates with scoped roles. You assign roles through the JWT and expose a **user-list callback** so Unit knows who belongs to the account.

**Effort:** ~1–2 days.

:::note[Enabling multi-user access]
Multi-user/team functionality is turned on by Unit once your user-list endpoint is ready. Implement and test the endpoint in sandbox, then contact your solution engineer to enable it.
:::

## Roles

| Role | How it's assigned | Capabilities |
| --- | --- | --- |
| **Owner** | Automatically — the user who submits the application form. | Full, unrestricted access to accounts, payments, cards, and team management. **One Owner per account; cannot be changed.** |
| **Admin** | Invited; up to **5 per account**. | Near-Owner. Can invite ReadOnly and Cardholder users. |
| **ReadOnly** | Invited / via JWT. | View-only across the full app (accounts, balances, transactions, cards). Cannot send payments, manage cards, or invite. |
| **Cardholder** | Invited / via JWT. | Access limited to a **single debit card** created for them: view its details and transactions, and freeze/unfreeze it. |

## Assigning a role

Roles are set two ways:

1. **Application form** — produces the **Owner** (the submitter).
2. **JWT** — include a `unitRole` claim of `Admin`, `ReadOnly`, or `Cardholder` for invited users.

```jsonc
// JWT payload for an invited admin
{
  "sub": "user_67890",
  "iss": "https://your-app.example.com",
  "exp": 1735689600,
  "unitRole": "Admin"
}
```

See [Authentication & JWT](/build/authentication/) for how to mint and sign the token.

## The user-list callback

So Unit can present the right team for an account, you expose an endpoint it calls to fetch your users.

**Request from Unit:**

```http
GET /unit/users HTTP/1.1
Host: yourdomain.com
Authorization: Bearer <JWT_TOKEN>
```

**Your response** — a JSON array, each entry typed `whiteLabelAppEndUser`:

```json
[
  {
    "data": {
      "type": "whiteLabelAppEndUser",
      "attributes": {
        "fullName": { "first": "Peter", "last": "Parker" },
        "email": "peter.parker@example.com",
        "phone": { "countryCode": "1", "number": "2345678888" },
        "jwtSubject": "user_identifier",
        "unitRole": "Admin",
        "bankingPageURL": "https://yourdomain.com/banking",
        "dateOfBirth": "1990-01-15"
      }
    }
  }
]
```

| Field | Required | Notes |
| --- | --- | --- |
| `fullName` | **Yes** | `{ first, last }`. |
| `email` | **Yes** | |
| `jwtSubject` | **Yes** | The user's `sub` — links this entry to the JWT identity. |
| `phone` | No | `{ countryCode, number }`. |
| `unitRole` | No | `Admin`, `ReadOnly`, or `Cardholder`. |
| `bankingPageURL` | No | Where this user accesses banking in your app (used in invite emails). |
| `dateOfBirth` | No | `YYYY-MM-DD`. |

As with [pre-fill](/build/prefilling/), **validate the JWT on every call** and serve over HTTPS only.

## Webhook events

You'll receive [webhooks](/operate/webhooks/) as team membership changes:

- `whiteLabelAppUser.created` — a new app user was added.
- `whiteLabelAppUser.disabled` — a user was disabled.

## Disabling a user

To revoke a user's access to the banking app, call:

```bash
curl -X POST 'https://api.s.unit.sh/ready-to-launch/users/user_67890/disable' \
  -H 'Content-Type: application/vnd.api+json' \
  -H 'Authorization: Bearer ${TOKEN}'
```

This disables **app access only**. It does **not** disable the underlying customer or freeze/archive their accounts, and it fires the `whiteLabelAppUser.disabled` webhook. See the [API reference](/api/overview/) for the full response.

## Next step

Embed only onboarding → [Embedded application form](/build/embedded-application-form/).
