import Settings from "./config"
import {request} from "requestV2"
TermsDone = 0
LeversDone = 0
zombieTranslation = FileLib.read("./config/ChatTriggers/modules/shaweelAddons/translations/zombie.txt")
while (true) {
    if (!zombieTranslation.includes(" ")) break
    zombieTranslation = zombieTranslation.replace(" ", "")
}

translations = {zombie: []}
translations.zombie = zombieTranslation.split(",")

shitters = FileLib.read("./config/ChatTriggers/modules/shaweelAddons/shitters.json")
shitters = JSON.parse(shitters)

positions = FileLib.read("./config/ChatTriggers/modules/shaweelAddons/positions.json")
positions = JSON.parse(positions)

debugModeVariable = FileLib.read("./config/ChatTriggers/modules/shaweelAddons/debugMode.txt")
debugModeVariable = Number(debugModeVariable)

editGui = new Gui()
cooldown = false
msBelow3 = false
movingKatana = false

debugLog("Debug mode is currently &aactivated &7meaning you will recieve debug messages, as to what is internally happening in the module, to deactivate it, run &a/shaweeladdons debugmode")
loaded = false
register("tick", () => {
    if (loaded) return
    loaded = true
    chatLog("&aModule loaded")
})
function debugLog(message) {
    if (debugModeVariable == 1) {
        ChatLib.chat("&d[shaweelAddons] &e[DEBUG] &7"+message)
    }
}

function chatLog(message) {
    ChatLib.chat("&d[shaweelAddons] &7"+message)
}

let bz = {}
let ah = {}
function updateBazaar() {
    request({
        url: "https://api.hypixel.net/skyblock/bazaar",
        json: true
    }).then(data => {
        bz = data.products
    })
    debugLog("Bazaar updated")
}
function updateAuction() {
    request({
        url: "https://moulberry.codes/lowestbin.json",
        json: true
    }).then(data => {
        ah = data
    })
    debugLog("Auction updated")
}
updateBazaar()
updateAuction()
ticks = 0
register("tick", () => {
    ticks++
    if (ticks >= 100) {
        updateBazaar()
        updateAuction()
        ticks = 0
    }
})

/*
0 - katanaHud
1 - Splits
*/

function roundToDecimals(num, amount) {
    changer = 10**amount
    num = num*changer
    num = Math.round(num)
    num = num/changer
    return num
}


function formatNumber(num) {
    num = String(roundToDecimals(num, 1))
    if (!num.includes(".")) {
        num = num+".0"
    }
    return num
}

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

sizeAndPos = new Display()
sizeAndPos.setShouldRender(false)
sizeAndPos.setLine(0, "Scale: 1, Alignment: left, X: 0, Y: 0")
sizeAndPos.getLine(0).setShadow(true)
sizeAndPos.getLine(0).setScale(1)


register("tick", () => {
    guiEdit.setRenderX(Renderer.screen.getWidth()/2)
    index = -1
    for (element of elements) {
        index += 1
        if (guiToSelect != assignElementName(index)) {
            element.setBackground(DisplayHandler.Background.NONE)
        }
    }
    if (!editGui.isOpen()) {
        sizeAndPos.setShouldRender(false)
        guiEdit.setShouldRender(false)
    }
})

elements = [
    new Display(),
    new Display(),
    new Display()
]

bossStart=["Gratz for making it this far, but I’m basically unbeatable.", "This is where the journey ends for you, Adventurers.", "I was burdened with terrible news recently...", "Welcome Adventurers! I am Thorn, the Spirit! And host of the Vegan Trials!", "Welcome, you arrive right on time. I am Livid, the Master of Shadows.", "So you made it all the way here... Now you wish to defy me? Sadan?!"]
bossEnd=["Alright, maybe I'm just weak after all..", "Whatever...", "What?! My Guardian power is unbeatable!", "Whatttt? How did they win??", "Impossible! How did you figure out which one I was?!", "NOOOOOOOOO!!! THIS IS IMPOSSIBLE!!"]

register("chat", (msg) => {
    if (bossStart.includes(msg)) {
        chatLog("&aEnter &7phase of dungeon completed in "+formatNumber(enterTime)+"s")
        debugLog("&bMaxor &7phase of dungeon started.")
        f7Split = "Maxor"
    }
    if (bossEnd.includes(msg)) {
        chatLog("&bBoss &7phase of dungeon completed in "+formatNumber(enterTime)+"s")
        debugLog("&aDungeon Completed")
        f7Split = "Nothing"
    }
}).setCriteria("${msg}")

//katanaHud
elements[0].setAlign(positions.katanaHud.align)
elements[0].setRenderX(positions.katanaHud.x)
elements[0].setRenderY(positions.katanaHud.y)
elements[0].setLine(0, "")
elements[0].getLine(0).setScale(positions.katanaHud.scale)
elements[0].getLine(0).setShadow(true)

//Splits
elements[1].setAlign(positions.Splits.align)
elements[1].setRenderX(positions.Splits.x)
elements[1].setRenderY(positions.Splits.y)
elements[1].setLine(0, "&cBlood Open: 0.0s")
elements[1].getLine(0).setScale(positions.Splits.scale)
elements[1].getLine(0).setShadow(true)
elements[1].setLine(1, "&4Blood Clear: 0.0s")
elements[1].getLine(1).setScale(positions.Splits.scale)
elements[1].getLine(1).setShadow(true)
elements[1].setLine(2, "&aEnter: 0.0s")
elements[1].getLine(2).setScale(positions.Splits.scale)
elements[1].getLine(2).setShadow(true)
elements[1].setLine(3, "&bMaxor: 0.0s")
elements[1].getLine(3).setScale(positions.Splits.scale)
elements[1].getLine(3).setShadow(true)
elements[1].setLine(4, "&dStorm: 0.0s")
elements[1].getLine(4).setScale(positions.Splits.scale)
elements[1].getLine(4).setShadow(true)
elements[1].setLine(5, "&6Terminal Section 1: 0.0s")
elements[1].getLine(5).setScale(positions.Splits.scale)
elements[1].getLine(5).setShadow(true)
elements[1].setLine(6, "&6Terminal Section 2: 0.0s")
elements[1].getLine(6).setScale(positions.Splits.scale)
elements[1].getLine(6).setShadow(true)
elements[1].setLine(7, "&6Terminal Section 3: 0.0s")
elements[1].getLine(7).setScale(positions.Splits.scale)
elements[1].getLine(7).setShadow(true)
elements[1].setLine(8, "&6Terminal Section 4: 0.0s")
elements[1].getLine(8).setScale(positions.Splits.scale)
elements[1].getLine(8).setShadow(true)
elements[1].setLine(9, "&eGoldor: 0.0s")
elements[1].getLine(9).setScale(positions.Splits.scale)
elements[1].getLine(9).setShadow(true)
elements[1].setLine(10, "&cNecron: 0.0s")
elements[1].getLine(10).setScale(positions.Splits.scale)
elements[1].getLine(10).setShadow(true)
elements[1].setLine(11, "&5Dragons: 0.0s")
elements[1].getLine(11).setScale(positions.Splits.scale)
elements[1].getLine(11).setShadow(true)
elements[2].setAlign(positions.chestProfit.align)
elements[2].setRenderX(positions.chestProfit.x)
elements[2].setRenderY(positions.chestProfit.y)


bloodOpened = false
bloodCleared = false
f7Split="Nothing"
bloodOpenTime=0.00
bloodClearTime=0.00
enterTime=0.00
maxorTime=0.00
stormTime=0.00
term1Time=0.00
term2Time=0.00
term3Time=0.00
term4Time=0.00
goldorTime=0.00
necronTime=0.00
dragonsTime=0.00
gateDestroyed = false

function formatLargeNumber(num) {
    sign = Math.sign(num)
    num = Math.abs(num)
    num = String(num)
    numLen = num.length
    if (numLen < 4) return num
    itter = 0
    numArray = []
    for (char of num) {
        numArray.push(char)
    }
    amount = 0
    for (char of num) {
        itter += 1
        if (numLen % 3 == itter % 3 && itter != numLen) {
            numArray.splice(itter+amount, 0, ",")
            amount++
        }
    }
    if (sign == -1) {
        num = "-"
    } else {
        num = ""
    }
    for (char of numArray) {
        num += char
    }
    return num
}
chestTypes = ["Wood Chest", "Gold Chest", "Diamond Chest", "Emerald Chest", "Obsidian Chest", "Bedrock Chest"]
function inChest() {
    if (chestTypes.includes(Player.getContainer().getName())) {
        return true
    }
    return false
}

function inChestMenu() {
    if (Player.getContainer().getName().includes("The Catacombs")) {
        return true
    }
    return false
}

function getItemsFromLootChest() {
    if (!inChest()) return undefined
    chest = Player.getContainer()
    items = []
    items.push(chest.getStackInSlot(9), chest.getStackInSlot(10), chest.getStackInSlot(11), chest.getStackInSlot(12), chest.getStackInSlot(13), chest.getStackInSlot(14), chest.getStackInSlot(15), chest.getStackInSlot(16), chest.getStackInSlot(17))
    olditems = []
    olditems.push(chest.getStackInSlot(9), chest.getStackInSlot(10), chest.getStackInSlot(11), chest.getStackInSlot(12), chest.getStackInSlot(13), chest.getStackInSlot(14), chest.getStackInSlot(15), chest.getStackInSlot(16), chest.getStackInSlot(17))
    index = -1
    removed = 0
    for (item of olditems) {
        index+=1
        if (item == null) {
            items.splice(index-removed, 1) 
            removed += 1
            continue
        }
        if (item.getID() == 160) {
            items.splice(index-removed, 1) 
            removed += 1
        }
    }
    return items
}

