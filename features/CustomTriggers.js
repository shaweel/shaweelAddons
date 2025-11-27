let customTriggers = {}

export class CustomTrigger {
	constructor(name) {
		this.name = name
		customTriggers[this.name] = false
	}

	trigger() {
		customTriggers[this.name] = true
	}
}

export function customRegister(trigger, callback) {
	const vanillaTrigger = register("step", () => {
		if (customTriggers[trigger]) {
			customTriggers[trigger] = false
			callback()
		}
	}).setFps(1000)

	return new class CustomRegister {
		unregister() {
			vanillaTrigger.unregister()
		}
		register() {
			vanillaTrigger.register()
		}
	}
}



