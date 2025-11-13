import utils from "../utils.js"
import Settings from "../config.js"
import { getCurrentSplit } from "./Splits.js"
import { setLine, setShouldRender } from "./Gui.js"

let timer = -1
register("packetReceived", (p) => {
    if (utils.getDungeonFloor() == -1) {
        setShouldRender(3, false)
        return
    }
    if (String(p).includes("S32PacketConfirmTransaction")) {
        if (timer > 0) {
            timer = Math.max(0, timer - 0.05)
        } else {
            if (getCurrentSplit() == "Nothing") {
                timer = 2
                utils.playSound("note.pling", 1, 2)
            } else {
                timer = 1
            }
        }
    }
    if (getCurrentSplit() == "Enter") {
        setShouldRender(3, true)
        if (!Settings.secretTick) {
            setShouldRender(3, false)
            return
        }
        setShouldRender(3, true)
        if (timer > 13/20) {
            setLine(3, 0, "&7Secret: &a"+utils.formatSmallNumber(timer, 2)+"s")
        } else if (timer > 6/20) {
            setLine(3, 0, "&7Secret: &6"+utils.formatSmallNumber(timer, 2)+"s")
        } else {
            setLine(3, 0, "&7Secret: &c"+utils.formatSmallNumber(timer, 2)+"s")
        }
        return
    }
    if (getCurrentSplit() != "Nothing") {
        setShouldRender(3, false)
        return
    }
    if (!Settings.outTick) {
        setShouldRender(3, false)
        return
    }
    setShouldRender(3, true)
    if (timer > 13/20) {
        setLine(3, 0, "&8Outbounds: &a"+utils.formatSmallNumber(timer, 2)+"s")
    } else if (timer > 6/20) {
        setLine(3, 0, "&8Outbounds: &6"+utils.formatSmallNumber(timer, 2)+"s")
    } else {
        setLine(3, 0, "&8Outbounds: &c"+utils.formatSmallNumber(timer, 2)+"s")
    }

    if (!String(p).includes("S03PacketTimeUpdate")) return
    if (!Settings.tick) return
    if (utils.getDungeonFloor() == -1) {
        setShouldRender(3, false)
        return
    }
    if (getCurrentSplit() == "Enter") {
        setShouldRender(3, true)
        timer = (20 - (p.func_149366_c() % 20))/20
        if (!Settings.secretTick) {
            setShouldRender(3, false)
            return
        }
        setShouldRender(3, true)
        if (timer > 13/20) {
            setLine(3, 0, "&7Secret: &a"+utils.formatSmallNumber(timer, 2)+"s")
        } else if (timer > 6/20) {
            setLine(3, 0, "&7Secret: &6"+utils.formatSmallNumber(timer, 2)+"s")
        } else {
            setLine(3, 0, "&7Secret: &c"+utils.formatSmallNumber(timer, 2)+"s")
        }
        return
    }
    if (getCurrentSplit() != "Nothing") {
        setShouldRender(3, false)
        return
    }
    timer = (40 - (p.func_149366_c() % 40))/20
    if (!Settings.outTick) {
        setShouldRender(3, false)
        return
    }
    if (timer == 20) utils.playSound("note.pling", 1, 2)
    setShouldRender(3, true)
    if (timer > 13/20) {
        setLine(3, 0, "&8Outbounds: &a"+utils.formatSmallNumber(timer, 2)+"s")
    } else if (timer > 6/20) {
        setLine(3, 0, "&8Outbounds: &6"+utils.formatSmallNumber(timer, 2)+"s")
    } else {
        setLine(3, 0, "&8Outbounds: &c"+utils.formatSmallNumber(timer, 2)+"s")
    }
})