function getChests() {
    if (!inChestMenu()) return undefined
    menu = Player.getContainer()
    items = []
    items.push(menu.getStackInSlot(9), menu.getStackInSlot(10), menu.getStackInSlot(11), menu.getStackInSlot(12), menu.getStackInSlot(13), menu.getStackInSlot(14), menu.getStackInSlot(15), menu.getStackInSlot(16), menu.getStackInSlot(17), menu.getStackInSlot(18), menu.getStackInSlot(19), menu.getStackInSlot(20), menu.getStackInSlot(21), menu.getStackInSlot(22), menu.getStackInSlot(23), menu.getStackInSlot(24), menu.getStackInSlot(25), menu.getStackInSlot(26))
    olditems = []
    olditems.push(menu.getStackInSlot(9), menu.getStackInSlot(10), menu.getStackInSlot(11), menu.getStackInSlot(12), menu.getStackInSlot(13), menu.getStackInSlot(14), menu.getStackInSlot(15), menu.getStackInSlot(16), menu.getStackInSlot(17), menu.getStackInSlot(18), menu.getStackInSlot(19), menu.getStackInSlot(20), menu.getStackInSlot(21), menu.getStackInSlot(22), menu.getStackInSlot(23), menu.getStackInSlot(24), menu.getStackInSlot(25), menu.getStackInSlot(26))
    index = -1
    removed = 0
    for (item of olditems) {
        index+=1
        if (item == null) {
            items.splice(index-removed, 1) 
            removed += 1
            continue
        }
        if (item.getID() == 160) {
            items.splice(index-removed, 1) 
            removed += 1
        }
    }
    return items
}

function getProfitFromLore(lore) {
    tprofit = 0
    items = []
    chestcost = NaN
    for (line of lore) {
        if (line.includes("Coins") || line.includes("FREE")) chestcost = line 
    }
    chestcost = ChatLib.removeFormatting(chestcost)
    if (chestcost.includes("FREE")) {
        chestcost = 0
    } else {
        chestcost = chestcost.split(" Coins")[0]
    
        while (chestcost.includes(",")) {
            chestcost = chestcost.replace(",", "")
        }    
        chestcost = Number(chestcost)
    }

    iiindex = -1
    for (line of lore) {
        iiindex++
        if (iiindex < 2) continue
        if (line.includes("Cost")) {
            items.splice(items.length-1,1)
            break
        }
        items.push(line)
    }
    tprofit=0
    for (item of items) {
        itemProfit = getProfit(item)
        tprofit += itemProfit
    }
    tprofit -= chestcost
    tprofit = Math.floor(tprofit)
    return tprofit
}

