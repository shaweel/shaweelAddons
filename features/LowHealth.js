import Settings from "../config.js"
import utils from "../utils.js"

const lowHealthSound = new Sound({source: "shaweeladdons.lowHealth.ogg"})
let cooldown = false

register("actionBar", event => {
    if (!Settings.lhsound && !Settings.lhtitle) return
    if (cooldown) return    

    let message = ChatLib.removeFormatting(ChatLib.getChatMessage(event)).split(" ")[0].replaceAll(",", "").replaceAll("❤", "").split("/")
    
    let health = Number(message[0])
    let maxHealth = Number(message[1])
    if (isNaN(health) || isNaN(maxHealth) || health/maxHealth > 0.5) return

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