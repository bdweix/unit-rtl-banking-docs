// Prefixes the configured Astro `base` to root-relative links/srcs found in
// Markdown/MDX content. Starlight already base-prefixes the links it generates
// (sidebar, logo, etc.), but it does NOT rewrite absolute links you author in
// content (e.g. `/build/authentication/`). This plugin closes that gap so the
// site works when served from a sub-path like GitHub project Pages.
//
// Pass the base (with a leading slash, no trailing slash) when registering:
//   rehypePlugins: [[rehypeBaseLinks, { base: '/my-repo' }]]

const ATTRS = ['href', 'src'];

export default function rehypeBaseLinks({ base = '' } = {}) {
	const prefix = base.replace(/\/$/, '');
	if (!prefix) return () => {};

	const rewrite = (value) => {
		if (typeof value !== 'string') return value;
		// Only touch root-relative paths ("/foo"), not protocol-relative ("//"),
		// external URLs, anchors, or paths already carrying the base.
		if (!value.startsWith('/')) return value;
		if (value.startsWith('//')) return value;
		if (value === prefix || value.startsWith(prefix + '/')) return value;
		return prefix + value;
	};

	const walk = (node) => {
		if (node.type === 'element' && node.properties) {
			for (const attr of ATTRS) {
				if (attr in node.properties) {
					node.properties[attr] = rewrite(node.properties[attr]);
				}
			}
		}
		if (Array.isArray(node.children)) node.children.forEach(walk);
	};

	return (tree) => walk(tree);
}
