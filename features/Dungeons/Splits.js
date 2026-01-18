import utils from "../../lib/Utils.js"
import Settings from "../../core/config.js"
import { CustomTrigger, CustomTriggerRequiredArgument } from "../../lib/CustomTriggers.js"
import { editGui, removeLine, setLine, setShouldRender } from "../../core/Gui.js"

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
let splitChanged = new CustomTrigger("splitChanged", {"oldSplit": CustomTriggerRequiredArgument, "newSplit": CustomTriggerRequiredArgument})

const bossStart=["[BOSS] Bonzo: Gratz for making it this far, but I'm basically unbeatable.", "[BOSS] Scarf: This is where the journey ends for you, Adventurers.", "[BOSS] The Professor: I was burdened with terrible news recently...", "[BOSS] Thorn: Welcome Adventurers! I am Thorn, the Spirit! And host of the Vegan Trials!", "[BOSS] Livid: Welcome, you've arrived right on time. I am Livid, the Master of Shadows.", "[BOSS] Sadan: So you made it all the way here... Now you wish to defy me? Sadan?!"]
const bossEnd=["[BOSS] Bonzo: Alright, maybe I'm just weak after all..", "[BOSS] Scarf: Whatever...", "[BOSS] The Professor: What?! My Guardian power is unbeatable!", , "[BOSS] Thorn: This is it... where shall I go now?", "Livid: Impossible! How did you figure out which one I was?!", "[BOSS] Sadan: NOOOOOOOOO!!! THIS IS IMPOSSIBLE!!"]
const watcherOpen = ["[BOSS] The Watcher: Congratulations, you made it through the Entrance.", "[BOSS] The Watcher: Ah, you've finally arrived.", "[BOSS] The Watcher: Ah, we meet again...", "[BOSS] The Watcher: So you made it this far... interesting.", "[BOSS] The Watcher: You've managed to scratch and claw your way here, eh?", "[BOSS] The Watcher: I'm starting to get tired of seeing you around here...", "[BOSS] The Watcher: Oh.. hello?", "[BOSS] The Watcher: Things feel a little more roomy now, eh?"]
const necronStart = ["[BOSS] Necron: Finally, I heard so much about you. The Eye likes you very much.", "[BOSS] Necron: You went further than any human before, congratulations."]

