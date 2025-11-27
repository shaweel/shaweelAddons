import {request} from "requestV2"
import Utils from "../Utils.js"

(() => {
	let currentVersion = "1.0.0"
	try {
		currentVersion = FileLib.read("./config/ChatTriggers/modules/shaweelAddons/metadata.json")
		currentVersion = JSON.parse(currentVersion)
		currentVersion = currentVersion.version
	} catch (err) {
		Utils.errorLog(err)
		Utils.errorLog("Failed to retrieve the current shaweelAddons version, aborting the Update Checker.")
		return
	}
	let latestVersion = "1.0.0"
	request({
		url: "https://raw.githubusercontent.com/shaweel/shaweelAddons/refs/heads/ctjs-1.8.9/metadata.json",
		json: true
	}).then(data => {
		latestVersion = data.version
		if (currentVersion !== latestVersion) {
			Utils.chatLog("&c&lWARNING: &r&cYou are currently using an outdated version of shaweelAddons!")
			Utils.chatLog("Current Version: &c"+currentVersion)
			Utils.chatLog("Latest Version: &a"+latestVersion)
			Utils.chatLog("&cIt is highly advised to update!")
			ChatLib.chat(new TextComponent("&d[shaweelAddons] &lClick to update!").setClick("open_url", "https://github.com/shaweel/shaweelAddons/releases/latest"))
		}
	})
	Utils.debugLog("Debug mode is currently &aactivated &7meaning you will recieve debug messages, as to what is internally happening in the module, to deactivate it, run &a/shaweeladdons debugmode")
})()