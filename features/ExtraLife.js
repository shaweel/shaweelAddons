import Settings from "../config.js"
import utils from "../utils.js"

function registerExtraLifeItem(chatMessage, title, text, sound) {
	register("chat", () => {
		sinceLastBonzo = Date.now()
		if (Settings[sound]) utils.playSound("note.pling", 1, 2) 
		if (Settings[title]) utils.drawCustomText(Settings[text], 500, 500, 500)
	}).setCriteria(chatMessage)
}

registerExtraLifeItem(
	"Your Bonzo's Mask saved your life!",
	"bonzoTitle",
	"bonzoText",
	"bonzoSound",
)

registerExtraLifeItem(
	"Your ⚚ Bonzo's Mask saved your life!",
	"bonzoTitle",
	"bonzoText",
	"bonzoSound",
)

registerExtraLifeItem(
	"Second Wind Activated! Your Spirit Mask saved your life!",
	"spiritTitle",
	"spiritText",
	"spiritSound",
)

registerExtraLifeItem(
	"Your Phoenix Pet saved you from certain death!",
	"phoenixTitle",
	"phoenixText",
	"phoenixSound",
)
