import {request} from "requestV2"
import Settings from "../config.js"
import utils from "../utils.js"
import { elements, editGui, positions } from "./Gui.js"

//Define needed variables
let bestChestName=null
let updateGUI = false

//Define needed constants
const chestTypes = ["Wood Chest", "Gold Chest", "Diamond Chest", "Emerald Chest", "Obsidian Chest", "Bedrock Chest"]

//Update ah and bz prices every 10s
let bz = {}
let ah = {}
function updateBazaar() {
    request({
        url: "https://api.hypixel.net/skyblock/bazaar",
        json: true
    }).then(data => {
        bz = data.products
    })
    utils.debugLog("Bazaar updated")
}
function updateAuction() {
    request({
        url: "https://moulberry.codes/lowestbin.json",
        json: true
    }).then(data => {
        ah = data
    })
    utils.debugLog("Auction updated")
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
    let chest = Player.getContainer()
    let items = []
    items.push(chest.getStackInSlot(9), chest.getStackInSlot(10), chest.getStackInSlot(11), chest.getStackInSlot(12), chest.getStackInSlot(13), chest.getStackInSlot(14), chest.getStackInSlot(15), chest.getStackInSlot(16), chest.getStackInSlot(17))
    let olditems = []
    olditems.push(chest.getStackInSlot(9), chest.getStackInSlot(10), chest.getStackInSlot(11), chest.getStackInSlot(12), chest.getStackInSlot(13), chest.getStackInSlot(14), chest.getStackInSlot(15), chest.getStackInSlot(16), chest.getStackInSlot(17))
    let index = -1
    let removed = 0

    for (let item of olditems) {
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
    let menu = Player.getContainer()
    let items = []
    items.push(menu.getStackInSlot(9), menu.getStackInSlot(10), menu.getStackInSlot(11), menu.getStackInSlot(12), menu.getStackInSlot(13), menu.getStackInSlot(14), menu.getStackInSlot(15), menu.getStackInSlot(16), menu.getStackInSlot(17), menu.getStackInSlot(18), menu.getStackInSlot(19), menu.getStackInSlot(20), menu.getStackInSlot(21), menu.getStackInSlot(22), menu.getStackInSlot(23), menu.getStackInSlot(24), menu.getStackInSlot(25), menu.getStackInSlot(26))
    let olditems = []
    olditems.push(menu.getStackInSlot(9), menu.getStackInSlot(10), menu.getStackInSlot(11), menu.getStackInSlot(12), menu.getStackInSlot(13), menu.getStackInSlot(14), menu.getStackInSlot(15), menu.getStackInSlot(16), menu.getStackInSlot(17), menu.getStackInSlot(18), menu.getStackInSlot(19), menu.getStackInSlot(20), menu.getStackInSlot(21), menu.getStackInSlot(22), menu.getStackInSlot(23), menu.getStackInSlot(24), menu.getStackInSlot(25), menu.getStackInSlot(26))
    let index = -1
    let removed = 0
    for (let item of olditems) {
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
    let profit = 0
    let items = []
    let chestcost = NaN
    for (let line of lore) {
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

    let index = -1
    for (let line of lore) {
        index++
        if (index < 2) continue
        if (line.includes("Cost")) {
            items.splice(items.length-1,1)
            break
        }
        items.push(line)
    }
    profit=0
    for (let item of items) {
        itemProfit = getProfit(item)
        profit += itemProfit
    }
    profit -= chestcost
    profit = Math.floor(profit)
    return profit
}

function getProfit(name) {
    let profit = null
    try {
        name.includes("a")
    } catch (error) {
        return 0
    }
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
    if (!Settings.chestProfit) return
    elements[2].clearLines()
    if (!inChestMenu() && !inChest()) {
        updateGUI = true
        return
    }
    if (inChest()) {
        let loot = getItemsFromLootChest()
        let chest = Player.getContainer().getName()
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
        let index = 0
        let totalprofit = 0
        let chestcost = Player.getContainer().getStackInSlot(31)
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
        for (let item of loot) {
            index += 1
            let name = item.getName()
            if (name.includes("Enchanted Book")) {
                name = item.getLore()[1]
            }
            let profit = getProfit(name)
            profit = Math.floor(profit)
            if (profit > 0) {
                elements[2].setLine(index, name+"&7 - &a+"+utils.formatLargeNumber(profit))
            } else if (profit == 0) {
                elements[2].setLine(index, name+"&7 - &e0")
            } else {
                elements[2].setLine(index, name+"&7 - &c"+utils.formatLargeNumber(profit))
            }
            elements[2].getLine(index).setScale(positions.chestProfit.scale)
            elements[2].getLine(index).setShadow(true)
            if (profit == NaN) return
            totalprofit += profit
        }
        totalprofit -= chestcost
        chestcost = Math.floor(chestcost)
        elements[2].setLine(index+2, "&7Chest Cost - &c-"+utils.formatLargeNumber(chestcost))
        if (chestcost == 0) {
            elements[2].setLine(index+2, "&7Chest Cost - &aFREE")
        }
        elements[2].getLine(index+2).setScale(positions.chestProfit.scale)
        elements[2].getLine(index+2).setShadow(true)
        totalprofit = Math.floor(totalprofit)
        formatted = utils.formatLargeNumber(totalprofit)
        if (totalprofit > 0) {
            elements[2].setLine(index+3, "&7Total Profit - &a+"+formatted)
        } else if (totalprofit == 0) {
            elements[2].setLine(index+3, "&7Total Profit - &e0")
        } else {
            elements[2].setLine(index+3, "&7Total Profit -&c "+formatted)
        }
    
        elements[2].getLine(index+3).setScale(positions.chestProfit.scale)
        elements[2].getLine(index+3).setShadow(true)
        return
    }
    if (inChestMenu()) {
        let chests = getChests()
        let chestsAndProfits = {"Wood Chest": 0, "Gold Chest": 0, "Diamond Chest": 0, "Emerald Chest": 0, "Obsidian Chest": 0, "Bedrock Chest": 0}
        let index = -1
        for (let chest of chests) {
            index += 1
            try {
                chest.getLore()
            } catch (error) {
                return
            }
            let profit = getProfitFromLore(chest.getLore())
            let chestName = chest.getName()
            let formatted = utils.formatLargeNumber(profit)
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
        let best = Object.entries(chestsAndProfits).reduce((a, b) => a[1] > b[1] ? a : b)[0]
        
        for (let chest of chests) {
            let chestName = chest.getName()
            if (!chestName.includes(best)) continue
            if (chestName.includes("[BEST]")) return
            chest.setName(chestName+" &a[BEST]")
            bestChestName = chest.getName()
        }
    }
    updateGUI = true
})

register("renderSlot", slot => {
    if (!Settings.chestProfit) return
    if (!slot.getInventory().getName().includes("The Catacombs")) return
    found = false
    citem = slot.getItem()
    if (!citem) return
    cname = citem.getName()
    if (!bestChestName) return
    if (citem.getName()==bestChestName) {
        found = true
    }

    if (found) {
        Renderer.drawRect(Renderer.color(0, 255, 0, 100), slot.getDisplayX(), slot.getDisplayY(), 16, 16)
    }
})

register("guiRender", () => {
    if (editGui.isOpen()) return
    elements[2].setShouldRender(false)
    let index = -1
    for (let line of elements[2].getLines()) {
        index++
        line.getText().setAlign(positions.chestProfit.align).draw(positions.chestProfit.x, positions.chestProfit.y+10*index*positions.chestProfit.scale)
    }
})