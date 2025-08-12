import Settings from "./config"

positions = FileLib.read("./config/ChatTriggers/modules/shaweelAddons/positions.json")
positions = JSON.parse(positions)

editGui = new Gui()
cooldown = false
msBelow3 = false
movingKatana = false

const katanaHud = new Display()
katanaHud.setRenderX(positions.katanaHud.x)
katanaHud.setRenderY(positions.katanaHud.y)
katanaHud.setLine(0, "")
katanaHud.getLine(0).setScale(positions.katanaHud.scale)
katanaHud.getLine(0).setShadow(true)


function isIn(x, y, width, height, x2, y2) {
    minX = x
    maxX = x+width
    minY = y
    maxY = y+height
    if (x2 >= minX && x <= maxX && y2 >= minY && y <= maxY) {
        return true
    }
    return false
}

offsetX = 0
offsetY = 0
oldMousePos = {x:-1,y:-1}
isDragging = false

register("scrolled", (mouseX, mouseY, direction) => {
    width = katanaHud.getWidth()
    height = katanaHud.getHeight()
    if (!editGui.isOpen()) return
    if (!isIn(positions.katanaHud.x, positions.katanaHud.y, width, height, mouseX, mouseY)) return
    amount = direction/10
    if (positions.katanaHud.scale <= 0.25 && amount == -0.1) return
    if (positions.katanaHud.scale >= 10 && amount == 0.1) return
    positions.katanaHud.scale += amount
    katanaHud.getLine(0).setScale(positions.katanaHud.scale)
    katanaHud.setShouldRender(false)
    katanaHud.setShouldRender(true)

})

register("guiMouseClick", (mouseX, mouseY, mouseButton) => {
    width = katanaHud.getWidth()
    height = katanaHud.getHeight()
    if (!editGui.isOpen()) return
    if (!isIn(positions.katanaHud.x, positions.katanaHud.y, width, height, mouseX, mouseY)) return
    if (mouseButton != 0) return
    isDragging = true

    offsetX = mouseX - positions.katanaHud.x
    offsetY = mouseY - positions.katanaHud.y
})


register("tick", () => {    
    if (!isDragging) return
    mouseX = Client.getMouseX()
    mouseY = Client.getMouseY()
    if (oldMousePos.x == mouseX) return
    if (oldMousePos.y == mouseY) return
    oldMousePos.x = mouseX
    oldMousePos.y = mouseY
    positions.katanaHud.x = mouseX-offsetX
    positions.katanaHud.y = mouseY-offsetY
    katanaHud.setRenderX(positions.katanaHud.x)
    katanaHud.setRenderY(positions.katanaHud.y)
    katanaHud.setShouldRender(false)
    katanaHud.setShouldRender(true)
})

register("guiMouseRelease", (mouseX, mouseY, mouseButton) => {
    width = katanaHud.getWidth()
    height = katanaHud.getHeight()
    if (!editGui.isOpen()) return
    if (!isIn(positions.katanaHud.x, positions.katanaHud.y, width, height, mouseX, mouseY)) return
    if (mouseButton != 0) return
    isDragging = false
    jsonPos = JSON.stringify(positions)
    FileLib.write("./config/ChatTriggers/modules/shaweelAddons/positions.json", jsonPos)
})


function startMovingKatana() {
    editGui.open()
    katanaHud.setShouldRender(true)
    katanaHud.setLine(0, "&cKatana Ability NOT activated")
    katanaHud.getLine(0).setScale(positions.katanaHud.scale)
    katanaHud.getLine(0).setShadow(true)
}

register("command", startMovingKatana).setCommandName("shaweelgui")

countingDown = -1

