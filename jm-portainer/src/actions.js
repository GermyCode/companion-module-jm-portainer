module.exports = {
	initActions () {
		let self = this;
		let actions = {};

		actions.getStacks = {
			name: 'getStacks',
			options: [],
			callback: async function () {
				self.log('debug', 'Retreving Stacks');

				self.PORTAINER.getStacks()
				.then((data) => {self.log('info', JSON.stringify(data))})
				.catch((error) => {self.log('error', self.processError(error))});
			}
		};
		actions.startStack = {
			name: 'startStack',
			options: [
				{
					type: 'number',
					id: 'stackID',
					label: 'Stack ID',
					default: 0,
				},
				{
					type: 'number',
					id: 'endpointId',
					label: 'Endpoint ID',
					default: 0,
				},
			],
			callback: async function (action) {
				self.log('debug', 'Starting Stack' + action.options.stackID);

				self.PORTAINER.startStack(action.options.stackID, action.options.endpointId)
				.then((data) => {self.log('info', JSON.stringify(data))})
				.catch((error) => {self.log('error', self.processError(error))});
			}
		};
		actions.stopStack = {
			name: 'stopStack',
			options: [
				{
					type: 'number',
					id: 'stackID',
					label: 'Stack ID',
					default: 0,
				},
				{
					type: 'number',
					id: 'endpointId',
					label: 'Endpoint ID',
					default: 0,
				},
			],
			callback: async function (action) {
				self.log('debug', 'Stopping Stack' + action.options.stackID);

				self.PORTAINER.stopStack(action.options.stackID, action.options.endpointId)
				.then((data) => {self.log('info', JSON.stringify(data))})
				.catch((error) => {self.log('error', self.processError(error))});
			}
		};

		// actions.makeAPIJWT = {
		// 	name: 'makeAPIJWT',
		// 	options: [],
		// 	callback: async function (action) {
		// 		self.log('debug', 'Making JWT Key');

		// 		// self.send_request('makeAPIJWT', limit, offset, query)
		// 		self.PFSENSE.makeAPIJWT()
		// 		.then((data) => {self.log('info', JSON.stringify(data))})
		// 		.catch((error) => {self.log('error', self.processError(error))});
		// 	}
		// };
		// actions.makeAPIKey = {
		// 	name: 'makeAPIKey',
		// 	options: [
		// 		{
		// 			type: 'textinput',
		// 			label: 'descr',
		// 			id: 'descr',
		// 			tooltip: 'Identifyer for the key, for administrative purposes',
		// 		},
		// 		{
		// 			type: 'dropdown',
		// 			label: 'hash_algo',
		// 			id: 'hash_algo',
		// 			choices: [
		// 				{ id: 'sha256', label: 'sha256' },
		// 				{ id: 'sha384', label: 'sha384' },
		// 				{ id: 'sha512', label: 'sha512' },
		// 			],
		// 			default: 'sha256',
		// 			tooltip: 'The hash algorithm used for this API key. It is recommended to increase the strength of the algorithm for keys assigned to privileged users.'
		// 		},
		// 		{
		// 			type: 'dropdown',
		// 			label: 'length_bytes',
		// 			id: 'length_bytes',
		// 			choices: [
		// 				{ id: 16, label: '16'},
		// 				{ id: 24, label: '24'},
		// 				{ id: 32, label: '32'},
		// 				{ id: 64, label: '64'},
		// 			],
		// 			default: 16,
		// 			tooltip: 'The hash algorithm used for this API key. It is recommended to increase the strength of the algorithm for keys assigned to privileged users.'
		// 		},
		// 	],
		// 	callback: async function (action) {
		// 		self.log('debug', 'Making API Key');

		// 		const descr = action.options.descr == '' ? 'Made With Companion' : action.options.descr
		// 		const hash_algo  = action.options.hash_algo
		// 		const length_bytes  = parseInt(action.options.length_bytes)

		// 		// self.send_request('makeAPIKey', limit, offset, query)
		// 		self.PFSENSE.makeAPIKey(descr, hash_algo, length_bytes)
		// 		.then((data) => {self.log('info', JSON.stringify(data))})
		// 		.catch((error) => {self.log('error', self.processError(error))});
		// 	}
		// };




		self.setActionDefinitions(actions);
	}
}