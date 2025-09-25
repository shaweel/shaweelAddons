import { currentSplit } from "./Splits"
import Settings from "../config.js"
import utils from "../utils.js"

//Define needed constants
const pssSound = new Sound({source: "shaweeladdons.ssFail.ogg"})
const requirementSets = [["restart", "rs", "reset", "slow", "broke"], ["ss", "dev", "simon says", "simonsays", "device"]]

function resetSSAlert() {
    //Return if both SS related settings are off
    if (!Settings.sstitle && !Settings.sssound) return

    //Alert SS reset
    if (Settings.sstitle == true)
        Client.showTitle(Settings.sstext, "", "5", "20", "5")
    if (Settings.sssound == true)
        pssSound.play()
}

function isValidBadSS(msg) {
    //Absolute unreadable tomfoolery (it works, source: just trust me bro)
    if (!msg.includes(":")) return false
    msg = msg.split(":")[1]

    for (let requirementSet of requirementSets) {
        let passed = false
        for (let requirement of requirementSet) {
            if (msg.includes(requirement) == false) continue
            passed = true
            break
        }
        if (passed == false) return false
    }
    return true
}

register("chat", (message) => {
    //Return if both SS related settings are off
    if (!Settings.sstitle && !Settings.sssound) return
    
    //Return if the message is undefined, not valid for SS reset, or you aren't in 1st Terminal Section
    if (message == undefined) return
    message = message.toLowerCase()
    if (isValidBadSS(message) == false) return
    if (currentSplit != "Term1") return

    //Alert SS reset
    utils.debugLog("Alerting SS Reset, source: "+message)
    resetSSAlert()
}).setCriteria("${message}")
