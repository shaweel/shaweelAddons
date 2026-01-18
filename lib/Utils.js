import {request} from "requestV2"

let debugMode = FileLib.read("shaweelAddons", "config/debugMode.txt")

if (debugMode === null) {
	FileLib.write("shaweelAddons", "config/debugMode.txt", -1)
	debugMode = -1
} else {
	debugMode = JSON.parse(debugMode)
}
debugMode = Number(debugMode)

let bz = {}
let ah = {}

function updateBazaar() {
	request({
		url: "https://api.hypixel.net/skyblock/bazaar",
		json: true
	}).then(data => {
		bz = data.products
	})
}
function updateAuction() {
	request({
		url: "https://lowestbin.snailify.workers.dev",
		json: true
	}).then(data => {
		ah = data
	})
}
updateBazaar()
updateAuction()
let ticks = 0
register("tick", () => {
	ticks++
	if (ticks >= 100) {
		updateBazaar()
		updateAuction()
		ticks = 0
	}
})

let translationsFolder = new java.io.File("./config/ChatTriggers/modules/shaweelAddons/translations")
translationsFolder = translationsFolder.listFiles()
let translations = {}
for (let translation of translationsFolder) {
	const name = String(translation.getName())
	translations[name.replaceAll(".txt", "")] = FileLib.read("shaweelAddons", "translations/"+name).replaceAll(" ", "").split(",")
}

let cachedDungeonFloor = null
let cachedClassMilestone = null
let lastDungeonFloorCacheUpdate = 0
let lastClassMilestoneCacheUpdate = 0
let usedSounds = Object.create(null)

let titles = []

function getVisibleTitles() {
	let visibleTitles = []
	for (let title of titles) {
		if (title.visible) visibleTitles.push(title)
	}
	return visibleTitles
}

class CustomTitle {
	constructor(title, fadeIn, time, fadeOut) {
		this.visible = true
		this.id = titles.length
		this.textObject = new Text(title, Renderer.screen.getWidth()/2, Renderer.screen.getHeight()/2.333 - Renderer.screen.getHeight()/13 * getVisibleTitles().length)
		this.text = title
		this.creationTime = Date.now()

		this.renderTrigger = register("renderOverlay", () => {
			this.textObject.setAlign(DisplayHandler.Align.CENTER).setScale(Renderer.screen.getWidth()/237).setShadow(true).setColor(0xFFFFFFFF)
			const sinceStart = Date.now() - this.creationTime
			if (sinceStart > 0 && sinceStart < fadeIn) {
				let alpha = Math.floor((sinceStart / fadeIn) * 255)
				alpha = Math.max(0, Math.min(255, alpha))
				const rgb = 0xFFFFFF
				this.textObject.setColor((alpha << 24) | rgb)
			}
			if (sinceStart > time+fadeIn) {
				let alpha = Math.floor(255 - ((sinceStart - time - fadeIn) / fadeOut) * 255)
				alpha = Math.max(0, Math.min(255, alpha))
				const rgb = 0xFFFFFF
				this.textObject.setColor((alpha << 24) | rgb)
			}
			if (isNaN(this.textObject.getY())) errorLog("The Y coordinate of a custom title is somehow not a number.")
			this.textObject.draw()
			lastTime = Date.now()
		})
	}

	erase() {
		if (this.visible == false) return

		this.visible = false
		this.renderTrigger.unregister()

		for (let title of getVisibleTitles()) {
			if (title.textObject.getY() >= this.textObject.getY()) continue
			title.goDownByOneTitle()
		}
	}

	goDownByOneTitle() {
		const easeOut2_5 = easingProgress => 1 - Math.pow(1 - easingProgress, 2.5)

		const duration = 150
		const startTime = Date.now()
		const startY = this.textObject.getY()
		
		const tickRegister = register("step", () => {
			const elapsed = Date.now()-startTime
			const easingProgress = Math.min(Math.max(elapsed / duration, 0), 1)
			this.textObject.setY(startY+Renderer.screen.getHeight()/13*easeOut2_5(easingProgress))
		}).setFps(1000)

		utils.clientSchedule(duration, () => {
			tickRegister.unregister()
		})
	}
}

const spawnLocations = {
	'Private Island': [7, 100, 7],
	'The Hub': [-3, 70, -70],
	'Dungeon Hub': [-31, 121, 0],
	'The Farming Islands': [113, 71, -208],
	'The Park': [-279, 82, -14],
	'Gold Mine': [-5, 74, -279],
	'Deep Caverns': [4, 157, 80],
	'Dwarven Mines': [-49, 200, -122],
	'Crystal Hollows': [213, 113, 417],
	'Spider\'s Den': [-203, 83, -233],
	'The End': [-503, 101, -275],
	'Crimson Isle': [-361, 80, -431],
	'Garden': [-6, 71, 17],
	'The Rift': [-45, 122, 69],
	'Backwater Bayou': [-13, 74, -11],
	'Dark Auction': [91, 75, 180],
	'Catacombs': [0, 100, 0],
	'Mineshaft': [-182, 100, -192],
	'Kuudra': [-101, 100, -186],
	"Jerry's Workshop": [-5, 76, 100]
}

