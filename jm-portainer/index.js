const { InstanceBase, InstanceStatus, runEntrypoint } = require('@companion-module/base');
const UpgradeScripts = require('./src/upgrades');

const config = require('./src/config');
const actions = require('./src/actions');
const feedbacks = require('./src/feedbacks');
const variables = require('./src/variables')
const { variableList } = require('./src/variables');
const presets = require('./src/presets');

const portainer = require('./src/portainerAPI');

class portainerInstance extends InstanceBase {
	constructor(internal) {
		super(internal);

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...config,
			...actions,
			...feedbacks,
			...variables,
			...variableList,
			...presets,
		});

		this.ENVIROMENTS = [
			{ id: 'select', label: 'No Enviroments Detected. Enter your API key, click "Save", wait a moment, and then return to this config to choose an enviroment.' },
		];
		this.CONTAINERS = [{}]
		this.STACKS = [{}]
	}

	async destroy() {
		this.log('debug', 'destroy');
		// clear any intervals or timers here ↓
	}

	async init(config) {
		this.configUpdated(config);
	}

	async configUpdated(config) {
		this.config = config

		if (this.config.verbose) {
			this.log('info', 'Verbose mode enabled. Log entries will contain detailed information.');
		}

		if (!this.config.host) {
			this.updateStatus(InstanceStatus.Connecting, 'Please fill out the config.');
			return
		}

		// this.PORTAINER = new portainer(this.config.host, this.config.port, this.config.usehttps, this.config.api_key);

		await this.initConnection();

		this.initActions();
		this.checkVariableValues();

		// this.initFeedbacks();
		// this.initPresets();

		// this.checkFeedbacks();

		this.updateStatus(InstanceStatus.Ok, 'Ready');
	}

	async initConnection() {
		let self = this;
		if (self.config.verbose) {
			self.log('debug', 'Initializing Connection...')
		}

		self.PORTAINER = new portainer(this.config.host, this.config.port, this.config.usehttps, this.config.api_key);
		await self.getPortainerEnviroments().then(async(enviroments) => {
			if (enviroments.length <= 1) { // meaning theres no enviroments besides the default 'select' entry
				self.log('error', 'No enviroments detected.');
			}

			self.enviroment = enviroments.find(env => env.id === self.config.enviromentID);

			if (!self.enviroment) { // doesnt exist
				self.log('error', 'Invalid Enviroment Selected. Select an available enviroment from the list');
				return
			}

			if (self.enviroment.id === 'select') {
				self.log('warn', 'Select an available enviroment from the list...')
				return
			}

			if (self.config.verbose) {
				self.log('debug', `Connecting to enviroment id: ${self.enviroment.id} | name: ${self.enviroment.label}`)
			}

			self.updateStatus(InstanceStatus.Ok, 'Connection Successful');

			await this.getInformation();

		}).catch((error) => self.processError(error))
	}

	getPortainerEnviroments() {
		let self = this;
		return new Promise((resolve, reject) => {
			if (self.config.verbose) {
				self.log('debug', 'Getting Enviroments...');
			}

			self.PORTAINER.enviroment_getEnviroments().then((data) => {
				self.buildEnviromentList.bind(self)(data);
				if (self.config.verbose) {
					self.log('debug', `Enviroments Fetched: ${self.ENVIROMENTS.length-1}`);
				}

				//might need to do a check here to see if the enviroment they had selected is still in the list, if not, change it back to 'select'
				if (self.config.enviromentID !== 'select') {
					let enviroment = self.ENVIROMENTS.find(enviroment => enviroment.id === self.config.enviromentID);
					if (!enviroment) {
						// doesnt exits in the list, and they have it selected
						if (self.config.verbose) {
							self.log('debug', 'Selected enviroment doesnt exits in the list any more. Reverting to default');
						}
						self.config.enviromentID = 'select';
						self.getConfigFields();
						self.configUpdated(self.config); // refresh the config to show the device list
						self.updateStatus(InstanceStatus.Connecting, 'Devices Auto-Detected. Please select a device.');
					}
				}
				resolve(self.ENVIROMENTS); // Return the device list
			}).catch((error) => reject(error));
		});
	}

	buildEnviromentList(data) {
		let self = this;
		if (self.config.verbose) {
			self.log('debug', 'Building Enviroment List...');
		}
		if (data.length > 0) {
			let list = [];

			let selectObj = {};
			selectObj.id = 'select';
			selectObj.label = '(Select an Enviroment)';
			list.push(selectObj);

			for (let i = 0; i < data.length; i++) {
				let obj = { ...data[i] };
				obj.id = data[i].Id;
				obj.label = data[i].Name;

				list.push(obj);
			}
			self.ENVIROMENTS = list;
		}
	}

	buildContainerList(data) {
		let self = this;
		if (self.config.verbose) {
			self.log('debug', 'Building Container List...');
		}
		if (data.length > 0) {
			let list = [];

			let selectObj = {};
			selectObj.id = 'select';
			selectObj.label = '(Select a Container)';
			list.push(selectObj);

			for (let i = 0; i < data.length; i++) {
				let obj = { ...data[i] };
				obj.id = data[i].Id;
				obj.label = data[i].Names[0].split('/')[1]; // names is a list, so im just taking the first one, and it has a '/' at the beginning so im just splitting that out
				list.push(obj);
			}
			self.CONTAINERS = list;
		}
	}

	buildStacksList(data) {
		let self = this;
		if (self.config.verbose) {
			self.log('debug', 'Building Stacks List...');
		}
		if (data.length > 0) {
			let list = [];

			let selectObj = {};
			selectObj.id = 'select';
			selectObj.label = '(Select a Stack)';
			list.push(selectObj);

			for (let i = 0; i < data.length; i++) {
				let obj = { ...data[i] };
				obj.id = data[i].Id;
				obj.label = data[i].Name;
				list.push(obj);
			}
			self.STACKS = list;
		}
	}

	async getInformation() {
		let self = this

		if (self.config.verbose) {
			self.log('debug', 'Getting Information...')
		}

		await self.PORTAINER.container_getContainers(self.enviroment.id, true).then((data) => {
			self.buildContainerList.bind(self)(data);
			if (self.config.verbose) {
				self.log('debug', `Containers Fetched: ${self.CONTAINERS.length-1}`);
			}

			for (var container of self.CONTAINERS) {
				if (container.id === 'select') continue
				for (var variable of variableList) {
					if (variable.variableId === `container_${container.label}_id`) {
						break
					}
					variableList.push({ name: `Container: ${container.label} Name`, variableId: `container_${container.label}_name`})
					variableList.push({ name: `Container: ${container.label} Id`, variableId: `container_${container.label}_id`})
					variableList.push({ name: `Container: ${container.label} state`, variableId: `container_${container.label}_state`})
					variableList.push({ name: `Container: ${container.label} Status`, variableId: `container_${container.label}_status`})
					break
				}
			}

			self.setVariableDefinitions(variableList)

			for (var container of self.CONTAINERS) {
					self.setVariableValues({
						[`container_${container.label}_name`]: container.label,
						[`container_${container.label}_id`]: container.id,
						[`container_${container.label}_state`]: container.State,
						[`container_${container.label}_status`]: container.Status,
					})

			}
		}).catch((error) => self.log('error', 'Error fetching Containers: ' + error));

		await self.PORTAINER.stack_getStacks().then((data) => {
			self.buildStacksList.bind(self)(data);
			if (self.config.verbose) {
				self.log('debug', `Stacks Fetched: ${self.STACKS.length-1}`);
			}

			for (var stack of self.STACKS) {
				self.log('info', JSON.stringify(stack))
				if (stack.id === 'select') continue
				for (var variable of variableList) {
					if (variable.variableId === `stack_${stack.label}_id`) {
						break
					}
					variableList.push({ name: `Stack: ${stack.label} Name`, variableId: `stack_${stack.label}_name`})
					variableList.push({ name: `Stack: ${stack.label} Id`, variableId: `stack_${stack.label}_id`})
					variableList.push({ name: `Stack: ${stack.label} EndpointId`, variableId: `stack_${stack.label}_endpointid`})
					variableList.push({ name: `Stack: ${stack.label} Status`, variableId: `stack_${stack.label}_status`})
					break
				}
			}

			self.setVariableDefinitions(variableList)

			for (var stack of self.STACKS) {
					self.setVariableValues({
						[`stack_${stack.label}_name`]: stack.label,
						[`stack_${stack.label}_id`]: stack.id,
						[`stack_${stack.label}_endpointid`]: stack.EndpointId,
						[`stack_${stack.label}_status`]: stack.Status == 1 ? 'active' : 'inactive',
					})

			}
		}).catch((error) => self.log('error', 'Error fetching Stacks: ' + error));
	}

	processError(error_raw) {
		let self = this;
		const STATUS_CODES = {
			"100": "Continue",
			"101": "Switching Protocols",
			"102": "Processing",
			"103": "Early Hints",
			"200": "OK",
			"201": "Created",
			"202": "Accepted",
			"203": "Non-Authoritative Information",
			"204": "No Content",
			"205": "Reset Content",
			"206": "Partial Content",
			"207": "Multi-Status",
			"208": "Already Reported",
			"226": "IM Used",
			"300": "Multiple Choices",
			"301": "Moved Permanently",
			"302": "Found",
			"303": "See Other",
			"304": "Not Modified",
			"305": "Use Proxy",
			"307": "Temporary Redirect",
			"308": "Permanent Redirect",
			"400": "Bad Request",
			"401": "Unauthorized",
			"402": "Payment Required",
			"403": "Forbidden",
			"404": "Not Found",
			"405": "Method Not Allowed",
			"406": "Not Acceptable",
			"407": "Proxy Authentication Required",
			"408": "Request Timeout",
			"409": "Conflict",
			"410": "Gone",
			"411": "Length Required",
			"412": "Precondition Failed",
			"413": "Payload Too Large",
			"414": "URI Too Long",
			"415": "Unsupported Media Type",
			"416": "Range Not Satisfiable",
			"417": "Expectation Failed",
			"418": "I'm a Teapot",
			"421": "Misdirected Request",
			"422": "Unprocessable Entity",
			"423": "Locked",
			"424": "Failed Dependency",
			"425": "Too Early",
			"426": "Upgrade Required",
			"428": "Precondition Required",
			"429": "Too Many Requests",
			"431": "Request Header Fields Too Large",
			"451": "Unavailable For Legal Reasons",
			"500": "Internal Server Error",
			"501": "Not Implemented",
			"502": "Bad Gateway",
			"503": "Service Unavailable",
			"504": "Gateway Timeout",
			"505": "HTTP Version Not Supported",
			"506": "Variant Also Negotiates",
			"507": "Insufficient Storage",
			"508": "Loop Detected",
			"509": "Bandwidth Limit Exceeded",
			"510": "Not Extended",
			"511": "Network Authentication Required"
		}
		try {
			self.log('error', `${error_raw.code} | ${error_raw.status} | ${STATUS_CODES[error_raw.status]} | ${error_raw.message}`);
		} catch (error) {
			self.log('error', JSON.stringify(error_raw))
		}
	}
}

runEntrypoint(portainerInstance, UpgradeScripts);