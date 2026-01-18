import utils from "../lib/Utils.js"
import Settings from "../core/config.js"
//Adding a GUI:
//1. Add it's name to elementNames at line 7, this name must match the config variable name that it's dependant on in config.js
//2. Add placeholder lines

const elementNames = [
	"katanaHud",
	"splits",
	"chestProfit",
	"tick",
	"compactMaxor",
	"compactStorm",
	"compactTerms"
]

const defaultPosition = {"x":75,"y":75,"scale":1,"align":"left"}
let positions = FileLib.read("shaweelAddons", "config/positions.json")


let lines = {}
let shouldRender = {}
const elements = {}
for (index in elementNames) {
	lines[elementNames[index]] = []
	shouldRender[elementNames[index]] = false
	elements[elementNames[index]] = new Display()
}
if (positions === null) {
	utils.debugLog("File positions.json &7didn't exist, creating it.")
	positions = {}
	for (element of elementNames) {
		positions[element] = { ...defaultPosition }
	}
	FileLib.write("shaweelAddons", "config/positions.json", JSON.stringify(positions))
} else {
	positions = JSON.parse(positions)
}

let detector = {}
for (let elementName of elementNames) {
	let detected = false
	for (let key in positions) {
		if (key == elementName) detected = true
	}
	detector[elementName] = detected
}

let edited = false
for (let key in detector) {
	if (detector[key] == false) {
		edited = true
		positions[key] = { ...defaultPosition }
	}
}

if (edited) {
	jsonPos = JSON.stringify(positions)
	FileLib.write("shaweelAddons", "config/positions.json", jsonPos)
}


const editGui = new Gui()
const guiEdit = new Display()
guiEdit.setRenderY(8)
guiEdit.setLine(0, "Currently editing GUI size and positions")
guiEdit.getLine(0).setShadow(true)
guiEdit.getLine(0).setScale(1)
guiEdit.setLine(1, "Drag with LMB. Resize with the scroll wheel. Change text alignment with RMB.")
guiEdit.getLine(1).setShadow(true)
guiEdit.getLine(1).setScale(1)
guiEdit.setAlign(DisplayHandler.Align.CENTER)
guiEdit.setShouldRender(false)
guiEdit.setRenderX(Renderer.screen.getWidth()/2)

const sizeAndPos = new Display()
sizeAndPos.setShouldRender(false)
sizeAndPos.setLine(0, "Scale: 1, Alignment: left, X: 0, Y: 0")
sizeAndPos.getLine(0).setShadow(true)
sizeAndPos.getLine(0).setScale(1)


function assignElementName(assignIndex) {
	if (typeof(assignIndex) == "number" || typeof(assignIndex) == "bigint") {
		return elementNames[assignIndex]
	}
	if (typeof(assignIndex) != "object") {utils.errorLog("assignElementName only takes numbers, bigints and objects"); return}
	for (let key in elements) {
		if (elements[key] !== assignIndex) continue
		return key
	}
}
	
function getIndexFromName(name) {
	return elementNames.find(name)
}

function refreshGui(gui, render) {
	let guiName = assignElementName(gui)
	gui.setAlign(positions[guiName].align)
	gui.setRenderX(positions[guiName].x)
	gui.setRenderY(positions[guiName].y)
	index = -1
	for (let line of gui.getLines()) {
		line.setScale(positions[guiName].scale)
		line.setShadow(true)
	}
	gui.setShouldRender(false)
	gui.setShouldRender(render)
}

function isIn(gui) {
	let mouseX = Client.getMouseX()
	let mouseY = Client.getMouseY()
	let elementName = assignElementName(gui)
	let height = gui.getHeight()
	let width = gui.getWidth()
	let guiX = positions[elementName].x
	let guiY = positions[elementName].y
	let minY = guiY
	let maxY = guiY+height

	if (positions[elementName].align == "left") {
		minX = guiX
		maxX = guiX+width
	} else if (positions[elementName].align == "right") {
		minX = guiX-width
		maxX = guiX
	} else if (positions[elementName].align == "center") {
		minX = guiX-width/2
		maxX = guiX+width/2
	}

	if (mouseX >= minX && mouseX <= maxX && mouseY >= minY && mouseY <= maxY) {
		return true
	}
	return false
}

function drawOutline(color, thickness, x, y, width, height) {
	width+=2*thickness
	height+=2*thickness
	x-=(1+thickness)
	y-=(1+thickness)

	Renderer.drawRect(color, x, y, width, thickness)
	Renderer.drawRect(color, x, y+height-thickness, width, thickness)
	Renderer.drawRect(color, x, y, thickness, height)
	Renderer.drawRect(color, x+width-1, y, thickness, height)
}
let selected = "No GUI"
let isMoving = false
let movingName = "No GUI"
let offsetX = 0
let offsetY = 0

