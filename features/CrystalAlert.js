import Settings from "../config.js"
import Utils from "../Utils.js"

let crystalPickedUp = false
register("chat", (plr) => {
	if (ChatLib.removeFormatting(plr) != ChatLib.removeFormatting(Player.getName())) return
	crystalPickedUp = true
	if (Settings.crystalSound) {Utils.playSound("note.pling", 1, 2)}
	if (Settings.crystalTitle) {Utils.drawCustomTitle(Settings.crystalText, 500, 500, 500)}
}).setCriteria("${plr} picked up an Energy Crystal!")


register("tick", () => {
	if (!crystalPickedUp) return
	let lastSlot = Player.getInventory().getStackInSlot(8)
	if (!lastSlot) return
	lastSlot = ChatLib.removeFormatting(lastSlot.getName())
	if (lastSlot != "SkyBlock Menu (Click)") return
	crystalPickedUp = false
	if (Settings.crystalPlaceSound) {Utils.playSound("note.pling", 1, 2)}
	if (Settings.crystalPlaceTitle) {Utils.drawCustomTitle(Settings.crystalPlaceText, 500, 500, 500)}
})