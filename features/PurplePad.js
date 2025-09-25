import Settings from "../config.js"
import utils from "../utils.js"

padding = false
padTimer = 0
register("packetReceived", () => {  //Every server side tick
    //Return if pad related settings are disabled
    if (!Settings.padTitle && !Settings.padSound) return

    //Add 0.05 to the timer if you're currently padding
    if (padding) {
        padTimer += 0.05
    }
    padTimer = utils.roundToDecimals(padTimer, 2)
    if (Settings.padTitle && padTimer == 3.5) {
        Client.showTitle("&dEnter Pad", "", "3", "5", "3")
    }
    if (Settings.padSound && padTimer == 3.5) {
        World.playSound("note.pling", 1, 2)
    }
    if (Settings.padTitle && padTimer == 4.6) {
        Client.showTitle("&dExit Pad", "", "3", "5", "3")
    }
    if (Settings.padSound && padTimer == 4.6) {
        World.playSound("note.pling", 1, 2)
    }
    //Cancel padding after it ended
    if (padTimer > 4.6) {
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