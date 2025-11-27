import Utils from "../Utils.js"
import Settings from "../config.js"
import { CustomTrigger } from "./CustomTriggers.js"
import { editGui, elements, removeLine, setLine, setShouldRender } from "./Gui.js"

const dev2 = {x:60, y:132, z:140}
const dev3 = {x:1, y:120, z:77}
const dev4 = {x:63, y:127, z:35}

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
let blowGateAlert = false
let splitChanged = new CustomTrigger("splitChanged")

//Define needed constants
const bossStart=["[BOSS] Bonzo: Gratz for making it this far, but I’m basically unbeatable.", "[BOSS] Scarf: This is where the journey ends for you, Adventurers.", "[BOSS] The Professor: I was burdened with terrible news recently...", "[BOSS] Thorn: Welcome Adventurers! I am Thorn, the Spirit! And host of the Vegan Trials!", "[BOSS] Livid: Welcome, you've arrived right on time. I am Livid, the Master of Shadows.", "[BOSS] Sadan: So you made it all the way here... Now you wish to defy me? Sadan?!"]
const bossEnd=["[BOSS] Bonzo: Alright, maybe I'm just weak after all..", "[BOSS] Scarf: Whatever...", "[BOSS] The Professor: What?! My Guardian power is unbeatable!", "CROWD: Whatttt? How did they win??", "Livid: Impossible! How did you figure out which one I was?!", "[BOSS] Sadan: NOOOOOOOOO!!! THIS IS IMPOSSIBLE!!"]
const watcherOpen = ["[BOSS] The Watcher: Congratulations, you made it through the Entrance.", "[BOSS] The Watcher: Ah, you've finally arrived.", "[BOSS] The Watcher: Ah, we meet again...", "[BOSS] The Watcher: So you made it this far... interesting.", "[BOSS] The Watcher: You've managed to scratch and claw your way here, eh?", "[BOSS] The Watcher: I'm starting to get tired of seeing you around here...", "[BOSS] The Watcher: Oh.. hello?", "[BOSS] The Watcher: Things feel a little more roomy now, eh?"]
const necronStart = ["[BOSS] Necron: Finally, I heard so much about you. The Eye likes you very much.", "[BOSS] Necron: You went further than any human before, congratulations."]

function triggerSectionComplete() {
	Utils.drawCustomTitle("&aSection complete", 500, 750, 500)
	Utils.playSound("note.pling", 1, 2)
	Utils.debugLog("&aSection complete")
}

