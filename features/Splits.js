import utils from "../utils.js"
import Settings from "../config.js"
import { editGui, elements, positions, removeLine, setLine, setShouldRender } from "./Gui.js"

//Define needed variables
let bloodOpened = false
let bloodCleared = false
let enterDone = false
let currentSplit="Nothing"
let timers = {
    bloodOpen:0,
    bloodClear:0,
    enter:0,
    maxor:0,
    storm:0,
    term1:0,
    term2:0,
    term3:0,
    term4:0,
    goldor:0,
    necron:0,
    dragons:0
}
    
let gateDestroyed = false
let allTermsDone = false
let inDungeon = false

//Define needed constants
const bossStart=["[BOSS] Bonzo: Gratz for making it this far, but I’m basically unbeatable.", "[BOSS] Scarf: This is where the journey ends for you, Adventurers.", "[BOSS] The Professor: I was burdened with terrible news recently...", "[BOSS] Thorn: Welcome Adventurers! I am Thorn, the Spirit! And host of the Vegan Trials!", "[BOSS] Livid: Welcome, you've arrived right on time. I am Livid, the Master of Shadows.", "[BOSS] Sadan: So you made it all the way here... Now you wish to defy me? Sadan?!"]
const bossEnd=["[BOSS] Bonzo: Alright, maybe I'm just weak after all..", "[BOSS] Scarf: Whatever...", "[BOSS] The Professor: What?! My Guardian power is unbeatable!", "CROWD: Whatttt? How did they win??", "Livid: Impossible! How did you figure out which one I was?!", "[BOSS] Sadan: NOOOOOOOOO!!! THIS IS IMPOSSIBLE!!"]
const watcherOpen = ["[BOSS] The Watcher: Congratulations, you made it through the Entrance.", "[BOSS] The Watcher: Ah, you've finally arrived.", "[BOSS] The Watcher: Ah, we meet again...", "[BOSS] The Watcher: So you made it this far... interesting.", "[BOSS] The Watcher: You've managed to scratch and claw your way here, eh?", "[BOSS] The Watcher: I'm starting to get tired of seeing you around here...", "[BOSS] The Watcher: Oh.. hello?", "[BOSS] The Watcher: Things feel a little more roomy now, eh?"]
const necronStart = ["[BOSS] Necron: Finally, I heard so much about you. The Eye likes you very much.", "[BOSS] Necron: You went further than any human before, congratulations."]


