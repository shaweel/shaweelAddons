import Settings from "../../core/config.js"
import utils from "../../lib/Utils.js"

register("soundPlay", (position, name, volume, pitch) => {
	if (name != "mob.wither.shoot" || pitch != 0.6984127163887024 || volume != 0.5) return
	if (Settings.bossSpawnAlert) utils.drawCustomTitle(Settings.bossSpawnText, 250, 500, 250)
	if (Settings.bossSpawnSound) utils.playSound("random.orb", 1, 0.5)
})