let lastHowmanyeth = 0
let lastTotal = 0
let onlyGateMissing = false
termCompactor = register("renderTitle", (title, subtitle, e) =>  {
	if (subtitle.includes("|")) return //Return on custom titles

	const player = subtitle.split(" ")[0]

	let amount = subtitle.split("(")[1]
	if (!amount == undefined) {
		amount=amount.split(")")[0]
	}
	amount=ChatLib.removeFormatting(amount)

	const howmanyeth = amount[0]
	const total = amount[2]
	let time = 72000

	//Set the time to 30 ticks if it's the last action
	if ((howmanyeth == total && (gateDestroyed || currentSplit == "Term4" || currentSplit == "Goldor")) ||
	(lastHowmanyeth == lastTotal && [7, 8].includes(lastTotal))){
		time = 30
	}

	if (howmanyeth == total && !(gateDestroyed || currentSplit == "Term4" || currentSplit == "Goldor")) {
		onlyGateMissing = true
	}

	if (howmanyeth == lastHowmanyeth && !subtitle.includes("Pre") && subtitle.includes("device")) { //When it's a instant device
		let pre = NaN
		let players = World.getAllPlayers()
		let playerMP = {}
		for (let plr of players) {
			if (plr.getName() == ChatLib.removeFormatting(player)) {
				playerMP = plr
				break
			}
		}
		let playerCoordinates
		try {
			playerCoordinates = {x: playerMP.getX(), y: playerMP.getY(), z: playerMP.getZ()}
		} catch (err) {
			e.setCanceled(true)
			Client.showTitle("", player+"&7 | &eUnknown Instant Device", 0, time, 10) //Unfixable - Hypixel caps render distance
			return
		}

		const distance2 = Utils.calculate3DDistanceFromPointAToPointBInTheShortestPossibleStraightLine(
			dev2.x, dev2.y, dev2.z,
			playerCoordinates.x, playerCoordinates.y, playerCoordinates.z
		)
		const distance3 = Utils.calculate3DDistanceFromPointAToPointBInTheShortestPossibleStraightLine(
			dev3.x, dev3.y, dev3.z,
			playerCoordinates.x, playerCoordinates.y, playerCoordinates.z
		)
		const distance4 = Utils.calculate3DDistanceFromPointAToPointBInTheShortestPossibleStraightLine(
			dev4.x, dev4.y, dev4.z,
			playerCoordinates.x, playerCoordinates.y, playerCoordinates.z
		)
		const closestDistance = Math.min(distance2, distance3, distance4)
		if (closestDistance == distance2) pre="2"
		if (closestDistance == distance3) pre="3"
		if (closestDistance == distance4) pre="4"

		e.setCanceled(true)
		Client.showTitle("", player+"&7 | &ePre"+pre, 0, time, 10)
		
		if (howmanyeth != "u") {
			lastHowmanyeth = howmanyeth
			lastTotal = total
		}
		return
	}
	if (howmanyeth != "u") {
		lastHowmanyeth = howmanyeth
		lastTotal = total
	}
	if (subtitle.includes("terminal")) {
		e.setCanceled(true)
		Client.showTitle("", player+"&7 | &eTerm &7| &c"+howmanyeth+"&a/"+total, 0, time, 10)
		return
	}
	if (subtitle.includes("lever")) {
		e.setCanceled(true)
		Client.showTitle("", player+"&7 | &eLever &7| &c"+howmanyeth+"&a/"+total, 0, time, 10)
		return
	}
	if (subtitle.includes("device")) {
		e.setCanceled(true)
		Client.showTitle("", player+"&7 | &eDevice &7| &c"+howmanyeth+"&a/"+total, 0, time, 10)
		return
	}
	if (subtitle.includes("The gate has been destroyed")) {
		e.setCanceled(true)
		if (onlyGateMissing) {
			onlyGateMissing = false
			time = 30
		}
		Client.showTitle("", "&eGate destroyed", 0, time, 10)
		return
	}
	if (subtitle.includes("The gate will open in 5 seconds!") || subtitle.includes("The Core entrance is opening!")) {
		e.setCanceled(true)
		return
	}
})
termCompactor.unregister()

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
	if (Utils.getDungeonFloor() == -1) {
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
		Utils.debugLog("Not in dungeon")
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
	} catch (err) {
		return
	}
	if (sbMenu == null) return
	if (sbMenu.getName().includes("Magical Map")) {
		if (currentSplit == "Nothing" && !enterDone) {
			currentSplit = "Enter"
			splitChanged.trigger()
			if (!Settings.Splits) return
			Utils.debugLog("&aEnter &7phase of dungeon started.")
			Utils.debugLog("You are in Floor "+Utils.getDungeonFloor())
		}            
	}

	//Terminal section 2
	if (currentSplit == "Term1" && gateDestroyed && allTermsDone) {
		allTermsDone = false
		setTimeout(() => {
			gateDestroyed = false
		}, 100)
		currentSplit = "Term2"
		splitChanged.trigger()
		triggerSectionComplete()
		if (!Settings.Splits) return
		Utils.chatLog("&6Terminal Section 1 &7completed in&a "+Utils.formatSmallNumber(timers.term1, 2)+"s")
		Utils.debugLog("&6Terminal Section 2 &7started.")
	//Terminal section 3
	} else if (currentSplit == "Term2" && gateDestroyed && allTermsDone) {
		allTermsDone = false
		setTimeout(() => {
			gateDestroyed = false
		}, 100)
		currentSplit = "Term3"
		splitChanged.trigger()
		triggerSectionComplete()
		if (!Settings.Splits) return
		Utils.chatLog("&6Terminal Section 2 &7completed in&a "+Utils.formatSmallNumber(timers.term2, 2)+"s")
		Utils.debugLog("&6Terminal Section 3 &7started.")
	//Terminal section 4
	} else if (currentSplit == "Term3" && gateDestroyed && allTermsDone) {
		allTermsDone = false
		setTimeout(() => {
			gateDestroyed = false
		}, 100)
		currentSplit = "Term4"
		splitChanged.trigger()
		triggerSectionComplete()
		if (!Settings.Splits) return
		Utils.chatLog("&6Terminal Section 3 &7completed in&a "+Utils.formatSmallNumber(timers.term3, 2)+"s")
		Utils.debugLog("&6Terminal Section 4 &7started.")
	//Goldor
	} else if (currentSplit == "Term4" && allTermsDone) {
		allTermsDone = false
		currentSplit = "Goldor"
		splitChanged.trigger()
		triggerSectionComplete()
		if (!Settings.Splits) return
		Utils.chatLog("&6Terminal Section 4 &7completed in&a "+Utils.formatSmallNumber(timers.term4, 2)+"s")
		Utils.chatLog("&6Terminals &7completed in &a"+Utils.formatSmallNumber(timers.term1+timers.term2+timers.term3+timers.term4, 2)+"s")
		Utils.debugLog("&eGoldor &7phase of dungeon started.")
	}

	//Update the GUI
	if (!elements[1].getShouldRender()) {
		setShouldRender(1, true)
	}
	setLine(1, 0, "&cBlood Open: "+Utils.formatSmallNumber(timers.bloodOpen, 2)+"s")
	setLine(1, 1, "&4Blood Clear: "+Utils.formatSmallNumber(timers.bloodClear, 2)+"s"+"&7 ("+Utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen, 2)+"s)")
	setLine(1, 2, "&aEnter: "+Utils.formatSmallNumber(timers.enter, 2)+"s"+"&7 ("+Utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter, 2)+"s)")
	if (Utils.getDungeonFloor() < 14 && Utils.getDungeonFloor() != 7) {
		setLine(1, 3, "&bBoss: "+Utils.formatSmallNumber(timers.maxor, 2)+"s"+"&7 ("+Utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor, 2)+"s)")
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
	setLine(1, 3, "&bMaxor: "+Utils.formatSmallNumber(timers.maxor, 2)+"s"+"&7 ("+Utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor, 2)+"s)")
	setLine(1, 4, "&dStorm: "+Utils.formatSmallNumber(timers.storm, 2)+"s"+"&7 ("+Utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor+timers.storm, 2)+"s)")
	setLine(1, 5, "&6Terminal Section 1: "+Utils.formatSmallNumber(timers.term1, 2)+"s"+"&7 ("+Utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor+timers.storm+timers.term1, 2)+"s)")
	setLine(1, 6, "&6Terminal Section 2: "+Utils.formatSmallNumber(timers.term2, 2)+"s"+"&7 ("+Utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor+timers.storm+timers.term1+timers.term2, 2)+"s)")
	setLine(1, 7, "&6Terminal Section 3: "+Utils.formatSmallNumber(timers.term3, 2)+"s"+"&7 ("+Utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor+timers.storm+timers.term1+timers.term2+timers.term3, 2)+"s)")
	setLine(1, 8, "&6Terminal Section 4: "+Utils.formatSmallNumber(timers.term4, 2)+"s"+"&7 ("+Utils.formatSmallNumber(timers.term1+timers.term2+timers.term3+timers.term4, 2)+"s) ("+Utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor+timers.storm+timers.term1+timers.term2+timers.term3+timers.term4, 2)+"s)")
	setLine(1, 9, "&eGoldor: "+Utils.formatSmallNumber(timers.goldor, 2)+"s"+"&7 ("+Utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor+timers.storm+timers.term1+timers.term2+timers.term3+timers.term4+timers.goldor, 2)+"s)")
	setLine(1, 10, "&cNecron: "+Utils.formatSmallNumber(timers.necron, 2)+"s"+"&7 ("+Utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor+timers.storm+timers.term1+timers.term2+timers.term3+timers.term4+timers.goldor+timers.necron, 2)+"s)")
	removeLine(1, 11)
	if (Utils.getDungeonFloor() < 14) return
	setLine(1, 11, "&5Dragons: "+Utils.formatSmallNumber(timers.dragons, 2)+"s"+"&7 ("+Utils.formatSmallNumber(timers.bloodClear+timers.bloodOpen+timers.enter+timers.maxor+timers.storm+timers.term1+timers.term2+timers.term3+timers.term4+timers.goldor+timers.necron+timers.dragons, 2)+"s)")
}).setFps(100)

