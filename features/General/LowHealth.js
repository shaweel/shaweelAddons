import Settings from "../../core/config.js"
import utils from "../../lib/Utils.js"

const lowHealthSound = new Sound({source: "shaweeladdons.lowHealth.ogg"})
let cooldown = false
let lowHealthTitle = utils.drawCustomTitle("", 0, 0, 0)

register("actionBar", event => {
	if (!Settings.lhsound && !Settings.lhtitle) return
	if (cooldown) return    

	let message = ChatLib.removeFormatting(ChatLib.getChatMessage(event)).split(" ")[0].replaceAll(",", "").replaceAll("❤", "").split("/")
	
	let health = Number(message[0])
	let maxHealth = Number(message[1])
	if (isNaN(health) || isNaN(maxHealth) || health/maxHealth > 0.5) {lowHealthTitle.erase(); return}


	if (Settings.lhsound) {
		lowHealthSound.play()
	}
	if (!Settings.lhtitle) return
	if (lowHealthTitle.visible) return
	lowHealthTitle = utils.drawCustomTitle(Settings.lhtext, 0, 31556952, 250)
})

register("chat", (message) => {
	if (!message.startsWith("Sending to server") && !message.startsWith("Отправление на сервер")) return
	cooldown = true
	utils.clientSchedule(5000, () => {
		cooldown = false
	})
}).setCriteria("${message}")