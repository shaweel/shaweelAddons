import {request} from "requestV2"
import Settings from "../../core/config.js"
import utils from "../../lib/Utils.js"
import { editGui, positions, setShouldRender, clearLines, getLines, setLine } from "../../core/Gui.js"

let bestChestName=null
let updateGUI = false
const chestTypes = ["Wood Chest", "Gold Chest", "Diamond Chest", "Emerald Chest", "Obsidian Chest", "Bedrock Chest"]

function inChest() {
	if (chestTypes.includes(Player.getContainer().getName())) {
		return true
	}
	return false
}

function inChestMenu() {
	if (Player.getContainer().getName().includes("Catacombs -")) {
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
		index++
		if ((line.includes("Coins") || line.includes("FREE")) && !line.includes("NOTE")) chestcost = line
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
	if (isNaN(chestcost)) chestcost = 0
	profit -= chestcost

	for (let line of lore) {
		index++
		if (!line.includes("Dungeon Chest Key")) continue
		profit -= utils.getBz().DUNGEON_CHEST_KEY.quick_status.buyPrice
		break
	}

	for (let line of lore) {
		index++
		if (!line.includes("Already opened!")) continue
		return NaN
	}
	profit = Math.floor(profit)
	return profit
}

function getProfit(name) {
	let profit = null
	try {
		name.includes("a")
	} catch (err) {
		return 0
	}
	if (name.includes("Wither")) {
		profit = utils.getBz().SHARD_WITHER.quick_status.sellPrice
	}
	if (name.includes("Thorn")) {
		profit = utils.getBz().SHARD_THORN.quick_status.sellPrice
	}
	if (name.includes("Scarf")) {
		profit = utils.getBz().SHARD_SCARF.quick_status.sellPrice
	}
	if (name.includes("Wither Essence")) {
		amount = name.split("x")[1]
		amount = Number(amount)
		price = utils.getBz().ESSENCE_WITHER.quick_status.sellPrice
		profit = price*amount
	}
	if (name.includes("Undead Essence")) {
		amount = name.split("x")[1]
		amount = Number(amount)
		price = utils.getBz().ESSENCE_UNDEAD.quick_status.sellPrice
		profit = price*amount
	}
	if (name.includes("Bank I") || name.includes("Bank 1")) {
		profit = utils.getBz().ENCHANTMENT_ULTIMATE_BANK_1.quick_status.sellPrice
	}
	if (name.includes("Bank II") || name.includes("Bank 2")) {
		profit = utils.getBz().ENCHANTMENT_ULTIMATE_BANK_2.quick_status.sellPrice
	}
	if (name.includes("Bank III") || name.includes("Bank 3")) {
		profit = utils.getBz().ENCHANTMENT_ULTIMATE_BANK_3.quick_status.sellPrice
	}
	if (name.includes("Combo I") || name.includes("Combo 1")) {
		profit = utils.getBz().ENCHANTMENT_ULTIMATE_COMBO_1.quick_status.sellPrice
	}
	if (name.includes("Combo II") || name.includes("Combo 2")) {
		profit = utils.getBz().ENCHANTMENT_ULTIMATE_COMBO_2.quick_status.sellPrice
	}
	if (name.includes("Ultimate Wise I") || name.includes("Ultimate Wise 1")) {
		profit = utils.getBz().ENCHANTMENT_ULTIMATE_WISE_1.quick_status.sellPrice
	}
	if (name.includes("Ultimate Wise II") || name.includes("Ultimate Wise 2")) {
		profit = utils.getBz().ENCHANTMENT_ULTIMATE_WISE_2.quick_status.sellPrice
	}
	if (name.includes("Wisdom I") || name.includes("Wisdom 1")) {
		profit = utils.getBz().ENCHANTMENT_ULTIMATE_WISDOM_1.quick_status.sellPrice
	}
	if (name.includes("Wisdom II") || name.includes("Wisdom 2")) {
		profit = utils.getBz().ENCHANTMENT_ULTIMATE_WISDOM_2.quick_status.sellPrice
	}
	if (name.includes("Ultimate Jerry I") || name.includes("Ultimate Jerry 1")) {
		profit = utils.getBz().ENCHANTMENT_ULTIMATE_JERRY_1.quick_status.sellPrice
	}
	if (name.includes("Ultimate Jerry II") || name.includes("Ultimate Jerry 2")) {
		profit = utils.getBz().ENCHANTMENT_ULTIMATE_JERRY_2.quick_status.sellPrice
	}
	if (name.includes("Ultimate Jerry III") || name.includes("Ultimate Jerry 3")) {
		profit = utils.getBz().ENCHANTMENT_ULTIMATE_JERRY_3.quick_status.sellPrice
	}
	if (name.includes("Infinite Quiver VI") || name.includes("Infinite Quiver 6")) {
		profit = utils.getBz().ENCHANTMENT_INFINITE_QUIVER_6.quick_status.sellPrice
	}
	if (name.includes("Infinite Quiver VII") || name.includes("Infinite Quiver 7")) {
		profit = utils.getBz().ENCHANTMENT_INFINITE_QUIVER_7.quick_status.sellPrice
	}
	if (name.includes("Feather Falling VI") || name.includes("Feather Falling 6")) {
		profit = utils.getBz().ENCHANTMENT_FEATHER_FALLING_6.quick_status.sellPrice
	}
	if (name.includes("Feather Falling VII") || name.includes("Feather Falling 7")) {
		profit = utils.getBz().ENCHANTMENT_FEATHER_FALLING_7.quick_status.sellPrice
	}
	if (name.includes("Rejuvenate I") || name.includes("Rejuvenate 1")) {
		profit = utils.getBz().ENCHANTMENT_REJUVENATE_1.quick_status.sellPrice
	}
	if (name.includes("Swarm I") || name.includes("Swarm 1")) {
		profit = utils.getBz().ENCHANTMENT_ULTIMATE_SWARM_1.quick_status.sellPrice
	}
	if (name.includes("Legion I") || name.includes("Legion 1")) {
		profit = utils.getBz().ENCHANTMENT_ULTIMATE_LEGION_1.quick_status.sellPrice
	}
	if (name.includes("Rend I") || name.includes("Rend 1")) {
		profit = utils.getBz().ENCHANTMENT_ULTIMATE_REND_1.quick_status.sellPrice
	}
	if (name.includes("Rend II") || name.includes("Rend 2")) {
		profit = utils.getBz().ENCHANTMENT_ULTIMATE_REND_2.quick_status.sellPrice
	}
	if (name.includes("Overload I") || name.includes("Overload 1")) {
		profit = utils.getBz().ENCHANTMENT_OVERLOAD_1.quick_status.sellPrice
	}
	if (name.includes("Lethality I") || name.includes("Lethality 1")) {
		profit = utils.getBz().ENCHANTMENT_LETHALITY_6.quick_status.sellPrice
	}
	if (name.includes("Rejuvenate II") || name.includes("Rejuvenate 2")) {
		profit = utils.getBz().ENCHANTMENT_REJUVENATE_2.quick_status.sellPrice
	}
	if (name.includes("Rejuvenate III") || name.includes("Rejuvenate 3")) {
		profit = utils.getBz().ENCHANTMENT_REJUVENATE_3.quick_status.sellPrice
	}
	if (name.includes("No Pain No Gain I") || name.includes("No Pain No Gain 1")) {
		profit = utils.getBz().ENCHANTMENT_ULTIMATE_NO_PAIN_NO_GAIN_1.quick_status.sellPrice
	}
	if (name.includes("No Pain No Gain II") || name.includes("No Pain No Gain 2")) {
		profit = utils.getBz().ENCHANTMENT_ULTIMATE_NO_PAIN_NO_GAIN_2.quick_status.sellPrice
	}
	if (name.includes("Soul Eater I") || name.includes("Soul Eater 1")) {
		profit = utils.getBz().ENCHANTMENT_ULTIMATE_SOUL_EATER_1.quick_status.sellPrice
	}
	if (name.includes("Last Stand I") || name.includes("Last Stand 1")) {
		profit = utils.getBz().ENCHANTMENT_ULTIMATE_LAST_STAND_1.quick_status.sellPrice
	}
	if (name.includes("Last Stand II") || name.includes("Last Stand 2")) {
		profit = utils.getBz().ENCHANTMENT_ULTIMATE_LAST_STAND_2.quick_status.sellPrice
	}
	if (name.includes("One For All I") || name.includes("One For All 1")) {
		profit = utils.getBz().ENCHANTMENT_ULTIMATE_ONE_FOR_ALL_1.quick_status.sellPrice
	}
	if (name.includes("Thunderlord VII") || name.includes("Thunderlord 7")) {
		profit = utils.getBz().ENCHANTMENT_THUNDERLORD_7.quick_status.sellPrice
	}
	if (name.includes("Necromancer's Brooch")) {
		profit = utils.getBz().NECROMANCER_BROOCH.quick_status.sellPrice
	}
	if (name.includes("Hot Potato Book")) {
		profit = utils.getBz().HOT_POTATO_BOOK.quick_status.sellPrice
	}
	if (name.includes("Fuming Potato Book")) {
		profit = utils.getBz().FUMING_POTATO_BOOK.quick_status.sellPrice
	}
	if (name.includes("Red Nose")) {
		profit = utils.getBz().RED_NOSE.quick_status.sellPrice
	}
	if (name.includes("Balloon Snake")) {
		profit = utils.getAh().BALLOON_SNAKE
	}
	if (name.includes("Bonzo's Mask")) {
		profit = utils.getAh().BONZO_MASK
	}
	if (name.includes("Bonzo's Staff")) {
		profit = utils.getAh().BONZO_STAFF
	}
	if (name.includes("Recombobulator 3000")) {
		profit = utils.getBz().RECOMBOBULATOR_3000.quick_status.sellPrice
	}
	if (name.includes("Master Skull - Tier 1")) {
		profit = utils.getAh().MASTER_SKULL_TIER_1
	}
	if (name.includes("Master Skull - Tier 2")) {
		profit = utils.getAh().MASTER_SKULL_TIER_2
	}
	if (name.includes("Master Skull - Tier 3")) {
		profit = utils.getAh().MASTER_SKULL_TIER_3
	}
	if (name.includes("Master Skull - Tier 4")) {
		profit = utils.getAh().MASTER_SKULL_TIER_4
	}
	if (name.includes("Master Skull - Tier 5")) {
		profit = utils.getAh().MASTER_SKULL_TIER_5
	}
	if (name.includes("Scarf's Studies")) {
		profit = utils.getAh().SCARF_STUDIES
	}
	if (name.includes("Dark Claymore")) {
		profit = utils.getAh().DARK_CLAYMORE
	}
	if (name.includes("Necron's Handle")) {
		profit = utils.getAh().NECRON_HANDLE
	}
	if (name.includes("Auto Recombobulator")) {
		profit = utils.getAh().AUTO_RECOMBOBULATOR
	}
	if (name.includes("Wither Shield")) {
		profit = utils.getBz().WITHER_SHIELD_SCROLL.quick_status.sellPrice
	}
	if (name.includes("Storm The Fish")) {
		profit = utils.getAh().STORM_THE_FISH
	}
	if (name.includes("Maxor The Fish")) {
		profit = utils.getAh().MAXOR_THE_FISH
	}
	if (name.includes("Goldor The Fish")) {
		profit = utils.getAh().GOLDOR_THE_FISH
	}
	if (name.includes("Dungeon Disc")) {
		profit = utils.getAh().DUNGEON_DISC_1
	}
	if (name.includes("Clown Disc")) {
		profit = utils.getAh().DUNGEON_DISC_2
	}
	if (name.includes("Watcher Disc")) {
		profit = utils.getAh().DUNGEON_DISC_3
	}
	if (name.includes("Necron Disc")) {
		profit = utils.getAh().DUNGEON_DISC_4
	}
	if (name.includes("Old Disc")) {
		profit = utils.getAh().DUNGEON_DISC_5
	}
	if (name.includes("Wither Cloak Sword")) {
		profit = utils.getAh().WITHER_CLOAK
	}
	if (name.includes("Shadow Warp")) {
		profit = utils.getBz().SHADOW_WARP_SCROLL.quick_status.sellPrice
	}
	if (name.includes("Implosion")) {
		profit = utils.getBz().IMPLOSION_SCROLL.quick_status.sellPrice
	}
	if (name.includes("Red Scarf")) {
		profit = utils.getBz().RED_SCARF.quick_status.sellPrice
	}
	if (name.includes("Dark Orb")) {
		profit = utils.getBz().DARK_ORB.quick_status.sellPrice
	}
	if (name.includes("Wither Blood")) {
		profit = utils.getBz().WITHER_BLOOD.quick_status.sellPrice
	}
	if (name.includes("Wither Catalyst")) {
		profit = utils.getBz().WITHER_CATALYST.quick_status.sellPrice
	}
	if (name.includes("Precursor Gear")) {
		profit = utils.getBz().PRECURSOR_GEAR.quick_status.sellPrice
	}
	if (name.includes("Sadan's Brooch")) {
		profit = utils.getBz().SADAN_BROOCH.quick_status.sellPrice
	}
	if (name.includes("Giant Tooth")) {
		profit = utils.getBz().GIANT_TOOTH.quick_status.sellPrice
	}
	if (name.includes("Warped Stone")) {
		profit = utils.getBz().AOTE_STONE.quick_status.sellPrice
	}
	if (name.includes("Suspicious Vial")) {
		profit = utils.getBz().SUSPICIOUS_VIAL.quick_status.sellPrice
	}
	if (name.includes("Adaptive Blade")) {
		profit = utils.getAh().STONE_BLADE
	}
	if (name.includes("Adaptive Belt")) {
		profit = utils.getAh().ADAPTIVE_BELT
	}
	if (name.includes("Livid Dagger")) {
		profit = utils.getAh().LIVID_DAGGER
	}
	if (name.includes("Shadow Fury")) {
		profit = utils.getAh().SHADOW_FURY
	}
	if (name.includes("Last Breath")) {
		profit = utils.getAh().LAST_BREATH
	}
	if (name.includes("Precursor Eye")) {
		profit = utils.getAh().PRECURSOR_EYE
	}
	if (name.includes("Giant's Sword")) {
		profit = utils.getAh().GIANTS_SWORD
	}
	if (name.includes("Fel Skull")) {
		profit = utils.getAh().FEL_SKULL
	}
	if (name.includes("Necromancer Sword")) {
		profit = utils.getAh().NECROMANCER_SWORD
	}
	if (name.includes("Summoning Ring")) {
		profit = utils.getAh().SUMMONING_RING
	}
	if (name.includes("Soulweaver Gloves")) {
		profit = utils.getAh().SOULWEAVER_GLOVES
	}
	if (name.includes("First Master Star")) {
		profit = utils.getBz().FIRST_MASTER_STAR.quick_status.sellPrice
	}
	if (name.includes("Second Master Star")) {
		profit = utils.getBz().SECOND_MASTER_STAR.quick_status.sellPrice
	}
	if (name.includes("Third Master Star")) {
		profit = utils.getBz().THIRD_MASTER_STAR.quick_status.sellPrice
	}
	if (name.includes("Fourth Master Star")) {
		profit = utils.getBz().FOURTH_MASTER_STAR.quick_status.sellPrice
	}
	if (name.includes("Fifth Master Star")) {
		profit = utils.getBz().FIFTH_MASTER_STAR.quick_status.sellPrice
	}
	if (name.includes("Adaptive Boots")) {
		profit = utils.getAh().ADAPTIVE_BOOTS
	}
	if (name.includes("Adaptive Chestplate")) {
		profit = utils.getAh().ADAPTIVE_CHESTPLATE
	}
	if (name.includes("Adaptive Leggings")) {
		profit = utils.getAh().ADAPTIVE_LEGGINGS
	}
	if (name.includes("Adaptive Helmet")) {
		profit = utils.getAh().ADAPTIVE_HELMET
	}
	if (name.includes("Wither Boots")) {
		profit = utils.getAh().WITHER_BOOTS
	}
	if (name.includes("Wither Chestplate")) {
		profit = utils.getAh().WITHER_CHESTPLATE
	}
	if (name.includes("Wither Leggings")) {
		profit = utils.getAh().WITHER_LEGGINGS
	}
	if (name.includes("Wither Helmet")) {
		profit = utils.getAh().WITHER_HELMET
	}
	if (name.includes("Shadow Assassin Boots")) {
		profit = utils.getAh().SHADOW_ASSASSIN_BOOTS
	}
	if (name.includes("Shadow Assassin Chestplate")) {
		profit = utils.getAh().SHADOW_ASSASSIN_CHESTPLATE
	}
	if (name.includes("Shadow Assassin Leggings")) {
		profit = utils.getAh().SHADOW_ASSASSIN_LEGGINGS
	}
	if (name.includes("Shadow Assassin Helmet")) {
		profit = utils.getAh().SHADOW_ASSASSIN_HELMET
	}
	if (name.includes("Necromancer Lord Boots")) {
		profit = utils.getAh().NECROMANCER_LORD_BOOTS
	}
	if (name.includes("Necromancer Lord Chestplate")) {
		profit = utils.getAh().NECROMANCER_LORD_CHESTPLATE
	}
	if (name.includes("Necromancer Lord Leggings")) {
		profit = utils.getAh().NECROMANCER_LORD_LEGGINGS
	}
	if (name.includes("Necromancer Lord Helmet")) {
		profit = utils.getAh().NECROMANCER_LORD_HELMET
	}
	if (name.includes("Shadow Assassin Cloak")) {
		profit = utils.getAh().SHADOW_ASSASSIN_CLOAK
	}
	if (name.includes("Spirit") && name.includes("Lvl")) {
		if (name.includes("&5")) {
			profit = utils.getAh()["SPIRIT;3"]
		} else {
			profit = utils.getAh()["SPIRIT;4"]
		}
	}

	if (name.includes("Spirit Stone")) {
		profit = utils.getBz().SPIRIT_DECOY.quick_status.sellPrice
	}
	if (name.includes("Spirit Wing")) {
		profit = utils.getBz().SPIRIT_WING.quick_status.sellPrice
	}
	if (name.includes("Apex Dragon")) {
		profit = utils.getBz().SHARD_APEX_DRAGON.quick_status.sellPrice
	}
	if (name.includes("Power Dragon")) {
		profit = utils.getBz().SHARD_POWER_DRAGON.quick_status.sellPrice
	}
	if (name.includes("Spirit Boots")) {
		profit = utils.getAh().THORNS_BOOTS
	}
	if (name.includes("Spirit Mask")) {
		profit = utils.getAh().SPIRIT_MASK
	}
	if (name.includes("Spirit Bone")) {
		profit = utils.getBz().SPIRIT_BONE.quick_status.sellPrice
	}
	if (name.includes("Spirit Sword")) {
		profit = utils.getAh().SPIRIT_SWORD
	}
	if (name.includes("Spirit Shortbow")) {
		profit = utils.getAh().ITEM_SPIRIT_BOW
	}
	if (profit == null) profit = 0
	return profit
}

register("tick", () => {
	if (editGui.isOpen()) return
	if (!Settings.chestProfit) return
	clearLines("chestProfit")
	if (!inChestMenu() && !inChest()) {
		updateGUI = true
		return
	}
	if (inChest()) {
		let loot = getItemsFromLootChest()
		let chest = Player.getContainer().getName()
		if (chest == "Wood Chest") {
			setLine("chestProfit", 0, "&fWood Chest")
		} else if (chest == "Gold Chest") {
			setLine("chestProfit", 0, "&6Gold Chest")
		} else if (chest == "Diamond Chest") {
			setLine("chestProfit", 0, "&bDiamond Chest")
		} else if (chest == "Emerald Chest") {
			setLine("chestProfit", 0, "&2Emerald Chest")
		} else if (chest == "Obsidian Chest") {
			setLine("chestProfit", 0, "&5Obsidian Chest")
		} else if (chest == "Bedrock Chest") {
			setLine("chestProfit", 0, "&8Bedrock Chest")
		}
		let index = 0
		let totalprofit = 0
		let lore = Player.getContainer().getStackInSlot(31)
		if (lore === null) {
			return
		}
		lore = lore.getLore()
		let chestcost = NaN
		for (let line of lore) {
			index++
			if ((line.includes("Coins") || line.includes("FREE")) && !line.includes("NOTE")) chestcost = line
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
		if (isNaN(chestcost)) chestcost = 0
		try {
			let lore = Player.getContainer().getStackInSlot(31).getLore()
			let keyIndex = -1
			for (let line of lore) {
				keyIndex++
				if (!line.includes("Dungeon Chest Key")) continue
				chestcost += utils.getBz().DUNGEON_CHEST_KEY.quick_status.buyPrice
				break
			}
		} catch (err) {}
		let lootIndex = -1
		for (let item of loot) {
			lootIndex += 1
			let name = item.getName()
			if (name.includes("Enchanted Book")) {
				name = item.getLore()[1]
			}
			let profit = getProfit(name)
			profit = Math.floor(profit)
			if (profit > 0) {
				setLine("chestProfit", lootIndex, name+"&7 - &a+"+utils.formatLargeNumber(profit))
			} else if (profit == 0) {
				setLine("chestProfit", lootIndex, name+"&7 - &e0")
			} else {
				setLine("chestProfit", lootIndex, name+"&7 - &c"+utils.formatLargeNumber(profit))
			}
			if (profit == NaN) return
			totalprofit += profit
		}
		totalprofit -= chestcost
		chestcost = Math.floor(chestcost)
		setLine("chestProfit", lootIndex+2, "&7Chest Cost - &c-"+utils.formatLargeNumber(chestcost))
		if (chestcost == 0) {
			setLine("chestProfit", lootIndex+2, "&7Chest Cost - &aFREE")
		}
		totalprofit = Math.floor(totalprofit)
		formatted = utils.formatLargeNumber(totalprofit)
		let currentlore = Player.getContainer().getStackInSlot(31).getLore()
		let openedIndex = -1
		for (let line of currentlore) {
			openedIndex++
			if (!line.includes("Already opened!")) continue
			formatted = "&aAlready opened!"
			totalprofit = -999999999999
		}
		if (totalprofit > 0) {
			setLine("chestProfit", lootIndex+3, "&7Total Profit - &a+"+formatted)
		} else if (totalprofit == 0) {
			setLine("chestProfit", lootIndex+3, "&7Total Profit - &e0")
		} else {
			setLine("chestProfit", lootIndex+3, "&7Total Profit -&c "+formatted)
		}
		return
	}
	if (inChestMenu()) {
		let chests = getChests()
		let chestsAndProfits = {"Wood": -999999999999, "Gold": -999999999999, "Diamond": -999999999999, "Emerald": -999999999999, "Obsidian": -999999999999, "Bedrock": -999999999999}
		let index = -1
		for (let chest of chests) {
			index += 1
			try {
				chest.getLore()
			} catch (err) {
				return
			}
			let profit = getProfitFromLore(chest.getLore())
			let chestName = chest.getName()
			let formatted = utils.formatLargeNumber(profit)
			if (isNaN(profit)) {
				formatted = "&aAlready opened"
				profit = -999999999999
				chestsAndProfits[chestName] = -999999999999
			}
			if (profit > 0) {
				setLine("chestProfit", index, chestName+"&7 - &a+"+formatted)
			} else if (profit == 0) {
				setLine("chestProfit", index, chestName+"&7 - &e0")
			} else {
				setLine("chestProfit", index, chestName+"&7 -&c "+formatted)
			}
			chestName = ChatLib.removeFormatting(chestName)
			chestsAndProfits[chestName] = profit
		}
		let best = Object.entries(chestsAndProfits).reduce((a, b) => a[1] > b[1] ? a : b)[0]
		
		for (let chest of chests) {
			let chestName = chest.getName()
			utils.debugLog(best)
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
	if (!slot.getInventory().getName().includes("Catacombs -")) return
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
	setShouldRender("chestProfit", false)
	let index = -1
	for (let line of getLines("chestProfit")) {
		index++
		try {
			line.draw(positions.chestProfit.x, positions.chestProfit.y+10*index*positions.chestProfit.scale)
		} catch (err) {}
	}
})