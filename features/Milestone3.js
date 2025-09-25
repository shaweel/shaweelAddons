import utils from "../utils"
import Settings from "../config.js"

register("tick", () => {
    let milestone = utils.getClassMilestone()
    if (milestone == null) return
    if (milestone > 2) return
    if (!Settings.cmtitle) return
    Client.showTitle(Settings.cmtext, "", "0", "5", "10")
})


