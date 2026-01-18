import Settings from "../../core/config.js"
import { getCurrentSplit } from "./Splits.js"

register("soundPlay", (position, name, volume) => {
	if (getCurrentSplit() != "Enter") return
	if (!((name == "mob.bat.hurt" && volume == 0.10000000149011612) || name == "mob.bat.death")) return

        if (Settings.batAlert) {
            utils.drawCustomTitle(Settings.batText, 250, 500, 250)
        }
})