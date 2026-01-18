import Settings from "../../core/config.js"
import utils from "../../lib/Utils.js"

function registerExtraLifeItem(chatMessage, title, text, announce, message, sound) {
	register("chat", () => {
		sinceLastBonzo = Date.now()
		if (Settings[sound]) utils.playSound("note.pling", 1, 2) 
		if (Settings[title]) utils.drawCustomTitle(Settings[text], 250, 500, 250)
		if (Settings[announce]) ChatLib.say(Settings[message])
	}).setCriteria(chatMessage)
}

registerExtraLifeItem(
	"Your Bonzo's Mask saved your life!",
	"bonzoTitle",
	"bonzoText",
	"bonzoAnnounce",
	"bonzoMessage",
	"bonzoSound",
)

registerExtraLifeItem(
	"Your ⚚ Bonzo's Mask saved your life!",
	"bonzoTitle",
	"bonzoText",
	"bonzoAnnounce",
	"bonzoMessage",
	"bonzoSound",
)

registerExtraLifeItem(
	"Second Wind Activated! Your Spirit Mask saved your life!",
	"spiritTitle",
	"spiritText",
	"spiritAnnounce",
	"spiritMessage",
	"spiritSound",
)

registerExtraLifeItem(
	"Your Phoenix Pet saved you from certain death!",
	"phoenixTitle",
	"phoenixText",
	"phoenixAnnounce",
	"phoenixMessage",
	"phoenixSound",
)