register("step", () => { 
	if (!Settings.splits) {
		setShouldRender("splits", false)
		return
	}

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

	if (editGui.isOpen()) {
		return
	}


	if (utils.getDungeonFloor() == -1) {
		if (!inDungeon) {
			setShouldRender("splits", false)
			return
		}
		setShouldRender("splits", false)
		inDungeon = false
		setLine("splits", 0, "&cBlood Open: 0.0s")
		setLine("splits", 1, "&4Blood Clear: 0.0s &7(0.0s)")
		setLine("splits", 2, "&aEnter: 0.0s &7(0.0s)")
		setLine("splits", 3, "&bMaxor: 0.0s &7(0.0s)")
		setLine("splits", 4, "&dStorm: 0.0s &7(0.0s)")
		setLine("splits", 5, "&6Terminal Section 1: 0.0s &7(0.0s)")
		setLine("splits", 6, "&6Terminal Section 2: 0.0s &7(0.0s)")
		setLine("splits", 7, "&6Terminal Section 3: 0.0s &7(0.0s)")
		setLine("splits", 8, "&6Terminal Section 4: 0.0s &7(0.0s) (0.0s)")
		setLine("splits", 9, "&eGoldor: 0.0s &7(0.0s)")
		setLine("splits", 10, "&cNecron: 0.0s &7(0.0s)")
		setLine("splits", 11, "&5Dragons: 0.0s &7(0.0s)")
		splitChanged.trigger({"oldSplit": currentSplit, "newSplit": "Nothing"})
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
	setShouldRender("splits", true)
	try {
		sbMenu = Player.getInventory().getStackInSlot(8)
	} catch (err) {
		return
	}
	if (sbMenu == null) return
	if (sbMenu.getName().includes("Magical Map")) {
		if (currentSplit == "Nothing" && !enterDone) {
			splitChanged.trigger({"oldSplit": currentSplit, "newSplit": "Enter"})
			currentSplit = "Enter"
			if (!Settings.splits) return
			utils.debugLog("&aEnter &7phase started.")
			utils.debugLog("You are in Floor "+utils.getDungeonFloor())
		}            
	}

	if (currentSplit == "Term1" && gateDestroyed && allTermsDone) {
		allTermsDone = false
		utils.clientSchedule(100, () => {
			gateDestroyed = false
		})	
		splitChanged.trigger({"oldSplit": currentSplit, "newSplit": "Term2"})
		currentSplit = "Term2"
		onlyGateMissing = false
		
		if (!Settings.splits) return
		if (Settings.sendSplits) ChatLib.say("[shaweelAddons] Terminal Section 1 completed in "+utils.formatSmallNumber(timers.term1, 2)+"s")
		utils.chatLog("&6Terminal Section 1 &7completed in&a "+utils.formatSmallNumber(timers.term1, 2)+"s")
		utils.debugLog("&6Terminal Section 2 &7started.")
	} else if (currentSplit == "Term2" && gateDestroyed && allTermsDone) {
		allTermsDone = false
		utils.clientSchedule(100, () => {
			gateDestroyed = false
		})
		splitChanged.trigger({"oldSplit": currentSplit, "newSplit": "Term3"})
		currentSplit = "Term3"
		onlyGateMissing = false
		if (!Settings.splits) return
		if (Settings.sendSplits) ChatLib.say("[shaweelAddons] Terminal Section 2 completed in "+utils.formatSmallNumber(timers.term2, 2)+"s")
		utils.chatLog("&6Terminal Section 2 &7completed in&a "+utils.formatSmallNumber(timers.term2, 2)+"s")
		utils.debugLog("&6Terminal Section 3 &7started.")
	} else if (currentSplit == "Term3" && gateDestroyed && allTermsDone) {
		allTermsDone = false
		utils.clientSchedule(100, () => {
			gateDestroyed = false
		})
		splitChanged.trigger({"oldSplit": currentSplit, "newSplit": "Term4"})
		currentSplit = "Term4"
		onlyGateMissing = false
		if (!Settings.splits) return
		if (Settings.sendSplits) ChatLib.say("[shaweelAddons] Terminal Section 3 completed in "+utils.formatSmallNumber(timers.term3, 2)+"s")
		utils.chatLog("&6Terminal Section 3 &7completed in&a "+utils.formatSmallNumber(timers.term3, 2)+"s")
		utils.debugLog("&6Terminal Section 4 &7started.")
	} else if (currentSplit == "Term4" && allTermsDone) {
		allTermsDone = false
		splitChanged.trigger({"oldSplit": currentSplit, "newSplit": "Goldor"})
		currentSplit = "Goldor"
		onlyGateMissing = false
		if (!Settings.splits) return
		if (Settings.sendSplits) ChatLib.say("[shaweelAddons] Terminal Section 4 completed in "+utils.formatSmallNumber(timers.term4, 2)+"s")
		if (Settings.sendSplits) ChatLib.say("[shaweelAddons] Terminals completed in "+utils.formatSmallNumber(timers.term1+timers.term2+timers.term3+timers.term4, 2)+"s")
		utils.chatLog("&6Terminal Section 4 &7completed in&a "+utils.formatSmallNumber(timers.term4, 2)+"s")
		utils.chatLog("&6Terminals &7completed in &a"+utils.formatSmallNumber(timers.term1+timers.term2+timers.term3+timers.term4, 2)+"s")
		utils.debugLog("&eGoldor &7phase started.")
	}

	setShouldRender("splits", true)
	setLine("splits", 0, "&cBlood Open: "+utils.formatSmallNumber(timers.bloodOpen, 2)+"s")
	setLine("splits", 1, "&4Blood Clear: "+utils.formatSmallNumber(timers.bloodClear, 2)+"s"+"&7 ("+utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen, 2)+"s)")
	setLine("splits", 2, "&aEnter: "+utils.formatSmallNumber(timers.enter, 2)+"s"+"&7 ("+utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter, 2)+"s)")
	if (utils.getDungeonFloor() < 14 && utils.getDungeonFloor() != 7) {
		setLine("splits", 3, "&bBoss: "+utils.formatSmallNumber(timers.maxor, 2)+"s"+"&7 ("+utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor, 2)+"s)")
		removeLine("splits", 4)
		removeLine("splits", 5)
		removeLine("splits", 6)
		removeLine("splits", 7)
		removeLine("splits", 8)
		removeLine("splits", 9)
		removeLine("splits", 10)
		removeLine("splits", 11)
		return
	}
	setLine("splits", 3, "&bMaxor: "+utils.formatSmallNumber(timers.maxor, 2)+"s"+"&7 ("+utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor, 2)+"s)")
	setLine("splits", 4, "&dStorm: "+utils.formatSmallNumber(timers.storm, 2)+"s"+"&7 ("+utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor+timers.storm, 2)+"s)")
	setLine("splits", 5, "&6Terminal Section 1: "+utils.formatSmallNumber(timers.term1, 2)+"s"+"&7 ("+utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor+timers.storm+timers.term1, 2)+"s)")
	setLine("splits", 6, "&6Terminal Section 2: "+utils.formatSmallNumber(timers.term2, 2)+"s"+"&7 ("+utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor+timers.storm+timers.term1+timers.term2, 2)+"s)")
	setLine("splits", 7, "&6Terminal Section 3: "+utils.formatSmallNumber(timers.term3, 2)+"s"+"&7 ("+utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor+timers.storm+timers.term1+timers.term2+timers.term3, 2)+"s)")
	setLine("splits", 8, "&6Terminal Section 4: "+utils.formatSmallNumber(timers.term4, 2)+"s"+"&7 ("+utils.formatSmallNumber(timers.term1+timers.term2+timers.term3+timers.term4, 2)+"s) ("+utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor+timers.storm+timers.term1+timers.term2+timers.term3+timers.term4, 2)+"s)")
	setLine("splits", 9, "&eGoldor: "+utils.formatSmallNumber(timers.goldor, 2)+"s"+"&7 ("+utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor+timers.storm+timers.term1+timers.term2+timers.term3+timers.term4+timers.goldor, 2)+"s)")
	setLine("splits", 10, "&cNecron: "+utils.formatSmallNumber(timers.necron, 2)+"s"+"&7 ("+utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor+timers.storm+timers.term1+timers.term2+timers.term3+timers.term4+timers.goldor+timers.necron, 2)+"s)")
	removeLine("splits", 11)
	if (utils.getDungeonFloor() < 14) return
	setLine("splits", 11, "&5Dragons: "+utils.formatSmallNumber(timers.dragons, 2)+"s"+"&7 ("+utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor+timers.storm+timers.term1+timers.term2+timers.term3+timers.term4+timers.goldor+timers.necron+timers.dragons, 2)+"s)")
}).setFps(100)

