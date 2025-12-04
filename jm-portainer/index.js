const { InstanceBase, InstanceStatus, runEntrypoint } = require('@companion-module/base');
const UpgradeScripts = require('./src/upgrades');

const config = require('./src/config');
const actions = require('./src/actions');
const feedbacks = require('./src/feedbacks');
const variables = require('./src/variables');
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
			...presets,
		});
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
			this.updateStatus(InstanceStatus.Connecting, 'Please enter your portainer ip address.');
			// return
		}

		this.PORTAINER = new portainer({host: this.config.host, port: this.config.port, usehttps: this.config.usehttps, api_key: this.config.api_key});

		this.initActions();

		// this.initFeedbacks();
		// this.initVariables();
		// this.initPresets();

		// this.checkFeedbacks();
		// this.checkVariables();

		this.updateStatus(InstanceStatus.Ok, '');
	}

	// send_request(request, ...args) {
	// 	this.portainer[request](...args)
	// 	.then((data) => {self.log('info', JSON.stringify(data))})
	// 	.catch((error) => {self.log('error', self.processError(error))});
	// }

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