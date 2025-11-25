import utils from "../utils.js"
import Settings from "../config.js"
import { editGui, elements, positions, removeLine, setLine, setShouldRender } from "./Gui.js"

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
let TermsDone = 0
let LeversDone = 0
let oldSplit = "Term0"
let playerName = Player.getName()

//Define needed constants
const bossStart=["[BOSS] Bonzo: Gratz for making it this far, but I’m basically unbeatable.", "[BOSS] Scarf: This is where the journey ends for you, Adventurers.", "[BOSS] The Professor: I was burdened with terrible news recently...", "[BOSS] Thorn: Welcome Adventurers! I am Thorn, the Spirit! And host of the Vegan Trials!", "[BOSS] Livid: Welcome, you've arrived right on time. I am Livid, the Master of Shadows.", "[BOSS] Sadan: So you made it all the way here... Now you wish to defy me? Sadan?!"]
const bossEnd=["[BOSS] Bonzo: Alright, maybe I'm just weak after all..", "[BOSS] Scarf: Whatever...", "[BOSS] The Professor: What?! My Guardian power is unbeatable!", "CROWD: Whatttt? How did they win??", "Livid: Impossible! How did you figure out which one I was?!", "[BOSS] Sadan: NOOOOOOOOO!!! THIS IS IMPOSSIBLE!!"]
const watcherOpen = ["[BOSS] The Watcher: Congratulations, you made it through the Entrance.", "[BOSS] The Watcher: Ah, you've finally arrived.", "[BOSS] The Watcher: Ah, we meet again...", "[BOSS] The Watcher: So you made it this far... interesting.", "[BOSS] The Watcher: You've managed to scratch and claw your way here, eh?", "[BOSS] The Watcher: I'm starting to get tired of seeing you around here...", "[BOSS] The Watcher: Oh.. hello?", "[BOSS] The Watcher: Things feel a little more roomy now, eh?"]
const necronStart = ["[BOSS] Necron: Finally, I heard so much about you. The Eye likes you very much.", "[BOSS] Necron: You went further than any human before, congratulations."]

function triggerSectionComplete() {
	utils.drawCustomText("&aSection complete", 500, 1000, 500)
	utils.playSound("note.pling", 1, 2)
	utils.debugLog("&aSection complete")
}

register("tick", () => {
	if (!Settings.gateSound && !Settings.gateTitle) return
	if (oldSplit != currentSplit) {
		oldSplit = currentSplit
		TermsDone = 0
		LeversDone = 0
	}
	if (!blowGateAlert) return
	if (gateDestroyed) {
		blowGateAlert = false
		return
	}

	if (Settings.gateSound) {
		utils.playSound("note.pling", 1, 2)
	}

	if (Settings.gateTitle && !Settings.compactTerms) {
		Client.showTitle(Settings.gateText, "", 0, 72000, 10)
	}
})

register("chat", (player) => {
	if (player != playerName) return
	TermsDone+=1
	utils.debugLog("Player has activated a terminal.")
}).setCriteria("${player} activated a terminal! (${amount}/${max})")

register("chat", (player) => {
	if (player != playerName) return
	LeversDone+=1
	if ((currentSplit === "Term1" || currentSplit === "Term3") && LeversDone === 2 && !gateDestroyed) {
		utils.debugLog("Player has activated both levers in S1/S3, alerting blow gate.")
		blowGateAlert = true
	}
	if (currentSplit === "Term2" && LeversDone === 1 && !gateDestroyed && TermsDone === 0) {
		utils.debugLog("Player has activated a lever in S2 and hasn't done any terminal, alerting blow gate.")
		blowGateAlert = true
	}
}).setCriteria("${player} activated a lever! (${amount}/${max})")

