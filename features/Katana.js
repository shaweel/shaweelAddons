import { editGui, elements, getLines, positions, setLine, setShouldRender } from "./Gui.js"
import Settings from "../config.js"
import Utils from "../Utils.js"

let countingDown = false
let timer = 4
let activated = null

register("packetReceived", () => {
	if (countingDown) {
		timer -= 0.05
	}
	if (!Settings.katanaHud) {
		setShouldRender(0, false)
		elements[0].setShouldRender(false)
		return
	}
	if (editGui.isOpen()) {
		elements[0].setShouldRender(true)
		return
	}
	let items = []
	items[0] = Player.getInventory().getStackInSlot(0)
	items[1] = Player.getInventory().getStackInSlot(1)
	items[2] = Player.getInventory().getStackInSlot(2)
	items[3] = Player.getInventory().getStackInSlot(3)
	items[4] = Player.getInventory().getStackInSlot(4)
	items[5] = Player.getInventory().getStackInSlot(5)
	items[6] = Player.getInventory().getStackInSlot(6)
	items[7] = Player.getInventory().getStackInSlot(7)
	let index = -1
	let katana = {vanillaId: null, skyblockId: null} 
	
	for (let item of items) {
		index ++
		try {
			skyblockId = String(item.getNBT().getTag("tag").getTag("ExtraAttributes").getTag("id"))
			vanillaId = String(item.getNBT().getTag("id"))
		} catch (err) {
			continue
		}

		skyblockId = skyblockId.replaceAll('"', "")
		vanillaId = vanillaId.replaceAll('"', "")
		
		if (skyblockId == "ATOMSPLIT_KATANA" || skyblockId == "VORPAL_KATANA" || skyblockId == "VOIDEDGE_KATANA") {
			katana.vanillaId = vanillaId
			katana.skyblockId = skyblockId
			break
		}
		continue
	}
	
	if (katana.vanillaId == null && katana.skyblockId == null) {
		setShouldRender(0, false)
		return
	}

	setShouldRender(0, true)

	if (katana.vanillaId == "minecraft:diamond_sword") {
		if (countingDown) countingDown = false
		timer = 4
		
		if (activated == true) {
			Utils.debugLog("The Katana's ability has just expired")
			if (Settings.expireSound) {Utils.playSound("note.pling", 1, 1)}
		}
		activated = false
		setLine(0, 0, "&cKatana Ability NOT activated")
	}
	if (katana.vanillaId == "minecraft:golden_sword") {
		activated = true
		countingDown = true
		setLine(0, 0, "&aKatana Ability activated ("+Utils.formatSmallNumber(timer, 1)+")")
	}
}).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction)