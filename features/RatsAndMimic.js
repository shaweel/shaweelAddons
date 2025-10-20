import Settings from "../config.js"
import utils from "../utils.js"

const ratSound = new Sound({source: "shaweeladdons.ratKill.ogg"})
const mimicSound = new Sound({source: "shaweeladdons.mimicKill.ogg"})

//Every time an entity dies
register("entityDeath", (entity) => {
    //Return if all related toggles are off - feature is obsolete and there is no need to waste performance by checking
    let inDungeon = utils.getDungeonFloor() !== -1
    if (!Settings.ratSound && !Settings.ratTitle && !Settings.mimicAnnounce && !Settings.mimicSound && !Settings.mimicTitle) return
    if (inDungeon && !Settings.mimicAnnounce && !Settings.mimicSound && !Settings.mimicTitle) return
    if (!inDungeon && !Settings.ratSound && !Settings.ratTitle) return
    
    utils.debugLog("An entity has been killed.")

    //Return if the entity killed isn't a zombie
    if (entity.getClassName() != "EntityZombie") return
    if (!utils.getTranslation("zombie").includes(entity.name)) return

    let eyeHeight = entity.getEyeHeight()
    if (!(eyeHeight < 1 && eyeHeight > 0.9)) return

    utils.debugLog("The killed entity is either a &aRat&7 or a &aMimic&7.")

    //If you're in a dungeon, alert that Mimic got killed
    if (inDungeon) {
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
            mimicSound.play()
        }
        return
    }
    //Check if you're close to the rat and return if you're not close and the force rat setting is disabled
    if (Math.abs(entity.getX() - Player.getX()) >= 15 || Math.abs(entity.getZ() - Player.getZ()) >= 15 || Math.abs(entity.getY() - Player.getY()) >= 5) {
        if (Settings.forceRat) {
            utils.debugLog("Rat killed and user is too far, but force yourself on rat kill is enabled, alerting")
        } else {
            utils.debugLog("Rat killed but user is too far, not alerting")
            return
        }
    }
    
    //Alert a rat has been killed
    if (Settings.ratTitle) {
        utils.debugLog("Showing &aRat&7 kill title")
        Client.showTitle(Settings.ratText, "", "0", "20", "5")
    }
    if (Settings.ratSound) {
        utils.debugLog("Playing &aRat&7 kill sound")
        ratSound.play()
    }
})