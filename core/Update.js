import {request} from "requestV2"
import utils from "../lib/Utils.js"

function compareVersion(v1, v2) {
	let versions1 = v1.split(".")
	let versions2 = v2.split(".")
	for (let index = 0; index <= Math.max(versions1.length, versions2.length); index++) {
		let version1 = versions1?.[index]
		let version2 = versions2?.[index]
		if (version1 == undefined && version2 == undefined) return "="
		if (version1 == undefined) return "<"
		if (version2 == undefined) return ">"
		if (version1 > version2) return ">"
		if (version1 < version2) return "<"
	}
	return "="
}


let checked = false
register("step", () => {
	if (checked) return
	checked = true
	let currentVersion = "1.0.0"
	try {
		currentVersion = FileLib.read("shaweelAddons", "metadata.json")
		currentVersion = JSON.parse(currentVersion)
		currentVersion = currentVersion.version
	} catch (err) {
		utils.errorLog(err)
		utils.errorLog("Failed to retrieve the current shaweelAddons version, aborting the Update Checker.")
		return
	}
	let latestVersion = "1.0.0"
	request({
		url: "https://raw.githubusercontent.com/shaweel/shaweelAddons/refs/heads/ctjs-1.8.9/metadata.json",
		json: true
	}).then(data => {
		latestVersion = data.version
		if (compareVersion(currentVersion, latestVersion) === "<") {
			utils.chatLog("&c&lWARNING: &r&cYou are currently using an outdated version of shaweelAddons!")
			utils.chatLog("Current Version: &c"+currentVersion)
			utils.chatLog("Latest Version: &a"+latestVersion)
			utils.chatLog("&cIt is highly advised to update!")
			ChatLib.chat(new TextComponent("&d[shaweelAddons] &lClick to update!").setClick("open_url", "https://github.com/shaweel/shaweelAddons/releases/latest"))
			utils.chatLog("You can read about how to safely update without erasing configuration")
			ChatLib.chat(new TextComponent("&d[shaweelAddons] &7on the &d&lGitHub &a&lREADME &r&7file").setClick("open_url", "https://github.com/shaweel/shaweelAddons/blob/ctjs-1.8.9/README.md"))
			ChatLib.chat(new TextComponent("&d[shaweelAddons] &7or on my &9&lDiscord server").setClick("open_url", "https://discord.gg/znuZAaT4tv"))
		}
	})
	utils.debugLog("Debug mode is currently &aactivated &7meaning you will recieve debug messages, as to what is internally happening in the module, to deactivate it, run &a/shaweeladdons debugmode")
}).setFps(1000)
