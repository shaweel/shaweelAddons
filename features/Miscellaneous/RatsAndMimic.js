import Settings from "../../core/config.js"
import utils from "../../lib/Utils.js"

const sound = new Sound({source: "shaweeladdons.mimicKill.ogg"})

register("entityDeath", (entity) => {
	let inDungeon = utils.getDungeonFloor() !== -1
	if (!Settings.ratSound && !Settings.ratTitle && !Settings.mimicAnnounce && !Settings.mimicSound && !Settings.mimicTitle) return
	if (inDungeon && !Settings.mimicAnnounce && !Settings.mimicSound && !Settings.mimicTitle) return
	if (!inDungeon && !Settings.ratSound && !Settings.ratTitle) return
	
	if (entity.getClassName() != "EntityZombie") return
	if (!utils.getTranslation("zombie").includes(entity.name)) return

	let eyeHeight = entity.getEyeHeight()
	if (!(eyeHeight < 1 && eyeHeight > 0.9)) return

	if (inDungeon) {
		if (!entity.getEntity().func_70631_g_()/*isChild()*/) return
		utils.debugLog("Mimic killed")
		if (Settings.mimicTitle) {
			utils.debugLog("Showing &aMimic&7 kill title")
			utils.drawCustomTitle(Settings.mimicText, 0, 1000, 250)
		}
		if (Settings.mimicAnnounce) {
			utils.debugLog("Announcing &aMimic&7 kill")
			ChatLib.command("pc "+Settings.mimicAnnounceText)
		}
		if (Settings.mimicSound) {
			utils.debugLog("Playing &aMimic&7 kill sound")
			sound.play()
		}
		return
	}
	utils.debugLog(utils.getSkyblockIsland())
	if (utils.getSkyblockIsland() != "The Hub") return
	if (Math.abs(entity.getX() - Player.getX()) >= 15 || Math.abs(entity.getZ() - Player.getZ()) >= 15 || Math.abs(entity.getY() - Player.getY()) >= 5) {
		if (Settings.forceRat) {
			utils.debugLog("Rat killed and user is too far, but force yourself on rat kill is enabled, alerting")
		} else {
			utils.debugLog("Rat killed but user is too far, not alerting")
			return
		}
	}
	
	if (Settings.ratTitle) {
		utils.debugLog("Showing &aRat&7 kill title")
		utils.drawCustomTitle(Settings.ratText, 0, 1000, 250)
	}
	if (Settings.ratSound) {
		utils.debugLog("Playing &aRat&7 kill sound")
		sound.play()
	}
})

register("chat", () => {
	if (Settings.princeTitle) {
		utils.debugLog("Showing &aPrince&7 kill title")
		utils.drawCustomTitle(Settings.princeText, 0, 1000, 250)
	}
	if (Settings.princeAnnounce) {
		utils.debugLog("Announcing &aPrince&7 kill")
		ChatLib.command("pc "+Settings.princeAnnounceText)
	}
	if (Settings.mimicSound) {
		utils.debugLog("Playing &aPrince&7 kill sound")
		sound.play()
	}
	return
}).setCriteria("A Prince falls. +1 Bonus Score")