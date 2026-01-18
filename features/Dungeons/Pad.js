import Settings from "../../core/config.js"
import utils from "../../lib/Utils.js"

const ENTER_PURPLE_PAD = 70
const EXIT_PURPLE_PAD = 92
const msgs = ["[BOSS] Storm: ENERGY HEED MY CALL!", "[BOSS] Storm: THUNDER LET ME BE YOUR CATALYST!"]


/**
 * Gets if the player is playing on a class that is enabled to work with the pad alert of the corresponding color
 * @param {String} color The pad color - either purple or yellow
 * @returns {Boolean} result
 */
function getAllowedClass(color) {
	color = color.toLowerCase()
	if (!["purple", "yellow"].includes(color)) {
		utils.errorLog("Invalid pad color: "+color+"(green pad is not supported)")
	}
	let clazz = utils.getDungeonClass()
	return (Settings[color+"Pad"+clazz])
}

register("chat", (msg) => {
	if (!msgs.includes(msg) || !getAllowedClass("purple")) return
	utils.serverSchedule(ENTER_PURPLE_PAD, () => {
		if (Settings.purplePadTitle) utils.drawCustomTitle("&dEnter Pad", 100, 250, 100)
		if (Settings.purplePadSound) utils.playSound("note.pling", 1, 2)
	})
	utils.serverSchedule(EXIT_PURPLE_PAD, () => {
		if (Settings.purplePadTitle) utils.drawCustomTitle("&dExit Pad", 100, 250, 100)
		if (Settings.purplePadSound) utils.playSound("note.pling", 1, 2)
	})
}).setCriteria("${msg}")

register("chat", () => {
	if (!getAllowedClass("yellow")) return
	if (Settings.yellowPadTitle) utils.drawCustomTitle("&eEnter Pad", 100, 250, 100)
	if (Settings.yellowPadSound) utils.playSound("note.pling", 1, 2)
}).setCriteria("⚠ Storm is enraged! ⚠")