class Utils {
	/**
	 * Gets the auction house lowest bin data from the snailify API
	 * @returns {Object} The auction data
	 */
	getAh() {
		return ah
	}
	/**
	 * Gets the bazaar price data from the Hypixel API
	 * @returns {Object} The auction data
	 */
	getBz() {
		return bz
	}
	/**
	 * Gets all translations for a specific string in the ./translations folder, this must match the name of the .txt file, if the file doesn't exist, returns null
	 * @param {String} word The name of the file to fetch translations from - e.g. party, zombie
	 * @returns {(String[]|null)} An array of all the translations or 
	 */
	getTranslation(word) {
		try { return translations[word] } 
		catch (err) { return null }
	}

	/**
	 * Sends a message with the [shaweelAddons] [DEBUG] prefix in chat if the player has debugMode on
	 * @param {any} debugMessage The message
	 */
	debugLog(debugMessage) {
		if (debugMode == 1) ChatLib.chat("&d[shaweelAddons] &e[DEBUG] &7"+debugMessage)
	}

	/**
	 * Sends a message with the [shaweelAddons] [DEBUG] prefix in chat even when the player has debugMode off
	 * @param {any} debugMessage The message
	 */
	pseudoDebugLog(debugMessage) {
		ChatLib.chat("&d[shaweelAddons] &e[DEBUG] &7"+debugMessage)
	}

	/**
	 * Sends a message with the [shaweelAddons] prefix in chat
	 * @param {any} chatMessage The message
	 */
	chatLog(chatMessage) {
		ChatLib.chat("&d[shaweelAddons] &7"+chatMessage)
	}

	/**
	 * Sends a message with the [shaweelAddons] [ERROR] prefix in chat
	 * @param {any} errorMessage The message
	 */
	errorLog(errorMessage) {
		ChatLib.chat("&d[shaweelAddons] &4[ERROR] &c"+errorMessage)
	}

	/**
	 * Toggles debugMode
	 */
	toggleDebugMode() {
		debugMode *= -1
		FileLib.write("shaweelAddons", "config/debugMode.txt", String(debugMode))

		if (debugMode == 1) {
			ChatLib.chat("&d[shaweelAddons] &e[DEBUG] &aDebug mode activated.")
		} else {
			ChatLib.chat("&d[shaweelAddons] &e[DEBUG] &cDebug mode deactivated.")
		}
	}

	/**
	 * Gets the current dungeon floor of the run you're in
	 * @returns {Number} The floor from -1-14, -1 being no dungeon, 0 entrance, 1-7 floors 1-7 and 8-14 master mode floors 1-7 
	 */
	getDungeonFloor() {
		if (Date.now() - lastDungeonFloorCacheUpdate < 1000) {
			return cachedDungeonFloor
		}
		lastDungeonFloorCacheUpdate = Date.now()
		let floor = ""
		let lines = Scoreboard.getLines()
		for (let line of lines) {
			line = String(line)
			line = ChatLib.removeFormatting(line)
			line = line.replaceAll("🔮", "")
			if (line.includes("Dragons") || line.includes("- Flame") || line.includes("- Soul") || line.includes("- Power") || line.includes("- Ice") || line.includes("- Apex")) {
				cachedDungeonFloor = 14
				return 14
			}
			if (line.includes("Cata")) {
				floor = line
			}
			if (line.includes("Guardian")) {
				return cachedDungeonFloor
			}
		}
		if (floor.includes("F")) {
			let floorNum = Number(floor.split("F")[1].replace(")", ""))
			cachedDungeonFloor = floorNum
			return floorNum
		}
		if (floor.includes("M")) {
			let floorNum = Number(floor.split("M")[1].replace(")", ""))
			cachedDungeonFloor = floorNum + 7
			return floorNum+7
		}
		cachedDungeonFloor = -1
		return -1
	}
	