function updateKatanaHud() {
    if (editGui.isOpen()) return
    katanaHud.setShouldRender(Settings.katanaHud)
    hasKatana = false
    itemId = Player.getHeldItem()
    if (itemId != null) {
        if (itemId.getNBT() != null) {
            try {
                item = String(itemId.getNBT().getTag("id"))
                itemId = String(itemId.getNBT().getTag("tag").getTag("ExtraAttributes").getTag("id"))
            } catch (error) {
                print("[shaweelAddons] Held item doesn't have a SkyBlock ID, assuming user isn't on skyblock and skipping feature.")
                return
            }
            while (true) {
                if (!itemId.includes('"')) break
                itemId = itemId.replace('"', "")
            }
            while (true) {
                if (!item.includes('"')) break
                item = item.replace('"', "")
            }
        }
    }
    if (countingDown > -1) {
        if (countingDown <= 0 && (itemId == "ATOMSPLIT_KATANA" || itemId == "VORPAL_KATANA" || itemId == "VOIDEDGE_KATANA") && item == "minecraft:diamond_sword") {
            katanaHud.setLine(0, "&cKatana Ability NOT activated")
            katanaHud.getLine(0).setScale(positions.katanaHud.scale)
            katanaHud.getLine(0).setShadow(true)
            countingDown = -1
            return
        }
        if (countingDown <= 0 && (itemId == "ATOMSPLIT_KATANA" || itemId == "VORPAL_KATANA" || itemId == "VOIDEDGE_KATANA") && item == "minecraft:golden_sword") {
            katanaHud.setLine(0, "&aKatana Ability activated (0)")
            katanaHud.getLine(0).setScale(positions.katanaHud.scale)
            katanaHud.getLine(0).setShadow(true)
            return
        }
        
        if (countingDown <= 0) {
            katanaHud.setLine(0, "&aKatana Ability activated (0)")
            katanaHud.getLine(0).setScale(positions.katanaHud.scale)
            katanaHud.getLine(0).setShadow(true)
            countingDown = -1
            return
        }
        countingDown -= 0.05
        displayCount = Math.round(countingDown*10)/10
        katanaHud.setLine(0, "&aKatana Ability activated ("+displayCount+")")
        katanaHud.getLine(0).setScale(positions.katanaHud.scale)
        katanaHud.getLine(0).setShadow(true)
        return
    }
    if (itemId == "ATOMSPLIT_KATANA" || itemId == "VORPAL_KATANA" || itemId == "VOIDEDGE_KATANA") {
        if (item == "minecraft:diamond_sword") {
            katanaHud.setLine(0, "&cKatana Ability NOT activated")
            katanaHud.getLine(0).setScale(positions.katanaHud.scale)
            katanaHud.getLine(0).setShadow(true)
        } else if (item == "minecraft:golden_sword" && countingDown == -1) {
            katanaHud.setLine(0, "&aKatana Ability activated (4)")
            countingDown = 4
            katanaHud.getLine(0).setScale(positions.katanaHud.scale)
            katanaHud.getLine(0).setShadow(true)
        }

        
    } else {
        katanaHud.setLine(0, "")
        katanaHud.getLine(0).setScale(positions.katanaHud.scale)
        katanaHud.getLine(0).setShadow(true)
    }
    katanaHud.setRenderX(positions.katanaHud.x)
    katanaHud.setRenderY(positions.katanaHud.y)
}

register("tick", updateKatanaHud)


const scaSound = new Sound({source: "shaweeladdons.seaCreature.ogg"})
const pssSound = new Sound({source: "shaweeladdons.ssFail.ogg"})
const lowHealthSound = new Sound({source: "shaweeladdons.lowHealth.ogg"})

function checkDungeon() {
    let names = TabList.getNames()
    for (let name of names) {
        if (!name.includes("§r§b§lDungeon: §r§7Catacombs§r")) continue
        return true
    }
    return false
}

register("actionBar", event => {
    let message = ChatLib.removeFormatting(ChatLib.getChatMessage(event));
    message = message.split(" ")[0]
    while (true) {
        if (!message.includes(",")) break
        message = message.replace(",", "")
    }
    while (true) {
        if (!message.includes("❤")) break
        message = message.replace("❤", "")
    }
    message = message.split("/")
    health = message[0]
    maxHealth = message[1]
    health = Number(health)
    maxHealth = Number(maxHealth)
    ratio = health/maxHealth
    if (cooldown) return    
    if (ratio > 0.5) return
    if (isNaN(ratio)) return
    print("[shaweelAddons] Alerting Low Health")
    print("health")
    print(health)
    print("maxHealth")
    print(maxHealth)
    print("ratio")
    print(ratio)

    if (Settings.lhsound) {
        print("[shaweelAddons] Playing low health sound")
        lowHealthSound.play()
    }
    if (!Settings.lhtitle) return
    print("[shaweelAddons] Showing low health title")
    Client.showTitle(Settings.lhtext, "", "0", "20", "5")
})


