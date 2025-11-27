import Settings from "../config.js"
import Utils from "../Utils.js"

const lowHealthSound = new Sound({source: "shaweeladdons.lowHealth.ogg"})
let cooldown = false

register("actionBar", event => {
	if (!Settings.lhsound && !Settings.lhtitle) return
	if (cooldown) return    

	let message = ChatLib.removeFormatting(ChatLib.getChatMessage(event)).split(" ")[0].replaceAll(",", "").replaceAll("❤", "").split("/")
	
	let health = Number(message[0])
	let maxHealth = Number(message[1])
	if (isNaN(health) || isNaN(maxHealth) || health/maxHealth > 0.5) return

	Utils.debugLog("Alerting Low Health")

	if (Settings.lhsound) {
		Utils.debugLog("Playing low health sound")
		lowHealthSound.play()
	}
	if (!Settings.lhtitle) return
	Utils.debugLog("Showing low health title")
	Utils.drawCustomTitle(Settings.lhtext, 0, 1000, 250)
})

register("chat", (message) => {
	if (!message.startsWith("Sending to server") && !message.startsWith("Отправление на сервер")) return
	cooldown = true
	setTimeout(() => {
		cooldown = false
	}, 5000)
}).setCriteria("${message}")