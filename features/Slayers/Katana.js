import { editGui, setLine, setShouldRender } from "../../core/Gui.js"
import Settings from "../../core/config.js"
import utils from "../../lib/Utils.js"

let activated = false
let ticks = 80

register("packetReceived", () => {
	if (activated) ticks --
	if (ticks < 0) ticks = 80

	if (!Settings.katanaHud) {
		setShouldRender("katanaHud", false)
		return
	}

	if (editGui.isOpen()) return


	let items = []
	for (let index = 0; index <= 7; index++) {
		items[index] = Player.getInventory().getStackInSlot(index)
	}
	let katana = {}
	
	for (let index in items) {
		let item = items[index]
		let skyblockId, minecraftId
		try {
			skyblockId = String(item.getNBT().getTag("tag").getTag("ExtraAttributes").getTag("id")).replaceAll('"', "")
			minecraftId = String(item.getNBT().getTag("id")).replaceAll('"', "")
		} catch (err) {continue}

		if (skyblockId == "ATOMSPLIT_KATANA" || skyblockId == "VORPAL_KATANA" || skyblockId == "VOIDEDGE_KATANA") {
			katana.minecraftId = minecraftId
			katana.skyblockId = skyblockId
			break
		}
		continue
	}
	
	if (katana.minecraftId == null && katana.skyblockId == null) {
		setShouldRender("katanaHud", false)
		return
	}


	setShouldRender("katanaHud", true)
	if (katana.minecraftId == "minecraft:diamond_sword") {
		if (activated) activated = false
		ticks = 80

		setLine("katanaHud", 0, "&d&lSoulcry: &c✖")
	}

	if (katana.minecraftId == "minecraft:golden_sword") {
		activated = true
		let time = -1
		let color = "[COLOR CODE]"
		let unit = "[TIME UNIT]"

		if (ticks > 1.15) time += color = "a"
		else if (ticks > 0.35) color = "6"
		else timeText = time += color = "c"

		if (Settings.katanaTimeUnit == 2) time = Math.round(ticks)
		else if (Settings.katanaTimeUnit == 1) Math.round(ticks*50, 0)
		else if (Settings.katanaTimeUnit == 0) utils.formatSmallNumber(ticks/20, 2)
		
		if (Settings.katanaTimeUnit == 2) unit = "t"
		if (Settings.katanaTimeUnit == 1) unit = "ms"
		if (Settings.katanaTimeUnit == 0) unit = "s"
		if (!Settings.showUnitKatana) unit = ""
		
		setLine("katanaHud", 0, "&d&lSoulcry: &a✔️ &7(&"+color+time+unit+"&7)")
	}
}).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction)