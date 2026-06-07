// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkGfm from 'remark-gfm';
import rehypeBaseLinks from './rehype-base-links.mjs';

// Served from GitHub project Pages at https://bdweix.github.io/<BASE>/
// To host at a domain root instead, set BASE = '' and update `site`.
const BASE = '/unit-rtl-banking-docs';

// https://astro.build/config
export default defineConfig({
	site: 'https://bdweix.github.io',
	base: BASE,
	// Ensure GitHub-Flavored Markdown (tables, etc.) is applied to .mdx files too,
	// and base-prefix root-relative links authored in content so they work under a sub-path.
	markdown: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [[rehypeBaseLinks, { base: BASE }]],
	},
	integrations: [
		starlight({
			title: 'Ready-to-Launch Banking',
			description:
				'Developer documentation for Unit Ready-to-Launch Banking — embed a white-labeled bank account, cards, and payments experience in weeks.',
			logo: {
				light: './src/assets/logo-light.svg',
				dark: './src/assets/logo-dark.svg',
				replacesTitle: true,
			},
			customCss: ['./src/styles/theme.css'],
			tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
			social: [
				{ icon: 'external', label: 'Live demo', href: 'https://demo.unit.co/ready-to-launch/banking' },
				{ icon: 'seti:html', label: 'Unit.co', href: 'https://www.unit.co' },
			],
			lastUpdated: true,
			sidebar: [
				{
					label: 'Start here',
					items: [
						{ label: 'Introduction', slug: 'start-here/introduction' },
						{ label: 'Custom vs. Ready-to-Launch', slug: 'start-here/custom-vs-ready-to-launch' },
						{ label: 'How it works', slug: 'start-here/how-it-works' },
						{ label: 'Quickstart (5 minutes)', slug: 'start-here/quickstart' },
					],
				},
				{
					label: 'Build the integration',
					items: [
						{ label: 'Embed the app', slug: 'build/embed-the-app' },
						{ label: 'Authentication & JWT', slug: 'build/authentication' },
						{ label: 'Theming & branding', slug: 'build/theming' },
						{ label: 'Pre-fill user information', slug: 'build/prefilling' },
						{ label: 'Multi-user access & roles', slug: 'build/multi-user-access' },
						{ label: 'Embedded application form', slug: 'build/embedded-application-form' },
						{ label: 'Unified onboarding (Banking + Stripe)', slug: 'build/unified-onboarding' },
						{ label: 'Handling end-user events', slug: 'build/end-user-events' },
					],
				},
				{
					label: 'Operate & observe',
					badge: { text: 'Day 2', variant: 'tip' },
					items: [
						{ label: 'Webhooks', slug: 'operate/webhooks' },
						{ label: 'Application & onboarding states', slug: 'operate/application-states' },
						{ label: 'Error handling & troubleshooting', slug: 'operate/error-handling' },
						{ label: 'The Unit Dashboard', slug: 'operate/dashboard' },
						{ label: 'Operational accounts', slug: 'operate/operational-accounts' },
					],
				},
				{
					label: 'API reference',
					items: [
						{ label: 'Overview & conventions', slug: 'api/overview' },
						{ label: 'Interactive reference ↗', link: '/api-reference/', attrs: { target: '_blank' } },
					],
				},
				{
					label: 'Go to production',
					items: [
						{ label: 'Environment model', slug: 'launch/environments' },
						{ label: 'Security model', slug: 'launch/security' },
						{ label: 'Launch checklist', slug: 'launch/production-checklist' },
					],
				},
				{
					label: 'Customer outreach',
					items: [
						{ label: 'Overview', slug: 'outreach/overview' },
						{ label: 'Marketing banners', slug: 'outreach/marketing-banners' },
						{ label: 'Customer emails', slug: 'outreach/customer-emails' },
						{ label: 'Marketing landing page', slug: 'outreach/landing-page' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'FAQ', slug: 'reference/faq' },
						{ label: 'Glossary', slug: 'reference/glossary' },
					],
				},
			],
		}),
	],
});
