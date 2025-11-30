import Settings from "../config.js"
import Utils from "../Utils.js"
import { getCurrentSplit } from "./Splits.js"

register("chat", (plr) => {
	if (ChatLib.removeFormatting(plr) != ChatLib.removeFormatting(Player.getName())) return
	if (Settings.crystalSound) {Utils.playSound("note.pling", 1, 2)}
	if (Settings.crystalTitle) {Utils.drawCustomTitle(Settings.crystalText, 500, 500, 500)}
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
	if (Settings.crystalPlaceSound) {Utils.playSound("note.pling", 1, 2)}
	if (Settings.crystalPlaceTitle) {Utils.drawCustomTitle(Settings.crystalPlaceText, 500, 500, 500)}
})