import utils from "../../lib/Utils.js"
import Settings from "../../core/config.js"
import { customRegister } from "../../lib/CustomTriggers.js"
import { setLine, setShouldRender } from "../../core/Gui.js"
import { getCurrentSplit, getGateDestroyed } from "./Splits.js"

const dev2 = {x:60, y:132, z:140}
const dev3 = {x:1, y:120, z:77}
const dev4 = {x:63, y:127, z:35}
const playerName = ChatLib.removeFormatting(Player.getName())

let gateNotDestroyed = utils.drawCustomTitle("", 0, 0, 0)
let lastHowmanyeth = -1
let onlyGateMissing = false
let registeredTitles = []
let blowGateTitle = utils.drawCustomTitle("", 0, 0, 0)
let termsDone = 0
let leversDone = 0
let blowGateAlert = false
let titleGenerated = false

const termCompactor = register("renderTitle", (title, subtitle, e) =>  {
	const gateDestroyed = getGateDestroyed()
	const currentSplit = getCurrentSplit()
	if (subtitle.includes("revived")) return
	e.setCanceled(true)
	if (registeredTitles.includes(subtitle)) return
	registeredTitles.push(subtitle)

	const player = subtitle.split(" ")[0]
	let playerTitle = player

	let amount = subtitle.split("(")[1]
	if (!amount == undefined) {
		amount=amount.split(")")[0]
	}
	amount=ChatLib.removeFormatting(amount)

	const howmanyeth = amount[0]
	const total = amount[2]

	if (howmanyeth == total && !(gateDestroyed || currentSplit == "Term4" || currentSplit == "Goldor")) {
		onlyGateMissing = true
	}

	let clazz = utils.getDungeonClass(ChatLib.removeFormatting(player), true) + "&7 | "
	playerTitle += "&7 | "
	if (!Settings.showClasses) clazz = ""
	if (!Settings.showNames)  playerTitle = ""

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
			setLine("compactTerms", 0, playerTitle+clazz+"&eUnknown Instant Device") //Unfixable - Hypixel caps render distance
			return
		}

		const distance2 = utils.calculateDistance(
			dev2.x, dev2.y, dev2.z,
			playerCoordinates.x, playerCoordinates.y, playerCoordinates.z
		)
		const distance3 = utils.calculateDistance(
			dev3.x, dev3.y, dev3.z,
			playerCoordinates.x, playerCoordinates.y, playerCoordinates.z
		)
		const distance4 = utils.calculateDistance(
			dev4.x, dev4.y, dev4.z,
			playerCoordinates.x, playerCoordinates.y, playerCoordinates.z
		)
		const closestDistance = Math.min(distance2, distance3, distance4)
		if (closestDistance == distance2) pre="2"
		if (closestDistance == distance3) pre="3"
		if (closestDistance == distance4) pre="4"
		if (ChatLib.removeFormatting(player) == playerName && pre == "4") {
			utils.drawCustomTitle("&aPre4 Complete", 250, 500, 250)
			utils.playSound("note.pling", 1, 2)
		}
		e.setCanceled(true)
		setLine("compactTerms", 0, playerTitle+clazz+"&ePre"+pre)
		
		if (howmanyeth != "u") {
			lastHowmanyeth = howmanyeth
		}
		return
	}
	if (howmanyeth != "u") {
		lastHowmanyeth = howmanyeth
	}
	if (subtitle.includes("terminal")) {
		if (ChatLib.removeFormatting(player) == playerName) termsDone++
		setLine("compactTerms", 0, playerTitle+clazz+"&eTerm &7| &c"+howmanyeth+"&a/"+total)
		return
	}
	if (subtitle.includes("lever")) {
		if (ChatLib.removeFormatting(player) == playerName) leversDone++
		setLine("compactTerms", 0, playerTitle+clazz+"&eLever &7| &c"+howmanyeth+"&a/"+total)
		return
	}
	if (subtitle.includes("device")) {
		setLine("compactTerms", 0, playerTitle+clazz+"&eDevice &7| &c"+howmanyeth+"&a/"+total)
		return
	}
	if (subtitle.includes("The gate has been destroyed")) {
		setLine("compactTerms", 0, "&eGate destroyed")
		gateNotDestroyed.erase()
		blowGateTitle.erase()
		titleGenerated = false
		currentlyAlertToBlowTheGate = false
		return
	}
	if (subtitle.includes("The gate will open in 5 seconds!") || subtitle.includes("The Core entrance is opening!")) {
		return
	}
})
termCompactor.unregister()


customRegister("splitChanged", (args) => {
	if (!Settings.compactTerms) return
	registeredTitles = []
	lastHowmanyeth = -1
	termsDone = 0
	leversDone = 0
	if (args.newSplit == "Term1") {
		termCompactor.register()
		setShouldRender("compactTerms", true)
	}
	if (!["Term1", "Term2", "Term3", "Term4", "Goldor"].includes(args.newSplit)) {
		termCompactor.unregister()
		setShouldRender("compactTerms", false)
		setLine("compactTerms", 0, "")
	}
	if (["Term2", "Term3", "Term4", "Goldor"].includes(args.newSplit)) {
		utils.drawCustomTitle("&aSection complete", 500, 750, 500)
		utils.playSound("note.pling", 1, 2)
		utils.debugLog("&aSection complete")
	}
})

register("chat", () => {
	if (!Settings.compactTerms) return
	gateNotDestroyed = utils.drawCustomTitle("&4&lGate not destroyed", 500, 750, 500)
	utils.playSound("random.anvil_land", 1, 1)
}).setCriteria("The gate will open in 5 seconds!")

register("tick", () => {
	let gateDestroyed = getGateDestroyed()
	let currentSplit = getCurrentSplit()
	if (!((currentSplit === "Term1" || currentSplit === "Term3") && leversDone === 2 && !gateDestroyed) ||
	!(currentSplit === "Term2" && leversDone === 1 && !gateDestroyed && termsDone === 0)) return

	utils.playSound("note.pling", 1, 2)
	if (!titleGenerated) {
		titleGenerated = true
		gateTitle = utils.drawCustomTitle("&4Blow Gate!", 0, 72000, 10)
	}
})