//Blood enter/open
register("chat", (msg) => {
	if (!Settings.Splits) return
	msg = ChatLib.removeFormatting(msg)
	if (!watcherOpen.includes(msg)) {
		return
	}
	Utils.chatLog("&cBlood Opened&7 in &a"+Utils.formatSmallNumber(timers.bloodOpen, 2)+"s")
	bloodOpened = true
}).setCriteria("${msg}")

//Blood clear
register("chat", () => {
	if (!Settings.Splits) return
	Utils.chatLog("&4Blood Cleared &7in &a"+Utils.formatSmallNumber(timers.bloodClear, 2)+"s")
	bloodCleared = true
}).setCriteria("[BOSS] The Watcher: You have proven yourself. You may pass.")

//Non F7/M7 bosses start and end
register("chat", (msg) => {
	if (bossStart.includes(ChatLib.removeFormatting(msg))) {
		enterDone = true
		currentSplit = "Maxor"
		splitChanged.trigger()
		if (!Settings.Splits) return
		Utils.chatLog("&aEnter &7phase of dungeon completed in "+Utils.formatSmallNumber(timers.enter, 2)+"s")
		Utils.debugLog("&bBoss &7phase of dungeon started.")
	}
	if (ChatLib.removeFormatting(msg).includes("Livid: Impossible! How did you figure out which one I was?!")) {
		currentSplit = "Nothing"
		splitChanged.trigger()
		if (!Settings.Splits) return
		Utils.chatLog("&bBoss &7phase of dungeon completed in "+Utils.formatSmallNumber(timers.maxor, 2)+"s")
		Utils.debugLog("&aDungeon Completed")
	}
	if (bossEnd.includes(ChatLib.removeFormatting(msg))) {
		currentSplit = "Nothing"
		splitChanged.trigger()
		if (!Settings.Splits) return
		Utils.chatLog("&bBoss &7phase of dungeon completed in "+Utils.formatSmallNumber(timers.maxor, 2)+"s")
		Utils.debugLog("&aDungeon Completed")
	}
}).setCriteria("${msg}")