function seaCreatureAlert() {
    if (Settings.sctitle == true)
        print("[shaweelAddons] Showing sea creature title")
        Client.showTitle(Settings.sctext, "", "5", "20", "5")
    if (Settings.scsound == true)
        print("[shaweelAddons] Playing sea creature sound")
        scaSound.play()
}

function resetSSAlert() {
    if (Settings.sstitle == true)
        Client.showTitle(Settings.sstext, "", "5", "20", "5")
    if (Settings.sssound == true)
        pssSound.play()
}

function checkms() {
    let names = TabList.getNames()
    for (let name of names) {
        if (!name.includes(" Your Milestone: ")) continue
        let ms = name.split(" Your Milestone: §r§e")[1]
        ms = ms.split("§r")[0]
        if (ms=="?") {
            ms="0"
        }
        ms = ms.replace("☠", "")
        ms = ms.replace("❤", "")
        ms = ms.replace("☄", "")
        ms = ms.replace("♦", "")
        ms = ms.replace("⓿", "0")
        ms = ms.replace("❶", "1")
        ms = ms.replace("❷", "2")
        ms = ms.replace("❸", "3")
        ms = ms.replace("❹", "4")
        ms = ms.replace("❺", "5")
        ms = ms.replace("❻", "6")
        ms = ms.replace("❼", "7")
        ms = ms.replace("❽", "8")
        ms = ms.replace("❾", "9")
        return ms
    }
    return null
}    

register("command", checkms).setName("ms")


const requirementSets = [["restart", "rs", "reset", "slow"], ["ss", "dev", "simon says", "simonsays", "device"]]

function isValidBadSS(msg) {
    for (let requirementSet of requirementSets) {
        let passed = false
        for (let requirement of requirementSet) {
            if (msg.includes(requirement) == false) continue
            passed = true
            break
        }
        if (passed == false) return false
    }
    if (msg.includes("[BOSS]")) return false
    return true
}

register("chat", (message) => {
    if (!message.startsWith("Sending to server") && !message.startsWith("Отправление на сервер")) return
    cooldown = true
    setTimeout(() => {
        cooldown = false
    }, 5000)


}).setCriteria("${message}")

register("chat", (message) => {
    if (message == undefined) return
    message = message.toLowerCase()
    if (isValidBadSS(message) == false) return
    if (message.includes("[boss]")) return
    if (message.includes("bers")) return
    if (message.includes("class")) return
    if (!checkDungeon()) return
    print("[shaweelAddons] Alerting SS Reset, source: ")
    print(message)
    resetSSAlert()
}).setCriteria("${message}")