register("chat", (msg) => {
	if (!Settings.splits) return
	msg = ChatLib.removeFormatting(msg)
	if (!watcherOpen.includes(msg)) {
		return
	}
	utils.chatLog("&cBlood Opened&7 in &a"+utils.formatSmallNumber(timers.bloodOpen, 2)+"s")
	ChatLib.say("[shaweelAddons] Blood Opened in "+utils.formatSmallNumber(timers.bloodOpen, 2)+"s")
	bloodOpened = true
}).setCriteria("${msg}")

register("chat", () => {
	if (!Settings.splits) return
	utils.chatLog("&4Blood Cleared &7in &a"+utils.formatSmallNumber(timers.bloodClear, 2)+"s")
	ChatLib.say("[shaweelAddons] Blood Cleared in "+utils.formatSmallNumber(timers.bloodClear, 2)+"s")
	bloodCleared = true
}).setCriteria("[BOSS] The Watcher: You have proven yourself. You may pass.")

register("chat", (msg) => {
	msg = ChatLib.removeFormatting(msg)
	if (bossStart.includes(msg)) {
		enterDone = true
		splitChanged.trigger({"oldSplit": currentSplit, "newSplit": "Maxor"})
		currentSplit = "Maxor"
		if (!Settings.splits) return
		utils.chatLog("&aEnter &7phase completed in "+utils.formatSmallNumber(timers.enter, 2)+"s")
		if (Settings.sendSplits) ChatLib.say("[shaweelAddons] Enter phase completed in "+utils.formatSmallNumber(timers.enter, 2)+"s")
		utils.debugLog("&bBoss &7phase started.")
	}
	if (msg.includes("Livid: Impossible! How did you figure out which one I was?!")) {
		splitChanged.trigger({"oldSplit": currentSplit, "newSplit": "Nothing"})
		currentSplit = "Nothing"
		if (!Settings.splits) return
		utils.chatLog("&bBoss &7phase completed in "+utils.formatSmallNumber(timers.maxor, 2)+"s")
		if (Settings.sendSplits) ChatLib.say("[shaweelAddons] Boss phase completed in "+utils.formatSmallNumber(timers.maxor, 2)+"s")
		utils.debugLog("&aDungeon Completed")
	}


	if (bossEnd.includes(msg) || (msg.startsWith("                      ☠ Defeated Thorn in ") && utils.getDungeonFloor() == 11 && currentSplit == "Boss")) {
		splitChanged.trigger({"oldSplit": currentSplit, "newSplit": "Nothing"})
		currentSplit = "Nothing"
		if (!Settings.splits) return
		if (Settings.sendSplits) ChatLib.say("[shaweelAddons] Boss phase completed in "+utils.formatSmallNumber(timers.maxor, 2)+"s")
		utils.chatLog("&bBoss &7phase completed in "+utils.formatSmallNumber(timers.maxor, 2)+"s")
		utils.debugLog("&aDungeon Completed")
	}
}).setCriteria("${msg}")

