import utils from "../utils.js"
import Settings from "../config.js"

function isIn(mouseX, mouseY, x, y, width, height) {
    return mouseX >= x && mouseX <= x + width && mouseY >= y && mouseY <= y + height;
}
maxMult = []
mult = []
let leapGui = new Gui()
let lastChange = Date.now()

function sortPlayers(players) {
    let result = [null, null, null, null]
    let secondRound = []
    for (let player of players) {
        let clazz = player[0]
        let priority = 0
        if (clazz === "Archer" || clazz === "Healer" || clazz === "Mage") priority = 2
        if (clazz === "Tank") priority = 1
        let defaultQuadrant = 0
        if (clazz === "Berserk") defaultQuadrant = 1
        if (clazz === "Healer") defaultQuadrant = 2
        if (clazz === "Mage" || clazz === "Tank") defaultQuadrant = 3
        player[2] = priority
        player[3] = defaultQuadrant
    }

    players.sort((a, b) => a[2] - b[2])

    for (let player of players) {
        let q = player[3]
        if (result[q] === null) {
            result[q] = player
        } else {
            secondRound.push(player)
        }
    }

    if (secondRound.length === 0) return result

    for (let i = 0; i < result.length && secondRound.length > 0; i++) {
        if (result[i] === null) {
            result[i] = secondRound.shift()
        }
    }
    return result
}

let boxes = []

function drawPlayer(color, outlineColor, x, y, width, height, radius, thickness, id, username, clazz) {
    if (!mult[id]) {
        mult[id] = 1
        maxMult[id] = 1.05
    }

    let mouseX = Client.getMouseX()
    let mouseY = Client.getMouseY()

    let maxWidth = width * maxMult[id]
    let maxHeight = height * maxMult[id]
    let maxX = x - (maxWidth - width) / 2
    let maxY = y - (maxHeight - height) / 2

    let hovering = isIn(mouseX, mouseY, maxX, maxY, maxWidth, maxHeight)

    if (hovering && mult[id] < maxMult[id] && Date.now()-lastChange > 7.5) {
        lastChange = Date.now()
        mult[id] += 0.01
    } else if (!hovering && mult[id] > 1 && Date.now()-lastChange > 7.5) {
        lastChange = Date.now()
        mult[id] -= 0.01
    }

    let drawWidth = width * mult[id]
    let drawHeight = height * mult[id]
    let drawX = x - (drawWidth - width) / 2
    let drawY = y - (drawHeight - height) / 2

    utils.drawOutlinedRoundedRect(color, outlineColor, drawX, drawY, drawWidth, drawHeight, radius, thickness)

    boxes[id] = {x: drawX, y: drawY, width: drawWidth, height: drawHeight, username: username, clazz: clazz}
    if (clazz === "Tank") {
        clazz = "&2Tank"
        username = "&2"+ChatLib.removeFormatting(username)
    }
    if (clazz === "Berserk") {
        clazz = "&4Berserk"
        username = "&4"+ChatLib.removeFormatting(username)
    }
    if (clazz === "Archer") {
        clazz = "&6Archer"
        username = "&6"+ChatLib.removeFormatting(username)
    }
    if (clazz === "Healer") {
        clazz = "&dHealer"
        username = "&d"+ChatLib.removeFormatting(username)
    }
    if (clazz === "Mage") {
        clazz = "&bMage"
        username = "&b"+ChatLib.removeFormatting(username)
    }
    let name = new Text(username).setShadow(true).setScale(drawWidth/150)
    name.draw(drawX+10, drawY+10)
    let classText = new Text(clazz).setShadow(true).setScale(drawWidth/175)
    classText.draw(drawX+10, drawY+20+name.getHeight())
}

