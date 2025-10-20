import { getCurrentSplit, getGateDestroyed } from "./Splits.js"
import Settings from "../config.js"
import utils from "../utils.js"

//Define needed variables
let blowGateAlert = false
let TermsDone = 0
let LeversDone = 0
let oldSplit = "Term0"
let playerName = Player.getName()

register("tick", () => {
    if (!Settings.gateSound && !Settings.gateTitle) return
    let currentSplit = getCurrentSplit()
    let gateDestroyed = getGateDestroyed()
    if (oldSplit != currentSplit) {
        oldSplit = currentSplit
        TermsDone = 0
        LeversDone = 0
    }
    //Return if the reminder is not supposed to play or the gate is destroyed
    if (!blowGateAlert) return
    if (gateDestroyed) {
        blowGateAlert = false
        return
    }

    //Remind to blow gate
    if (Settings.gateSound) {
        utils.playSound("note.pling", 1, 2)
    }
    if (Settings.gateTitle) {
        Client.showTitle(Settings.gateText, "", "0", "5", "10")
    }
})

//Count TermsDone up when you do a terminal
register("chat", (player) => {
    if (player != playerName) return
    TermsDone+=1
    utils.debugLog("Player has activated a terminal.")
}).setCriteria("${player} activated a terminal! (${amount}/${max})")

//Count LeversDone when you activate a lever and turn the alert on appropriately
register("chat", (player) => {
    let currentSplit = getCurrentSplit()
    let gateDestroyed = getGateDestroyed()
    if (player != playerName) return
    LeversDone+=1
    //Alert to blow gate whenever the player has done two levers in Terminal Section 1 or 3
    if ((currentSplit === "Term1" || currentSplit === "Term3") && LeversDone === 2 && !gateDestroyed) {
        utils.debugLog("Player has activated both levers in S1/S3, alerting blow gate.")
        blowGateAlert = true
    }
    //Alert to blow gate whenever the player has done one lever and no terminals in Terminal Section 2
    if (currentSplit === "Term2" && LeversDone === 1 && !gateDestroyed && TermsDone === 0) {
        utils.debugLog("Player has activated a lever in S2 and hasn't done any terminal, alerting blow gate.")
        blowGateAlert = true
    }
}).setCriteria("${player} activated a lever! (${amount}/${max})")