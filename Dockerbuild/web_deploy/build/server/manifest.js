export const manifest = {
	appDir: "_app",
	assets: new Set(["favicon.png","mystyles.css"]),
	_: {
		mime: {".png":"image/png",".css":"text/css"},
		entry: {"file":"start-bbf586ac.js","js":["start-bbf586ac.js","chunks/vendor-850453c4.js"],"css":["assets/vendor-30b899a4.css"]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js'),
			() => import('./nodes/3.js')
		],
		routes: [
			{
				type: 'page',
				pattern: /^\/$/,
				params: null,
				path: "/",
				a: [0,2],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/about\/?$/,
				params: null,
				path: "/about",
				a: [0,3],
				b: [1]
			},
			{
				type: 'endpoint',
				pattern: /^\/api\/profile_groups\.json$/,
				params: null,
				load: () => import('./entries/endpoints/api/profile_groups.json.js')
			},
			{
				type: 'endpoint',
				pattern: /^\/api\/node_groups\.json$/,
				params: null,
				load: () => import('./entries/endpoints/api/node_groups.json.js')
			},
			{
				type: 'endpoint',
				pattern: /^\/api\/profiles\.json$/,
				params: null,
				load: () => import('./entries/endpoints/api/profiles.json.js')
			},
			{
				type: 'endpoint',
				pattern: /^\/api\/api_client\/?$/,
				params: null,
				load: () => import('./entries/endpoints/api/api_client.js')
			},
			{
				type: 'endpoint',
				pattern: /^\/api\/nodes\.json$/,
				params: null,
				load: () => import('./entries/endpoints/api/nodes.json.js')
			}
		]
	}
};
