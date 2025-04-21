const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const actions = require('./actions')

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		Object.assign(this, {
			..actions
		})
	}

	async init(config) {
		this.config = config

		this.updateStatus(InstanceStatus.Ok)
		this.UpdateActions() // export actions
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Fire TV IP',
				width: 8,
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Fire TV Port',
				default: 5555,
				width: 4,
				regex: Regex.PORT,
			},
		]
	}

	updateActions() {
		UpdateActions(this)
	}
}

runEntrypoint(ModuleInstance)
