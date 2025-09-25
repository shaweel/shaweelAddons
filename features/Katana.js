import { editGui, elements, positions } from "./Gui.js"
import Settings from "../config.js"
import utils from "../utils.js"

//Define needed variables
countingDown = false
timer = 4
activated = null

register("packetReceived", () => {
    if (countingDown) {
        timer -= 0.05
    }
    if (!Settings.katanaHud) {
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
        //Skip all items that don't have a skyblock Id, and define the variables skyblockId and vanillaId
        index ++
        try {
            skyblockId = String(item.getNBT().getTag("tag").getTag("ExtraAttributes").getTag("id"))
            vanillaId = String(item.getNBT().getTag("id"))
        } catch (error) {
            continue
        }

        //Remove "" from Ids
        while (true) {
            if (!skyblockId.includes('"')) break
            skyblockId = skyblockId.replace('"', "")
        }
        while (true) {
            if (!vanillaId.includes('"')) break
            vanillaId = vanillaId.replace('"', "")
        }
        
        //Attempt to find a Katana in the hotbar
        if (skyblockId == "ATOMSPLIT_KATANA" || skyblockId == "VORPAL_KATANA" || skyblockId == "VOIDEDGE_KATANA") {
            //Skip the feature if multiple Katanas are present in one's hotbar
            katana.vanillaId = vanillaId
            katana.skyblockId = skyblockId
            break
        }
        continue
    }
    
    //Skip the feature if there are no Katanas present in one's hotbar
    if (katana.vanillaId == null && katana.skyblockId == null) {
        elements[0].setShouldRender(false)
        return
    }

    //Enable the GUI
    elements[0].setShouldRender(true)

    //Handle the feature
    if (katana.vanillaId == "minecraft:diamond_sword") {
        //Reset variables
        if (countingDown) countingDown = false
        timer = 4
        
        //Play the expiry sound if the activated variable just turned false
        if (activated == true) {
            utils.debugLog("The Katana's ability has just expired")
            if (Settings.expireSound) {World.playSound("note.pling", 1, 1)}
        }
        activated = false

        //Correct the GUI's text
        elements[0].setLine(0, "&cKatana Ability NOT activated")
        elements[0].getLine(0).setScale(positions.katanaHud.scale)
        elements[0].getLine(0).setShadow(true)
    }
    if (katana.vanillaId == "minecraft:golden_sword") {
        //Mark the ability as activated and start the countdown
        activated = true
        countingDown = true

        //Correct the GUI's text
        elements[0].setLine(0, "&aKatana Ability activated ("+utils.formatSmallNumber(timer, 1)+")")
        elements[0].getLine(0).setScale(positions.katanaHud.scale)
        elements[0].getLine(0).setShadow(true)
    }
}).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction)