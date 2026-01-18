import utils from "../../lib/Utils.js"
import Settings from "../../core/config.js"
const translations = utils.getTranslation("party")
let pinging = false
let tps = 20
let prevTime = Date.now()
let start = 0
function removeRanks(string) {
	string = string.replaceAll("[VIP] ", "")
	string = string.replaceAll("[VIP+] ", "")
	string = string.replaceAll("[MVP] ", "")
	string = string.replaceAll("[MVP+] ", "")
	string = string.replaceAll("[MVP++] ", "")
	string = string.replaceAll("[YOUTUBE] ", "")
	string = string.replaceAll("[YT] ", "")
	string = string.replaceAll("[MOJANG] ", "")
	string = string.replaceAll("[MCP] ", "")
	string = string.replaceAll("[PIG+++] ", "")
	string = string.replaceAll("[INNIT] ", "")
	string = string.replaceAll("[ዞ] ", "")
	return string
}

function getAllPartyMembers() {
	//TODO - finish this, add translations for woah ur doing ts too quick and no party members
	let startOrEndAmount = 0
	let chatRegister = register("chat", (event) => {
		let message = ChatLib.removeFormatting(ChatLib.getChatMessage(event))
		if (message === "-----------------------------------------------------") {
			event.setCanceled(true)
			startOrEndAmount++
			if (startOrEndAmount >= 2) {startOrEndAmount=0; chatRegister.unregister()}
			return
		}

		event.setCanceled(true)
		utils.chatLog(message)
	})
	ChatLib.command("party list")
}

register("chat", (msg) => {
	msg = ChatLib.removeFormatting(msg)
	if (!Settings.chatCommands || !translations.includes(msg.split(" ")[0]) || msg.split(" ")[1] != ">") return

	let playerAndMessage = msg.split(" ").slice(2).join(" ").split(": ")
	let player = removeRanks(playerAndMessage[0])
	let message = playerAndMessage[1]
	if (!message.startsWith("!")) return
	message = message.replace("!", "")
	let action = message.split(" ")[0].toLowerCase()
	utils.debugLog(action)
	let args = message.split(" ").slice(1)

	utils.debugLog(player+"&7 triggered the !"+action+" chat command.")
	if (action.startsWith("coords")) {
		let x = Player.getX()
		let y = Player.getY()
		let z = Player.getZ()
		ChatLib.command("pc X: "+utils.roundToDecimals(x, 0)+" , Y: "+utils.roundToDecimals(y, 0)+", Z: "+utils.roundToDecimals(z, 0))
		return
	}
	if (action.startsWith("k")) {
		ChatLib.command("pc [shaweelAddons] This command is temporarily disabled.")
		return
	}
	if (action.startsWith("promote")) {
		ChatLib.command("pc [shaweelAddons] This command is temporarily disabled.")
		return
	}
	if (action.startsWith("demote")) {
		ChatLib.command("pc [shaweelAddons] This command is temporarily disabled.")
		return
	}
	if (action.startsWith("inv")) {
		let plr=msg.split(" ")[1]
		ChatLib.command("party invite "+plr)
		return
	}
	if (action.startsWith("transfer")) {
		ChatLib.command("party transfer "+player)
		return
	}
	if (action.startsWith("ping")) {
		start = Date.now()
		pinging = true
		ChatLib.command("abcdefghijklmnop")
		return
	}
	if (action.startsWith("tps")) {
		ChatLib.command("pc TPS: "+tps)
		return
	}
	if (action.startsWith("fps")) {
		ChatLib.command("pc FPS: "+Client.getFPS())
		return
	}
	if (action.startsWith("r") && action != "racism") {
		ChatLib.command("p kick "+player)
		utils.clientSchedule(500, () => {
			ChatLib.command("p "+player)
		})
		return
	}
	if (action.startsWith("time")) {
		let now = new Date()
		let hours = now.getHours()
		let norm = "AM"
		if (hours > 12) {hours -= 12; norm = "PM"}
		if (hours === 12 && norm === "AM") norm = "PM"
		if (hours === 12 && norm === "PM") norm = "AM"
		ChatLib.command("pc Time: "+hours+":"+now.getMinutes()+":"+now.getSeconds()+" "+norm)
		return
	}
	if (action.startsWith("w")) ChatLib.command("p warp")
	if (action.startsWith("allinv")) ChatLib.command("p setting allinvite")
	if (action.startsWith("e")) ChatLib.command("joininstance catacombs_entrance")
	if (action.startsWith("f1")) ChatLib.command("joininstance catacombs_floor_one")
	if (action.startsWith("f2")) ChatLib.command("joininstance catacombs_floor_two")
	if (action.startsWith("f3")) ChatLib.command("joininstance catacombs_floor_three")
	if (action.startsWith("f4")) ChatLib.command("joininstance catacombs_floor_four")
	if (action.startsWith("f5")) ChatLib.command("joininstance catacombs_floor_five")
	if (action.startsWith("f6")) ChatLib.command("joininstance catacombs_floor_six")
	if (action.startsWith("f7")) ChatLib.command("joininstance catacombs_floor_seven")
	if (action.startsWith("m1")) ChatLib.command("joininstance master_catacombs_floor_one")
	if (action.startsWith("m2")) ChatLib.command("joininstance master_catacombs_floor_two")
	if (action.startsWith("m3")) ChatLib.command("joininstance master_catacombs_floor_three")
	if (action.startsWith("m4")) ChatLib.command("joininstance master_catacombs_floor_four")
	if (action.startsWith("m5")) ChatLib.command("joininstance master_catacombs_floor_five")
	if (action.startsWith("m6")) ChatLib.command("joininstance master_catacombs_floor_six")
	if (action.startsWith("m7")) ChatLib.command("joininstance master_catacombs_floor_seven")
	if (action.startsWith("t1")) ChatLib.command("joininstance kuudra_normal")
	if (action.startsWith("t2")) ChatLib.command("joininstance kuudra_hot")
	if (action.startsWith("t3")) ChatLib.command("joininstance kuudra_burning")
	if (action.startsWith("t4")) ChatLib.command("joininstance kuudra_fiery")
	if (action.startsWith("t5")) ChatLib.command("joininstance kuudra_infernal")
}).setCriteria("${msg}")


register("chat", (event) => {
	if (!pinging) return
	pinging = false
	event.setCanceled(true)
	let ms = Date.now()-start
	ChatLib.command("pc Ping: "+ms+"ms")
}).setCriteria(/^Unknown command\. Type \"\/help\" for help\. \(\'.+\'\)$/)

register("packetReceived", () => {
	tps = (20000 / (Date.now() - prevTime))
	tps = Math.min(Math.max(tps, 0), 20)
	tps = utils.formatSmallNumber(tps, 1)
	prevTime=Date.now()
}).setFilteredClass(net.minecraft.network.play.server.S03PacketTimeUpdate)


register("command", () => {
	getAllPartyMembers()
}).setName("testPartyMembers")