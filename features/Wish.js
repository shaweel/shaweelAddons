import Settings from "../config.js"
import Utils from "../Utils.js"

const wishMessages = ["[BOSS] Sadan: My giants! Unleashed!", "⚠ Maxor is enraged! ⚠", "[BOSS] Goldor: You have done it, you destroyed the factory…", ]

let wishCustomTitle = Utils.drawCustomTitle("", 0, 0, 0)
function alertWish() {
	if (Settings.wishTitle) {
		wishCustomTitle = Utils.drawCustomTitle(Settings.wishText, 500, 500, 500)
	}
	if (Settings.wishSound) {
		Utils.playSound("random.anvil_land", 1, 1)
	}
}


register("chat", () => {
	wishCustomTitle.erase()
	if (Settings.wishedTitle) {
		Utils.drawCustomTitle(Settings.wishedText, 500, 500, 500)
	}
	if (Settings.wishedSound) {
		Utils.playSound("note.pling", 1, 2)
	}
}).setCriteria("Your Wish healed you for ${h1} health and granted you an absorption shield with ${h2} health!")


register("chat", (msg) => {
	if (wishMessages.includes(msg) && Utils.getDungeonClass() === "Healer") {
		alertWish()
	}
}).setCriteria("${msg}")