import Utils from "../Utils.js"
import Settings from "../config.js"

let lines = [[], [], [], []]
let shouldRender = [false, false, false]
let positions = FileLib.read("./config/ChatTriggers/modules/shaweelAddons/positions.json")
positions = JSON.parse(positions)

let editGui = new Gui()
const guiEdit = new Display()
guiEdit.setRenderY(8)
guiEdit.setLine(0, "Currently editing GUI size and positions")
guiEdit.getLine(0).setShadow(true)
guiEdit.getLine(0).setScale(1)
guiEdit.setLine(1, "Drag with LMB. Scroll to resize. RMB to change text alignment.")
guiEdit.getLine(1).setShadow(true)
guiEdit.getLine(1).setScale(1)
guiEdit.setAlign(DisplayHandler.Align.CENTER)
guiEdit.setShouldRender(false)
guiEdit.setRenderX(Renderer.screen.getWidth()/2)

sizeAndPos = new Display()
sizeAndPos.setShouldRender(false)
sizeAndPos.setLine(0, "Scale: 1, Alignment: left, X: 0, Y: 0")
sizeAndPos.getLine(0).setShadow(true)
sizeAndPos.getLine(0).setScale(1)
elements = [
	new Display(),
	new Display(),
	new Display(),
	new Display()
]

elements[0].setAlign(positions.katanaHud.align)
elements[0].setRenderX(positions.katanaHud.x)
elements[0].setRenderY(positions.katanaHud.y)
elements[1].setAlign(positions.Splits.align)
elements[1].setRenderX(positions.Splits.x)
elements[1].setRenderY(positions.Splits.y)
elements[2].setAlign(positions.chestProfit.align)
elements[2].setRenderX(positions.chestProfit.x)
elements[2].setRenderY(positions.chestProfit.y)


function refreshGui(gui, render) {
	let guiName = Utils.assignElementName(elements.indexOf(gui))
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
	let elementName = Utils.assignElementName(elements.indexOf(gui))
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
	for (let element of elements) {
		element.setBackground(DisplayHandler.Background.NONE)
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
	for (let element of elements) {
		index+=1
		let elementName = Utils.assignElementName(elements.indexOf(element))
		if (isIn(element) && Settings[elementName]) {
			selected = element
			assigned = true
			break
		}
	}

	if (isMoving) {
		selectedName = movingName
		selected = elements[Utils.getIndexFromName(movingName)]
		let mouseX = Client.getMouseX()
		let mouseY = Client.getMouseY()

		positions[selectedName].x = Utils.roundToDecimals(mouseX-offsetX, 1)
		positions[selectedName].y = Utils.roundToDecimals(mouseY-offsetY, 1)

		Utils.debugLog("Refreshing position, size and alignment of &a"+selectedName)
		refreshGui(selected, true)
	}

	if (!assigned) {
		selected = "No GUI"
	}
	if (selected == "No GUI") {
		sizeAndPos.setShouldRender(false)
		return
	}

	selectedName = Utils.assignElementName(elements.indexOf(selected))

	let thickness = 1.5
	let y = positions[selectedName].y
	let width = selected.getWidth()
	let height = selected.getHeight()
	let color = Renderer.color(0,0,0,255)
	let x = positions[selectedName].x
	let align = positions[selectedName].align


	if (align == "left") {
		x = Utils.roundToDecimals(x, 1)
	} else if (align == "right") {
		x = Utils.roundToDecimals(x-width, 1)
	} else if (align == "center") {
		x = Utils.roundToDecimals(x-width/2, 1)
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
			Utils.debugLog("Changing alignment of &a"+selectedName+"&7 to &aright")
			positions[selectedName].x += Utils.roundToDecimals(selected.getWidth(), 1)
			positions[selectedName].align = "right"
		} else if (positions[selectedName].align == "right") {
			positions[selectedName].x -= Utils.roundToDecimals(selected.getWidth(), 1)/2
			Utils.debugLog("Changing alignment of &a"+selectedName+"&7 to &acenter")
			positions[selectedName].align = "center"
		} else if (positions[selectedName].align == "center") {
			positions[selectedName].x -= Utils.roundToDecimals(selected.getWidth(), 1)/2
			Utils.debugLog("Changing alignment of &a"+selectedName+"&7 to &aleft")
			positions[selectedName].align = "left"
		}
		positions[selectedName].x = Utils.roundToDecimals(positions[selectedName].x, 1)
		Utils.debugLog("Refreshing position, size and alignment of &a"+selectedName)
		refreshGui(selected, true)
	}
})

