import {request} from "requestV2"
import utils from "../utils"

(() => {
    try {
        let currentVersion = FileLib.read("./config/ChatTriggers/modules/shaweelAddons/metadata.json")
        currentVersion = JSON.parse(currentVersion)
        currentVersion = currentVersion.version
    } catch (err) {
        utils.errorLog(err)
        utils.errorLog("Failed to retrieve the current shaweelAddons version, aborting the Update Checker.")
        return
    }

    let latestVersion = "1.0.0"
    request({
        url: "https://raw.githubusercontent.com/shaweel/shaweelAddons/refs/heads/main/metadata.json",
        json: true
    }).then(data => {
        latestVersion = data.version
        if (currentVersion !== latestVersion) {
            utils.chatLog("&c&lWARNING: &r&cYou are currently using an outdated version of shaweelAddons!")
            utils.chatLog("Current Version: &c"+currentVersion)
            utils.chatLog("Latest Version: &a"+latestVersion)
            utils.chatLog("&cIt is highly advised to update!")
            ChatLib.chat(new TextComponent("&d[shaweelAddons] &lClick to update!").setClick("open_url", "https://github.com/shaweel/shaweelAddons/releases/latest"))
        }
    })

    utils.debugLog("Debug mode is currently &aactivated &7meaning you will recieve debug messages, as to what is internally happening in the module, to deactivate it, run &a/shaweeladdons debugmode")
})()