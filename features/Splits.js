import utils from "../utils"
import Settings from "../config.js"
import { editGui, elements, positions } from "./Gui.js"

//Define needed variables
let bloodOpened = false
let bloodCleared = false
let currentSplit="Nothing"
let bloodOpenTime=0.00
let bloodClearTime=0.00
let enterTime=0.00
let maxorTime=0.00
let stormTime=0.00
let term1Time=0.00
let term2Time=0.00
let term3Time=0.00
let term4Time=0.00
let goldorTime=0.00
let necronTime=0.00
let dragonsTime=0.00
let gateDestroyed = false
let allTermsDone = false

//Define needed constants
const bossStart=["[BOSS] Bonzo: Gratz for making it this far, but I’m basically unbeatable.", "[BOSS] Scarf: This is where the journey ends for you, Adventurers.", "[BOSS] The Professor: I was burdened with terrible news recently...", "[BOSS] Thorn: Welcome Adventurers! I am Thorn, the Spirit! And host of the Vegan Trials!", "[BOSS] Livid: Welcome, you arrive right on time. I am Livid, the Master of Shadows.", "[BOSS] Sadan: So you made it all the way here... Now you wish to defy me? Sadan?!"]
const bossEnd=["[BOSS] Bonzo: Alright, maybe I'm just weak after all..", "[BOSS] Scarf: Whatever...", "[BOSS] The Professor: What?! My Guardian power is unbeatable!", "CROWD: Whatttt? How did they win??", "[BOSS] Livid: Impossible! How did you figure out which one I was?!", "[BOSS] Sadan: NOOOOOOOOO!!! THIS IS IMPOSSIBLE!!"]
const watcherOpen = ["[BOSS] The Watcher: Congratulations, you made it through the Entrance.", "[BOSS] The Watcher: Ah, you've finally arrived.", "[BOSS] The Watcher: Ah, we meet again...", "[BOSS] The Watcher: So you made it this far... interesting.", "[BOSS] The Watcher: You've managed to scratch and claw your way here, eh?", "[BOSS] The Watcher: I'm starting to get tired of seeing you around here...", "[BOSS] The Watcher: Oh.. hello?", "[BOSS] The Watcher: Things feel a little more roomy now, eh?"]
const necronStart = ["[BOSS] Necron: Finally, I heard so much about you. The Eye likes you very much.", "[BOSS] Necron: You went further than any human before, congratulations."]
register("step", () => {
    //Return if Splits are disabled
    if (!Settings.Splits) {
        elements[1].setShouldRender(false)
        return
    }
    //Increment the timers
    if (currentSplit == "Enter") {
        if (!bloodOpened) {
            bloodOpenTime += 0.01
        }
        if (!bloodCleared && bloodOpened) {
            bloodClearTime += 0.01
        }
        if (bloodCleared && bloodOpened) {
            enterTime += 0.01
        }
    }
    if (currentSplit == "Maxor") {
        maxorTime += 0.01
    }
    if (currentSplit == "Storm") {
        stormTime += 0.01
    }
    if (currentSplit == "Term1") {
        term1Time += 0.01
    }
    if (currentSplit == "Term2") {
        term2Time += 0.01
    }
    if (currentSplit == "Term3") {
        term3Time += 0.01
    }
    if (currentSplit == "Term4") {
        term4Time += 0.01
    }
    if (currentSplit == "Goldor") {
        goldorTime += 0.01
    }
    if (currentSplit == "Necron") {
        necronTime += 0.01
    }
    if (currentSplit == "Dragons") {
        dragonsTime += 0.01
    }

    //If editing GUI Elements, set it to the preset
    if (editGui.isOpen()) {
        elements[1].setShouldRender(true)
        return
    }

    //Reset all variables if not in a dungeon
    if (utils.getDungeonFloor() == -1) {
        elements[1].setLine(0, "&cBlood Open: 0.00s")
        elements[1].getLine(0).setScale(positions.Splits.scale)
        elements[1].getLine(0).setShadow(true)
        elements[1].setLine(1, "&4Blood Clear: 0.00s &7(0.00s)")
        elements[1].getLine(1).setScale(positions.Splits.scale)
        elements[1].getLine(1).setShadow(true)
        elements[1].setLine(2, "&aEnter: 0.00s &7(0.00s)")
        elements[1].getLine(2).setScale(positions.Splits.scale)
        elements[1].getLine(2).setShadow(true)
        elements[1].setLine(3, "&bMaxor: 0.00s &7(0.00s)")
        elements[1].getLine(3).setScale(positions.Splits.scale)
        elements[1].getLine(3).setShadow(true)
        elements[1].setLine(4, "&dStorm: 0.00s &7(0.00s)")
        elements[1].getLine(4).setScale(positions.Splits.scale)
        elements[1].getLine(4).setShadow(true)
        elements[1].setLine(5, "&6Terminal Section 1: 0.00s &7(0.00s)")
        elements[1].getLine(5).setScale(positions.Splits.scale)
        elements[1].getLine(5).setShadow(true)
        elements[1].setLine(6, "&6Terminal Section 2: 0.00s &7(0.00s)")
        elements[1].getLine(6).setScale(positions.Splits.scale)
        elements[1].getLine(6).setShadow(true)
        elements[1].setLine(7, "&6Terminal Section 3: 0.00s &7(0.00s)")
        elements[1].getLine(7).setScale(positions.Splits.scale)
        elements[1].getLine(7).setShadow(true)
        elements[1].setLine(8, "&6Terminal Section 4: 0.00s &7(0.00s) (0.00s)")
        elements[1].getLine(8).setScale(positions.Splits.scale)
        elements[1].getLine(8).setShadow(true)
        elements[1].setLine(9, "&eGoldor: 0.00s &7(0.00s)")
        elements[1].getLine(9).setScale(positions.Splits.scale)
        elements[1].getLine(9).setShadow(true)
        elements[1].setLine(10, "&cNecron: 0.00s &7(0.00s)")
        elements[1].getLine(10).setScale(positions.Splits.scale)
        elements[1].getLine(10).setShadow(true)
        elements[1].setLine(11, "&5Dragons: 0.00s &7(0.00s)")
        elements[1].getLine(11).setScale(positions.Splits.scale)
        elements[1].getLine(11).setShadow(true)
        currentSplit = "Nothing"
        bloodOpened=false
        bloodCleared=false
        bloodOpenTime=0.00
        bloodClearTime=0.00
        enterTime=0.00
        maxorTime=0.00
        stormTime=0.00
        term1Time=0.00
        term2Time=0.00
        term3Time=0.00
        term4Time=0.00
        goldorTime=0.00
        necronTime=0.00
        dragonsTime=0.00
        elements[1].setShouldRender(false)
        return
    }

    //Determine phase
    try {
        sbMenu = Player.getInventory().getStackInSlot(8)
    } catch (error) {
        return
    }
    if (sbMenu == null) return
    if (sbMenu.getName().includes("Magical Map")) {
        if (currentSplit == "Nothing") {
            currentSplit = "Enter"
            utils.debugLog("&aEnter &7phase of dungeon started.")
            utils.debugLog("You are in Floor "+utils.getDungeonFloor())
        }            
    }

    //Update the GUI
    elements[1].setShouldRender(true)
    elements[1].setLine(0, "&cBlood Open: "+utils.formatSmallNumber(bloodOpenTime, 2)+"s")
    elements[1].getLine(0).setScale(positions.Splits.scale)
    elements[1].getLine(0).setShadow(true)
    elements[1].setLine(1, "&4Blood Clear: "+utils.formatSmallNumber(bloodClearTime, 2)+"s"+"&7 ("+utils.formatSmallNumber(bloodClearTime+bloodOpenTime, 2)+"s)")
    elements[1].getLine(1).setScale(positions.Splits.scale)
    elements[1].getLine(1).setShadow(true)
    elements[1].setLine(2, "&aEnter: "+utils.formatSmallNumber(enterTime, 2)+"s"+"&7 ("+utils.formatSmallNumber(bloodClearTime+bloodOpenTime+enterTime, 2)+"s)")
    elements[1].getLine(2).setScale(positions.Splits.scale)
    elements[1].getLine(2).setShadow(true)
    if (utils.getDungeonFloor() < 14 && utils.getDungeonFloor() != 7) {
        elements[1].setLine(3, "&bBoss: "+utils.formatSmallNumber(maxorTime, 2)+"s"+"&7 ("+utils.formatSmallNumber(bloodClearTime+bloodOpenTime+enterTime+maxorTime, 2)+"s)")
        elements[1].getLine(3).setScale(positions.Splits.scale)
        elements[1].getLine(3).setShadow(true)
        elements[1].setLine(4, "")
        elements[1].setLine(5, "")
        elements[1].setLine(6, "")
        elements[1].setLine(7, "")
        elements[1].setLine(8, "")
        elements[1].setLine(9, "")
        elements[1].setLine(10, "")
        elements[1].setLine(11, "")
        return
    }
    elements[1].setLine(3, "&bMaxor: "+utils.formatSmallNumber(maxorTime, 2)+"s"+"&7 ("+utils.formatSmallNumber(bloodClearTime+bloodOpenTime+enterTime+maxorTime, 2)+"s)")
    elements[1].getLine(3).setScale(positions.Splits.scale)
    elements[1].getLine(3).setShadow(true)
    elements[1].setLine(4, "&dStorm: "+utils.formatSmallNumber(stormTime, 2)+"s"+"&7 ("+utils.formatSmallNumber(bloodClearTime+bloodOpenTime+enterTime+maxorTime+stormTime, 2)+"s)")
    elements[1].getLine(4).setScale(positions.Splits.scale)
    elements[1].getLine(4).setShadow(true)
    elements[1].setLine(5, "&6Terminal Section 1: "+utils.formatSmallNumber(term1Time, 2)+"s"+"&7 ("+utils.formatSmallNumber(bloodClearTime+bloodOpenTime+enterTime+maxorTime+stormTime+term1Time, 2)+"s)")
    elements[1].getLine(5).setScale(positions.Splits.scale)
    elements[1].getLine(5).setShadow(true)
    elements[1].setLine(6, "&6Terminal Section 2: "+utils.formatSmallNumber(term2Time, 2)+"s"+"&7 ("+utils.formatSmallNumber(bloodClearTime+bloodOpenTime+enterTime+maxorTime+stormTime+term1Time+term2Time, 2)+"s)")
    elements[1].getLine(6).setScale(positions.Splits.scale)
    elements[1].getLine(6).setShadow(true)
    elements[1].setLine(7, "&6Terminal Section 3: "+utils.formatSmallNumber(term3Time, 2)+"s"+"&7 ("+utils.formatSmallNumber(bloodClearTime+bloodOpenTime+enterTime+maxorTime+stormTime+term1Time+term2Time+term3Time, 2)+"s)")
    elements[1].getLine(7).setScale(positions.Splits.scale)
    elements[1].getLine(7).setShadow(true)
    elements[1].setLine(8, "&6Terminal Section 4: "+utils.formatSmallNumber(term4Time, 2)+"s"+"&7 ("+utils.formatSmallNumber(term1Time+term2Time+term3Time+term4Time, 2)+"s) ("+utils.formatSmallNumber(bloodClearTime+bloodOpenTime+enterTime+maxorTime+stormTime+term1Time+term2Time+term3Time+term4Time, 2)+"s)")
    elements[1].getLine(8).setScale(positions.Splits.scale)
    elements[1].getLine(8).setShadow(true)
    elements[1].setLine(9, "&eGoldor: "+utils.formatSmallNumber(goldorTime, 2)+"s"+"&7 ("+utils.formatSmallNumber(bloodClearTime+bloodOpenTime+enterTime+maxorTime+stormTime+term1Time+term2Time+term3Time+term4Time+goldorTime, 2)+"s)")
    elements[1].getLine(9).setScale(positions.Splits.scale)
    elements[1].getLine(9).setShadow(true)
    elements[1].setLine(10, "&cNecron: "+utils.formatSmallNumber(necronTime, 2)+"s"+"&7 ("+utils.formatSmallNumber(bloodClearTime+bloodOpenTime+enterTime+maxorTime+stormTime+term1Time+term2Time+term3Time+term4Time+goldorTime+necronTime, 2)+"s)")
    elements[1].getLine(10).setScale(positions.Splits.scale)
    elements[1].getLine(10).setShadow(true)
    elements[1].setLine(11, "")
    if (utils.getDungeonFloor() < 14) return
    elements[1].setLine(11, "&5Dragons: "+utils.formatSmallNumber(dragonsTime, 2)+"s"+"&7 ("+utils.formatSmallNumber(bloodClearTime+bloodOpenTime+enterTime+maxorTime+stormTime+term1Time+term2Time+term3Time+term4Time+goldorTime+necronTime+dragonsTime, 2)+"s)")
    elements[1].getLine(11).setScale(positions.Splits.scale)
    elements[1].getLine(11).setShadow(true)
}).setFps(100)

