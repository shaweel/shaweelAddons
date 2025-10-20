import utils from "../utils.js"
import Settings from "../config.js"
import { startMovingGui } from "./Gui.js"

function tyfr() {
    ChatLib.command("pc tyfr ( ﾟ◡ﾟ)/")
    setTimeout(() => {
        ChatLib.command("p leave")
    }, 500);
}


//Get shitters
let shitters = []
try {
    shitters = FileLib.read("./config/ChatTriggers/modules/shaweelAddons/shitters.json")
    shitters = JSON.parse(shitters)
} catch (err) {
    utils.errorLog(err)
    utils.errorLog("Failed to retrieve shitters. Your shitter list is treated as empty.")
}

//Kick shitters
register("chat", (player, dungeonClass, level) => {
    if (player == Player.getName()) {
        utils.debugLog("You joined a party finder party")
        return
    }

    utils.debugLog("A player joined the party finder party")
    if (!isShitter(player)) return
    utils.debugLog("&cKicking player")
    reason = getShitterReason(player)
    ChatLib.command("pc [shaweelAddons] "+player+" is on my shitter list ("+reason+")")
    setTimeout(() => {
        ChatLib.command("party kick "+player)
    }, 1000)
}).setCriteria("Party Finder > ${player} joined the dungeon group! (${dungeonClass} Level ${level})")

//Get the reason for being a shitter
function getShitterReason(username) {
    username=username.toLowerCase()
    if (!isShitter(username)) return null
    for (let player of shitters) {
        if (player[0].toLowerCase() != username) continue
        return player[1]
    }
}

//Get if a player is on your shitterlist
function isShitter(username) {
    username = username.toLowerCase()
    for (let player of shitters) {
        if (player[0].toLowerCase() != username) continue
        return true
    }
    return false
}

//Save the shitterlist to the file
function saveShitters() {
    toSave = JSON.stringify(shitters)
    FileLib.write("./config/ChatTriggers/modules/shaweelAddons/shitters.json", toSave)
}