register("renderOverlay", () => {
	for (let key in elements) {
		elements[key].setBackground(DisplayHandler.Background.NONE)
	}
	if (!editGui.isOpen()) {
		sizeAndPos.setShouldRender(false)
		guiEdit.setShouldRender(false)
		return
	} else {
		guiEdit.setShouldRender(true)
	}

	let index = -1
	let assigned = false
	for (let key in elements) {
		index+=1
		let element = elements[key]
		let elementName = assignElementName(element)
		if (isIn(element) && Settings[elementName]) {
			selected = element
			assigned = true
			break
		}
	}

	if (isMoving) {
		selectedName = movingName
		selected = elements[movingName]
		let mouseX = Client.getMouseX()
		let mouseY = Client.getMouseY()

		positions[selectedName].x = utils.roundToDecimals(mouseX-offsetX, 1)
		positions[selectedName].y = utils.roundToDecimals(mouseY-offsetY, 1)

		utils.debugLog("Refreshing position, size and alignment of &a"+selectedName)
		refreshGui(selected, true)
	}

	if (!assigned) {
		selected = "No GUI"
	}
	if (selected == "No GUI") {
		sizeAndPos.setShouldRender(false)
		return
	}

	selectedName = assignElementName(selected)

	let thickness = 1.5
	let y = positions[selectedName].y
	let width = selected.getWidth()
	let height = selected.getHeight()
	let color = Renderer.color(0,0,0,255)
	let x = positions[selectedName].x
	let align = positions[selectedName].align


	if (align == "left") {
		x = utils.roundToDecimals(x, 1)
	} else if (align == "right") {
		x = utils.roundToDecimals(x-width, 1)
	} else if (align == "center") {
		x = utils.roundToDecimals(x-width/2, 1)
	}

	drawOutline(color,thickness,x,y,width,height)
	selected.setBackground(DisplayHandler.Background.FULL)

	y=y-sizeAndPos.getHeight()-thickness
	sizeAndPos.setShouldRender(true)
	sizeAndPos.setRenderX(x)
	sizeAndPos.setRenderY(y)
	let realX = x = positions[selectedName].x
	sizeAndPos.setLine(0, "&fX: "+realX+", Y: "+y+", Scale: "+positions[selectedName].scale+", Alignment: "+positions[selectedName].align)
	sizeAndPos.getLine(0).setShadow(true)
	sizeAndPos.getLine(0).setScale(1)
})

register("guiMouseClick", (mouseX, mouseY, mouseButton) => {
	if (!editGui.isOpen()) return
	if (selected == "No GUI") return
	if (!Settings[selectedName]) return

	if (mouseButton == 0) {
		if (!isMoving) {
			movingName = selectedName
			isMoving = true
			offsetX = mouseX - positions[selectedName].x
			offsetY = mouseY - positions[selectedName].y
		}
	} else if (mouseButton == 1) {
		if (positions[selectedName].align == "left") {
			utils.debugLog("Changing alignment of &a"+selectedName+"&7 to &aright")
			positions[selectedName].x += utils.roundToDecimals(selected.getWidth(), 1)
			positions[selectedName].align = "right"
		} else if (positions[selectedName].align == "right") {
			positions[selectedName].x -= utils.roundToDecimals(selected.getWidth(), 1)/2
			utils.debugLog("Changing alignment of &a"+selectedName+"&7 to &acenter")
			positions[selectedName].align = "center"
		} else if (positions[selectedName].align == "center") {
			positions[selectedName].x -= utils.roundToDecimals(selected.getWidth(), 1)/2
			utils.debugLog("Changing alignment of &a"+selectedName+"&7 to &aleft")
			positions[selectedName].align = "left"
		}
		positions[selectedName].x = utils.roundToDecimals(positions[selectedName].x, 1)
		utils.debugLog("Refreshing position, size and alignment of &a"+selectedName)
		refreshGui(selected, true)
	}
})

editGui.registerClosed(() => {
	for (let key in elements) {
		elements[key].setShouldRender(false)
	}
	if (!isMoving) return    
	isMoving = false
	movingName = "No GUI"
	offsetX = 0
	offsetY = 0
	utils.debugLog("Saving position, size and alignment of GUI Elements")
	jsonPos = JSON.stringify(positions)
	FileLib.write("shaweelAddons", "/config/positions.json", jsonPos)
})

register("guiMouseRelease", (mouseX, mouseY, mouseButton) => {
	if (!editGui.isOpen()) return

	if (mouseButton == 0) {
		if (!isMoving) return    
		isMoving = false
		movingName = "No GUI"
		offsetX = 0
		offsetY = 0
	}
	utils.debugLog("Saving position, size and alignment of GUI Elements")
	jsonPos = JSON.stringify(positions)
	FileLib.write("shaweelAddons", "/config/positions.json", jsonPos)
})

