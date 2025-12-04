const { combineRgb } = require('@companion-module/base');

module.exports = {
	initPresets () {
		let self = this;
		let presets = {};

		const  gradientPNG = 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAX1QTFRFAAD+AAP7AAf3AAvzAA/vABPrABfnABvjAB/fACPbACfXACvTAC/PADPLADfHADvDAD+/AEO7AEe3AEuzAE+vAFOrAFenAFujAF+fAGObAGeXAGuTAG+PAHOLAHeHAHuDAH9/AIJ8AIZ4AIp0AI5wAJJsAJZoAJpkAJ5gAKJcAKZYAKpUAK5QALJMALZIALpEAL5AAMI8AMY4AMo0AM4wANIsANYoANokAN4gAOIcAOYYAOoUAO4QAPIMAPYIAPoEAwD7BwD3CwDzDwDvEwDrFwDnGwDjHwDfIwDbJwDXKwDTLwDPMwDLNwDHOwDDPwC/QwC7RwC3SwCzTwCvUwCrVwCnWwCjXwCfYwCbZwCXawCTbwCPcwCLdwCHewCDfwB/gwB7hwB3iwBzjwBvkwBrlwBnmwBjnwBfowBbpwBXqwBTrwBPswBLtwBHuwBDvwA/wwA7xwA3ywAzzwAv0wAr1wAn2wAj3wAf4wAb5wAX6wAT7wAP8wAL9wAH+wADn2Q8QQAAASBJREFUeJylzAVWQlEUBVD/zCwsBGwFpLHFllTH9md2WPaPF/e+swewo4WItBiTwRLIYRnksAJyWAU5FEAOayCHdZDDBshhE+SwBXIoghy2QQ4lkEMZ5FABOeyAHHazgXbYywXKYT8f6IYDQ6AaDk2BZjgyBorh2BzIhxNLIB6qtkA61KyBcKjbA9lw6ghEQ8MVSIamMxAMLXfgH9qewDt0fIFv6HoDz9DzB+6hLwicw5kkcA3nosAxXMgC+3ApDKzDlTSwDdfiwDLcyAPzcKsIjMNAE5iGO1VgGO51QX54UAa54VEbZIcndZAZnvVBengJCFLDa0iQHIZBQWIYhQX/wzgw+BsmocHvMA0OfoZZePA9vBHB1/DOBJ/DBxUgngOv5OiKJ52ngwAAAABJRU5ErkJggg=='

		// Define colors
		const white = combineRgb(255, 255, 255);
		const black = combineRgb(0, 0, 0);
		const red = combineRgb(255, 0, 0);
		const dark_red = combineRgb(128, 0, 0);
		const green = combineRgb(0, 255, 0);
		const dark_green = combineRgb(0, 128, 0);
		const blue = combineRgb(0, 0, 255);

		// ##############
		// #### Main ####
		// ##############

		presets.power_on = {
			type: 'button',
			category: 'Main',
			name: 'Turn On',
			style: {
				text: 'Turn On',
				size: '18',
				color: white,
				bgcolor: black,
			},
			steps: [
				{
					down: [
						{
							actionId: 'power',
							options: {
								power: 'on',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'powerState',
					options: {
						option: 'on',
					},
					style: {
						bgcolor: red,
						color: white,
					},
				},
			]
		},
		self.setPresetDefinitions(presets);
	}
};