	/**
	 * Gets the current dungeon class of the player passed with or without color formatting, passing no player will use the user of the mod
	 * @param {String} name The username of the player whom you shall get the class of, if none is passed, the code will use the user of the mod
	 * @param {Boolean} colorFormatting Whether or not to add color formatting to the result, defaults to false
	 * @returns {String} The class it finds with or without color formatting
	 */
	getDungeonClass(name = Player.getName(), colorFormatting = false) {
		if (this.getDungeonFloor() == -1) return null

		let lines = TabList.getNames()
		for (let line of lines) {
			line = ChatLib.removeFormatting(line)
			if (line.includes("(Healer") && line.includes(name)) {
				if (colorFormatting) return "&dHealer"
				return "Healer"
			}
			if (line.includes("(Mage") && line.includes(name)) {
				if (colorFormatting) return "&bMage"
				return "Mage"
			}
			if (line.includes("(Berserk") && line.includes(name)) {
				if (colorFormatting) return "&4Berserk"
				return "Berserk"
			}
			if (line.includes("(Archer") && line.includes(name)) {
				if (colorFormatting) return "&6Archer"
				return "Archer"
			}
			if (line.includes("(Tank") && line.includes(name)) {
				if (colorFormatting) return "&2Tank"
				return "Tank"
			}
			if (line.includes("(Dead") && line.includes(name)) {
				if (colorFormatting) return "&cDead"
				return "Dead"
			}
		}
		if (colorFormatting) return "&cClass not found"
		return "Class not found"
	}

	/**
	 * Rounds a number to a set amount of decimals
	 * @param {Number} num The number to round
	 * @param {Number} amount The amount of decimals to round to
	 * @returns {Number} The rounded number 
	 */
	roundToDecimals(num, amount) {
		let changer = 10**amount
		num = num*changer
		num = Math.round(num)
		num = num/changer
		return num
	}

	/**
	 * Properly draws a CustomTitle
	 * @param {Any} title The text to display
	 * @param {Number} fadeIn The time in miliseconds the title should take to fade in
	 * @param {Number} time The time in miliseconds the title should stay on the screen
	 * @param {Number} fadeOut The time in miliseconds the title should take to fade out
	 * @returns {CustomTitle} The custom title that was drawn
	 */
	drawCustomTitle(title, fadeIn, time, fadeOut) {
		titles.push(new CustomTitle(title, fadeIn, time, fadeOut))
		const titleClass = titles[titles.length-1]
		const timeout = fadeIn+time+fadeOut
		this.clientSchedule(timeout, () => {
			titleClass.erase()
		})
		return titleClass
	}

	/**
	 * Rounds the passed number and adds commas to make it more readable e.g. 112386.9543 -> 112,387
	 * @param {Number} num The number to format
	 * @returns {Number} The formatted number
	 */
	formatLargeNumber(num) {
		if (String(num) == "Infinity") return "Infinity"
		num = Math.round(num)
		let sign = Math.sign(num)

		num = Math.abs(num)
		num = String(num)
		numLen = num.length

		let numArray = []
		for (let char of num) {
			numArray.push(char)
		}

		let amount = 0
		let index = 0
		for (let char of num) {
			index += 1
			if (numLen % 3 == index % 3 && index != numLen) {
				numArray.splice(index+amount, 0, ",")
				amount++
			}
		}

		if (sign == -1) {
			num = "-"
		} else {
			num = ""
		}

		for (let char of numArray) {
			num += char
		}

		return num
	}

	/**
	 * Rounds a number to a set amount of decimals and adds 0s to empty decimal characters e.g. 1842.9821, 2 -> 1842.98; 234.7, 3 -> 234.700
	 * @param {Number} num The number to format
	 * @param {Number} amount The amount of decimals to round to
	 * @returns {Number} The formatted number
	 */
	formatSmallNumber(num, decimals) {
		num = String(this.roundToDecimals(num, decimals))

		if (!num.includes(".")) {
			num = num+"."+"0".repeat(decimals)
			return num
		}

		let numLength = num.split(".")[1].length
		if (numLength < decimals) {
			let difference = decimals - numLength
			num = num+"0".repeat(difference)
		}

		return num
	}

	/**
	 * Plays a vanilla Minecraft sound saved in assets in the master channel with caching 
	 * @param {String} sound The sound name
	 * @param {Number} soundVolume The volume from 0-1
	 * @param {Number} soundPitch The pitch from 0-2
	 */
	playSound(sound, soundVolume, soundPitch) {
		sound = sound+".ogg"
		sound = String(sound)
		let toPlay
		if (usedSounds[sound]) {
			toPlay = usedSounds[sound]
		} else if (FileLib.exists("shaweelAddons", "assets/"+sound)) {
			toPlay = new Sound({source: sound})
			usedSounds[sound] = toPlay
		} else {
			this.errorLog("Couldn't find file "+sound+" in .minecraft/config/ChatTriggers/shaweelAddons/assets")
			return
		}
		try {
			toPlay.stop()
			toPlay.setVolume(soundVolume)
			toPlay.setPitch(soundPitch)
			toPlay.setAttenuation(0)
			toPlay.play()
		} catch (error) {
			utils.errorLog(toPlay)
			utils.errorLog(usedSounds[sound])
		}
	}

