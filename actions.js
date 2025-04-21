import { exec } from 'child_process';

const adbPath = (process.platform == "linux") ? "./platform-tools/ubuntu/adb" : "./platform-tools/adb";

function execCommand(cmd) {
	exec(adbPath + " devices", (error, stdout, stderr) => {
		const matchVar = new RegExp(this.config.host + ":" + this.config.port + "\sdevice", "g")
		const connected = stdout.match(matchVar)
		if(connected == null) {
			exec(adbPath + " connect " + this.config.host + ":" + this.config.port);
		}

		exec(cmd);
	});

	exec(cmd, (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
		console.error(`stderr: ${stderr}`);
	})
}

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
					execCommand(adbPath + " shell input keyevent " + event.options.action);
				},
			},
		})
	}
}
