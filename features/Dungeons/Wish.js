import Settings from "../../core/config.js"
import utils from "../../lib/Utils.js"

const wishMessages = ["[BOSS] Sadan: My giants! Unleashed!", "⚠ Maxor is enraged! ⚠", "[BOSS] Goldor: You have done it, you destroyed the factory…", ]

let wishCustomTitle = utils.drawCustomTitle("", 0, 0, 0)
wishCustomTitle.erase()
function alertWish() {
	if (Settings.wishTitle) {
		wishCustomTitle = utils.drawCustomTitle(Settings.wishText, 250, 1500, 250)
	}
	if (Settings.wishSound) {
		utils.playSound("random.anvil_land", 1, 1)
	}
}


register("chat", () => {
	wishCustomTitle.erase()
	if (Settings.wishedTitle) {
		utils.drawCustomTitle(Settings.wishedText, 250, 500, 250)
	}
	if (Settings.wishedSound) {
		utils.playSound("note.pling", 1, 2)
	}
}).setCriteria("Your Wish healed you for ${h1} health and granted you an absorption shield with ${h2} health!")


register("chat", (msg) => {
	if (wishMessages.includes(msg) && utils.getDungeonClass() === "Healer") {
		alertWish()
	}
}).setCriteria("${msg}")