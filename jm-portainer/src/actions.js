module.exports = {
	initActions () {
		let self = this;

		let actions = {};

		// ====================
		// ==== containers ====
		// ====================

		actions.getContainers = {
			name: 'getContainers',
			options: [
				{
					type: 'checkbox',
					id: 'all',
					label: 'Get ALL Containers',
					default: false,
					tooltip: 'false - gets ACTIVE/RUNNING containers. true - gets ALL containers'
				},
			],
			callback: async function (action) {
				self.log('debug', 'Getting Containers');

				this.variableList.push({ name: 'abc', variableId: 'def' })

				self.PORTAINER.container_getContainers(self.enviroment.id, action.options.all)
				.then((data) => {
					self.
					self.log('info', JSON.stringify(data))
				})
				.catch((error) => {self.log('error', self.processError(error))});
			}
		};

		actions.inspectContainer = {
			name: 'inspectContainer',
			options: [
				{
					type: 'dropdown',
					id: 'containerID',
					label: 'Select a Container',
					choices: self.CONTAINERS,
					default: 0,
				},
			],
			callback: async function (action) {
				// self.log('debug', 'Getting Containers');

				// this.variableList.push({ name: 'abc', variableId: 'def' })

				// self.PORTAINER.container_getContainers(self.enviroment.id, action.options.all)
				// .then((data) => {
				// 	self.
				// 	self.log('info', JSON.stringify(data))
				// })
				// .catch((error) => {self.log('error', self.processError(error))});
			}
		};





		// =====================
		// ==== enviroments ====
		// =====================

		actions.getEnviroments = {
			name: 'getEnviroments',
			options: [],
			callback: async function (action) {
				self.log('debug', 'Getting Enviroments');

				self.PORTAINER.enviroment_getEnviroments()
				.then((data) => {self.log('info', JSON.stringify(data))})
				.catch((error) => {self.log('error', self.processError(error))});
			}
		};








		// ================
		// ==== stacks ====
		// ================

		actions.getStacks = {
			name: 'getStacks',
			options: [],
			callback: async function () {
				self.log('debug', 'Retreving Stacks');

				self.PORTAINER.stack_getStacks()
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

				self.PORTAINER.stack_start(action.options.stackID, action.options.endpointId)
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

				self.PORTAINER.stack_stop(action.options.stackID, action.options.endpointId)
				.then((data) => {self.log('info', JSON.stringify(data))})
				.catch((error) => {self.log('error', self.processError(error))});
			}
		};

		actions.getContainerStats = {
			name: 'getContainerStats',
			options: [
				{
					type: 'number',
					id: 'enviromentID',
					label: 'Enviroment ID',
					default: 0,
				},
				{
					type: 'textinput',
					id: 'containerID',
					label: 'Container ID',
					default: '',
				},
			],
			callback: async function (action) {
				// self.log('debug', 'Stopping Stack' + action.options.stackID);

				self.PORTAINER.container_getStats(action.options.enviromentID, action.options.containerID)
				.then((data) => {self.log('info', JSON.stringify(data))})
				.catch((error) => {self.log('error', self.processError(error))});
			}
		};



		self.setActionDefinitions(actions);
	}
}