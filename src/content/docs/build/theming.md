---
title: Theming & branding
description: Make the embedded banking app look like your product — via the dashboard branding editor or a settings-json attribute, with the full theme object reference.
sidebar:
  order: 3
---

The embed renders in a shadow DOM, so you can't style it with your page's CSS. Instead you brand it through a **theme**: colors, typography, logo, card art, and per-component overrides. There are two ways to apply one.

## Two ways to theme

### 1. Dashboard branding editor (no code)

Use the visual editor to change colors (including semantic colors), upload a logo, and adjust container styles. Changes apply to your embed automatically.

| Environment | Branding editor |
| --- | --- |
| Sandbox | `https://app.s.unit.sh/ready-to-launch/branding` |
| Live | `https://app.unit.co/ready-to-launch/branding` |

This is the fastest path and is enough for most teams.

### 2. `settings-json` attribute (in code)

Pass a theme as a JSON string on the component. Useful when you want theming to live in your codebase or vary per context.

```html
<unit-elements-white-label-app
  jwt-token="{{JwtToken}}"
  settings-json='{"theme": { /* ...theme object... */ }}'
></unit-elements-white-label-app>
```

:::note[Branding in production]
Do your branding work in sandbox first. Some production branding changes are applied with help from your Unit solution engineer — confirm the production path with them before launch.
:::

## The theme object

The theme is structured into a `global` section (your brand-wide design system) plus per-element overrides.

```jsonc
{
  "name": "Acme Theme",
  "global": {
    "logoUrl": "https://acme.example.com/logo.png",
    "faviconUrl": "https://acme.example.com/favicon.ico",
    "colors": {
      "background": "#FFFFFF",   // component & dropdown backgrounds
      "primary":    "#5537FF",   // buttons, icons, focused fields
      "secondary":  "#0B1020",   // secondary buttons
      "neutral":    "#565B70",   // derived into 6 shades for text/disabled
      "success":    "#21D07A",
      "warning":    "#FF9933",
      "error":      "#FF4F64"
    },
    "typography": {
      "common": {
        "fontFamily":   "Inter, sans-serif",
        "fontSize":     "16px",
        "rootFontSize": "16px"   // base scaling reference
      },
      "titles": {
        "h2":            { "fontWeight": "800", "color": "#0B1020", "fontSize": "32px" },
        "h3":            { "fontWeight": "800", "color": "#0B1020", "fontSize": "24px" },
        "menuTitle":     { "fontWeight": "600" },
        "componentTitle":{ "fontWeight": "700" },
        "bigNumber":     { "fontWeight": "800" },
        "flow":          { "title": {}, "subtitle": {} },
        "response":      {},
        "emptyState":    {},
        "table":         {}
      }
    },
    "buttons": {
      "primary": {
        "default":  { "backgroundColor": "#5537FF", "textColor": "#FFFFFF",
                      "border": { "width": "1px", "radius": "8px", "color": "#5537FF" } },
        "hover":    {},
        "active":   {},
        "disabled": {}
      },
      "secondary": {}, "subtle": {}, "outline": {}, "flat": {}
    },
    "menuButton": { "default": {}, "hover": {}, "active": {}, "disabled": {} },
    "avatar":  { "iconColor": "#FFFFFF", "borderColor": "#5537FF", "backgroundColor": "#5537FF" },
    "cardIcon":{ "backgroundColor": "#0B1020", "visaTextColor": "#FFFFFF" },
    "sidebar": {
      "colors": { "background": "#0B1020", "primary": "#5537FF", "neutral": "#0B1020",
                  "secondary": "#FFFFFF", "info": "#5537FF",
                  "success": "#21D07A", "warning": "#FF9933", "error": "#FF4F64" }
    }
  },

  "elementsCard": {
    "designs": [
      {
        "name": "default",
        "url": "https://acme.example.com/card-art.png",
        "fontColor": "#FFFFFF",
        "boxShadow": "0px 3.6px 15px 2px rgb(0 0 0 / 0.25)"
      }
    ]
  },
  "elementsAccount": {
    "titleColor": "#0B1020",
    "balanceTitleColor": "#565B70",
    "coverBackgroundColor": "#F5F5F5"
  },
  "elementsApplicationForm": {
    "override": { "global": { "sidebar": { "colors": { "background": "#0B1020" } } } }
  }
}
```

### Section reference

| Section | What it controls |
| --- | --- |
| `global.colors` | `background`, `primary`, `secondary`, `neutral` (expands to 6 shades), and semantic `success` / `warning` / `error`. |
| `global.typography` | `common` font family/size/root size, plus `titles.*` for headings, big numbers, flow titles, responses, empty states, and tables. |
| `global.buttons` | Five button kinds (`primary`, `secondary`, `subtle`, `outline`, `flat`), each with `default` / `hover` / `active` / `disabled` states; each state has `backgroundColor`, `textColor`, and `border` (`width`, `radius`, `color`). |
| `global.menuButton` | Menu button states. |
| `global.avatar`, `global.cardIcon` | Avatar and card-icon colors. |
| `global.logoUrl`, `global.faviconUrl` | Brand logo and favicon. |
| `global.sidebar.colors` | Recolors the app sidebar. |
| `elementsCard.designs[]` | Card art: `name`, `url`, `fontColor`, `boxShadow` per design. |
| `elementsAccount` | Account screen `titleColor`, `balanceTitleColor`, `coverBackgroundColor`. |
| `elementsApplicationForm` | Onboarding-specific overrides (e.g. its own sidebar palette). |
| `*.override` | Any element can override `global` values locally. |

:::note[Border radius lives on buttons]
There isn't a single global "border radius" token — set `border.radius` per button state (and use card `boxShadow`/art for card rounding). To make everything feel rounded, set `radius` on each button kind's states.
:::

## Verifying your theme

1. Apply it in **sandbox** (dashboard editor or `settings-json`).
2. Walk the full flow: onboarding form, account screen, card screen, a payment.
3. Check both light surfaces and the card art, and test on mobile widths.
4. Confirm contrast on `primary`/`error` against `background` for accessibility.

## Next step

Reduce onboarding friction → [Pre-fill user information](/build/prefilling/).