register("chat", seaCreatureAlert).setCriteria("A Squid appeared.")
register("chat", seaCreatureAlert).setCriteria("Your Chumcap Bucket trembles, it's an Agarimoo.")
register("chat", seaCreatureAlert).setCriteria("You caught a Sea Walker.")
register("chat", seaCreatureAlert).setCriteria("Pitch darkness reveals a Night Squid.")
register("chat", seaCreatureAlert).setCriteria("You stumbled upon a Sea Guardian.")
register("chat", seaCreatureAlert).setCriteria("It looks like you've disrupted the Sea Witch's brewing session. Watch out, she's furious!")
register("chat", seaCreatureAlert).setCriteria("You reeled in a Sea Archer.")
register("chat", seaCreatureAlert).setCriteria("The Rider of the Deep has emerged.")
register("chat", seaCreatureAlert).setCriteria("Huh? A Catfish!")
register("chat", seaCreatureAlert).setCriteria("Is this even a fish? It's the Carrot King!")
register("chat", seaCreatureAlert).setCriteria("Gross! A Sea Leech!")
register("chat", seaCreatureAlert).setCriteria("You've discovered a Guardian Defender of the sea.")
register("chat", seaCreatureAlert).setCriteria("You have awoken the Deep Sea Protector, prepare for a battle!")
register("chat", seaCreatureAlert).setCriteria("The Water Hydra has come to test your strength.")
register("chat", seaCreatureAlert).setCriteria("The Sea Emperor arises from the depths.")
register("chat", seaCreatureAlert).setCriteria("An Oasis Rabbit appears from the water.")
register("chat", seaCreatureAlert).setCriteria("An Oasis Sheep appears from the water.")
register("chat", seaCreatureAlert).setCriteria("A Water Worm surfaces!")
register("chat", seaCreatureAlert).setCriteria("A Poisoned Water Worm surfaces!")
register("chat", seaCreatureAlert).setCriteria("An Abyssal Miner breaks out of the water!")
register("chat", seaCreatureAlert).setCriteria("Phew! It's only a Scarecrow.")
register("chat", seaCreatureAlert).setCriteria("You hear trotting from beneath the waves, you caught a Nightmare.")
register("chat", seaCreatureAlert).setCriteria("It must be a full moon, a Werewolf appears.")
register("chat", seaCreatureAlert).setCriteria("The spirit of a long lost Phantom Fisher has come to haunt you.")
register("chat", seaCreatureAlert).setCriteria("This can't be! The manifestation of death himself!")
register("chat", seaCreatureAlert).setCriteria("Frozen Steve fell into the pond long ago, never to resurface...until now!")
register("chat", seaCreatureAlert).setCriteria("It's a snowman! He looks harmless.")
register("chat", seaCreatureAlert).setCriteria("The Grinch stole Jerry's Gifts...get them back!")
register("chat", seaCreatureAlert).setCriteria("What is this creature!?")
register("chat", seaCreatureAlert).setCriteria("You found a forgotten Nutcracker laying beneath the ice.")
register("chat", seaCreatureAlert).setCriteria("A Reindrake forms from the depths.")
register("chat", seaCreatureAlert).setCriteria("A tiny fin emerges from the water, you've caught a Nurse Shark.")
register("chat", seaCreatureAlert).setCriteria("You spot a fin as blue as the water it came from, it's a Blue Shark.")
register("chat", seaCreatureAlert).setCriteria("A striped beast bounds from the depths, the wild Tiger Shark!")
register("chat", seaCreatureAlert).setCriteria("Hide no longer, a Great White Shark has tracked your scent and thirsts for your blood!")
register("chat", seaCreatureAlert).setCriteria("From beneath the lava appears a Magma Slug.")
register("chat", seaCreatureAlert).setCriteria("You hear a faint Moo from the lava... A Moogma appears.")
register("chat", seaCreatureAlert).setCriteria("Smells of burning. Must be a Fried Chicken.")
register("chat", seaCreatureAlert).setCriteria("A small but fearsome Lava Leech emerges.")
register("chat", seaCreatureAlert).setCriteria("You feel the heat radiating as a Pyroclastic Worm surfaces.")
register("chat", seaCreatureAlert).setCriteria("A Lava Flame flies out from beneath the lava.")
register("chat", seaCreatureAlert).setCriteria("A Fire Eel slithers out from the depths.")
register("chat", seaCreatureAlert).setCriteria("Taurus and his steed emerge.")
register("chat", seaCreatureAlert).setCriteria("WOAH! A Plhlegblast appeared.")
register("chat", seaCreatureAlert).setCriteria("You hear a massive rumble as Thunder emerges.")
register("chat", seaCreatureAlert).setCriteria("You have angered a legendary creature... Lord Jawbus has arrived.")
register("chat", seaCreatureAlert).setCriteria("A Flaming Worm surfaces from the depths!")
register("chat", seaCreatureAlert).setCriteria("A Lava Blaze has surfaced from the depths!")
register("chat", seaCreatureAlert).setCriteria("A Lava Pigman arose from the depths!")

function updateTitle() {
    if (checkms() == null) return
    if (checkms() > 2) msBelow3 = false
    if (checkms() < 3) msBelow3 = true
    if (!msBelow3) return
    if (!Settings.cmtitle) return
    Client.showTitle(Settings.cmtext, "", "0", "20", "5")
}

register("tick", updateTitle)





function openSettings() {
    Settings.openGUI()
}

register("command", openSettings).setName("shaweeladdons").setAliases("shaweel", "sha", "shaddons", "saddons")