register("scrolled", (mouseX, mouseY, direction) => {
	if (!editGui.isOpen()) return
	if ((selected) == "No GUI") return

	if (direction == -1) {
		utils.debugLog("Increasing size of &a"+selectedName)
		if (positions[selectedName].scale < 10) positions[selectedName].scale+=0.1
	}
	if (direction == 1) {
		utils.debugLog("Decreasing size of &a"+selectedName)
		if (positions[selectedName].scale > 0.4) positions[selectedName].scale-=0.1
	}

	positions[selectedName].scale = utils.roundToDecimals(positions[selectedName].scale, 1)
	utils.debugLog("Refreshing position, size and alignment of &a"+selectedName)
	refreshGui(selected, true)
	utils.debugLog("Saving position, size and alignment of GUI Elements")
	jsonPos = JSON.stringify(positions)
	FileLib.write("shaweelAddons", "/config/positions.json", jsonPos)
})

function startMovingGui() {
	editGui.open()
	guiEdit.setShouldRender(true)

	let index = -1
	elements.katanaHud.setLine(0, "&d&lSoulcry: &a✔️ &7(&a3.4s&7)")
	elements.splits.setLine(0, "&cBlood Open: 0.00s")
	elements.splits.setLine(1, "&4Blood Clear: 0.00s &7(0.00s)")
	elements.splits.setLine(2, "&aEnter: 0.00s &7(0.00s)")
	elements.splits.setLine(3, "&bMaxor: 0.00s &7(0.00s)")
	elements.splits.setLine(4, "&dStorm: 0.00s &7(0.00s)")
	elements.splits.setLine(5, "&6Terminal Section 1: 0.00s &7(0.00s)")
	elements.splits.setLine(6, "&6Terminal Section 2: 0.00s &7(0.00s)")
	elements.splits.setLine(7, "&6Terminal Section 3: 0.00s &7(0.00s)")
	elements.splits.setLine(8, "&6Terminal Section 4: 0.00s &7(0.00s) (0.00s)")
	elements.splits.setLine(9, "&eGoldor: 0.00s &7(0.00s)")
	elements.splits.setLine(10, "&cNecron: 0.00s &7(0.00s)")
	elements.splits.setLine(11, "&5Dragons: 0.00s &7(0.00s)")
	elements.chestProfit.setLine(0, "&8Bedrock Chest")
	elements.chestProfit.setLine(1, "&6Necron's Handle &7 - &a+400,000,000")
	elements.chestProfit.setLine(2, "&5Shadow Warp &7 - &a+100,000,000")
	elements.chestProfit.setLine(3, "&d&lSoul Eater I &7 - &a+1,000,000")
	elements.chestProfit.setLine(4, "")
	elements.chestProfit.setLine(5, "&7Chest Cost - &c-150,500,000")
	elements.chestProfit.setLine(6, "&7Total Profit - &a+350,500,000")
	elements.tick.setLine(0, "&7Secret: &a1.65s")
	elements.compactMaxor.setLine(0, "&eEnergy Crystal&7 | &c1&a/2")
	elements.compactStorm.setLine(0, "&eStorm enraged")
	elements.compactTerms.setLine(0, "&bshaweel &7| &4Berserk &7| &eTerm &7| &c5&a/7")
	for (let key in elements) {
		element = elements[key]
		for (let line of element.getLines()) {
			line.setScale(positions[key].scale).setShadow(true)
		}
		index += 1
		let elementName = assignElementName(index)
		if (!Settings[elementName]) continue
		refreshGui(element, true)
	}
}

function setLine(name, num, content) {
	let elementLines = lines[name]
	if (elementLines[num]) {
		if (elementLines[num].getString() === content) return
	}
	elementLines[num] = new Text(content).setShadow(true).setScale(positions[name].scale).setAlign(positions[name].align)
}

function removeLine(name, num) {
	try {
		lines[name].splice(num, 1)
	} catch (err) {}
}

function clearLines(name) {
	lines[name] = []
}

function getLines(name) {
	return lines[name]
}

function setShouldRender(name, bool) {
	shouldRender[name] = bool
}

function refreshLines(name) {
	for (let line of lines[name]) {
		line.setScale(positions[name].scale).setAlign(positions[name].align).setShadow(true)
	}
}

register("renderOverlay", () => {
	if (editGui.isOpen()) return
	let element = -1
	for (let key in lines) {
		elementLines = lines[key]
		element++
		elementName = key
		if (!shouldRender[elementName]) continue
		let index = -1
		for (let line of elementLines) {
			index++
			let x = positions[elementName].x
			let y = positions[elementName].y+10*index*positions[elementName].scale
			line.draw(x, y)  
		}
	}
})

export {editGui, positions, startMovingGui, setLine, removeLine, clearLines, refreshLines, setShouldRender, getLines}