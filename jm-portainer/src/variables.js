const variableList = [
	{ name: 'Enviroment Name', variableId: 'enviromentName' },
	{ name: 'Enviroment Id', variableId: 'enviromentId' },
]

module.exports = {
	initVariables () {
		let self = this;
		self.setVariableDefinitions(variableList);
	},

	checkVariableValues() {
		let self = this

		self.setVariableValues({ enviromentName: self.enviroment.Name })
		self.setVariableValues({ enviromentId: self.enviroment.Id })
	}
}
module.exports.variableList = variableList