import Settings from "../config.js"
import utils from "../utils.js"

function registerExtraLifeItem(chatMessage, title, text, sound) {
    register("chat", () => {
        if (Settings[sound]) utils.playSound("note.pling", 1, 2)
        if (Settings[title]) Client.showTitle(Settings[text], "", "10", "10", "10")
    }).setCriteria(chatMessage)
}

registerExtraLifeItem(
    "Your Bonzo's Mask saved your life!",
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