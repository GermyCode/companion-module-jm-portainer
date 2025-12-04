const { Regex } = require('@companion-module/base')

module.exports = {
	getConfigFields() {
		return [
			{ // main info
				type: 'static-text',
				id: 'info',
				label: 'Information',
				value: 'This module controls portainer. See the HELP file for more information and how to get started.',
				width: 12,
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'portainer ip address:',
				width: 12,
				default: '',
				regex: Regex.IP.replace(/\/$/, '|^$\/'),
			},
			{
				type: 'checkbox',
				id: 'usehttps',
				label: 'Use HTTPS??',
				width: 12,
				default: false,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'portainer port:',
				width: 12,
				default: '',
				regex: "\d{1,5}}",
			},
			{ // api key
				// type: 'secret-text',
				type: 'textinput',
				id: 'api_key',
				label: 'API Key',
				width: 12,
				default: '',
			},
			{ // verbose info
				type: 'static-text',
				id: 'info2',
				label: 'Verbose Logging',
				width: 12,
				value: `
					<div class="alert alert-info">
						Enabling this option will put more detail in the log, which can be useful for troubleshooting purposes.
					</div>
				`
			},
			{ // verbose toggle
				type: 'checkbox',
				id: 'verbose',
				label: 'Enable Verbose Logging',
				default: false,
				width: 12
			},
		]
	}
}