register("step", () => { 
    //Return if Splits are disabled
    if (!Settings.Splits) {
        elements[1].setShouldRender(false)
        setShouldRender(1, false)
        return
    }

    //Increment the timers
    if (currentSplit === "Enter") {
        if (!bloodOpened) {
            timers.bloodOpen += 0.01
        }
        if (!bloodCleared && bloodOpened) {
            timers.bloodClear += 0.01
        }
        if (bloodCleared && bloodOpened) {
            timers.enter += 0.01
        }
    } else {
        timers[currentSplit.toLowerCase()] += 0.01
    }

    //If editing GUI Elements, set it to the preset
    if (editGui.isOpen()) {
        elements[2].setShouldRender(true)
        return
    }


    //Reset all variables if not in a dungeon
    if (utils.getDungeonFloor() == -1) {
        if (!inDungeon) {
            setShouldRender(1, false)
            return
        }
        setShouldRender(1, false)
        inDungeon = false
        setLine(1, 0, "&cBlood Open: 0.0s")
        setLine(1, 1, "&4Blood Clear: 0.0s &7(0.0s)")
        setLine(1, 2, "&aEnter: 0.0s &7(0.0s)")
        setLine(1, 3, "&bMaxor: 0.0s &7(0.0s)")
        setLine(1, 4, "&dStorm: 0.0s &7(0.0s)")
        setLine(1, 5, "&6Terminal Section 1: 0.0s &7(0.0s)")
        setLine(1, 6, "&6Terminal Section 2: 0.0s &7(0.0s)")
        setLine(1, 7, "&6Terminal Section 3: 0.0s &7(0.0s)")
        setLine(1, 8, "&6Terminal Section 4: 0.0s &7(0.0s) (0.0s)")
        setLine(1, 9, "&eGoldor: 0.0s &7(0.0s)")
        setLine(1, 10, "&cNecron: 0.0s &7(0.0s)")
        setLine(1, 11, "&5Dragons: 0.0s &7(0.0s)")
        currentSplit = "Nothing"
        utils.debugLog("Not in dungeon")
        bloodOpened=false
        enterDone = false
        bloodCleared=false
        for (timer of Object.keys(timers)) {
            timers[timer] = 0
        }
        return
    }

    inDungeon = true
    setShouldRender(1, true)
    //Determine phase
    try {
        sbMenu = Player.getInventory().getStackInSlot(8)
    } catch (error) {
        return
    }
    if (sbMenu == null) return
    if (sbMenu.getName().includes("Magical Map")) {
        if (currentSplit == "Nothing" && !enterDone) {
            currentSplit = "Enter"
            utils.debugLog("&aEnter &7phase of dungeon started.")
            utils.debugLog("You are in Floor "+utils.getDungeonFloor())
        }            
    }

    //Terminal section 2
    if (currentSplit == "Term1" && gateDestroyed && allTermsDone) {
        allTermsDone = false
        setTimeout(() => {
            gateDestroyed = false
        }, 100)
        currentSplit = "Term2"
        utils.chatLog("&6Terminal Section 1 &7completed in&a "+utils.formatSmallNumber(timers.term1, 2)+"s")
        utils.debugLog("&6Terminal Section 2 &7started.")
    //Terminal section 3
    } else if (currentSplit == "Term2" && gateDestroyed && allTermsDone) {
        allTermsDone = false
        setTimeout(() => {
            gateDestroyed = false
        }, 100)
        currentSplit = "Term3"
        utils.chatLog("&6Terminal Section 2 &7completed in&a "+utils.formatSmallNumber(timers.term2, 2)+"s")
        utils.debugLog("&6Terminal Section 3 &7started.")
    //Terminal section 4
    } else if (currentSplit == "Term3" && gateDestroyed && allTermsDone) {
        allTermsDone = false
        setTimeout(() => {
            gateDestroyed = false
        }, 100)
        currentSplit = "Term4"
        utils.chatLog("&6Terminal Section 3 &7completed in&a "+utils.formatSmallNumber(timers.term3, 2)+"s")
        utils.debugLog("&6Terminal Section 4 &7started.")
    //Goldor
    } else if (currentSplit == "Term4" && allTermsDone) {
        allTermsDone = false
        currentSplit = "Goldor"
        utils.chatLog("&6Terminal Section 4 &7completed in&a "+utils.formatSmallNumber(timers.term4, 2)+"s")
        utils.chatLog("&6Terminals &7completed in &a"+utils.formatSmallNumber(timers.term1+timers.term2+timers.term3+timers.term4, 2)+"s")
        utils.debugLog("&eGoldor &7phase of dungeon started.")
    }

    //Update the GUI
    if (!elements[1].getShouldRender()) {
        setShouldRender(1, true)
    }
    setLine(1, 0, "&cBlood Open: "+utils.formatSmallNumber(timers.bloodOpen, 2)+"s")
    setLine(1, 1, "&4Blood Clear: "+utils.formatSmallNumber(timers.bloodClear, 2)+"s"+"&7 ("+utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen, 2)+"s)")
    setLine(1, 2, "&aEnter: "+utils.formatSmallNumber(timers.enter, 2)+"s"+"&7 ("+utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter, 2)+"s)")
    if (utils.getDungeonFloor() < 14 && utils.getDungeonFloor() != 7) {
        setLine(1, 3, "&bBoss: "+utils.formatSmallNumber(timers.maxor, 2)+"s"+"&7 ("+utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor, 2)+"s)")
        removeLine(1, 4)
        removeLine(1, 5)
        removeLine(1, 6)
        removeLine(1, 7)
        removeLine(1, 8)
        removeLine(1, 9)
        removeLine(1, 10)
        removeLine(1, 11)
        return
    }
    setLine(1, 3, "&bMaxor: "+utils.formatSmallNumber(timers.maxor, 2)+"s"+"&7 ("+utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor, 2)+"s)")
    setLine(1, 4, "&dStorm: "+utils.formatSmallNumber(timers.storm, 2)+"s"+"&7 ("+utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor+timers.storm, 2)+"s)")
    setLine(1, 5, "&6Terminal Section 1: "+utils.formatSmallNumber(timers.term1, 2)+"s"+"&7 ("+utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor+timers.storm+timers.term1, 2)+"s)")
    setLine(1, 6, "&6Terminal Section 2: "+utils.formatSmallNumber(timers.term2, 2)+"s"+"&7 ("+utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor+timers.storm+timers.term1+timers.term2, 2)+"s)")
    setLine(1, 7, "&6Terminal Section 3: "+utils.formatSmallNumber(timers.term3, 2)+"s"+"&7 ("+utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor+timers.storm+timers.term1+timers.term2+timers.term3, 2)+"s)")
    setLine(1, 8, "&6Terminal Section 4: "+utils.formatSmallNumber(timers.term4, 2)+"s"+"&7 ("+utils.formatSmallNumber(timers.term1+timers.term2+timers.term3+timers.term4, 2)+"s) ("+utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor+timers.storm+timers.term1+timers.term2+timers.term3+timers.term4, 2)+"s)")
    setLine(1, 9, "&eGoldor: "+utils.formatSmallNumber(timers.goldor, 2)+"s"+"&7 ("+utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor+timers.storm+timers.term1+timers.term2+timers.term3+timers.term4+timers.goldor, 2)+"s)")
    setLine(1, 10, "&cNecron: "+utils.formatSmallNumber(timers.necron, 2)+"s"+"&7 ("+utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor+timers.storm+timers.term1+timers.term2+timers.term3+timers.term4+timers.goldor+timers.necron, 2)+"s)")
    removeLine(1, 11)
    if (utils.getDungeonFloor() < 14) return
    setLine(1, 11, "&5Dragons: "+utils.formatSmallNumber(timers.dragons, 2)+"s"+"&7 ("+utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor+timers.storm+timers.term1+timers.term2+timers.term3+timers.term4+timers.goldor+timers.necron+timers.dragons, 2)+"s)")
}).setFps(100)

