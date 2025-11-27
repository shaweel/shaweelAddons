import Utils from "../Utils.js"
import Settings from "../config.js"
import { customRegister } from "./CustomTriggers.js"
import { getCurrentSplit, getGateDestroyed } from "./Splits.js"

const playerName = Player.getName()
let gateTitle = Utils.drawCustomTitle("", 0, 0, 0)
let termsDone = 0
let leversDone = 0
let currentlyAlertToBlowTheGate = false
let titleGenerated = false

register("tick", () => {
	if ((!Settings.gateSound && !Settings.gateTitle) || !currentlyAlertToBlowTheGate) return
	
	if (Settings.gateSound) {
		Utils.playSound("note.pling", 1, 2)
	}

	if (Settings.gateTitle && !titleGenerated) {
		titleGenerated = true
		gateTitle = Utils.drawCustomTitle(Settings.gateText, 0, 72000, 10)
	}
})

customRegister("splitChanged", () => {
	termsDone = 0
	leversDone = 0
})

register("chat", () => {
	gateTitle.erase()
	currentlyAlertToBlowTheGate = false
}).setCriteria("The gate has been destroyed!")

register("chat", (player) => {
	if (player != playerName) return
	termsDone+=1
	Utils.debugLog("Player has activated a terminal.")
}).setCriteria("${player} activated a terminal! (${amount}/${max})")

register("chat", (player) => {
	if (player != playerName) return
	const currentSplit = getCurrentSplit()
	const gateDestroyed = getGateDestroyed()
	leversDone+=1
	if ((currentSplit === "Term1" || currentSplit === "Term3") && leversDone === 2 && !gateDestroyed) {
		Utils.debugLog("Player has activated both levers in S1/S3, alerting blow gate.")
		currentlyAlertToBlowTheGate = true
		titleGenerated = false
	}
	if (currentSplit === "Term2" && leversDone === 1 && !gateDestroyed && termsDone === 0) {
		Utils.debugLog("Player has activated a lever in S2 and hasn't done any terminal, alerting blow gate.")
		currentlyAlertToBlowTheGate = true
		titleGenerated = false
	}
}).setCriteria("${player} activated a lever! (${amount}/${max})")