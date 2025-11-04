import utils from "../utils.js"
import Settings from "../config.js"
const translations = utils.getTranslation("party")
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
        utils.debugLog(player+"&7 triggered the !"+command+" chat command.")
        if (action === "sendCoords") {
            let x = Player.getX()
            let y = Player.getY()
            let z = Player.getZ()
            ChatLib.command("pc X: "+utils.roundToDecimals(x, 0)+" , Y: "+utils.roundToDecimals(y, 0)+", Z: "+utils.roundToDecimals(z, 0))
            return
        }
        if (action === "kickPerson") {
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
                        utils.debugLog("Kicking "+player)
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
            ChatLib.command("party list")
            partyMembers = []
            listing = true

            let plr=msg.split(" ")[1]
            const kicker = register("tick", () => {
                if (listing) return
                for (let player of partyMembers) {
                    if (player.startsWith(plr)) {
                        utils.debugLog("Promoting "+player)
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
            ChatLib.command("party list")
            partyMembers = []
            listing = true

            let plr=msg.split(" ")[1]
            const kicker = register("tick", () => {
                if (listing) return
                for (let player of partyMembers) {
                    if (player.startsWith(plr)) {
                        utils.debugLog("Demoting "+player)
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
            let plr=msg.split(" ")[1]
            ChatLib.command("party invite "+plr)
            return
        }
        if (action === "transfer") {
            ChatLib.command("party transfer "+player)
            return
        }
        if (action === "getPing") {
            start = Date.now()
            pinging = true
            ChatLib.command("abcdefghijklmnop")
            return
        }
        if (action === "getTps") {
            ChatLib.command("pc TPS: "+tps)
            return
        }
        if (action === "getFps") {
            ChatLib.command("pc FPS: "+Client.getFPS())
            return
        }
        if (action === "getTime") {
            let now = new Date()
            let hours = now.getHours()
            let norm = "AM"
            if (hours > 12) {hours -= 12; norm = "PM"}
            if (hours === 12 && norm === "AM") norm = "PM"
            if (hours === 12 && norm === "PM") norm = "AM"
            ChatLib.command("pc Time: "+hours+":"+now.getMinutes()+":"+now.getSeconds()+" "+norm)
            return
        }
        ChatLib.command(action)
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
    tps = utils.formatSmallNumber(tps, 1)
    prevTime=Date.now()
}).setFilteredClass(net.minecraft.network.play.server.S03PacketTimeUpdate)