function getProfit(name) {
    profit = null
    if (name.includes("Wither")) {
        profit = bz.SHARD_WITHER.quick_status.sellPrice
    }
    if (name.includes("Wither Essence")) {
        amount = name.split("x")[1]
        amount = Number(amount)
        price = bz.ESSENCE_WITHER.quick_status.sellPrice
        profit = price*amount
    }
    if (name.includes("Undead Essence")) {
        amount = name.split("x")[1]
        amount = Number(amount)
        price = bz.ESSENCE_UNDEAD.quick_status.sellPrice
        profit = price*amount
    }
    if (name.includes("Bank I") || name.includes("Bank 1")) {
        profit = bz.ENCHANTMENT_ULTIMATE_BANK_1.quick_status.sellPrice
    }
    if (name.includes("Bank II") || name.includes("Bank 2")) {
        profit = bz.ENCHANTMENT_ULTIMATE_BANK_2.quick_status.sellPrice
    }
    if (name.includes("Bank III") || name.includes("Bank 3")) {
        profit = bz.ENCHANTMENT_ULTIMATE_BANK_3.quick_status.sellPrice
    }
    if (name.includes("Combo I") || name.includes("Combo 1")) {
        profit = bz.ENCHANTMENT_ULTIMATE_COMBO_1.quick_status.sellPrice
    }
    if (name.includes("Combo II") || name.includes("Combo 2")) {
        profit = bz.ENCHANTMENT_ULTIMATE_COMBO_2.quick_status.sellPrice
    }
    if (name.includes("Ultimate Wise I") || name.includes("Ultimate Wise 1")) {
        profit = bz.ENCHANTMENT_ULTIMATE_WISE_1.quick_status.sellPrice
    }
    if (name.includes("Ultimate Wise II") || name.includes("Ultimate Wise 2")) {
        profit = bz.ENCHANTMENT_ULTIMATE_WISE_2.quick_status.sellPrice
    }
    if (name.includes("Wisdom I") || name.includes("Wisdom 1")) {
        profit = bz.ENCHANTMENT_ULTIMATE_WISDOM_1.quick_status.sellPrice
    }
    if (name.includes("Wisdom II") || name.includes("Wisdom 2")) {
        profit = bz.ENCHANTMENT_ULTIMATE_WISDOM_2.quick_status.sellPrice
    }
    if (name.includes("Ultimate Jerry I") || name.includes("Ultimate Jerry 1")) {
        profit = bz.ENCHANTMENT_ULTIMATE_JERRY_1.quick_status.sellPrice
    }
    if (name.includes("Ultimate Jerry II") || name.includes("Ultimate Jerry 2")) {
        profit = bz.ENCHANTMENT_ULTIMATE_JERRY_2.quick_status.sellPrice
    }
    if (name.includes("Ultimate Jerry III") || name.includes("Ultimate Jerry 3")) {
        profit = bz.ENCHANTMENT_ULTIMATE_JERRY_3.quick_status.sellPrice
    }
    if (name.includes("Infinite Quiver VI") || name.includes("Infinite Quiver 6")) {
        profit = bz.ENCHANTMENT_INFINITE_QUIVER_6.quick_status.sellPrice
    }
    if (name.includes("Infinite Quiver VII") || name.includes("Infinite Quiver 7")) {
        profit = bz.ENCHANTMENT_INFINITE_QUIVER_7.quick_status.sellPrice
    }
    if (name.includes("Feather Falling VI") || name.includes("Feather Falling 6")) {
        profit = bz.ENCHANTMENT_FEATHER_FALLING_6.quick_status.sellPrice
    }
    if (name.includes("Feather Falling VII") || name.includes("Feather Falling 7")) {
        profit = bz.ENCHANTMENT_FEATHER_FALLING_7.quick_status.sellPrice
    }
    if (name.includes("Rejuvenate I") || name.includes("Rejuvenate 1")) {
        profit = bz.ENCHANTMENT_REJUVENATE_1.quick_status.sellPrice
    }
    if (name.includes("Swarm I") || name.includes("Swarm 1")) {
        profit = bz.ENCHANTMENT_ULTIMATE_SWARM_1.quick_status.sellPrice
    }
    if (name.includes("Legion I") || name.includes("Legion 1")) {
        profit = bz.ENCHANTMENT_ULTIMATE_LEGION_1.quick_status.sellPrice
    }
    if (name.includes("Rend I") || name.includes("Rend 1")) {
        profit = bz.ENCHANTMENT_ULTIMATE_REND_1.quick_status.sellPrice
    }
    if (name.includes("Rend II") || name.includes("Rend 2")) {
        profit = bz.ENCHANTMENT_ULTIMATE_REND_2.quick_status.sellPrice
    }
    if (name.includes("Overload I") || name.includes("Overload 1")) {
        profit = bz.ENCHANTMENT_OVERLOAD_1.quick_status.sellPrice
    }
    if (name.includes("Lethality I") || name.includes("Lethality 1")) {
        profit = bz.ENCHANTMENT_LETHALITY_6.quick_status.sellPrice
    }
    if (name.includes("Rejuvenate II") || name.includes("Rejuvenate 2")) {
        profit = bz.ENCHANTMENT_REJUVENATE_2.quick_status.sellPrice
    }
    if (name.includes("Rejuvenate III") || name.includes("Rejuvenate 3")) {
        profit = bz.ENCHANTMENT_REJUVENATE_3.quick_status.sellPrice
    }
    if (name.includes("No Pain No Gain I") || name.includes("No Pain No Gain 1")) {
        profit = bz.ENCHANTMENT_ULTIMATE_NO_PAIN_NO_GAIN_1.quick_status.sellPrice
    }
    if (name.includes("No Pain No Gain II") || name.includes("No Pain No Gain 2")) {
        profit = bz.ENCHANTMENT_ULTIMATE_NO_PAIN_NO_GAIN_2.quick_status.sellPrice
    }
    if (name.includes("Soul Eater I") || name.includes("Soul Eater 1")) {
        profit = bz.ENCHANTMENT_ULTIMATE_SOUL_EATER_1.quick_status.sellPrice
    }
    if (name.includes("Last Stand I") || name.includes("Last Stand 1")) {
        profit = bz.ENCHANTMENT_ULTIMATE_LAST_STAND_1.quick_status.sellPrice
    }
    if (name.includes("Last Stand II") || name.includes("Last Stand 2")) {
        profit = bz.ENCHANTMENT_ULTIMATE_LAST_STAND_2.quick_status.sellPrice
    }
    if (name.includes("One For All I") || name.includes("One For All 1")) {
        profit = bz.ENCHANTMENT_ULTIMATE_ONE_FOR_ALL_1.quick_status.sellPrice
    }
    if (name.includes("Thunderlord VII") || name.includes("Thunderlord 7")) {
        profit = bz.ENCHANTMENT_THUNDERLORD_7.quick_status.sellPrice
    }
    if (name.includes("Necromancer's Brooch")) {
        profit = bz.NECROMANCER_BROOCH.quick_status.sellPrice
    }
    if (name.includes("Hot Potato Book")) {
        profit = bz.HOT_POTATO_BOOK.quick_status.sellPrice
    }
    if (name.includes("Fuming Potato Book")) {
        profit = bz.FUMING_POTATO_BOOK.quick_status.sellPrice
    }
    if (name.includes("Red Nose")) {
        profit = bz.RED_NOSE.quick_status.sellPrice
    }
    if (name.includes("Balloon Snake")) {
        profit = ah.BALLOON_SNAKE
    }
    if (name.includes("Bonzo's Mask")) {
        profit = ah.BONZO_MASK
    }
    if (name.includes("Bonzo's Staff")) {
        profit = ah.BONZO_STAFF
    }
    if (name.includes("Recombobulator 3000")) {
        profit = bz.RECOMBOBULATOR_3000.quick_status.sellPrice
    }
    if (name.includes("Master Skull - Tier 1")) {
        profit = ah.MASTER_SKULL_TIER_1
    }
    if (name.includes("Master Skull - Tier 2")) {
        profit = ah.MASTER_SKULL_TIER_2
    }
    if (name.includes("Master Skull - Tier 3")) {
        profit = ah.MASTER_SKULL_TIER_3
    }
    if (name.includes("Master Skull - Tier 4")) {
        profit = ah.MASTER_SKULL_TIER_4
    }
    if (name.includes("Master Skull - Tier 5")) {
        profit = ah.MASTER_SKULL_TIER_5
    }
    if (name.includes("Scarf's Studies")) {
        profit = ah.SCARF_STUDIES
    }
    if (name.includes("Dark Claymore")) {
        profit = ah.DARK_CLAYMORE
    }
    if (name.includes("Necron's Handle")) {
        profit = ah.NECRON_HANDLE
    }
    if (name.includes("Auto Recombobulator")) {
        profit = ah.AUTO_RECOMBOBULATOR
    }
    if (name.includes("Wither Shield")) {
        profit = bz.WITHER_SHIELD_SCROLL.quick_status.sellPrice
    }
    if (name.includes("Storm The Fish")) {
        profit = ah.STORM_THE_FISH
    }
    if (name.includes("Maxor The Fish")) {
        profit = ah.MAXOR_THE_FISH
    }
    if (name.includes("Goldor The Fish")) {
        profit = ah.GOLDOR_THE_FISH
    }
    if (name.includes("Dungeon Disc")) {
        profit = ah.DUNGEON_DISC_1
    }
    if (name.includes("Clown Disc")) {
        profit = ah.DUNGEON_DISC_2
    }
    if (name.includes("Watcher Disc")) {
        profit = ah.DUNGEON_DISC_3
    }
    if (name.includes("Necron Disc")) {
        profit = ah.DUNGEON_DISC_4
    }
    if (name.includes("Old Disc")) {
        profit = ah.DUNGEON_DISC_5
    }
    if (name.includes("Wither Cloak Sword")) {
        profit = ah.WITHER_CLOAK
    }
    if (name.includes("Shadow Warp")) {
        profit = bz.SHADOW_WARP_SCROLL.quick_status.sellPrice
    }
    if (name.includes("Red Scarf")) {
        profit = bz.RED_SCARF.quick_status.sellPrice
    }
    if (name.includes("Dark Orb")) {
        profit = bz.DARK_ORB.quick_status.sellPrice
    }
    if (name.includes("Wither Blood")) {
        profit = bz.WITHER_BLOOD.quick_status.sellPrice
    }
    if (name.includes("Wither Catalyst")) {
        profit = bz.WITHER_CATALYST.quick_status.sellPrice
    }
    if (name.includes("Precursor Gear")) {
        profit = bz.PRECURSOR_GEAR.quick_status.sellPrice
    }
    if (name.includes("Sadan's Brooch")) {
        profit = bz.SADAN_BROOCH.quick_status.sellPrice
    }
    if (name.includes("Giant Tooth")) {
        profit = bz.GIANT_TOOTH.quick_status.sellPrice
    }
    if (name.includes("Warped Stone")) {
        profit = bz.AOTE_STONE.quick_status.sellPrice
    }
    if (name.includes("Suspicious Vial")) {
        profit = bz.SUSPICIOUS_VIAL.quick_status.sellPrice
    }
    if (name.includes("Adaptive Blade")) {
        profit = ah.STONE_BLADE
    }
    if (name.includes("Adaptive Belt")) {
        profit = ah.ADAPTIVE_BELT
    }
    if (name.includes("Livid Dagger")) {
        profit = ah.LIVID_DAGGER
    }
    if (name.includes("Shadow Fury")) {
        profit = ah.SHADOW_FURY
    }
    if (name.includes("Last Breath")) {
        profit = ah.LAST_BREATH
    }
    if (name.includes("Precursor Eye")) {
        profit = ah.PRECURSOR_EYE
    }
    if (name.includes("Giant's Sword")) {
        profit = ah.GIANTS_SWORD
    }
    if (name.includes("Fel Skull")) {
        profit = ah.FEL_SKULL
    }
    if (name.includes("Necromancer Sword")) {
        profit = ah.NECROMANCER_SWORD
    }
    if (name.includes("Summoning Ring")) {
        profit = ah.SUMMONING_RING
    }
    if (name.includes("Soulweaver Gloves")) {
        profit = ah.SOULWEAVER_GLOVES
    }
    if (name.includes("First Master Star")) {
        profit = bz.FIRST_MASTER_STAR.quick_status.sellPrice
    }
    if (name.includes("Second Master Star")) {
        profit = bz.SECOND_MASTER_STAR.quick_status.sellPrice
    }
    if (name.includes("Third Master Star")) {
        profit = bz.THIRD_MASTER_STAR.quick_status.sellPrice
    }
    if (name.includes("Fourth Master Star")) {
        profit = bz.FOURTH_MASTER_STAR.quick_status.sellPrice
    }
    if (name.includes("Fifth Master Star")) {
        profit = bz.FIFTH_MASTER_STAR.quick_status.sellPrice
    }
    if (name.includes("Adaptive Boots")) {
        profit = ah.ADAPTIVE_BOOTS
    }
    if (name.includes("Adaptive Chestplate")) {
        profit = ah.ADAPTIVE_CHESTPLATE
    }
    if (name.includes("Adaptive Leggings")) {
        profit = ah.ADAPTIVE_LEGGINGS
    }
    if (name.includes("Adaptive Helmet")) {
        profit = ah.ADAPTIVE_HELMET
    }
    if (name.includes("Wither Boots")) {
        profit = ah.WITHER_BOOTS
    }
    if (name.includes("Wither Chestplate")) {
        profit = ah.WITHER_CHESTPLATE
    }
    if (name.includes("Wither Leggings")) {
        profit = ah.WITHER_LEGGINGS
    }
    if (name.includes("Wither Helmet")) {
        profit = ah.WITHER_HELMET
    }
    if (name.includes("Shadow Assassin Boots")) {
        profit = ah.SHADOW_ASSASSIN_BOOTS
    }
    if (name.includes("Shadow Assassin Chestplate")) {
        profit = ah.SHADOW_ASSASSIN_CHESTPLATE
    }
    if (name.includes("Shadow Assassin Leggings")) {
        profit = ah.SHADOW_ASSASSIN_LEGGINGS
    }
    if (name.includes("Shadow Assassin Helmet")) {
        profit = ah.SHADOW_ASSASSIN_HELMET
    }
    if (name.includes("Necromancer Lord Boots")) {
        profit = ah.NECROMANCER_LORD_BOOTS
    }
    if (name.includes("Necromancer Lord Chestplate")) {
        profit = ah.NECROMANCER_LORD_CHESTPLATE
    }
    if (name.includes("Necromancer Lord Leggings")) {
        profit = ah.NECROMANCER_LORD_LEGGINGS
    }
    if (name.includes("Necromancer Lord Helmet")) {
        profit = ah.NECROMANCER_LORD_HELMET
    }
    if (name.includes("Shadow Assassin Cloak")) {
        profit = ah.SHADOW_ASSASSIN_CLOAK
    }
    if (name.includes("Spirit") && name.includes("Lvl")) {
        if (name.includes("&5")) {
            profit = ah.SPIRIT;3;
        } else {
            profit = ah.SPIRIT;4;
        }
    }

    if (name.includes("Spirit Stone")) {
        profit = bz.SPIRIT_DECOY.quick_status.sellPrice
    }
    if (name.includes("Spirit Wing")) {
        profit = bz.SPIRIT_WING.quick_status.sellPrice
    }
    if (name.includes("Apex Dragon")) {
        profit = bz.SHARD_APEX_DRAGON.quick_status.sellPrice
    }
    if (name.includes("Power Dragon")) {
        profit = bz.SHARD_POWER_DRAGON.quick_status.sellPrice
    }
    if (name.includes("Spirit Boots")) {
        profit = ah.THORNS_BOOTS
    }
    if (name.includes("Spirit Bone")) {
        profit = bz.SPIRIT_BONE.quick_status.sellPrice
    }
    if (name.includes("Spirit Sword")) {
        profit = ah.SPIRIT_SWORD
    }
    if (name.includes("Spirit Shortbow")) {
        profit = ah.ITEM_SPIRIT_BOW
    }
    if (profit == null) profit = 0
    return profit
}

