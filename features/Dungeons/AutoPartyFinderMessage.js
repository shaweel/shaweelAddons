import Settings from "../../core/config.js"
import utils from "../../lib/Utils.js"

register("chat", (player, dungeonClass, level) => {
	if (player == Player.getName()) {
		utils.debugLog("You joined a party finder party")
		return
	}

	utils.debugLog("A player joined the party finder party")
	let timeout = Number(Settings.pfMsgDelay)
	if (isNaN(timeout)) {
		utils.errorLog("Unable to read Party Finder Auto Message Delay number, defaulting to 500ms")
		timeout = 500
	}

	if (!Settings.pfMsg) return
	utils.clientSchedule(timeout, () => {
		ChatLib.command("pc "+Settings.pfMsgMsg)
	})
}).setCriteria("Party Finder > ${player} joined the dungeon group! (${dungeonClass} Level ${level})")