//Blood enter/open
register("chat", (msg) => {
    msg = ChatLib.removeFormatting(msg)
    if (!watcherOpen.includes(msg)) {
        return
    }
    utils.chatLog("&cBlood Opened&7 in &a"+utils.formatSmallNumber(timers.bloodOpen, 2)+"s")
    bloodOpened = true
}).setCriteria("${msg}")

//Blood clear
register("chat", () => {
    utils.chatLog("&4Blood Cleared &7in &a"+utils.formatSmallNumber(timers.bloodClear, 2)+"s")
    bloodCleared = true
}).setCriteria("[BOSS] The Watcher: You have proven yourself. You may pass.")

//Non F7/M7 bosses start and end
register("chat", (msg) => {
    if (bossStart.includes(ChatLib.removeFormatting(msg))) {
        utils.chatLog("&aEnter &7phase of dungeon completed in "+utils.formatSmallNumber(timers.enter, 2)+"s")
        utils.debugLog("&bBoss &7phase of dungeon started.")
        enterDone = true
        currentSplit = "Maxor"
    }
    if (ChatLib.removeFormatting(msg).includes("Livid: Impossible! How did you figure out which one I was?!")) {
        utils.chatLog("&bBoss &7phase of dungeon completed in "+utils.formatSmallNumber(timers.maxor, 2)+"s")
        utils.debugLog("&aDungeon Completed")
        currentSplit = "Nothing"
    }
    if (bossEnd.includes(ChatLib.removeFormatting(msg))) {
        utils.chatLog("&bBoss &7phase of dungeon completed in "+utils.formatSmallNumber(timers.maxor, 2)+"s")
        utils.debugLog("&aDungeon Completed")
        currentSplit = "Nothing"
    }
}).setCriteria("${msg}")

