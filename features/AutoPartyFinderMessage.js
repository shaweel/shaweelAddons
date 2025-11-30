import Settings from "../config.js"
import Utils from "../Utils.js"

register("chat", (player, dungeonClass, level) => {
	if (player == Player.getName()) {
		Utils.debugLog("You joined a party finder party")
		return
	}

	Utils.debugLog("A player joined the party finder party")
	let timeout = Number(Settings.pfMsgDelay)
	if (isNaN(timeout)) {
		Utils.errorLog("Unable to read Party Finder Auto Message Delay number, defaulting to 500ms")
		timeout = 500
	}

	if (!Settings.pfMsg) return
	setTimeout(() => {
		ChatLib.command("pc "+Settings.pfMsgMsg)
	}, timeout);
	
}).setCriteria("Party Finder > ${player} joined the dungeon group! (${dungeonClass} Level ${level})")