register("tick", () => {
    if (editGui.isOpen()) return
    if (inChestMenu()) return
    index = -1
    for (line of elements[2].getLines()) {
        index += 1
        elements[2].setLine(index, "")
    }
    if (!inChest()) return
    loot = getItemsFromLootChest()
    chest = Player.getContainer().getName()
    if (chest == "Wood Chest") {
        elements[2].setLine(0, "&fWood Chest")
    } else if (chest == "Gold Chest") {
        elements[2].setLine(0, "&6Gold Chest")
    } else if (chest == "Diamond Chest") {
        elements[2].setLine(0, "&bDiamond Chest")
    } else if (chest == "Emerald Chest") {
        elements[2].setLine(0, "&2Emerald Chest")
    } else if (chest == "Obsidian Chest") {
        elements[2].setLine(0, "&5Obsidian Chest")
    } else if (chest == "Bedrock Chest") {
        elements[2].setLine(0, "&8Bedrock Chest")
    }
    elements[2].getLine(0).setScale(positions.chestProfit.scale)
    elements[2].getLine(0).setShadow(true)
    index = 0
    totalprofit = 0
    chestcost = Player.getContainer().getStackInSlot(31)
    if (chestcost != null) {
        chestcost = chestcost.getLore()[7]
        chestcost = ChatLib.removeFormatting(chestcost)
        if (chestcost.includes("FREE")) {
            chestcost = 0
        } else {
            chestcost = chestcost.split(" Coins")[0]
        
            while (chestcost.includes(",")) {
                chestcost = chestcost.replace(",", "")
            }    
            chestcost = Number(chestcost)
        }
    } else {
        chestcost = 0
    }
    for (item of loot) {
        elements[2].setShouldRender(true)
        index += 1
        name = item.getName()
        if (name.includes("Enchanted Book")) {
            name = item.getLore()[1]
        }
        profit = getProfit(name)
        profit = Math.floor(profit)
        if (profit > 0) {
            elements[2].setLine(index, name+"&7 - &a+"+formatLargeNumber(profit))
        } else if (profit == 0) {
            elements[2].setLine(index, name+"&7 - &e0")
        } else {
            elements[2].setLine(index, name+"&7 - &c"+formatLargeNumber(profit))
        }
        elements[2].getLine(index).setScale(positions.chestProfit.scale)
        elements[2].getLine(index).setShadow(true)
        if (profit == NaN) return
        totalprofit += profit
    }
    totalprofit -= chestcost
    chestcost = Math.floor(chestcost)
    elements[2].setLine(index+2, "&7Chest Cost - &c-"+formatLargeNumber(chestcost))
    if (chestcost == 0) {
        elements[2].setLine(index+2, "&7Chest Cost - &aFREE")
    }
    elements[2].getLine(index+2).setScale(positions.chestProfit.scale)
    elements[2].getLine(index+2).setShadow(true)
    totalprofit = Math.floor(totalprofit)
    formatted = formatLargeNumber(totalprofit)
    if (totalprofit > 0) {
        elements[2].setLine(index+3, "&7Total Profit - &a+"+formatted)
    } else if (totalprofit == 0) {
        elements[2].setLine(index+3, "&7Total Profit - &e0")
    } else {
        elements[2].setLine(index+3, "&7Total Profit -&c "+formatted)
    }

    elements[2].getLine(index+3).setScale(positions.chestProfit.scale)
    elements[2].getLine(index+3).setShadow(true)
})

register("tick", () => {
    if (editGui.isOpen()) return
    if (inChest()) return
    index = -1
    for (line of elements[2].getLines()) {
        index += 1
        elements[2].setLine(index, "")
    }
    if (!inChestMenu()) return
    chests = getChests()
    index = -1
    chestsAndProfits = {"Wood Chest": 0, "Gold Chest": 0, "Diamond Chest": 0, "Emerald Chest": 0, "Obsidian Chest": 0, "Bedrock Chest": 0}
    for (chest of chests) {
        index += 1
        profit = getProfitFromLore(chest.getLore())
        chestName = chest.getName()
        formatted = formatLargeNumber(profit)
        if (profit > 0) {
            elements[2].setLine(index, chestName+"&7 - &a+"+formatted)
        } else if (profit == 0) {
            elements[2].setLine(index, chestName+"&7 - &e0")
        } else {
            elements[2].setLine(index, chestName+"&7 -&c "+formatted)
        }
        chestName = ChatLib.removeFormatting(chestName)
        chestsAndProfits[chestName] = profit
        elements[2].getLine(index).setScale(positions.chestProfit.scale)
        elements[2].getLine(index).setShadow(true)
    }
    best = Object.entries(chestsAndProfits).reduce((a, b) => a[1] > b[1] ? a : b)[0]
    
    for (chest of chests) {
        chestName = chest.getName()
        if (!chestName.includes(best)) continue
        chest.setName(chestName+" &a[BEST]")
        chest.setStackSize(64)
    }
})

register("guiRender", () => {
    index = -1
    len = elements[2].getLines().length
    for (line of elements[2].getLines()) {
        index++
        line.getText().setAlign(positions.chestProfit.align).draw(positions.chestProfit.x, positions.chestProfit.y+10*index*positions.chestProfit.scale)
        elements[2].setShouldRender(false)
    }
})
allTermsDone = false
register("tick", () => {
    if (editGui.isOpen()) return
    if (!checkDungeon() || !Settings.Splits) {
        elements[1].setShouldRender(false)
    } else {
        elements[1].setShouldRender(true)
    }
})

function getDungeonFloor() {
    if (!checkDungeon()) return -1
    lines = Scoreboard.getLines()
    floor = ""
    for (line of lines) {
        line = String(line)
        if (line.includes("Cata")) {
            floor = line
        }
    }
    if (floor.includes("F")) {
        floorNum = Number(floor.split("F")[1].replace(")", ""))
        return floorNum
    }
    if (floor.includes("M")) {
        floorNum = Number(floor.split("M")[1].replace(")", ""))
        return floorNum+7
    }
    return -1
}

register("chat", () => {
    chatLog("&aEnter &7phase of dungeon completed in "+formatNumber(enterTime)+"s")
    debugLog("&bMaxor &7phase of dungeon started.")
    f7Split="Maxor"
}).setCriteria("[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!")


watcherOpen = ["Congratulations, you made it through the Entrance.", "Ah, you've finally arrived.", "Ah, we meet again...", "So you made it this far... interesting.", "You've managed to scratch and claw your way here, eh?", "I'm starting to get tired of seeing you around here...", "Oh.. hello?", "Things feel a little more roomy now, eh?"]
register("chat", (msg) => {
    if (!watcherOpen.includes(msg)) return
    chatLog("&cBlood Opened&7 in &a"+formatNumber(bloodOpenTime)+"s")
    bloodOpened = true
}).setCriteria("${msg}")
register("chat", () => {
    chatLog("&4Blood Cleared &7in &a"+formatNumber(bloodClearTime)+"s")
    bloodCleared = true
}).setCriteria("[BOSS] The Watcher: You have proven yourself. You may pass.")

register("chat", () => {
    chatLog("&bMaxor &7phase of dungeon completed in&a "+formatNumber(maxorTime)+"s")
    debugLog("&dStorm &7phase of dungeon started.")
    f7Split="Storm"
}).setCriteria("[BOSS] Storm: Pathetic Maxor, just like expected.")