//Maxor
register("chat", () => {
	enterDone = true
	currentSplit="Maxor"
	splitChanged.trigger()
	if (Settings.Splits) {
		Utils.chatLog("&aEnter &7phase of dungeon completed in "+Utils.formatSmallNumber(timers.enter, 2)+"s")
		Utils.debugLog("&bMaxor &7phase of dungeon started.")
	}
	if (Utils.getDungeonClass() !== "Archer") return
	if (Utils.getDungeonFloor() !== 7) return
	if (!Settings.cmtitle) return
	Client.showTitle("&4&lGET MILESTONE 3", "", "0", "144000", "0")
	Utils.playSound("random.anvil_land", 1, 1)
}).setCriteria("[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!")

//Storm
register("chat", () => {
	if (!Settings.Splits) return
	splitChanged.trigger()
	currentSplit="Storm"
	Utils.chatLog("&bMaxor &7phase of dungeon completed in&a "+Utils.formatSmallNumber(timers.maxor, 2)+"s")
	Utils.debugLog("&dStorm &7phase of dungeon started.")
}).setCriteria("[BOSS] Storm: Pathetic Maxor, just like expected.")

//Terminal Section 1
register("chat", () => {
	if (Settings.compactTerms) {
		termCompactor.register()
	}
	currentSplit="Term1"
	splitChanged.trigger()
	lastHowmanyeth = 0
	lastTotal = 0
	if (!Settings.Splits) return
	Utils.debugLog("&6Terminal Section 1 &7started.")
	Utils.chatLog("&dStorm &7phase of dungeon completed in&a "+Utils.formatSmallNumber(timers.storm, 2)+"s")
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")

//Necron
register("chat", (msg) => {
	if (!necronStart.includes(ChatLib.removeFormatting(msg))) return
	if (Settings.compactTerms) termCompactor.unregister()
	currentSplit="Necron"
	splitChanged.trigger()
	if (!Settings.Splits) return
	Utils.chatLog("&eGoldor &7phase of dungeon completed in "+Utils.formatSmallNumber(timers.goldor, 2)+"s")
	Utils.debugLog("&cNecron &7phase of dungeon started.")

}).setCriteria("${msg}")

//Dragons/Necron end
register("chat", () => {
	if (Utils.getDungeonFloor() == 7) {
		currentSplit = "Nothing"
		Utils.debugLog("&aDungeon completed")
		return
	}
	if (Utils.getDungeonFloor() == 14) currentSplit = "Dragons"
	splitChanged.trigger()
	if (!Settings.Splits) return
	Utils.chatLog("&cNecron &7phase of dungeon completed in "+Utils.formatSmallNumber(timers.necron, 2)+"s")
	Utils.debugLog("&5Dragons &7phase of dungeon started.")
}).setCriteria("[BOSS] Necron: All this, for nothing...")

//Dragons end
register("chat", (msg) => {
	if (!msg.endsWith("Incredible. You did what I couldn't do myself.")) return
	if (!msg.startsWith("[BOSS]")) return
	currentSplit = "Nothing"
	splitChanged.trigger()
	if (!Settings.Splits) return
	Utils.chatLog("&5Dragons &7phase of dungeon completed in "+Utils.formatSmallNumber(timers.dragons, 2)+"s")
	Utils.debugLog("&aDungeon completed")
}).setCriteria("${msg}")

//All terminals in section done
register("chat", (message) => {
	message = message.split(" ")
	message = message[1]+" "+message[2]+" "+message[3]+" "+message[4]
	if (message.endsWith("(7/7)") || message.endsWith("(8/8)")) {
		allTermsDone = true
		Utils.debugLog("All terminals in current section are done.")
	}
}).setCriteria("${message}")

//Gate blown
register("chat", () => {
	gateDestroyed = true
	Utils.debugLog("The gate has been destroyed.")
}).setCriteria("The gate has been destroyed!")


//Gate not blown
register("chat", () => {
	if (!compactTerms) return
	Utils.drawCustomTitle("&4&lGate not destroyed", 500, 750, 500)
	Utils.playSound("random.anvil_land", 1, 1)
}).setCriteria("The gate will open in 5 seconds!")

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
	Utils.debugLog("Not in dungeon")
	bloodOpened=false
	bloodCleared=false
	for (timer of Object.keys(timers)) {
		timers[timer] = 0
	}
	enterDone = false
	return
}).setCriteria("Starting in 4 seconds.")


export {getCurrentSplit, getGateDestroyed}
