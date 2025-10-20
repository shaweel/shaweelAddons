import utils from "../utils"
import Settings from "../config.js"

let oldMilestone = -1
let shown = false

register("tick", () => {
    if (!Settings.cmtitle) return
    let milestone = utils.getClassMilestone()
    if (milestone === null) return
    if (oldMilestone === milestone) return
    oldMilestone = milestone

    if (milestone < 3) {
        shown = false
        Client.showTitle(Settings.cmtext, "", "0", "144000", "0")
    } else if (!shown) {
        shown = true
        Client.showTitle(Settings.cmtext, "", "0", "0", "10")
    }
})


