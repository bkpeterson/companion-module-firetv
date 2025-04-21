const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const { exec } = require('child_process')
const UpgradeScripts = require('./upgrades')

class FireTVInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config

		this.updateStatus(InstanceStatus.Ok)

		this.setActionDefinitions({
			firetv: {
				name: 'Fire TV Remote',
				options: [
					{
						id: 'action',
						type: 'dropdown',
						label: 'Command',
						choices: [
							{ id: '19', label: 'Up'},
							{ id: '20', label: 'Down'},
							{ id: '21', label: 'Lef/Prev'},
							{ id: '22', label: 'Right/Next'},
							{ id: '66', label: 'Select/Play/Pause'},
							{ id: '4',  label: 'Backl'},
							{ id: '3',  label: 'Home'},
							{ id: '1',  label: 'Menu'}
						]
					},
				],
				callback: async (event) => {
					exec("./platform-tools/ubuntu/adb devices", (error, stdout, stderr) => {
						const matchVar = new RegExp(this.config.host + ":" + this.config.port + "\sdevice", "g")
						const connected = stdout.match(matchVar)
						if(connected == null) {
							exec(adbPath + " connect " + this.config.host + ":" + this.config.port);
						}
				
						exec(cmd);
					});
				
					exec(adbPath + " shell input keyevent " + event.options.action, (error, stdout, stderr) => {
						if (error) {
							console.error(`exec error: ${error}`);
							return;
						}
						console.log(`stdout: ${stdout}`);
						console.error(`stderr: ${stderr}`);
					})
				}
			}
		})
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
}

runEntrypoint(FireTVInstance, UpgradeScripts)
