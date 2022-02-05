import adapter from '@sveltejs/adapter-node';

export default {
	kit: {
		vite: {
			ssr: {
				noExternal: ['chart.js']
			}
		},
		adapter: adapter({
			// default options are shown
			out: 'build',
			precompress: false,
			env: {
				path: 'SOCKET_PATH',
				host: 'HOST',
				port: 'PORT',
				origin: 'ORIGIN',
				headers: {
					protocol: 'PROTOCOL_HEADER',
					host: 'HOST_HEADER'
				}
			}
		})
	}
};