editGui.registerClosed(() => {
	for (let element of elements) {
		element.setShouldRender(false)
	}
	if (!isMoving) return    
	isMoving = false
	movingName = "No GUI"
	offsetX = 0
	offsetY = 0
	Utils.debugLog("Saving position, size and alignment of GUI Elements")
	jsonPos = JSON.stringify(positions)
	FileLib.write("./config/ChatTriggers/modules/shaweelAddons/positions.json", jsonPos)
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
	Utils.debugLog("Saving position, size and alignment of GUI Elements")
	jsonPos = JSON.stringify(positions)
	FileLib.write("./config/ChatTriggers/modules/shaweelAddons/positions.json", jsonPos)
})

register("scrolled", (mouseX, mouseY, direction) => {
	if (!editGui.isOpen()) return
	if ((selected) == "No GUI") return

	if (direction == -1) {
		Utils.debugLog("Increasing size of &a"+selectedName)
		if (positions[selectedName].scale < 10) positions[selectedName].scale+=0.1
	}
	if (direction == 1) {
		Utils.debugLog("Decreasing size of &a"+selectedName)
		if (positions[selectedName].scale > 0.4) positions[selectedName].scale-=0.1
	}

	positions[selectedName].scale = Utils.roundToDecimals(positions[selectedName].scale, 1)
	Utils.debugLog("Refreshing position, size and alignment of &a"+selectedName)
	refreshGui(selected, true)
	Utils.debugLog("Saving position, size and alignment of GUI Elements")
	jsonPos = JSON.stringify(positions)
	FileLib.write("./config/ChatTriggers/modules/shaweelAddons/positions.json", jsonPos)
})

function startMovingGui() {
	editGui.open()
	guiEdit.setShouldRender(true)

	let index = -1
	elements[0].setLine(0, "&cKatana Ability NOT activated")
	elements[0].getLine(0).setScale(positions.katanaHud.scale)
	elements[0].getLine(0).setShadow(true)
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
	elements[2].setLine(0, "&8Bedrock Chest")
	elements[2].getLine(0).setScale(positions.chestProfit.scale)
	elements[2].getLine(0).setShadow(true)
	elements[2].setLine(1, "&6Necron's Handle &7 - &a+123,456,789")
	elements[2].getLine(1).setScale(positions.chestProfit.scale)
	elements[2].getLine(1).setShadow(true)
	elements[2].setLine(2, "&6Necron's Handle &7 - &a+12,345,678")
	elements[2].getLine(2).setScale(positions.chestProfit.scale)
	elements[2].getLine(2).setShadow(true)
	elements[2].setLine(3, "&6Necron's Handle &7 - &a+1,234,567")
	elements[2].getLine(3).setScale(positions.chestProfit.scale)
	elements[2].getLine(3).setShadow(true)
	elements[3].setLine(0, "&6Tick: &f1.25s")
	elements[3].getLine(0).setScale(positions.tick.scale)
	elements[3].getLine(0).setShadow(true)
	for (let element of elements) {
		index += 1
		let elementName = Utils.assignElementName(index)
		if (!Settings[elementName]) continue
		refreshGui(element, true)
	}
}

function setLine(index, num, content) {
	let elementLines = lines[index]
	if (elementLines[num]) {
		if (elementLines[num].getString() === content) return
	}
	elementLines[num] = new Text(content).setShadow(true).setScale(positions[Utils.assignElementName(index)].scale).setAlign(positions[Utils.assignElementName(index)].align)
}

function removeLine(index, num) {
	try {
		lines[index].splice(num, 1)
	} catch (err) {}
}

function clearLines(index) {
	lines[index] = []
}

function getLines(index) {
	return lines[index]
}

function setShouldRender(index, bool) {
	shouldRender[index] = bool
}

function refreshLines(index) {
	for (let line of lines[index]) {
		line.setShadow(true)
		line.setScale(positions[Utils.assignElementName(index)].scale)
		line.setAlign(positions[Utils.assignElementName(index)].align)
	}
}

register("renderOverlay", () => {
	if (editGui.isOpen()) return
	let element = -1
	for (let elementLines of lines) {
		element++
		if (!shouldRender[element]) continue
		let index = -1
		for (let line of elementLines) {
			index++
			let x = positions[Utils.assignElementName(element)].x
			let y = positions[Utils.assignElementName(element)].y+10*index*positions[Utils.assignElementName(element)].scale
			line.draw(x, y)  
		}
	}
})

export {elements, editGui, positions, startMovingGui, setLine, removeLine, clearLines, refreshLines, setShouldRender, getLines}