//Update current split

//Blood enter/open
register("chat", (msg) => {
    msg = ChatLib.removeFormatting(msg)
    if (!watcherOpen.includes(msg)) {
        return
    }
    utils.chatLog("&cBlood Opened&7 in &a"+utils.formatSmallNumber(bloodOpenTime, 2)+"s")
    bloodOpened = true
}).setCriteria("${msg}")

//Blood clear
register("chat", () => {
    utils.chatLog("&4Blood Cleared &7in &a"+utils.formatSmallNumber(bloodClearTime, 2)+"s")
    bloodCleared = true
}).setCriteria("[BOSS] The Watcher: You have proven yourself. You may pass.")

//Non F7/M7 bosses start and end
register("chat", (msg) => {
    if (bossStart.includes(ChatLib.removeFormatting(msg))) {
        utils.chatLog("&aEnter &7phase of dungeon completed in "+utils.formatSmallNumber(enterTime, 2)+"s")
        utils.debugLog("&bBoss &7phase of dungeon started.")
        currentSplit = "Maxor"
    }
    if (bossEnd.includes(ChatLib.removeFormatting(msg))) {
        utils.chatLog("&bBoss &7phase of dungeon completed in "+utils.formatSmallNumber(enterTime, 2)+"s")
        utils.debugLog("&aDungeon Completed")
        currentSplit = "Nothing"
    }
}).setCriteria("${msg}")

