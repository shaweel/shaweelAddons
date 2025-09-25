import Settings from "../config.js"
import utils from "../utils.js"

const lowHealthSound = new Sound({source: "shaweeladdons.lowHealth.ogg"})
let cooldown = false

register("actionBar", event => {
    //Return if both toggles are off - feature is obsolete and there is no need to waste performance by checking
    if (!Settings.lhsound && !Settings.lhtitle) return

    //Find the player's health
    let message = ChatLib.removeFormatting(ChatLib.getChatMessage(event))
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
    let health = message[0]
    let maxHealth = message[1]
    health = Number(health)
    maxHealth = Number(maxHealth)
    let ratio = health/maxHealth

    //Return if player's health is above 50%
    if (cooldown) return    
    if (ratio > 0.5) return
    if (isNaN(ratio)) return

    //Alert the player
    utils.debugLog("Alerting Low Health")

    if (Settings.lhsound) {
        utils.debugLog("Playing low health sound")
        lowHealthSound.play()
    }
    if (!Settings.lhtitle) return
    utils.debugLog("Showing low health title")
    Client.showTitle(Settings.lhtext, "", "0", "20", "5")
})

//Add a cooldown of 5s after switching lobbies
register("chat", (message) => {
    if (!message.startsWith("Sending to server") && !message.startsWith("Отправление на сервер")) return
    cooldown = true
    setTimeout(() => {
        cooldown = false
    }, 5000)
}).setCriteria("${message}")