register("renderOverlay", () => {
    if (!Settings.leapOverlay) return
    if (!leapGui.isOpen()) return
    let centerY = Renderer.screen.height/2
    let centerX = Renderer.screen.width/2
    let offset = Renderer.screen.height/30
    let width = Renderer.screen.width/2.8
    let height = Renderer.screen.height/3.3
    let color = Renderer.color(30, 30, 30, 255)
    let outlineColor = Renderer.color(0, 0, 0, 255)
    let thickness = 2
    let radius = 5
    let lines = TabList.getNames()
    let players = []
    for (let line of lines) {
        line = String(line)
        if (ChatLib.removeFormatting(line).includes("(Tank")) {
            if (ChatLib.removeFormatting(line.split(" ")[1]) !== Player.getName()) {
                players.push(["Tank", line.split(" ")[1]])
            }
        }
        if (ChatLib.removeFormatting(line).includes("(Berserk")) {
            if (ChatLib.removeFormatting(line.split(" ")[1]) !== Player.getName()) {
                players.push(["Berserk", line.split(" ")[1]])
            }
        }
        if (ChatLib.removeFormatting(line).includes("(Archer")) {
            if (ChatLib.removeFormatting(line.split(" ")[1]) !== Player.getName()) {
                players.push(["Archer", line.split(" ")[1]])
            }
        }
        if (ChatLib.removeFormatting(line).includes("(Healer")) {
            if (ChatLib.removeFormatting(line.split(" ")[1]) !== Player.getName()) {
                players.push(["Healer", line.split(" ")[1]])
            }
        }
        if (ChatLib.removeFormatting(line).includes("(Mage")) {
            if (ChatLib.removeFormatting(line.split(" ")[1]) !== Player.getName()) {
                players.push(["Mage", line.split(" ")[1]])
            }
        }
    }
    while (players.length < 4) {
        players.push(["Unknown", "&cPlayer not found"])
    }

    players = sortPlayers(players)
    drawPlayer(color, outlineColor, centerX-offset-width, centerY-offset-height, width, height, radius, thickness, 0, players[0][1], players[0][0])
    drawPlayer(color, outlineColor, centerX+offset, centerY-offset-height, width, height, radius, thickness, 1, players[1][1], players[1][0])
    drawPlayer(color, outlineColor, centerX-offset-width, centerY+offset, width, height, radius, thickness, 2, players[2][1], players[2][0])
    drawPlayer(color, outlineColor, centerX+offset, centerY+offset, width, height, radius, thickness, 3, players[3][1], players[3][0])
}).setPriority(Priority.HIGH)
let inventory = null
register("guiOpened", (event) =>  {
    if (!Settings.leapOverlay) return
    let localSlots = event.gui.field_147002_h
    if (!localSlots) return
    let localInventory = new Inventory(localSlots)
    if (localInventory.getName() !== "Spirit Leap") return
    inventory = localInventory
    leapGui.open()
    utils.debugLog("Opening leap overlay.")
})

function leapTo(username, clazz) {
    if (inventory === null) return
    let items = inventory.getItems()
    let index = -1
    let toClick = null
    for (item of items) {
        index++
        try {
            let name = ChatLib.removeFormatting(item.getName())
            username = ChatLib.removeFormatting(username)
            utils.debugLog(username)
            if (name === username && ChatLib.removeFormatting(item.getLore()[1]) !== "This player is currently dead!") {
                toClick = index
            }
        } catch (error) {}
    }
    if (toClick) {
        inventory.click(toClick, false, "MIDDLE")
        utils.debugLog("Leaping to "+ChatLib.removeFormatting(username))
        if (Settings.leapAnnounce) {
            ChatLib.command("pc Leaping to "+ChatLib.removeFormatting(username)+" ("+ChatLib.removeFormatting(clazz)+")")
        }
        leapGui.close()
    } else {
        utils.chatLog("No player to leap to.")
    }
}

register("guiMouseClick", (mouseX, mouseY, mouseButton, gui, event) => {
    if (!Settings.leapOverlay) return
    if (!leapGui.isOpen()) return
    event.setCanceled(true)
    for (let box of boxes) {
        if (!isIn(mouseX, mouseY, box.x, box.y, box.width, box.height)) continue
        leapTo(box.username, box.clazz)
    }
})

register("guiKey", (char, keyCode, gui, event) => {
    if (!Settings.leapOverlay) return
    if (!Settings.leapKeybinds) return
    if (!leapGui.isOpen()) return
    if (![2,3,4,5,6].includes(keyCode)) return
    event.setCanceled(true)
    let lines = TabList.getNames()
    let tank = null
    let heal = null
    let mage = null
    let bers = null
    let arch = null
    for (let line of lines) {
        line = String(line)
        if (ChatLib.removeFormatting(line).includes("(Tank")) {
            if (ChatLib.removeFormatting(line.split(" ")[1]) !== Player.getName()) {
                tank = line.split(" ")[1]
            }
        }
        if (ChatLib.removeFormatting(line).includes("(Berserk")) {
            if (ChatLib.removeFormatting(line.split(" ")[1]) !== Player.getName()) {
                bers = line.split(" ")[1]
            }
        }
        if (ChatLib.removeFormatting(line).includes("(Archer")) {
            if (ChatLib.removeFormatting(line.split(" ")[1]) !== Player.getName()) {
                arch = line.split(" ")[1]
            }
        }
        if (ChatLib.removeFormatting(line).includes("(Healer")) {
            if (ChatLib.removeFormatting(line.split(" ")[1]) !== Player.getName()) {
                heal = line.split(" ")[1]
            }
        }
        if (ChatLib.removeFormatting(line).includes("(Mage")) {
            if (ChatLib.removeFormatting(line.split(" ")[1]) !== Player.getName()) {
                mage = line.split(" ")[1]
            }
        }
    }
    if (keyCode-1 === Settings.mageKeybind && mage !== null) {
        leapTo(mage, "Mage")
    }
    if (keyCode-1 === Settings.archerKeybind && arch !== null) {
        leapTo(arch, "Archer")
    }
    if (keyCode-1 === Settings.healerKeybind && heal !== null) {
        leapTo(heal, "Healer")
    }
    if (keyCode-1 === Settings.tankKeybind && tank !== null) {
        leapTo(tank, "Tank")
    }
    if (keyCode-1 === Settings.berserkKeybind && bers !== null) {
        leapTo(bers, "Berserk")
    }
})