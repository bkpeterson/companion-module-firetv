const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
//const { exec } = require('child_process')
const UpgradeScripts = require('./upgrades')
const adb = require('shelljs')

const adbPath = "/home/bjorn/companion-dev/companion-module-firetv/platform-tools/adb"

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
							{ id: '21', label: 'Left/Prev'},
							{ id: '22', label: 'Right/Next'},
							{ id: '66', label: 'Select/Play/Pause'},
							{ id: '4',  label: 'Back'},
							{ id: '3',  label: 'Home'},
							{ id: '1',  label: 'Menu'}
						]
					},
				],
				callback: async (event) => {
					const reply = adb.exec(adbPath + " devices", { silent: true});
					if(reply.code === 0) {
						const stdout = reply.stdout;
						this.log('debug', 'ADB*: ' + stdout)
					} else {
						const stderr = reply.stderr;
						this.log('error', 'Err*: ' + stderr);
					}
					this.log('debug', 'ADB: ' + reply)
					const matchVar = new RegExp(this.config.host + ":" + this.config.port + "\s*?device", "g");
					const connected = reply.match(matchVar);
					if(connected == null) {
						this.log('debug', 'Connecting... ' + stdout)
						adb.exec(adbPath + " connect " + this.config.host + ":" + this.config.port);
					}
			
					this.log('debug', 'Connected')
					adb.exec(adbPath + " shell input keyevent " + event.options.action)
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
