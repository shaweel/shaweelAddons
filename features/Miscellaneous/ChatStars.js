import Settings from "../../core/config.js"
import utils from "../../lib/Utils.js"

let sending = false

function transformMessage(msg) {
	if (typeof(msg) != "string") {utils.errorLog("Chat message is not a string, this shouldn't be possible"); return}
	for (let i = 1; i <= 20; i++) {
		let stars = ""
		if (i <= 5) {
			stars = "✪".repeat(i)
		} else {
			stars = "✪✪✪✪✪" + "➊➋➌➍➎".charAt(i - 6)
		}
		let wordFirst = new RegExp(`<\\s*(?:s|star|stars)\\s*:?\\s*${i}\\s*>`, "gi")
		let numberFirst = new RegExp(`<\\s*${i}\\s*(?:s|star|stars)\\s*>`, "gi")
		msg = msg.replace(wordFirst, stars)
		msg = msg.replace(numberFirst, stars)
	}
	return msg
}

register("renderChat", () => {
    	if (!Client.isInChat()) return
	let currentMessage = Client.getCurrentChatMessage()
	let transformedMessage = transformMessage(currentMessage)
	if (currentMessage === transformedMessage) return
	Client.setCurrentChatMessage(transformedMessage)
})