import Settings from "../config.js"

register("chat", (plr) => {
    if (plr != Player.getName()) return
    if (Settings.crystalSound) utils.playSound("note.pling", 1, 2)
    if (Settings.crystalTitle) Client.showTitle(Settings.crystalText, "", "10", "10", "10")
}).setCriteria("${plr} picked up an Energy Crystal!")