confirming = false
function shitter(arg2, arg3, reason) {
    //Prints the help message
    if (arg2 == undefined || arg2 == "help") {
        utils.chatLog("&c[Shitter List] &7Available commands:")
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

    //Reloads the shitter list from the file
    if (arg2 == "reload") {
        shitters = FileLib.read("./config/ChatTriggers/modules/shaweelAddons/shitters.json")
        shitters = JSON.parse(shitters)
        utils.chatLog("&c[Shitter List] &7Succesfully reloaded the shitter list.")
        return
    }

    //Removes everyone from your shitterlist
    if (arg2 == "removeall") {
        confirming = true
        utils.chatLog("&c[Shitter List] &4&lTHIS ACTION IS IRREVERSIBLE&7, type &c/sha shitterlist confirm&7 in the next &a5&7 seconds to proceed.")
        setTimeout(() => {
            confirming = false
        }, 5000)
        return
    }

    //Confirmation for removing everyone from your shitterlist
    if (arg2 == "confirm" && confirming) {
        utils.chatLog("&c[Shitter List] &7Shitter list succesfully wiped.")
        shitters = []
        saveShitters()
        return
    }

    //Lists all players on your shitterlist
    if (arg2 == "list") {
        utils.chatLog("&c[Shitter List] &7All players on your shitter list:")
        for (let player of shitters) {
            ChatLib.chat("&e"+player[0]+"&7: "+player[1])
        }
        return
    }

    //Removes someone from your shitterlist
    if (arg2 == "remove") {
        if (arg3 == undefined) {
            utils.chatLog("&c[Shitter List] &7Usage: &a/sha shitterlist remove <player>")
            return
        }
        if (!isShitter(arg3)) {
            utils.chatLog("&c[Shitter List] &a"+arg3+"&7 is not on your shitter list.")
            return
        }
        utils.chatLog("&c[Shitter List] &7Succesfully removed &a"+arg3+"&7 from your shitter list.")
        n = null
        i=-1
        for (let player of shitters) {
            i+=1
            if (player[0].toLowerCase() != arg3.toLowerCase()) {
                utils.debugLog("&a"+player[0]+"&7 is not &a"+arg3)
                continue
            }
            utils.debugLog("Player to remove has been succesfully found.")
            n=i
            break
        }
        utils.debugLog("Attempting to remove &a"+arg3+" &7from the shitter list using the index &a"+n)
        shitters.splice(n, 1)
        saveShitters()
        return
    }

    //Changes the reason for someone being on your shitterlist
    if (arg2 == "reason") {
        if (arg3 == undefined || reason == "") {
            utils.chatLog("&c[Shitter List] &7Usage: &a/sha shitterlist reason <player> <reason>")
            return
        }

        if (!isShitter(arg3)) {
            utils.chatLog("&c[Shitter List] &a"+arg3+"&7 is not on your shitter list.")
            return
        }
        utils.chatLog("&c[Shitter List] &7Succesfully changed the reason of &a"+arg3+"&7 being on your shitter list to &a"+reason)
        for (let player of shitters) {
            if (player[0].toLowerCase() != arg3.toLowerCase()) {
                utils.debugLog("&a"+player[0]+"&7 is not &a"+arg3)
                continue
            }
            utils.debugLog("Player to change reason has been succesfully found.")
            player[1] = reason
            saveShitters()
            break
        }
        return
    } 

    //Adds someone to your shitterlist
    if (arg2 == "add") {
        if (arg3 == undefined) {
            utils.chatLog("&c[Shitter List] &7Usage: &a/sha shitterlist add <player> <reason(optional)>")
            return
        }

        if (reason == "") {
            reason = "No reason provided"
        }
        if (isShitter(arg3)) {
            utils.chatLog("&c[Shitter List] &a"+arg3+"&7 is already on your shitter list. Use &a/sha shitterlist reason&7, if you want to change the reason.")
            return
        }
        utils.chatLog("&c[Shitter List] &7Succesfully added &a"+arg3+"&7 to your shitter list because of: &a"+reason)
        shitters.push([arg3, reason])
        saveShitters()
        return
    }
    utils.chatLog("&c[Shitter List] &7Unknown command, use &a/sha shitterlist help&7 to learn more")
}

register("command", (...args) => {
    utils.debugLog("Argument 1: &a"+args[0])
    reason=args.slice(3).join(" ")
    index = -1

    //Prints the help message
    if (args[0] == "help") {
        utils.chatLog("Available commands:")
        ChatLib.chat("&a/sha config(or just /sha)&7 - Opens the config.")
        ChatLib.chat("&a/sha gui&7 - Opens the gui editor.")
        ChatLib.chat("&a/sha shitterlist(aliases: sl, shitter, slist, shitters)&7 - The local shitterlist, use &a/sha shitterlist&7 to learn more")
        ChatLib.chat("&a/sha debug&7 - Debug commands mainly used by shaweel to make the development process easier.")
        ChatLib.chat("&a/sha debugmode&7 - Gives extra information, that is useless if you're not working on the mod and just using it.")
        ChatLib.chat("&a/sha help&7 - Prints this help message.")
        return
    }

    //Toggles debug mode
    if (args[0] == "debugmode") {
        utils.toggleDebugMode()
        return
    }

    //Shitter list commands
    if (args[0] == "shitter" || args[0] == "shitterlist" || args[0] == "sl" || args[0] == "slist" || args[0] == "shitters") {
        shitter(args[1], args[2], reason)
        return
    }

    //Opens the GUI Editor
    if (args[0] == "gui") {
        startMovingGui()
        return
    }

    if (args[0] == "tyfr") {
        tyfr()
        return
    }

    //Opens the configuration
    if (args[0] == "config" || args[0] == undefined) {
        Settings.openGUI()
        return
    }
    utils.chatLog("&7Unknown command, use &a/sha help&7 to learn more")
}).setName("shaweeladdons").setAliases("shaweel", "sha", "shaddons", "saddons")


register("command", (...args) => {
    tyfr()
}).setName("tyfr")