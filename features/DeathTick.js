import utils from "../utils.js"
import Settings from "../config.js"
import { setLine, setShouldRender } from "./Gui.js"

let timer = 2
register("worldLoad", () => {
    if (!Settings.tick) return
    timer = 1
})


register("packetReceived", () => {
    if (!Settings.tick) return
    if (utils.getDungeonFloor == -1) {
        setShouldRender(3, false)
        return
    }
    timer -= 0.05
    setShouldRender(3, true)
    setLine(3, 0, "&6Tick: &f"+utils.formatSmallNumber(timer, 2)+"s")
    if (timer <= 0) {
        timer = 2
        utils.playSound("note.pling", 1, 2)
    }
}).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction)