register("chat", () => {
	enterDone = true
	splitChanged.trigger({"oldSplit": currentSplit, "newSplit": "Maxor"})
	currentSplit = "Maxor"
	if (Settings.splits) {
		if (Settings.sendSplits) ChatLib.say("[shaweelAddons] Enter phase completed in "+utils.formatSmallNumber(timers.enter, 2)+"s")
		utils.chatLog("&aEnter &7phase completed in "+utils.formatSmallNumber(timers.enter, 2)+"s")
		utils.debugLog("&bMaxor &7phase started.")
	}
	if (utils.getDungeonClass() !== "Archer") return
	if (utils.getDungeonFloor() !== 7) return
	if (!Settings.cmtitle) return
	utils.drawCustomTitle("&4&lGET MILESTONE 3", 500, 1500, 500)
	utils.playSound("random.anvil_land", 1, 1)
}).setCriteria("[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!")

register("chat", () => {
	if (!Settings.splits) return
	splitChanged.trigger({"oldSplit": currentSplit, "newSplit": "Storm"})
	currentSplit = "Storm"
	if (Settings.sendSplits) ChatLib.say("[shaweelAddons] Maxor phase completed in "+utils.formatSmallNumber(timers.maxor, 2)+"s")
	utils.chatLog("&bMaxor &7phase completed in&a "+utils.formatSmallNumber(timers.maxor, 2)+"s")
	utils.debugLog("&dStorm &7phase started.")
}).setCriteria("[BOSS] Storm: Pathetic Maxor, just like expected.")