//Maxor
register("chat", () => {
    utils.chatLog("&aEnter &7phase of dungeon completed in "+utils.formatSmallNumber(timers.enter, 2)+"s")
    utils.debugLog("&bMaxor &7phase of dungeon started.")
    enterDone = true
    currentSplit="Maxor"
    if (utils.getDungeonClass() !== "Archer") return
    if (utils.getDungeonFloor() !== 7) return
    if (!Settings.cmtitle) return
    Client.showTitle("&4&lGET MILESTONE 3", "", "0", "144000", "0")
    utils.playSound("random.anvil_land", 1, 1)
}).setCriteria("[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!")

//Storm
register("chat", () => {
    utils.chatLog("&bMaxor &7phase of dungeon completed in&a "+utils.formatSmallNumber(timers.maxor, 2)+"s")
    utils.debugLog("&dStorm &7phase of dungeon started.")
    currentSplit="Storm"
}).setCriteria("[BOSS] Storm: Pathetic Maxor, just like expected.")

//Terminal Section 1
register("chat", () => {
    utils.chatLog("&dStorm &7phase of dungeon completed in&a "+utils.formatSmallNumber(timers.storm, 2)+"s")
    utils.debugLog("&6Terminal Section 1 &7started.")
    currentSplit="Term1"
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")

//Necron
register("chat", (msg) => {
    if (!necronStart.includes(ChatLib.removeFormatting(msg))) return
    utils.chatLog("&eGoldor &7phase of dungeon completed in "+utils.formatSmallNumber(timers.goldor, 2)+"s")
    utils.debugLog("&cNecron &7phase of dungeon started.")
    currentSplit="Necron"
}).setCriteria("${msg}")

//Dragons/Necron end
register("chat", () => {
    utils.chatLog("&cNecron &7phase of dungeon completed in "+utils.formatSmallNumber(timers.necron, 2)+"s")
    
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
    utils.chatLog("&5Dragons &7phase of dungeon completed in "+utils.formatSmallNumber(timers.dragons, 2)+"s")
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

function getCurrentSplit() {
    return currentSplit
}

function getGateDestroyed() {
    return gateDestroyed
}

register("chat", () => {
    setShouldRender(1, false)
    inDungeon = false
    setLine(1, 0, "&cBlood Open: 0.0s")
    setLine(1, 1, "&4Blood Clear: 0.0s &7(0.0s)")
    setLine(1, 2, "&aEnter: 0.0s &7(0.0s)")
    setLine(1, 3, "&bMaxor: 0.0s &7(0.0s)")
    setLine(1, 4, "&dStorm: 0.0s &7(0.0s)")
    setLine(1, 5, "&6Terminal Section 1: 0.0s &7(0.0s)")
    setLine(1, 6, "&6Terminal Section 2: 0.0s &7(0.0s)")
    setLine(1, 7, "&6Terminal Section 3: 0.0s &7(0.0s)")
    setLine(1, 8, "&6Terminal Section 4: 0.0s &7(0.0s) (0.0s)")
    setLine(1, 9, "&eGoldor: 0.0s &7(0.0s)")
    setLine(1, 10, "&cNecron: 0.0s &7(0.0s)")
    setLine(1, 11, "&5Dragons: 0.0s &7(0.0s)")
    currentSplit = "Nothing"
    utils.debugLog("Not in dungeon")
    bloodOpened=false
    bloodCleared=false
    for (timer of Object.keys(timers)) {
        timers[timer] = 0
    }
    enterDone = false
    return
}).setCriteria("Starting in 4 seconds.")


export {getCurrentSplit, getGateDestroyed}
