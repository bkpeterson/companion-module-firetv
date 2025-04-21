import { exec } from 'child_process';

module.exports = {
	UpdateActions: function() {
		let self = this;

		self.setActionDefinitions({
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
								},
			},
		})
	}
}