register("chat", () => {
	splitChanged.trigger({"oldSplit": currentSplit, "newSplit": "Term1"})
	currentSplit = "Term1"
	allTermsDone = false
	gateDestroyed = false
	onlyGateMissing = false
	lastHowmanyeth = 0
	lastTotal = 0
	if (!Settings.splits) return
	if (Settings.sendSplits) ChatLib.say("[shaweelAddons] Storm phase completed in "+utils.formatSmallNumber(timers.storm, 2)+"s")
	utils.debugLog("&6Terminal Section 1 &7started.")
	utils.chatLog("&dStorm &7phase completed in&a "+utils.formatSmallNumber(timers.storm, 2)+"s")
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")

register("chat", (msg) => {
	if (!necronStart.includes(ChatLib.removeFormatting(msg))) return
	splitChanged.trigger({"oldSplit": currentSplit, "newSplit": "Necron"})
	currentSplit = "Necron"
	if (!Settings.splits) return
	if (Settings.sendSplits) ChatLib.say("[shaweelAddons] Goldor phase completed in "+utils.formatSmallNumber(timers.goldor, 2)+"s")
	utils.chatLog("&eGoldor &7phase completed in "+utils.formatSmallNumber(timers.goldor, 2)+"s")
	utils.debugLog("&cNecron &7phase started.")

}).setCriteria("${msg}")

register("chat", () => {
	if (utils.getDungeonFloor() == 7) {
		splitChanged.trigger({"oldSplit": currentSplit, "newSplit": "Nothing"})
		currentSplit = "Nothing"
		utils.debugLog("&aDungeon completed")
		if (!Settings.splits) return
		if (Settings.sendSplits) ChatLib.say("[shaweelAddons] Necron phase completed in "+utils.formatSmallNumber(timers.necron, 2)+"s")
		utils.chatLog("&cNecron &7phase completed in "+utils.formatSmallNumber(timers.necron, 2)+"s")
		utils.debugLog("&5Dragons &7phase started.")
		return
	}
	if (utils.getDungeonFloor() != 14) return
	splitChanged.trigger({"oldSplit": currentSplit, "newSplit": "Dragons"})
	currentSplit = "Dragons"
	if (!Settings.splits) return
	if (Settings.sendSplits) ChatLib.say("[shaweelAddons] Necron phase completed in "+utils.formatSmallNumber(timers.necron, 2)+"s")
	utils.chatLog("&cNecron &7phase completed in "+utils.formatSmallNumber(timers.necron, 2)+"s")
	utils.debugLog("&5Dragons &7phase started.")
}).setCriteria("[BOSS] Necron: All this, for nothing...")

register("chat", (msg) => {
	if (!msg.endsWith("Incredible. You did what I couldn't do myself.")) return
	if (!msg.startsWith("[BOSS]")) return
	splitChanged.trigger({"oldSplit": currentSplit, "newSplit": "Nothing"})
	currentSplit = "Nothing"
	if (!Settings.splits) return
	if (Settings.sendSplits) ChatLib.say("[shaweelAddons] Dragons phase completed in "+utils.formatSmallNumber(timers.dragons, 2)+"s")
	utils.chatLog("&5Dragons &7phase completed in "+utils.formatSmallNumber(timers.dragons, 2)+"s")
	utils.debugLog("&aDungeon completed")
}).setCriteria("${msg}")

register("chat", (message) => {
	message = message.split(" ")
	message = message[1]+" "+message[2]+" "+message[3]+" "+message[4]
	if (message.endsWith("(7/7)") || message.endsWith("(8/8)")) {
		allTermsDone = true
		utils.debugLog("All terminals in current section are done.")
	}
}).setCriteria("${message}")

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
	setShouldRender("splits", false)
	inDungeon = false
	setLine("splits", 0, "&cBlood Open: 0.0s")
	setLine("splits", 1, "&4Blood Clear: 0.0s &7(0.0s)")
	setLine("splits", 2, "&aEnter: 0.0s &7(0.0s)")
	setLine("splits", 3, "&bMaxor: 0.0s &7(0.0s)")
	setLine("splits", 4, "&dStorm: 0.0s &7(0.0s)")
	setLine("splits", 5, "&6Terminal Section 1: 0.0s &7(0.0s)")
	setLine("splits", 6, "&6Terminal Section 2: 0.0s &7(0.0s)")
	setLine("splits", 7, "&6Terminal Section 3: 0.0s &7(0.0s)")
	setLine("splits", 8, "&6Terminal Section 4: 0.0s &7(0.0s) (0.0s)")
	setLine("splits", 9, "&eGoldor: 0.0s &7(0.0s)")
	setLine("splits", 10, "&cNecron: 0.0s &7(0.0s)")
	setLine("splits", 11, "&5Dragons: 0.0s &7(0.0s)")
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
