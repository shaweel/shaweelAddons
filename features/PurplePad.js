import Settings from "../config.js"
import Utils from "../Utils.js"

let padding = false
let padTimer = 0

const ENTER_PAD = 3.5
const EXIT_PAD = 4.6
const msgs = ["[BOSS] Storm: ENERGY HEED MY CALL!", "[BOSS] Storm: THUNDER LET ME BE YOUR CATALYST!"]

register("packetReceived", () => {
	if (!Settings.padTitle && !Settings.padSound) return
	if (!padding) return

	padTimer += 0.05

	padTimer = Utils.roundToDecimals(padTimer, 2)

	if (padTimer >= ENTER_PAD && padTimer <= ENTER_PAD+0.05) {
		if (Settings.padTitle) Client.showTitle("&dEnter Pad", "", "3", "5", "3")
		if (Settings.padSound) Utils.playSound("note.pling", 1, 2)
	}

	if (padTimer >= EXIT_PAD && padTimer <= EXIT_PAD+0.05) {
		if (Settings.padTitle) Client.showTitle("&dExit Pad", "", "3", "5", "3")
		if (Settings.padSound) Utils.playSound("note.pling", 1, 2)
	}

	if (padTimer > EXIT_PAD) {
		padding = false
		padTimer = 0
	}
}).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction)


register("chat", (msg) => {
	if (!Settings.padTitle && !Settings.padSound) return
	if (!msgs.includes(msg)) return
	Utils.debugLog(Utils.getDungeonClass())
	if (Settings.padTank && Utils.getDungeonClass() !== "Tank") return
	padding = true
}).setCriteria("${msg}")