register("chat", () => {
    chatLog("&dStorm &7phase of dungeon completed in&a "+formatNumber(stormTime)+"s")
    debugLog("&6Terminal Section 1 &7started.")
    LeversDone = 0
    TermsDone = 0
    f7Split="Term1"
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")

register("chat", () => {
    chatLog("&aGoldor &7phase of dungeon completed in "+formatNumber(goldorTime)+"s")
    debugLog("&aNecron &7phase of dungeon started.")
    f7Split="Necron"
}).setCriteria("[BOSS] Necron: Finally, I heard so much about you. The Eye likes you very much.")

register("chat", () => {
    chatLog("&eGoldor &7phase of dungeon completed in "+formatNumber(goldorTime)+"s")
    debugLog("&cNecron &7phase of dungeon started.")
    f7Split="Necron"
}).setCriteria("[BOSS] Necron: You went further than any human before, congratulations.")

register("chat", () => {
    chatLog("&cNecron &7phase of dungeon completed in "+formatNumber(necronTime)+"s")
    
    if (getDungeonFloor() == 7) {
        f7Split = "Nothing"
        debugLog("&aDungeon completed")
        return
    }
    if (getDungeonFloor() == 14) f7Split = "Dragons"
    debugLog("&5Dragons &7phase of dungeon started.")
}).setCriteria("[BOSS] Necron: All this, for nothing...")

register("chat", (msg) => {
    if (!msg.endsWith("Incredible. You did what I couldn't do myself.")) return
    if (!msg.startsWith("[BOSS]")) return
    f7Split = "Nothing"
    chatLog("&5Dragons &7phase of dungeon completed in "+formatNumber(dragonsTime)+"s")
    debugLog("&aDungeon completed")
}).setCriteria("${msg}")

register("tick", () => {
    if (f7Split == "Term1" && gateDestroyed && allTermsDone) {
        allTermsDone = false
        setTimeout(() => {
            gateDestroyed = false
        }, 100)
        f7Split = "Term2"
        chatLog("&6Terminal Section 1 &7completed in&a "+formatNumber(term1Time)+"s")
        debugLog("&6Terminal Section 2 &7started.")
        TermsDone = 0
        LeversDone = 0
    } else if (f7Split == "Term2" && gateDestroyed && allTermsDone) {
        allTermsDone = false
        setTimeout(() => {
            gateDestroyed = false
        }, 100)
        f7Split = "Term3"
        TermsDone = 0
        LeversDone = 0
        chatLog("&6Terminal Section 2 &7completed in&a "+formatNumber(term2Time)+"s")
        debugLog("&6Terminal Section 3 &7started.")
    } else if (f7Split == "Term3" && gateDestroyed && allTermsDone) {
        allTermsDone = false
        setTimeout(() => {
            gateDestroyed = false
        }, 100)
        f7Split = "Term4"
        TermsDone = 0
        LeversDone = 0
        chatLog("&6Terminal Section 3 &7completed in&a "+formatNumber(term3Time)+"s")
        debugLog("&6Terminal Section 4 &7started.")
    } else if (f7Split == "Term4" && allTermsDone) {
        allTermsDone = false
        f7Split = "Goldor"
        TermsDone = 0
        LeversDone = 0
        chatLog("&6Terminal Section 4 &7completed in&a "+formatNumber(term4Time)+"s")
        chatLog("&6Terminals &7completed in &a"+formatNumber(term1Time+term2Time+term3Time+term4Time)+"s")
        debugLog("&eGoldor &7phase of dungeon started.")
    }
})

register("chat", () => {
    if (Settings.bonzoSound) {
        World.playSound("note.pling", 1, 2)
    }
    if (!Settings.bonzoTitle) return
    Client.showTitle(Settings.bonzoText, "", "10", "10", "10")
    
}).setCriteria("Your Bonzo's Mask saved your life!")

register("chat", () => {
    if (Settings.spiritSound) {
        World.playSound("note.pling", 1, 2)
    }
    if (!Settings.spiritTitle) return
    Client.showTitle(Settings.spiritText, "", "10", "10", "10")
    
}).setCriteria("Second Wind Activated! Your Spirit Mask saved your life!")

register("chat", () => {
    if (Settings.phoenixSound) {
        World.playSound("note.pling", 1, 2)
    }
    if (!Settings.phoenixTitle) return
    Client.showTitle(Settings.phoenixText, "", "10", "10", "10")
    
}).setCriteria("Your Phoenix Pet saved you from certain death!")

register("chat", (message) => {
    message = message.split(" ")
    message = message[1]+" "+message[2]+" "+message[3]+" "+message[4]
    if (message.endsWith("(7/7)") || message.endsWith("(8/8)")) {
        allTermsDone = true
        debugLog("All terminals in current section are done.")
    }
}).setCriteria("${message}")

blowGateAlert = false
register("tick", () => {
    if (!blowGateAlert) return
    if (gateDestroyed) {
        blowGateAlert = false
        return
    }
    if (Settings.gateSound) {
        World.playSound("note.pling", 1, 2)
    }
    if (!Settings.gateTitle) return
    Client.showTitle(Settings.gateText, "", "0", "5", "10")
})

register("chat", (player) => {
    if (player != Player.getName()) return
    TermsDone+=1
    debugLog("Player has activated a terminal.")
}).setCriteria("${player} activated a terminal! (${amount}/${max})")
register("chat", (player) => {
    if (player != Player.getName()) return
    LeversDone+=1
    debugLog(LeversDone)
    debugLog(TermsDone)
    if (f7Split == "Term1" || f7Split == "Term3") {
        if (LeversDone == 2 && !gateDestroyed) {
            debugLog("Player has activated both levers in S1/S3, alerting blow gate.")
            blowGateAlert = true
        }
    }
    if (f7Split == "Term2") {
        if (LeversDone == 1 && !gateDestroyed && TermsDone == 0) {
            debugLog("Player has activated a lever in S2 and hasn't done any terminal, alerting blow gate.")
            blowGateAlert = true
        }
    }
}).setCriteria("${player} activated a lever! (${amount}/${max})")

register("chat", () => {
    gateDestroyed = true
    debugLog("The gate has been destroyed.")
}).setCriteria("The gate has been destroyed!")

register("tick", () => {
    if (f7Split=="Nothing") {
        bloodOpened=false
        bloodCleared=false
        bloodOpenTime=0.00
        bloodClearTime=0.00
        enterTime=0.00
        maxorTime=0.00
        stormTime=0.00
        term1Time=0.00
        term2Time=0.00
        term3Time=0.00
        term4Time=0.00
        goldorTime=0.00
        necronTime=0.00
        dragonsTime=0.00
    }
    if (getDungeonFloor() == 7) {
        elements[1].setLine(11, "")
    } else if (getDungeonFloor() != 14) {
        elements[1].setLine(2, "")
        elements[1].setLine(3, "")
        elements[1].setLine(4, "")
        elements[1].setLine(5, "")
        elements[1].setLine(6, "")
        elements[1].setLine(7, "")
        elements[1].setLine(8, "")
        elements[1].setLine(9, "")
        elements[1].setLine(10, "")
        elements[1].setLine(11, "")
    }
    //Determine phase
    sbMenu = Player.getInventory().getStackInSlot(8)
    if (sbMenu == null) return
    if (sbMenu.getName().includes("Magical Map")) {
        if (f7Split=="Nothing") {
            bloodOpened=false
            bloodCleared=false
            bloodOpenTime=0.00
            bloodClearTime=0.00
            enterTime=0.00
            maxorTime=0.00
            stormTime=0.00
            term1Time=0.00
            term2Time=0.00
            term3Time=0.00
            term4Time=0.00
            goldorTime=0.00
            necronTime=0.00
            dragonsTime=0.00
            debugLog("&aEnter &7phase of dungeon started.")
            debugLog("Floor "+getDungeonFloor())
            if (getDungeonFloor() == 7) {
                elements[1].setLine(11, "")
            } else if (getDungeonFloor() != 14) {
                elements[1].setLine(2, "")
                elements[1].setLine(3, "")
                elements[1].setLine(4, "")
                elements[1].setLine(5, "")
                elements[1].setLine(6, "")
                elements[1].setLine(7, "")
                elements[1].setLine(8, "")
                elements[1].setLine(9, "")
                elements[1].setLine(10, "")
                elements[1].setLine(11, "")
            }
            f7Split="Enter"
        }
    } else {
        if (!checkDungeon()) { 
            f7Split = "Nothing"
            enterTime = 0.00
            return
        }
    }
})

register("tick", () => {
    if (f7Split == "Enter") {
        if (!bloodOpened) {
            bloodOpenTime += 0.05
        }
        if (!bloodCleared && bloodOpened) {
            bloodClearTime += 0.05
        }
        if (bloodCleared && bloodOpened) {
            enterTime += 0.05
        }
    }
    if (f7Split == "Maxor") {
        maxorTime += 0.05
    }
    if (f7Split == "Storm") {
        stormTime += 0.05
    }
    if (f7Split == "Term1") {
        term1Time += 0.05
    }
    if (f7Split == "Term2") {
        term2Time += 0.05
    }
    if (f7Split == "Term3") {
        term3Time += 0.05
    }
    if (f7Split == "Term4") {
        term4Time += 0.05
    }
    if (f7Split == "Goldor") {
        goldorTime += 0.05
    }
    if (f7Split == "Necron") {
        necronTime += 0.05
    }
    if (f7Split == "Dragons") {
        dragonsTime += 0.05
    }
    if (editGui.isOpen()) return
    elements[1].setLine(0, "&cBlood Open: "+formatNumber(bloodOpenTime)+"s")
    elements[1].getLine(0).setScale(positions.Splits.scale)
    elements[1].getLine(0).setShadow(true)
    elements[1].setLine(1, "&4Blood Clear: "+formatNumber(bloodClearTime)+"s"+"&7 ("+formatNumber(bloodClearTime+bloodOpenTime)+"s)")
    elements[1].getLine(1).setScale(positions.Splits.scale)
    elements[1].getLine(1).setShadow(true)
    elements[1].setLine(2, "&aEnter: "+formatNumber(enterTime)+"s"+"&7 ("+formatNumber(bloodClearTime+bloodOpenTime+enterTime)+"s)")
    elements[1].getLine(2).setScale(positions.Splits.scale)
    elements[1].getLine(2).setShadow(true)
    if (getDungeonFloor() < 14 && getDungeonFloor() != 7) {
        elements[1].setLine(3, "&bBoss: "+formatNumber(maxorTime)+"s"+"&7 ("+formatNumber(bloodClearTime+bloodOpenTime+enterTime+maxorTime)+"s)")
        elements[1].getLine(3).setScale(positions.Splits.scale)
        elements[1].getLine(3).setShadow(true)
        return
    }
    elements[1].setLine(3, "&bMaxor: "+formatNumber(maxorTime)+"s"+"&7 ("+formatNumber(bloodClearTime+bloodOpenTime+enterTime+maxorTime)+"s)")
    elements[1].getLine(3).setScale(positions.Splits.scale)
    elements[1].getLine(3).setShadow(true)
    elements[1].setLine(4, "&dStorm: "+formatNumber(stormTime)+"s"+"&7 ("+formatNumber(bloodClearTime+bloodOpenTime+enterTime+maxorTime+stormTime)+"s)")
    elements[1].getLine(4).setScale(positions.Splits.scale)
    elements[1].getLine(4).setShadow(true)
    elements[1].setLine(5, "&6Terminal Section 1: "+formatNumber(term1Time)+"s"+"&7 ("+formatNumber(bloodClearTime+bloodOpenTime+enterTime+maxorTime+stormTime+term1Time)+"s)")
    elements[1].getLine(5).setScale(positions.Splits.scale)
    elements[1].getLine(5).setShadow(true)
    elements[1].setLine(6, "&6Terminal Section 2: "+formatNumber(term2Time)+"s"+"&7 ("+formatNumber(bloodClearTime+bloodOpenTime+enterTime+maxorTime+stormTime+term1Time+term2Time)+"s)")
    elements[1].getLine(6).setScale(positions.Splits.scale)
    elements[1].getLine(6).setShadow(true)
    elements[1].setLine(7, "&6Terminal Section 3: "+formatNumber(term3Time)+"s"+"&7 ("+formatNumber(bloodClearTime+bloodOpenTime+enterTime+maxorTime+stormTime+term1Time+term2Time+term3Time)+"s)")
    elements[1].getLine(7).setScale(positions.Splits.scale)
    elements[1].getLine(7).setShadow(true)
    elements[1].setLine(8, "&6Terminal Section 4: "+formatNumber(term4Time)+"s"+"&7 ("+formatNumber(term1Time+term2Time+term3Time+term4Time)+"s) ("+formatNumber(bloodClearTime+bloodOpenTime+enterTime+maxorTime+stormTime+term1Time+term2Time+term3Time+term4Time)+"s)")
    elements[1].getLine(8).setScale(positions.Splits.scale)
    elements[1].getLine(8).setShadow(true)
    elements[1].setLine(9, "&eGoldor: "+formatNumber(goldorTime)+"s"+"&7 ("+formatNumber(bloodClearTime+bloodOpenTime+enterTime+maxorTime+stormTime+term1Time+term2Time+term3Time+term4Time+goldorTime)+"s)")
    elements[1].getLine(9).setScale(positions.Splits.scale)
    elements[1].getLine(9).setShadow(true)
    elements[1].setLine(10, "&cNecron: "+formatNumber(necronTime)+"s"+"&7 ("+formatNumber(bloodClearTime+bloodOpenTime+enterTime+maxorTime+stormTime+term1Time+term2Time+term3Time+term4Time+goldorTime+necronTime)+"s)")
    elements[1].getLine(10).setScale(positions.Splits.scale)
    elements[1].getLine(10).setShadow(true)
    if (getDungeonFloor() < 14) return
    elements[1].setLine(11, "&5Dragons: "+formatNumber(dragonsTime)+"s"+"&7 ("+formatNumber(bloodClearTime+bloodOpenTime+enterTime+maxorTime+stormTime+term1Time+term2Time+term3Time+term4Time+goldorTime+necronTime+dragonsTime)+"s)")
    elements[1].getLine(11).setScale(positions.Splits.scale)
    elements[1].getLine(11).setShadow(true)
})

function drawOutline(c,t,x,y,w,h) {
    w+=2*t
    h+=2*t
    x-=(1+t)
    y-=(1+t)
    Renderer.drawRect(c, x, y, w, t)
    Renderer.drawRect(c, x, y+h-t, w, t)
    Renderer.drawRect(c, x, y, t, h)
    Renderer.drawRect(c, x+w-1, y, t, h)
}

guiToSelect = "No GUI"
register("renderOverlay", () => {
    if (guiToSelect == "No GUI") {
        sizeAndPos.setShouldRender(false)
        return
    }
    t = 1.5
    y = positions[guiToSelect].y
    w = elements[getIndexFromName(guiToSelect)].getWidth()
    h = elements[getIndexFromName(guiToSelect)].getHeight()
    c = Renderer.color(0,0,0,255)
    if (positions[guiToSelect].align == "left") {
        x = roundToDecimals(positions[guiToSelect].x, 1)
    } else if (positions[guiToSelect].align == "right") {
        x = roundToDecimals(positions[guiToSelect].x-w, 1)
    } else if (positions[guiToSelect].align == "center") {
        x = roundToDecimals(positions[guiToSelect].x-w/2, 1)
    }
    drawOutline(c,t,x,y,w,h)
    elements[getIndexFromName(guiToSelect)].setBackground(DisplayHandler.Background.FULL)

    y=y-sizeAndPos.getHeight()-t
    sizeAndPos.setShouldRender(true)
    sizeAndPos.setRenderX(x)
    sizeAndPos.setRenderY(y)
    realX = x = positions[guiToSelect].x
    sizeAndPos.setLine(0, "&fX: "+realX+", Y: "+y+", Scale: "+positions[guiToSelect].scale+", Alignment: "+positions[guiToSelect].align)
    sizeAndPos.getLine(0).setShadow(true)
    sizeAndPos.getLine(0).setScale(1)
})

function isIn(mouseX, mouseY, gui, elementName) {
    height = gui.getHeight()
    width = gui.getWidth()
    guiX = positions[elementName].x
    guiY = positions[elementName].y
    minY = guiY
    maxY = guiY+height

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

function assignElementName(index) {
    if (index == 0) return "katanaHud"
    if (index == 1) return "Splits"
    if (index == 2) return "chestProfit"
    console.error("shaweel is stupid and forgot to asign a gui to the index, blame shaweel")
}

function getIndexFromName(name) {
    if (name == "katanaHud") return 0
    if (name == "Splits") return 1
    if (name == "chestProfit") return 2
    console.error("shaweel is stupid and forgot to asign a gui to the index, blame shaweel")
}

function refreshGui(gui, guiName, render) {
    gui.setAlign(positions[guiName].align)
    gui.setRenderX(positions[guiName].x)
    gui.setRenderY(positions[guiName].y)
    index = -1
    while (true) {
        index += 1
        try {
            gui.getLine(index).setScale(positions[guiName].scale)
        } catch (error) {
            break
        }
    }
    gui.setShouldRender(false)
    gui.setShouldRender(render)
}

register("scrolled", (mouseX, mouseY, direction) => {
    if (!editGui.isOpen()) return
    selected = "No GUI"
    index = -1
    for (element of elements) {
        index+=1
        elementName = assignElementName(index)
        if (isIn(mouseX, mouseY, element, elementName)) {
            selected = elementName
            break
        }
    }
    if (!Settings[selected]) return
    if (selected == "No GUI") {
        debugLog("Not resizing anything, since nothing is selected")
        return
    }
    element = elements[getIndexFromName(selected)]
    if (direction == -1) {
        debugLog("Increasing size of &a"+selected)
        if (positions[selected].scale < 10) positions[selected].scale+=0.1
    }
    if (direction == 1) {
        debugLog("Decreasing size of &a"+selected)
        if (positions[selected].scale > 0.4) positions[selected].scale-=0.1
    }
    positions[selected].scale=roundToDecimals(positions[selected].scale, 1)
    debugLog("Refreshing position, size and alignment of &a"+selected)
    refreshGui(element, selected, true)
    debugLog("Saving position, size and alignment of &a"+selected)
    jsonPos = JSON.stringify(positions)
    FileLib.write("./config/ChatTriggers/modules/shaweelAddons/positions.json", jsonPos)
})


//GUI To Select
oldSelected = null
register("tick", () => {
    if (!editGui.isOpen()) {
        guiToSelect = "No GUI"
        return
    }
    mouseX = Client.getMouseX()
    mouseY = Client.getMouseY()
    selected = "No GUI"
    index = -1
    for (element of elements) {
        index+=1
        elementName = assignElementName(index)
        if (isIn(mouseX, mouseY, element, elementName) && Settings[elementName]) {
            selected = elementName
            break
        }
    }
    guiToSelect = selected
    if (oldSelected == selected) return
    if (selected == "No GUI") {
        debugLog("No GUI Selected.")
        oldSelected = selected
        return
    }
    debugLog("GUI &a"+selected+"&7 is selected.")
    oldSelected = selected
})

moving = "No GUI"
isMoving = false
offsetX = 0
offsetY = 0
oldMousePos = {x:0,y:0}
register("guiMouseClick", (mouseX, mouseY, mouseButton) => {
    if (!editGui.isOpen()) return
    selected = "No GUI"
    index = -1
    for (element of elements) {
        index+=1
        elementName = assignElementName(index)
        if (isIn(mouseX, mouseY, element, elementName)) {
            selected = elementName
            break
        }
    }
    if (!Settings[selected]) return
    if (selected == "No GUI") return
    if (mouseButton == 0) {
        moving = selected
        isMoving = true
        offsetX = mouseX - positions[selected].x
        offsetY = mouseY - positions[selected].y
    } else if (mouseButton == 1) {
        if (positions[selected].align == "left") {
            debugLog("Changing alignment of &a"+selected+"&7 to &aright")
            positions[selected].x += roundToDecimals(elements[getIndexFromName(selected)].getWidth(), 1)
            positions[selected].align = "right"
        } else if (positions[selected].align == "right") {
            positions[selected].x -= roundToDecimals(elements[getIndexFromName(selected)].getWidth(), 1)/2
            debugLog("Changing alignment of &a"+selected+"&7 to &acenter")
            positions[selected].align = "center"
        } else if (positions[selected].align == "center") {
            positions[selected].x -= roundToDecimals(elements[getIndexFromName(selected)].getWidth(), 1)/2
            debugLog("Changing alignment of &a"+selected+"&7 to &aleft")
            positions[selected].align = "left"
        }
        positions[selected].x = roundToDecimals(positions[selected].x, 1)
        debugLog("Refreshing position, size and alignment of &a"+selected)
        refreshGui(elements[getIndexFromName(selected)], selected, true)
        debugLog("Saving position, size and alignment of &a"+selected)
        jsonPos = JSON.stringify(positions)
        FileLib.write("./config/ChatTriggers/modules/shaweelAddons/positions.json", jsonPos)
    }
})

register("tick", () => {
    if (!isMoving) return
    if (!editGui.isOpen()) return
    mouseX = Client.getMouseX()
    mouseY = Client.getMouseY()
    debugLog("Moving GUI &a"+moving)
    oldMousePos.x = mouseX
    oldMousePos.y = mouseY
    positions[moving].x = roundToDecimals(mouseX-offsetX, 1)
    positions[moving].y = roundToDecimals(mouseY-offsetY, 1)
    debugLog("Refreshing position, size and alignment of &a"+elementName)
    refreshGui(elements[getIndexFromName(moving)], moving, true)
})

register("guiMouseRelease", (mouseX, mouseY, mouseButton) => {
    if (!editGui.isOpen()) return
    if (mouseButton != 0) return
    if (!isMoving) return
    debugLog("Saving position, size and alignment of &a"+moving)
    jsonPos = JSON.stringify(positions)
    FileLib.write("./config/ChatTriggers/modules/shaweelAddons/positions.json", jsonPos)
    isMoving = false
    moving = "No GUI"
    offsetX = 0
    offsetY = 0
})


function startMovingGui() {
    editGui.open()
    guiEdit.setShouldRender(true)
    index = -1
    for (element of elements) {
        index += 1
        elementName = assignElementName(index)
        if (!Settings[elementName]) continue
        element.setShouldRender(true)
        if (index == 0) {
            element.setLine(0, "&cKatana Ability NOT activated")
            element.getLine(0).setScale(positions[elementName].scale)
            element.getLine(0).setShadow(true)
        }
        if (index == 1) {
            elements[1].setAlign(positions.Splits.align)
            elements[1].setRenderX(positions.Splits.x)
            elements[1].setRenderY(positions.Splits.y)
            elements[1].setLine(0, "&cBlood Open: 0.0s")
            elements[1].getLine(0).setScale(positions.Splits.scale)
            elements[1].getLine(0).setShadow(true)
            elements[1].setLine(1, "&4Blood Clear: 0.0s")
            elements[1].getLine(1).setScale(positions.Splits.scale)
            elements[1].getLine(1).setShadow(true)
            elements[1].setLine(2, "&aEnter: 0.0s")
            elements[1].getLine(2).setScale(positions.Splits.scale)
            elements[1].getLine(2).setShadow(true)
            elements[1].setLine(3, "&bMaxor: 0.0s")
            elements[1].getLine(3).setScale(positions.Splits.scale)
            elements[1].getLine(3).setShadow(true)
            elements[1].setLine(4, "&dStorm: 0.0s")
            elements[1].getLine(4).setScale(positions.Splits.scale)
            elements[1].getLine(4).setShadow(true)
            elements[1].setLine(5, "&6Terminal Section 1: 0.0s")
            elements[1].getLine(5).setScale(positions.Splits.scale)
            elements[1].getLine(5).setShadow(true)
            elements[1].setLine(6, "&6Terminal Section 2: 0.0s")
            elements[1].getLine(6).setScale(positions.Splits.scale)
            elements[1].getLine(6).setShadow(true)
            elements[1].setLine(7, "&6Terminal Section 3: 0.0s")
            elements[1].getLine(7).setScale(positions.Splits.scale)
            elements[1].getLine(7).setShadow(true)
            elements[1].setLine(8, "&6Terminal Section 4: 0.0s")
            elements[1].getLine(8).setScale(positions.Splits.scale)
            elements[1].getLine(8).setShadow(true)
            elements[1].setLine(9, "&eGoldor: 0.0s")
            elements[1].getLine(9).setScale(positions.Splits.scale)
            elements[1].getLine(9).setShadow(true)
            elements[1].setLine(10, "&cNecron: 0.0s")
            elements[1].getLine(10).setScale(positions.Splits.scale)
            elements[1].getLine(10).setShadow(true)
            elements[1].setLine(11, "&5Dragons: 0.0s")
            elements[1].getLine(11).setScale(positions.Splits.scale)
            elements[1].getLine(11).setShadow(true)
        }
        if (index == 2) {
            index = -1
            for (line of elements[2].getLines()) {
                index += 1
                elements[2].setLine(index, "")
            }
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
        }
    }
    
}

countingDown = false
countDown = 4
oldActivated = null
activated = null
no1 = false
no2 = false
no3 = false
no4 = false
no5 = false
no6 = false
no7 = false
no8 = false
hasKatana = null
oldHasKatana = null
moreKatanas = null
oldMoreKatanas = null
function updateKatanaHud() {
    if (!Settings.katanaHud) {
        elements[0].setShouldRender(false)
        return
    }
    if (editGui.isOpen()) {
        if (countingDown) {
            if (countDown <= 0.01) {
                countDown = 4
            }
            countDown -= 0.05
        }
        return
    }
    items = []
    items[1] = Player.getInventory().getStackInSlot(1)
    items[2] = Player.getInventory().getStackInSlot(2)
    items[3] = Player.getInventory().getStackInSlot(3)
    items[4] = Player.getInventory().getStackInSlot(4)
    items[5] = Player.getInventory().getStackInSlot(5)
    items[6] = Player.getInventory().getStackInSlot(6)
    items[7] = Player.getInventory().getStackInSlot(7)
    items[8] = Player.getInventory().getStackInSlot(8)
    index = -1

    katana = ["", ""]
    for (item of items) {
        //Create SkyblockId and VanillaId of item and skip non skyblock items
        index += 1
        try {
            skyblockId = String(item.getNBT().getTag("tag").getTag("ExtraAttributes").getTag("id"))
            vanillaId = String(item.getNBT().getTag("id"))
        } catch (error) {
            if (!no1) {debugLog("Hotbar item &a1&7 isn't a Katana, skipping item."); no1 = true}
            if (!no2) {debugLog("Hotbar item &a2&7 isn't a Katana, skipping item."); no2 = true}
            if (!no3) {debugLog("Hotbar item &a3&7 isn't a Katana, skipping item."); no3 = true}
            if (!no4) {debugLog("Hotbar item &a4&7 isn't a Katana, skipping item."); no4 = true}
            if (!no5) {debugLog("Hotbar item &a5&7 isn't a Katana, skipping item."); no5 = true}
            if (!no6) {debugLog("Hotbar item &a6&7 isn't a Katana, skipping item."); no6 = true}
            if (!no7) {debugLog("Hotbar item &a7&7 isn't a Katana, skipping item."); no7 = true}
            if (!no8) {debugLog("Hotbar item &a8&7 isn't a Katana, skipping item."); no8 = true}
            continue
        }
        //Remove "" from Ids
        while (true) {
            if (!skyblockId.includes('"')) break
            skyblockId = skyblockId.replace('"', "")
        }
        while (true) {
            if (!vanillaId.includes('"')) break
            vanillaId = vanillaId.replace('"', "")
        }
        
        //Find Katana in hotbar
        if (skyblockId == "ATOMSPLIT_KATANA" || skyblockId == "VORPAL_KATANA" || skyblockId == "VOIDEDGE_KATANA") {
            if (!katana[0] == "" && katana[1] == "") {
                moreKatanas = true
                if (moreKatanas != oldMoreKatanas) {debugLog("Hotbar contains multiple Katanas, skipping katanaHud to not bug the mod out.")}
                oldMoreKatanas = true
                continue
            }
            katana[0] = vanillaId
            katana[1] = skyblockId
        }
        continue
    }
    if (katana[0] == "" && katana[1] == "") {
        hasKatana = false
        if (hasKatana != oldHasKatana) {debugLog("Hotbar doesn't contain a Katana, skipping katanaHud.")}
        elements[0].setShouldRender(false)
        oldHasKatana = false
        moreKatanas = false
        oldMoreKatanas = null
        return
    }
    if (countingDown) {
        if (countDown <= 0.01) {
            countDown = 4
        }
        countDown -= 0.05
    }
    elements[0].setShouldRender(true)
    if (katana[0] == "minecraft:diamond_sword") {
        if (countingDown) countingDown = false
        countDown = 4
        activated = false
        
        if (oldActivated == null) debugLog("Katana is&c not activated")
        if (oldActivated == true) {
            debugLog(oldActivated)
            debugLog("Katana &chas just expired")
            if (Settings.expireSound) {World.playSound("note.pling", 1, 1)}
        }
        oldActivated = false
        elements[0].setLine(0, "&cKatana Ability NOT activated")
        elements[0].getLine(0).setScale(positions.katanaHud.scale)
        elements[0].getLine(0).setShadow(true)
    }
    if (katana[0] == "minecraft:golden_sword") {
        activated = true
        if (activated != oldActivated) { 
            debugLog("Katana has&a just been activated")
        }
        oldActivated = true
        countingDown = true
        elements[0].setLine(0, "&aKatana Ability activated ("+formatNumber(countDown)+")")
        elements[0].getLine(0).setScale(positions.katanaHud.scale)
        elements[0].getLine(0).setShadow(true)
    }
}

register("tick", updateKatanaHud)

const scaSound = new Sound({source: "shaweeladdons.seaCreature.ogg"})
const pssSound = new Sound({source: "shaweeladdons.ssFail.ogg"})
const lowHealthSound = new Sound({source: "shaweeladdons.lowHealth.ogg"})
const ratSound = new Sound({source: "shaweeladdons.ratKill.ogg"})
const mimicSound = new Sound({source: "shaweeladdons.mimicKill.ogg"})

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
    debugLog("Alerting Low Health")

    if (Settings.lhsound) {
        debugLog("Playing low health sound")
        lowHealthSound.play()
    }
    if (!Settings.lhtitle) return
    debugLog("Showing low health title")
    Client.showTitle(Settings.lhtext, "", "0", "20", "5")
})


function seaCreatureAlert() {
    if (Settings.sctitle == true)
        debugLog("Showing sea creature title")
        Client.showTitle(Settings.sctext, "", "5", "20", "5")
    if (Settings.scsound == true)
        debugLog("Playing sea creature sound")
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


const requirementSets = [["restart", "rs", "reset", "slow", "broke"], ["ss", "dev", "simon says", "simonsays", "device"]]

function isValidBadSS(msg) {
    if (!msg.includes(":")) return false
    msg = msg.split(":")[1]


    for (let requirementSet of requirementSets) {
        let passed = false
        for (let requirement of requirementSet) {
            if (msg.includes(requirement) == false) continue
            passed = true
            break
        }
        if (passed == false) return false
    }
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
    if (!checkDungeon()) return
    if (f7Split != "Term1") return
    debugLog("Alerting SS Reset, source: ")
    debugLog(message)
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
register("chat", seaCreatureAlert).setCriteria("The Trash Gobbler is hungry for you!")
register("chat", seaCreatureAlert).setCriteria("A Dumpster Diver has emerged from the swamp!")
register("chat", seaCreatureAlert).setCriteria("The desolate wail of a Banshee breaks the silence.")
register("chat", seaCreatureAlert).setCriteria("A swampy mass of slime emerges, the Bayou Sludge!")
register("chat", seaCreatureAlert).setCriteria("A long snout breaks the surface of the water. It's an Alligator!")
register("chat", seaCreatureAlert).setCriteria("A massive Titanoboa surfaces. It's body stretches as far as the eye can see.")
register("chat", seaCreatureAlert).setCriteria("A Lava Pigman arose from the depths!")
register("chat", seaCreatureAlert).setCriteria("You've hooked a Bogged!")
register("chat", seaCreatureAlert).setCriteria("Look! A Wetwing emerges!")
register("chat", seaCreatureAlert).setCriteria("A gang of Liltads!")
register("chat", seaCreatureAlert).setCriteria("You've hooked an Ent, as ancient as the forest itself.")
register("chat", seaCreatureAlert).setCriteria("The Loch Emperor arises from the depths.")



function updateTitle() {
    if (checkms() == null) return
    if (checkms() > 2) msBelow3 = false
    if (checkms() < 3) msBelow3 = true
    if (!msBelow3) return
    if (!Settings.cmtitle) return
    Client.showTitle(Settings.cmtext, "", "0", "5", "10")
}

register("tick", updateTitle)


register("entityDeath", (entity) => {
    if (entity.getClassName() == "EntityZombie") {
    } else {
        return
    }
    isRat = false
    for (translation of translations.zombie) {
        if (translation == entity.name) isRat = true
    }
    if (!isRat) return
    if (!(entity.getEyeHeight() < 1 && entity.getEyeHeight() > 0.9)) return
    if (checkDungeon()) {
        if (Settings.mimicTitle) {
            Client.showTitle(Settings.mimicText, "", "0", "20", "5")
        }
        if (Settings.mimicAnnounce) {
            ChatLib.command("pc "+Settings.mimicAnnounceText)
        }
        if (!Settings.mimicSound) return
        mimicSound.play()
        return
    }
    if (Math.abs(entity.getX() - Player.getX()) < 15 && Math.abs(entity.getZ() - Player.getZ()) < 15 && Math.abs(entity.getY() - Player.getY()) < 5) {} 
    else if (Settings.forceRat) {debugLog
        debugLog("Rat killed and user is too far, but force yourself on rat kill is enabled, alerting")
    } else {
        debugLog("Rat killed but user is too far, not alerting")
        return
    }
    debugLog("Alerting rat kill")
    if (Settings.ratTitle == true) {
        debugLog("Showing rat kill title")
        Client.showTitle(Settings.ratText, "", "0", "20", "5")
    }
    if (!Settings.ratSound) return
    debugLog("Playing rat kill sound")
    ratSound.play()
})

function debug(type, arg) {
    if (type == "getallentities") {
        ChatLib.chat("&d[shaweelAddons] &e[DEBUG] &7Printed all entites in the chattriggers javascript console.")
        entities = World.getAllEntities()
        for (let entity of entities) {
            print(entity)
        }
        return
    } else if (type == "getentitiesinradius") {
        ChatLib.chat("&d[shaweelAddons] &e[DEBUG] &7Printed all entites that are &a" +arg+ "&7 or less blocks away from you in the chattriggers javascript console.")
        if (isNaN(Number(arg))) {
            ChatLib.chat("&d[shaweelAddons] &e[DEBUG] &7Usage: &agetentitiesinradius <radius>")
        }
        entities = World.getAllEntities()
        if (entities == null) return
        for (let entity of entities) {
            if (Math.abs(entity.x - Player.getX()) < arg && Math.abs(entity.y - Player.getY()) < arg && Math.abs(entity.z - Player.getZ()) < arg) {
                print(entity)
            }
        }
        return
    }
    ChatLib.chat("&d[shaweelAddons] &e[DEBUG] &7Currently available debug commands: &agetallentities&7, &agetentitiesinradius")
}

function debugMode() {
    if (debugModeVariable == 0) {
        ChatLib.chat("&d[shaweelAddons] &e[DEBUG] &aDebug mode activated.")
        debugModeVariable = 1
        FileLib.write("./config/ChatTriggers/modules/shaweelAddons/debugMode.txt", String(debugModeVariable))
        return
    }
    if (debugModeVariable == 1) {
        ChatLib.chat("&d[shaweelAddons] &e[DEBUG] &cDebug mode deactivated.")
        debugModeVariable = 0
        FileLib.write("./config/ChatTriggers/modules/shaweelAddons/debugMode.txt", String(debugModeVariable))
        return
    }
}

function openSettings() {
    Settings.openGUI()
}

register("chat", (player, dungeonClass, level) => {
    if (player == Player.getName()) {
        debugLog("You joined a party finder party")
        return
    }

    debugLog("A player joined the party finder party")
    if (!isShitter(player)) return
    debugLog("&cKicking player")
    reason = getShitterReason(player)
    ChatLib.command("pc [shaweelAddons] "+player+" is on my shitter list ("+reason+")")
    setTimeout(() => {
        ChatLib.command("party kick "+player)
    }, 1000);
}).setCriteria("Party Finder > ${player} joined the dungeon group! (${dungeonClass} Level ${level})")


function getShitterReason(username) {
    username=username.toLowerCase()
    if (!isShitter(username)) return null
    for (player of shitters) {
        if (player[0].toLowerCase() != username) continue
        return player[1]
    }
}

function isShitter(username) {
    username = username.toLowerCase()
    for (player of shitters) {
        if (player[0].toLowerCase() != username) continue
        return true
    }
    return false
}

function saveShitters() {
    toSave = JSON.stringify(shitters)
    FileLib.write("./config/ChatTriggers/modules/shaweelAddons/shitters.json", toSave)
}

confirming = false
function shitter(arg2, arg3, reason) {
    if (arg2 == undefined || arg2 == "help") {
        chatLog("&c[Shitter List] &7Available commands:")
        ChatLib.chat("&a/sha shitterlist add <username> <reason(optional)>&7 - adds a player to your shitter list, with an optional reason.")
        ChatLib.chat("&a/sha shitterlist reason <username> <reason>&7 - adds/changes a player's reason for being on the shitter list.")
        ChatLib.chat("&a/sha shitterlist remove <username>&7 - removes a player from your shitter list.")
        ChatLib.chat("&a/sha shitterlist removeall&7 - removes all players from your shitter list, this action is irrevertable")
        ChatLib.chat("&a/sha shitterlist list&7 - lists every person on your shitter list, with the reason")
        ChatLib.chat("&a/sha shitterlist reload&7 - reloads the shitterlist using the "+"shitters.json"+"&7 file.")
        ChatLib.chat("&a/sha shitterlist help&7 - shows this help message.")
        ChatLib.chat("")
        ChatLib.chat("&7Every person on your shitter list will be auto kicked from your party whenever they join through party finder, when kicking it says that they got kicked and the reason for being on the shitter list in chat.")
        return
    }

    if (arg2 == "reload") {
        shitters = FileLib.read("./config/ChatTriggers/modules/shaweelAddons/shitters.json")
        shitters = JSON.parse(shitters)
        chatLog("&c[Shitter List] &7Succesfully reloaded the shitter list.")
        return
    }

    if (arg2 == "removeall") {
        confirming = true
        chatLog("&c[Shitter List] &4&lTHIS ACTION IS IRREVERSIBLE&7, type &c/sha shitterlist confirm&7 in the next &a5&7 seconds to proceed.")
        setTimeout(() => {
            confirming = false
        }, 5000)
        return
    }

    if (arg2 == "confirm" && confirming) {
        chatLog("&c[Shitter List] &7Shitter list succesfully wiped.")
        shitters = []
        saveShitters()
        return
    }

    if (arg2 == "list") {
        chatLog("&c[Shitter List] &7All players on your shitter list:")
        for (player of shitters) {
            ChatLib.chat("&e"+player[0]+"&7: "+player[1])
        }
        return
    }

    if (arg2 == "remove") {
        if (arg3 == undefined) {
            chatLog("&c[Shitter List] &7Usage: &a/sha shitterlist remove <player>")
            return
        }
        if (!isShitter(arg3)) {
            chatLog("&c[Shitter List] &a"+arg3+"&7 is not on your shitter list.")
            return
        }
        chatLog("&c[Shitter List] &7Succesfully removed &a"+arg3+"&7 from your shitter list.")
        n = null
        i=-1
        for (player of shitters) {
            i+=1
            if (player[0].toLowerCase() != arg3.toLowerCase()) {
                debugLog("&a"+player[0]+"&7 is not &a"+arg3)
                continue
            }
            debugLog("Player to remove has been succesfully found.")
            n=i
            break
        }
        debugLog("Attempting to remove &a"+arg3+" &7from the shitter list using the index &a"+n)
        shitters.splice(n, 1)
        saveShitters()
        return
    }

    if (arg2 == "reason") {
        if (arg3 == undefined || reason == "") {
            chatLog("&c[Shitter List] &7Usage: &a/sha shitterlist reason <player> <reason>")
            return
        }

        if (!isShitter(arg3)) {
            chatLog("&c[Shitter List] &a"+arg3+"&7 is not on your shitter list.")
            return
        }
        chatLog("&c[Shitter List] &7Succesfully changed the reason of &a"+arg3+"&7 being on your shitter list to &a"+reason)
        for (player of shitters) {
            if (player[0].toLowerCase() != arg3.toLowerCase()) {
                debugLog("&a"+player[0]+"&7 is not &a"+arg3)
                continue
            }
            debugLog("Player to change reason has been succesfully found.")
            player[1] = reason
            saveShitters()
            break
        }
        return
    } 

    if (arg2 == "add") {
        if (arg3 == undefined) {
            chatLog("&c[Shitter List] &7Usage: &a/sha shitterlist add <player> <reason(optional)>")
            return
        }

        if (reason == "") {
            reason = "No reason provided"
        }
        if (isShitter(arg3)) {
            chatLog("&c[Shitter List] &a"+arg3+"&7 is already on your shitter list. Use &a/sha shitterlist reason&7, if you want to change the reason.")
            return
        }
        chatLog("&c[Shitter List] &7Succesfully added &a"+arg3+"&7 to your shitter list because of: &a"+reason)
        shitters.push([arg3, reason])
        saveShitters()
        return
    }
    chatLog("&c[Shitter List] &7Unknown command, use &a/sha shitterlist help&7 to learn more")
}

register("command", (...args) => {
    debugLog("Argument 1: &a"+args[0])
    reason=""
    index = -1
    for (arg of args) {
        index+=1
        if (index < 3) continue
        if (index > 3) reason+=" "
        reason+=arg
    }
    if (args[0] == "help") {
        chatLog("Available commands:")
        ChatLib.chat("&a/sha config(or just /sha)&7 - Opens the config.")
        ChatLib.chat("&a/sha gui&7 - Opens the gui editor.")
        ChatLib.chat("&a/sha shitterlist(aliases: sl, shitter, slist, shitters)&7 - The local shitterlist, use &a/sha shitterlist&7 to learn more")
        ChatLib.chat("&a/sha debug&7 - Debug commands mainly used by shaweel to make the development process easier.")
        ChatLib.chat("&a/sha debugmode&7 - Gives extra information, that is useless if you're not working on the mod and just using it.")
        return
    }
    if (args[0] == "debug") {
        debug(args[1], args[2])
        return
    }
    if (args[0] == "debugmode") {
        debugMode()
        return
    }
    if (args[0] == "shitter" || args[0] == "shitterlist" || args[0] == "sl" || args[0] == "slist" || args[0] == "shitters") {
        shitter(args[1], args[2], reason)
        return
    }
    if (args[0] == "gui") {
        startMovingGui()
        return
    }
    
    if (args[0] == "config" || args[0] == undefined) {
        openSettings()
        return
    }
    chatLog("&7Unknown command, use &a/sha help&7 to learn more")
}).setName("shaweeladdons").setAliases("shaweel", "sha", "shaddons", "saddons")
