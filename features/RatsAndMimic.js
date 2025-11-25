import Settings from "../config.js"
import utils from "../utils.js"

const sound = new Sound({source: "shaweeladdons.mimicKill.ogg"})

register("entityDeath", (entity) => {
	let inDungeon = utils.getDungeonFloor() !== -1
	if (!Settings.ratSound && !Settings.ratTitle && !Settings.mimicAnnounce && !Settings.mimicSound && !Settings.mimicTitle) return
	if (inDungeon && !Settings.mimicAnnounce && !Settings.mimicSound && !Settings.mimicTitle) return
	if (!inDungeon && !Settings.ratSound && !Settings.ratTitle) return
	
	utils.debugLog("An entity has been killed.")

	if (entity.getClassName() != "EntityZombie") return
	if (!utils.getTranslation("zombie").includes(entity.name)) return

	let eyeHeight = entity.getEyeHeight()
	if (!(eyeHeight < 1 && eyeHeight > 0.9)) return

	utils.debugLog("The killed entity is either a &aRat&7 or a &aMimic&7.")

	if (inDungeon) {
		if (!entity.getEntity().func_70631_g_()) return
		utils.debugLog("Mimic killed")
		if (Settings.mimicTitle) {
			utils.debugLog("Showing &aMimic&7 kill title")
			Client.showTitle(Settings.mimicText, "", "0", "20", "5")
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
		Client.showTitle(Settings.ratText, "", "0", "20", "5")
	}
	if (Settings.ratSound) {
		utils.debugLog("Playing &aRat&7 kill sound")
		sound.play()
	}
})

register("chat", () => {
	if (Settings.princeTitle) {
		utils.debugLog("Showing &aPrince&7 kill title")
		Client.showTitle(Settings.princeText, "", "0", "20", "5")
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
