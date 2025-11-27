import Settings from "../config.js"
import Utils from "../Utils.js"

const sound = new Sound({source: "shaweeladdons.mimicKill.ogg"})

register("entityDeath", (entity) => {
	let inDungeon = Utils.getDungeonFloor() !== -1
	if (!Settings.ratSound && !Settings.ratTitle && !Settings.mimicAnnounce && !Settings.mimicSound && !Settings.mimicTitle) return
	if (inDungeon && !Settings.mimicAnnounce && !Settings.mimicSound && !Settings.mimicTitle) return
	if (!inDungeon && !Settings.ratSound && !Settings.ratTitle) return
	
	Utils.debugLog("An entity has been killed.")

	if (entity.getClassName() != "EntityZombie") return
	if (!Utils.getTranslation("zombie").includes(entity.name)) return

	let eyeHeight = entity.getEyeHeight()
	if (!(eyeHeight < 1 && eyeHeight > 0.9)) return

	Utils.debugLog("The killed entity is either a &aRat&7 or a &aMimic&7.")

	if (inDungeon) {
		if (!entity.getEntity().func_70631_g_()) return
		Utils.debugLog("Mimic killed")
		if (Settings.mimicTitle) {
			Utils.debugLog("Showing &aMimic&7 kill title")
			Utils.drawCustomTitle(Settings.mimicText, 0, 1000, 250)
		}
		if (Settings.mimicAnnounce) {
			Utils.debugLog("Announcing &aMimic&7 kill")
			ChatLib.command("pc "+Settings.mimicAnnounceText)
		}
		if (Settings.mimicSound) {
			Utils.debugLog("Playing &aMimic&7 kill sound")
			sound.play()
		}
		return
	}
	if (Utils.getSkyblockIsland() != "The Hub") return
	if (Math.abs(entity.getX() - Player.getX()) >= 15 || Math.abs(entity.getZ() - Player.getZ()) >= 15 || Math.abs(entity.getY() - Player.getY()) >= 5) {
		if (Settings.forceRat) {
			Utils.debugLog("Rat killed and user is too far, but force yourself on rat kill is enabled, alerting")
		} else {
			Utils.debugLog("Rat killed but user is too far, not alerting")
			return
		}
	}
	
	if (Settings.ratTitle) {
		Utils.debugLog("Showing &aRat&7 kill title")
		Utils.drawCustomTitle(Settings.ratText, 0, 1000, 250)
	}
	if (Settings.ratSound) {
		Utils.debugLog("Playing &aRat&7 kill sound")
		sound.play()
	}
})

register("chat", () => {
	if (Settings.princeTitle) {
		Utils.debugLog("Showing &aPrince&7 kill title")
		Utils.drawCustomTitle(Settings.princeText, 0, 1000, 250)
	}
	if (Settings.princeAnnounce) {
		Utils.debugLog("Announcing &aPrince&7 kill")
		ChatLib.command("pc "+Settings.princeAnnounceText)
	}
	if (Settings.mimicSound) {
		Utils.debugLog("Playing &aPrince&7 kill sound")
		sound.play()
	}
	return
}).setCriteria("A Prince falls. +1 Bonus Score")