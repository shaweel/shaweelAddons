import Utils from "../Utils.js"
import Settings from "../config.js"
const translations = Utils.getTranslation("party")
let listing = false
let pinging = false
let tps = 20
let prevTime = Date.now()
let start = 0
let partyMembers = []
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
function command(command, action) {
	register("chat", (msg) => {
	if (!Settings.chatCommands) return
	msg = msg.split(" ")
	if (!translations.includes(msg[0])) return
	if (msg[1] !== ">") return
	msg.splice(0, 2)
	msgString = msg.join(" ")
	msg = msgString.split(": ")
	player = removeRanks(msg[0])
	msg = msg[1]
	if (!msg || !msg.startsWith("!"+command)) return
	Utils.debugLog(player+"&7 triggered the !"+command+" chat command.")
	let dontCommand = false
	if (action === "sendCoords") {
		dontCommand = true
		let x = Player.getX()
		let y = Player.getY()
		let z = Player.getZ()
		ChatLib.command("pc X: "+Utils.roundToDecimals(x, 0)+" , Y: "+Utils.roundToDecimals(y, 0)+", Z: "+Utils.roundToDecimals(z, 0))
		return
	}
	if (action === "kickPerson") {
		dontCommand = true
		ChatLib.command("party list")
		partyMembers = []
		listing = true

		let plr=msg.split(" ")[1]
		plr=plr.toLowerCase()
		const kicker = register("tick", () => {
		if (listing) return
		for (let player of partyMembers) {
			player = player.toLowerCase()
			if (player.startsWith(plr)) {
			Utils.debugLog("Kicking "+player)
			setTimeout(() => {
				ChatLib.command("party kick "+player)
			}, 400);
			kicker.unregister()
			return
			}
		}
		kicker.unregister()
		return
		})
	}
	if (action === "promotePerson") {
		dontCommand = true
		ChatLib.command("party list")
		partyMembers = []
		listing = true

		let plr=msg.split(" ")[1]
		const kicker = register("tick", () => {
		if (listing) return
		for (let player of partyMembers) {
			if (player.startsWith(plr)) {
			Utils.debugLog("Promoting "+player)
			setTimeout(() => {
				ChatLib.command("party promote "+player)
			}, 400);
			kicker.unregister()
			return
			}
		}
		kicker.unregister()
		return
		})
	}
	if (action === "demotePerson") {
		dontCommand = true
		ChatLib.command("party list")
		partyMembers = []
		listing = true

		let plr=msg.split(" ")[1]
		const kicker = register("tick", () => {
		if (listing) return
		for (let player of partyMembers) {
			if (player.startsWith(plr)) {
			Utils.debugLog("Demoting "+player)
			setTimeout(() => {
				ChatLib.command("party demote "+player)
			}, 400);
			kicker.unregister()
			return
			}
		}
		kicker.unregister()
		return
		})
	}
	if (action === "invPerson") {
		dontCommand = true
		let plr=msg.split(" ")[1]
		ChatLib.command("party invite "+plr)
		return
	}
	if (action === "transfer") {
		dontCommand = true
		ChatLib.command("party transfer "+player)
		return
	}
	if (action === "getPing") {
		dontCommand = true
		start = Date.now()
		pinging = true
		ChatLib.command("abcdefghijklmnop")
		return
	}
	if (action === "getTps") {
		dontCommand = true
		ChatLib.command("pc TPS: "+tps)
		return
	}
	if (action === "getFps") {
		dontCommand = true
		ChatLib.command("pc FPS: "+Client.getFPS())
		return
	}
	if (action === "getTime") {
		dontCommand = true
		let now = new Date()
		let hours = now.getHours()
		let norm = "AM"
		if (hours > 12) {hours -= 12; norm = "PM"}
		if (hours === 12 && norm === "AM") norm = "PM"
		if (hours === 12 && norm === "PM") norm = "AM"
		ChatLib.command("pc Time: "+hours+":"+now.getMinutes()+":"+now.getSeconds()+" "+norm)
		return
	}
	if (!dontCommand) ChatLib.command(action)
	}).setCriteria("${msg}")
}

command(
	"w",
	"p warp"
)
command(
	"coords",
	"sendCoords"
)
command(
	"allinv",
	"p setting allinvite"
)
command(
	"kick",
	"kickPerson"
)
command(
	"promote",
	"promotePerson"
)
command(
	"demote",
	"demotePerson"
)
command(
	"pt",
	"transfer"
)
command(
	"ping",
	"getPing"
)
command(
	"tps",
	"getTps"
)
command(
	"fps",
	"getFps"
)
command(
	"inv",
	"invPerson"
)
command(
	"time",
	"getTime"
)
let amount=0
register("chat", (event) => {
	msg = ChatLib.getChatMessage(event)
	msg = ChatLib.removeFormatting(msg)
	let tempMsg = msg.split(" ")
	if (translations.includes(tempMsg[0]) && tempMsg[1] === ">") return
	if (!listing) return
	event.setCanceled(true)
	if (amount > 1) {
	amount = 0
	listing = false
	return
	}
	if (msg==="-----------------------------------------------------") {
	amount ++
	return
	}
	if (msg.startsWith("Party Members (")) return
	msg = removeRanks(msg)
	if (msg.startsWith("Party Leader: ")) {
	let newmsg=msg.split("Party Leader: ")[1]
	newmsg=newmsg.split(" ●")[0]
	partyMembers.push(newmsg)
	}
	if (msg.startsWith("Party Members: ")) {
	let newmsg=msg.split("Party Members: ")[1]
	let plrs=newmsg.split(" ●")
	for (let player of plrs) {
		partyMembers.push(player)
	}
	}
	if (msg.startsWith("Party Moderators: ")) {
	let newmsg=msg.split("Party Moderators: ")[1]
	let plrs=newmsg.split(" ●")
	for (let player of plrs) {
		partyMembers.push(player)
	}
	}
})

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
	tps = Utils.formatSmallNumber(tps, 1)
	prevTime=Date.now()
}).setFilteredClass(net.minecraft.network.play.server.S03PacketTimeUpdate)