let lastHowmanyeth = 0
let lastTotal = 0
let lastSubtitle = ""
let onlyGateMissing = false
termCompactor = register("renderTitle", (title, subtitle, e) =>  {
	lastSubtitle = subtitle
	if (subtitle.includes("|")) return
	const player = subtitle.split(" ")[0]
	let amount = subtitle.split("(")[1]
	if (!amount == undefined) {
		amount=amount.split(")")[0]
	}
	amount=ChatLib.removeFormatting(amount)
	const howmanyeth = amount[0]
	const total = amount[2]
	let time = 72000
	let title = ""
	if (howmanyeth == total && (gateDestroyed || currentSplit == "Term4" || currentSplit == "Goldor")) {
		time = 30
	} else if (howmanyeth == total) {
		utils.playSound("random.anvil_land", 1, 1)
		title = "&4&lGate not destroyed!"
		onlyGateMissing = true
	}
	if (lastHowmanyeth == lastTotal && [7, 8].includes(lastTotal)) {
		time = 30
	}
	if (Settings.gateTitle && blowGateAlert) {
		title = Settings.gateText
	}
	if (howmanyeth == lastHowmanyeth && !subtitle.includes("Pre") && subtitle.includes("device")) {
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
			const difference2 = {x: dev2.x-playerCoordinates.x, y: dev2.y-playerCoordinates.y, z: dev2.z-playerCoordinates.z}
			const difference3 = {x: dev3.x-playerCoordinates.x, y: dev3.y-playerCoordinates.y, z: dev3.z-playerCoordinates.z}
			const difference4 = {x: dev4.x-playerCoordinates.x, y: dev4.y-playerCoordinates.y, z: dev4.z-playerCoordinates.z}
			const distance2 = Math.sqrt(difference2.x**2+difference2.y**2+difference2.z**2)
			const distance3 = Math.sqrt(difference3.x**2+difference3.y**2+difference3.z**2)
			const distance4 = Math.sqrt(difference4.x**2+difference4.y**2+difference4.z**2)
			const closestDistance = Math.min(distance2, distance3, distance4)
			if (closestDistance == distance2) pre="2"
			if (closestDistance == distance3) pre="3"
			if (closestDistance == distance4) pre="4"
			e.setCanceled(true)
			Client.showTitle(title, player+"&7 | &ePre"+pre, 0, time, 10)
		} catch (error) {
			Client.showTitle(title, player+"&7 | &eUnknown Instant Device", 0, time, 10)
		}
		
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
		Client.showTitle(title, player+"&7 | &eTerm &7| &c"+howmanyeth+"&a/"+total, 0, time, 10)
		return
	}
	if (subtitle.includes("lever")) {
		e.setCanceled(true)
		Client.showTitle(title, player+"&7 | &eLever &7| &c"+howmanyeth+"&a/"+total, 0, time, 10)
		return
	}
	if (subtitle.includes("device")) {
		e.setCanceled(true)
		Client.showTitle(title, player+"&7 | &eDevice &7| &c"+howmanyeth+"&a/"+total, 0, time, 10)
		return
	}
	if (subtitle.includes("The gate has been destroyed")) {
		e.setCanceled(true)
		if (onlyGateMissing) {
			onlyGateMissing = false
			time = 30
		}
		Client.showTitle(title, "&eGate destroyed", 0, time, 10)
		return
	}
	if (subtitle.includes("The gate will open in 5 seconds!")) {
		e.setCanceled(true)
		return
	}
	if (subtitle.includes("The Core entrance is opening!")) {
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
		if (!Settings.Splits) return
		allTermsDone = false
		setTimeout(() => {
			gateDestroyed = false
		}, 100)
		currentSplit = "Term2"
		utils.chatLog("&6Terminal Section 1 &7completed in&a "+utils.formatSmallNumber(timers.term1, 2)+"s")
		utils.debugLog("&6Terminal Section 2 &7started.")
		triggerSectionComplete()
	//Terminal section 3
	} else if (currentSplit == "Term2" && gateDestroyed && allTermsDone) {
		if (!Settings.Splits) return
		allTermsDone = false
		setTimeout(() => {
			gateDestroyed = false
		}, 100)
		currentSplit = "Term3"
		utils.chatLog("&6Terminal Section 2 &7completed in&a "+utils.formatSmallNumber(timers.term2, 2)+"s")
		utils.debugLog("&6Terminal Section 3 &7started.")
		triggerSectionComplete()
	//Terminal section 4
	} else if (currentSplit == "Term3" && gateDestroyed && allTermsDone) {
		if (!Settings.Splits) return
		allTermsDone = false
		setTimeout(() => {
			gateDestroyed = false
		}, 100)
		currentSplit = "Term4"
		utils.chatLog("&6Terminal Section 3 &7completed in&a "+utils.formatSmallNumber(timers.term3, 2)+"s")
		utils.debugLog("&6Terminal Section 4 &7started.")
		triggerSectionComplete()
	//Goldor
	} else if (currentSplit == "Term4" && allTermsDone) {
		if (!Settings.Splits) return
		allTermsDone = false
		currentSplit = "Goldor"
		utils.chatLog("&6Terminal Section 4 &7completed in&a "+utils.formatSmallNumber(timers.term4, 2)+"s")
		utils.chatLog("&6Terminals &7completed in &a"+utils.formatSmallNumber(timers.term1+timers.term2+timers.term3+timers.term4, 2)+"s")
		utils.debugLog("&eGoldor &7phase of dungeon started.")
		triggerSectionComplete()
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
	if (!Settings.Splits) return
	msg = ChatLib.removeFormatting(msg)
	if (!watcherOpen.includes(msg)) {
		return
	}
	utils.chatLog("&cBlood Opened&7 in &a"+utils.formatSmallNumber(timers.bloodOpen, 2)+"s")
	bloodOpened = true
}).setCriteria("${msg}")

//Blood clear
register("chat", () => {
	if (!Settings.Splits) return
	utils.chatLog("&4Blood Cleared &7in &a"+utils.formatSmallNumber(timers.bloodClear, 2)+"s")
	bloodCleared = true
}).setCriteria("[BOSS] The Watcher: You have proven yourself. You may pass.")

//Non F7/M7 bosses start and end
register("chat", (msg) => {
	if (!Settings.Splits) return
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
	if (!Settings.Splits) return
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
	if (!Settings.Splits) return
	utils.chatLog("&bMaxor &7phase of dungeon completed in&a "+utils.formatSmallNumber(timers.maxor, 2)+"s")
	utils.debugLog("&dStorm &7phase of dungeon started.")
	currentSplit="Storm"
}).setCriteria("[BOSS] Storm: Pathetic Maxor, just like expected.")

//Terminal Section 1
register("chat", () => {
	if (!Settings.Splits) return
	utils.chatLog("&dStorm &7phase of dungeon completed in&a "+utils.formatSmallNumber(timers.storm, 2)+"s")
	if (Settings.compactTerms) {
		termCompactor.register()
	}
	utils.debugLog("&6Terminal Section 1 &7started.")
	currentSplit="Term1"
	lastHowmanyeth = 0
	lastTotal = 0
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")

//Necron
register("chat", (msg) => {
	if (!Settings.Splits) return
	if (!necronStart.includes(ChatLib.removeFormatting(msg))) return
	utils.chatLog("&eGoldor &7phase of dungeon completed in "+utils.formatSmallNumber(timers.goldor, 2)+"s")
	termCompactor.unregister()
	utils.debugLog("&cNecron &7phase of dungeon started.")
	currentSplit="Necron"
}).setCriteria("${msg}")

//Dragons/Necron end
register("chat", () => {
	if (!Settings.Splits) return
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
	if (!Settings.Splits) return
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
