import { getCurrentSplit } from "./Splits.js"
import Settings from "../config.js"
import utils from "../utils.js"

//Define needed constants
const pssSound = new Sound({source: "shaweeladdons.ssFail.ogg"})
const requirementSets = [["restart", "rs", "reset", "slow", "broke"], ["ss", "dev", "simon says", "simonsays", "device"]]

function resetSSAlert() {
    //Return if both SS related settings are off
    if (!Settings.sstitle && !Settings.sssound) return

    //Alert SS reset
    if (Settings.sstitle) Client.showTitle(Settings.sstext, "", "5", "20", "5")
    if (Settings.sssound) pssSound.play()
}

function isValidBadSS(msg) {
    //Absolute unreadable tomfoolery (it works, source: just trust me bro)
    if (!msg.includes(":")) return false
    let message = msg.split(":")[1].toLowerCase()
    return requirementSets.every(requirementSet => requirementSet.some(req => message.includes(req)))
}

register("chat", (message) => {
    if (!Settings.sstitle && !Settings.sssound) return
    if (message == undefined) return
    if (!isValidBadSS(message)) return    
    if (getCurrentSplit() !== "Term1") return

    utils.debugLog("Alerting SS Reset, source: "+message)
    resetSSAlert()
}).setCriteria("${message}")
