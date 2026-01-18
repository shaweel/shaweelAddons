import Settings from "../../core/config.js"
import utils from "../../lib/Utils.js"

let onCooldown = false
register("soundPlay", (position, name, volume, pitch) => {
	if (name != "random.explode" || pitch != 0.6000000238418579 && volume != 0.6000000238418579 || onCooldown) return
	if (Settings.minibossSpawnAlert) utils.drawCustomTitle(Settings.minibossSpawnText, 250, 500, 250)
	if (Settings.minibossSpawnSound) utils.playSound("random.orb", 1, 0.5)
	onCooldown = true
	utils.serverSchedule(13, () => onCooldown = false)
})