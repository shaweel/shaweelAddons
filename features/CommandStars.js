import Settings from "../config.js"

let sending = false

register("messageSent", (msg, e) => {
	if (!Settings.stars) return
	if (sending) {
		sending = false
		return
	}
	let ogmsg = msg
	for (let i = 1; i <= 20; i++) {
		let stars = ""
		if (i <= 5) {
			stars = "✪".repeat(i)
		} else {
			stars = "✪✪✪✪✪" + "➊➋➌➍➎".charAt(i - 6)
		}
		let wordFirst = new RegExp(`<\\s*(s|star|stars)\\s*:?\s*${i}\\s*>`, "gi")
		let numberFirst = new RegExp(`<\\s*${i}\\s*(s|star|stars)\\s*>`, "gi")
		msg = msg.replace(wordFirst, stars)
		msg = msg.replace(numberFirst, stars)
	}
	if (msg == ogmsg) return
	
	sending = true
	e.setCanceled(true)
	ChatLib.say(msg)
})