import Settings from "../../core/config.js"
import utils from "../../lib/Utils.js"
import { getCurrentSplit } from "./Splits.js"

register("chat", (plr) => {
	if (ChatLib.removeFormatting(plr) != ChatLib.removeFormatting(Player.getName())) return
	if (Settings.crystalSound) {utils.playSound("note.pling", 1, 2)}
	if (Settings.crystalTitle) {utils.drawCustomTitle(Settings.crystalText, 250, 500, 250)}
}).setCriteria("${plr} picked up an Energy Crystal!")

let crystalPickedUp = false
register("tick", () => {
	let lastSlot = Player.getInventory().getStackInSlot(8)
	if (!lastSlot) return
	lastSlot = ChatLib.removeFormatting(lastSlot.getName())
	if (getCurrentSplit() != "Maxor") return
	if (!crystalPickedUp) {
		if (lastSlot == "Energy Crystal") crystalPickedUp = true
		return
	}
	if (lastSlot != "SkyBlock Menu (Click)") return
	crystalPickedUp = false
	if (Settings.crystalPlaceSound) {utils.playSound("note.pling", 1, 2)}
	if (Settings.crystalPlaceTitle) {utils.drawCustomTitle(Settings.crystalPlaceText, 250, 500, 250)}
})