//Maxor
register("chat", () => {
    utils.chatLog("&aEnter &7phase of dungeon completed in "+utils.formatSmallNumber(enterTime, 2)+"s")
    utils.debugLog("&bMaxor &7phase of dungeon started.")
    currentSplit="Maxor"
}).setCriteria("[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!")

//Storm
register("chat", () => {
    utils.chatLog("&bMaxor &7phase of dungeon completed in&a "+utils.formatSmallNumber(maxorTime, 2)+"s")
    utils.debugLog("&dStorm &7phase of dungeon started.")
    currentSplit="Storm"
}).setCriteria("[BOSS] Storm: Pathetic Maxor, just like expected.")

//Terminal Section 1
register("chat", () => {
    utils.chatLog("&dStorm &7phase of dungeon completed in&a "+utils.formatSmallNumber(stormTime, 2)+"s")
    utils.debugLog("&6Terminal Section 1 &7started.")
    currentSplit="Term1"
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")

register("tick", () => {
    //Terminal section 2
    if (currentSplit == "Term1" && gateDestroyed && allTermsDone) {
        allTermsDone = false
        setTimeout(() => {
            gateDestroyed = false
        }, 100)
        currentSplit = "Term2"
        utils.chatLog("&6Terminal Section 1 &7completed in&a "+utils.formatSmallNumber(term1Time, 2)+"s")
        utils.debugLog("&6Terminal Section 2 &7started.")
    //Terminal section 3
    } else if (currentSplit == "Term2" && gateDestroyed && allTermsDone) {
        allTermsDone = false
        setTimeout(() => {
            gateDestroyed = false
        }, 100)
        currentSplit = "Term3"
        utils.chatLog("&6Terminal Section 2 &7completed in&a "+utils.formatSmallNumber(term2Time, 2)+"s")
        utils.debugLog("&6Terminal Section 3 &7started.")
    //Terminal section 4
    } else if (currentSplit == "Term3" && gateDestroyed && allTermsDone) {
        allTermsDone = false
        setTimeout(() => {
            gateDestroyed = false
        }, 100)
        currentSplit = "Term4"
        utils.chatLog("&6Terminal Section 3 &7completed in&a "+utils.formatSmallNumber(term3Time, 2)+"s")
        utils.debugLog("&6Terminal Section 4 &7started.")
    //Goldor
    } else if (currentSplit == "Term4" && allTermsDone) {
        allTermsDone = false
        currentSplit = "Goldor"
        utils.chatLog("&6Terminal Section 4 &7completed in&a "+utils.formatSmallNumber(term4Time, 2)+"s")
        utils.chatLog("&6Terminals &7completed in &a"+utils.formatSmallNumber(term1Time+term2Time+term3Time+term4Time, 2)+"s")
        utils.debugLog("&eGoldor &7phase of dungeon started.")
    }
})

//Necron
register("chat", (msg) => {
    if (!necronStart.includes(ChatLib.removeFormatting(msg))) return
    utils.chatLog("&eGoldor &7phase of dungeon completed in "+utils.formatSmallNumber(goldorTime, 2)+"s")
    utils.debugLog("&cNecron &7phase of dungeon started.")
    currentSplit="Necron"
}).setCriteria("${msg}")

//Dragons/Necron end
register("chat", () => {
    utils.chatLog("&cNecron &7phase of dungeon completed in "+utils.formatSmallNumber(necronTime, 2)+"s")
    
    if (utils.getDungeonFloor() == 7) {
        currentSplit = "Nothing"
        utils.debugLog("&aDungeon completed")
        return
    }
    if (utils.getDungeonFloor() == 14) currentSplit = "Dragons"
    utils.debugLog("&5Dragons &7phase of dungeon started.")
}).setCriteria("[BOSS] Necron: All this, for nothing...")

//Dragons end
register("chat", (msg) => {
    if (!msg.endsWith("Incredible. You did what I couldn't do myself.")) return
    if (!msg.startsWith("[BOSS]")) return
    currentSplit = "Nothing"
    utils.chatLog("&5Dragons &7phase of dungeon completed in "+utils.formatSmallNumber(dragonsTime, 2)+"s")
    utils.debugLog("&aDungeon completed")
}).setCriteria("${msg}")

//All terminals in section done
register("chat", (message) => {
    message = message.split(" ")
    message = message[1]+" "+message[2]+" "+message[3]+" "+message[4]
    if (message.endsWith("(7/7)") || message.endsWith("(8/8)")) {
        allTermsDone = true
        utils.debugLog("All terminals in current section are done.")
    }
}).setCriteria("${message}")

//Gate blown
register("chat", () => {
    gateDestroyed = true
    utils.debugLog("The gate has been destroyed.")
}).setCriteria("The gate has been destroyed!")

export {currentSplit, gateDestroyed}
