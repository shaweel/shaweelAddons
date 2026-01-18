import utils from "./Utils.js"

let customTriggers = {}

export const CustomTriggerRequiredArgument = "CustomTriggerRequiredArgumentCustomTriggerRequiredArgumentCustomTriggerRequiredArgument"

export class CustomTrigger {
	//Args must be an Object, the keys are the argument names and the values are the default placeholder, if it's CustomTriggerRequiredArgument, the argument will be required.
	constructor(name, args) {
		if (typeof(args) != "object") {
			utils.errorLog("A custom trigger's args argument must be an Object")
			return
		}
		this.name = name
		customTriggers[this.name] = {"status": false, "arguments": args, "defaultArguments": args, "callbacks": []}
		this.vanillaTrigger = register("step", () => {
		if (customTriggers[this.name].status) {
			for (let loopedCallback of customTriggers[this.name].callbacks) {
				loopedCallback(customTriggers[this.name].arguments)
			}
			customTriggers[this.name].arguments = customTriggers[this.name].defaultArguments
			customTriggers[this.name].status = false
		}
		}).setFps(1000)
	}

	trigger(args={"null": CustomTriggerRequiredArgument}) {
		if (typeof(args) != "object") {
			utils.errorLog("A custom trigger's args argument must be an Object")
			return
		}
		for (let arg in args) {
			let defaultArgumentsKeys = []
			for (let defaultArgument in customTriggers[this.name].defaultArguments) {
				defaultArgumentsKeys.push(defaultArgument)
			}
			if (!defaultArgumentsKeys.includes(arg)) {
				utils.errorLog("Argument "+arg+" does not exist in "+this.name)
				return
			}
			customTriggers[this.name].arguments[arg] = args[arg]
		}
		let argumentsValues = []
		for (let argument in customTriggers[this.name].arguments) {
			argumentsValues.push(customTriggers[this.name].arguments[argument])
		}
		if (argumentsValues.includes(CustomTriggerRequiredArgument)) {
			utils.errorLog(this.name+" has missing required arguments")
			return
		}
		customTriggers[this.name].status = true
	}
}

export function customRegister(trigger, callback) {
	customTriggers[trigger].callbacks.push(callback)

	return new class CustomRegister {
		unregister() {
			customTriggers[trigger].vanillaTrigger.unregister()
		}
		register() {
			customTriggers[trigger].vanillaTrigger.register()
		}
	}
}



