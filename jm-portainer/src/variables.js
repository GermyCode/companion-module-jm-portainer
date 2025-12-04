module.exports = {
	initVariables () {
		let self = this;

		let variables = [];

		// variables.push({ variableId: 'device', name: 'MAC Address' })

		self.setVariableDefinitions(variables);
	},

	checkVariables () {
		let self = this;

		try {
			let variableObj = {};

			// variableObj.power = self.INFO.power;

			self.setVariableValues(variableObj);
		}
		catch(error) {
			self.log('error', 'Error setting variables: ' + error);
		}
	}
}
