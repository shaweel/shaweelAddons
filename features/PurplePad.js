import Settings from "../config.js"
import utils from "../utils.js"

let padding = false
let padTimer = 0

const ENTER_PAD = 3.5
const EXIT_PAD = 4.6

register("packetReceived", () => {  //Every server side tick
    //Return if pad related settings are disabled
    if (!Settings.padTitle && !Settings.padSound) return
    if (!padding) return

    padTimer += 0.05

    padTimer = utils.roundToDecimals(padTimer, 2)

    if (padTimer >= ENTER_PAD && padTimer <= ENTER_PAD+0.05) {
        if (Settings.padTitle) Client.showTitle("&dEnter Pad", "", "3", "5", "3")
        if (Settings.padSound) utils.playSound("note.pling", 1, 2)
    }

    if (padTimer >= EXIT_PAD && padTimer <= EXIT_PAD+0.05) {
        if (Settings.padTitle) Client.showTitle("&dExit Pad", "", "3", "5", "3")
        if (Settings.padSound) utils.playSound("note.pling", 1, 2)
    }

    //Cancel padding after it ended
    if (padTimer > EXIT_PAD) {
        padding = false
        padTimer = 0
    }
}).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction) //Every server side tick

//Start padding when lightning hits
register("chat", () => {
    //Return if pad related settings are disabled
    if (!Settings.padTitle && !Settings.padSound) return
    
    //Don't pad if you aren't tank and tank only is enabled
    if (Settings.padTank) {
        if (utils.getDungeonClass() != "Tank") {
            return
        }
    }
    padding = true
}).setCriteria("Storm's Giga Lightning hit you for ${dmg} true damage.")