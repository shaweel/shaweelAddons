import Settings from "../config.js"
import utils from "../utils.js"

const wishMessages = ["[BOSS] Sadan: My giants! Unleashed!", "⚠ Maxor is enraged! ⚠", "[BOSS] Goldor: You have done it, you destroyed the factory…", ]


function alertWish() {
    if (Settings.wishTitle) {
        Client.showTitle(Settings.wishText, "", 10, 100, 10)
    }
    if (Settings.wishSound) {
        utils.playSound("random.anvil_land", 1, 2)
    }
}


register("chat", () => {
    if (Settings.wishedTitle) {
        Client.showTitle(Settings.wishedText, "", 10, 10, 10)
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

register("renderTitle", (title, subtitle) => {
    if (ChatLib.removeFormatting(subtitle) !== ("⚠ Maxor is enraged! ⚠")) return
    if (!Settings.wishTitle) return
    if (utils.getDungeonClass() !== "Healer") return
    Client.showTitle(Settings.wishText, "", 10, 100, 10)
})