	/**
	 * Returns properly formatted time from miliseconds
	 * @param {Number} ms The number of miliseconds
	 * @returns {String} The formatted time
	 */
	getTimeFromMiliseconds(ms) {
		years = Math.floor(ms / 31536000000)
		months = Math.floor((ms-years*31536000000) / 2592000000)
		days = Math.floor((ms-years*31536000000-months*2592000000) / 86400000)
		hours = Math.floor((ms-years*31536000000-months*2592000000-days*86400000) / 3600000)
		minutes = Math.floor((ms-years*31536000000-months*2592000000-days*86400000-hours*3600000) / 60000)
		seconds = Math.floor((ms-years*31536000000-months*2592000000-days*86400000-hours*3600000-minutes*60000) / 1000)
		ms = Math.floor(ms-years*31536000000-months*2592000000-days*86400000-hours*3600000-minutes*60000-seconds*1000)
		secondDecimal = Math.floor(ms/10)
		if (secondDecimal < 10) secondDecimal = "0"+secondDecimal

		if (years > 0) return `${years}y ${months}mo ${days}d ${hours}h ${minutes}m ${seconds}.${secondDecimal}s`
		if (months > 0) return `${months}mo ${days}d ${hours}h ${minutes}m ${seconds}.${secondDecimal}s`
		if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}.${secondDecimal}s`
		if (hours > 0) return `${hours}h ${minutes}m ${seconds}.${secondDecimal}s`
		if (minutes > 0) return `${minutes}m ${seconds}.${secondDecimal}s`
		return `${seconds}.${secondDecimal}s`
	}

	drawRoundedRect(color, x, y, width, height, radius) {
		Renderer.drawRect(color, x+radius, y, width - 2*radius, height)
		Renderer.drawRect(color, x, y+radius, width, height - 2*radius)
		Renderer.drawCircle(color, x+radius, y+radius, radius, 10*radius)
		Renderer.drawCircle(color, x+width-radius, y+radius, radius, 10*radius)
		Renderer.drawCircle(color, x+radius, y+height-radius, radius, 10*radius)
		Renderer.drawCircle(color, x-radius+width, y+height-radius, radius, 10*radius)
	}

	drawOutlinedRoundedRect(color, outlineColor, x, y, width, height, radius, thickness) {
		this.drawRoundedRect(outlineColor, x - thickness, y - thickness, width + 2 * thickness, height + 2 * thickness, radius)
		this.drawRoundedRect(color, x, y, width, height, radius)
	}

	/**
	 * Returns the SkyBlock island the mod user is currently on, returns null if they aren't on SkyBlock
	 * @returns {String} The island
	 */
	getSkyblockIsland() {
		if (Number(World.spawn.getX()) == null || Number(World.spawn.getY())== null || Number(World.spawn.getZ())== null) return null
		let currentSpawnLocation = [Number(World.spawn.getX()), Number(World.spawn.getY()), Number(World.spawn.getZ())]
		for (let spawnLocationName in spawnLocations) {
			let spawnLocation = spawnLocations[spawnLocationName]
			if (spawnLocation[0] === currentSpawnLocation[0] && spawnLocation[1] === currentSpawnLocation[1] && spawnLocation[2] === currentSpawnLocation[2]) return spawnLocationName
		}
		return null
	}

	/**
	 * Calculates distnace from point A to point B in the shortest possible straight line, arguments are self explanatory
	 * @returns {Number} The distance in blocks(meters)
	 */
	calculateDistance(PointAX, PointAY, PointAZ, PointBX, PointBY, PointBZ) {
		const difference = {x: PointAX-PointBX, y: PointAY-PointBY, z: PointAZ-PointBZ}
		return Math.sqrt(difference.x**2+difference.y**2+difference.z**2)
	}

	/**
	 * Schedules a task with a delay with 1ms precision
	 * @param {Number} timeout The time in miliseconds to do the task in
	 * @param {callback} callback The task to do after the delay
	 */
	clientSchedule(timeout, callback) {
		const startTime = Date.now()
		const stepTrigger = register("step", () => {
			if (Date.now() - startTime < timeout) return
			callback()
			stepTrigger.unregister()
		}).setFps(1000)
	}

	/**
	 * Schedules a task with a delay in server time with 1t precision | 1 tick(t) = 50ms
	 * @param {Number} timeout The time in ticks to do the task in
	 * @param {callback} callback The task to do after the delay
	 */
	serverSchedule(timeout, callback) {
		let timePassed = 0
		const packetTrigger = register("packetReceived", () => {
			timePassed++
			if (timePassed < timeout) return
			callback()
			packetTrigger.unregister()
		}).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction)
	}
}
var utils = new Utils()
export default utils