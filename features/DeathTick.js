import Utils from "../Utils.js"
import Settings from "../config.js"
import { getCurrentSplit } from "./Splits.js"
import { setLine, setShouldRender, startMovingGui } from "./Gui.js"

let timer = -1
register("packetReceived", (p) => {
	if (!Settings.tick) {
		setShouldRender(3, false)
		return
	}
	if (Utils.getDungeonFloor() == -1) {
		setShouldRender(3, false)
		return
	}
	if (String(p).includes("S32PacketConfirmTransaction")) {
		if (timer > 0) {
			timer -= 1
		} else {
			if (getCurrentSplit() == "Nothing") {
				timer = 40
				if (!Settings.outTick) return
				Utils.playSound("note.pling", 1, 2)
			} else {
				timer = 20
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
		msg = "&7Secret: &_timeunit"
		if (Settings.useTicks) {
			msg = msg.replace("unit", "t")
			msg = msg.replace("time", Math.round(timer))
		} else {
			msg = msg.replace("unit", "s")
			msg = msg.replace("time", Utils.formatSmallNumber(timer/20, 2))
		}
		if (Settings.removeLabel) {
			msg = msg.split(" ")[1]
		}
		if (timer > 13) {
			msg = msg.replace("_", "a")
		} else if (timer > 6) {
			msg = msg.replace("_", "6")
		} else {
			msg = msg.replace("_", "c")
		}
		setLine(3, 0, msg)
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
	msg = "&8Outbounds: &_timeunit"
	if (Settings.useTicks) {
		msg = msg.replace("unit", "t")
		msg = msg.replace("time", Math.round(timer))
	} else {
		msg = msg.replace("unit", "s")
		msg = msg.replace("time", Utils.formatSmallNumber(timer/20, 2))
	}
	if (Settings.removeLabel) {
		msg = msg.split(" ")[1]
	}
	if (timer > 13) {
		msg = msg.replace("_", "a")
	} else if (timer > 6) {
		msg = msg.replace("_", "6")
	} else {
		msg = msg.replace("_", "c")
	}
	setLine(3, 0, msg)

	if (String(p).includes("S03PacketTimeUpdate")) {
		timer = (40 - (p.func_149366_c() % 40))
		if (getCurrentSplit() != "Nothing") {
			return
		}
		if (!Settings.outTick) {
			setShouldRender(3, false)
			return
		}
		if (timer == 40) Utils.playSound("note.pling", 1, 2)
		setShouldRender(3, true)
		msg = "&8Outbounds: &_timeunit"
		if (Settings.useTicks) {
			msg = msg.replace("unit", "t")
			msg = msg.replace("time", Math.round(timer))
		} else {
			msg = msg.replace("unit", "s")
			msg = msg.replace("time", Utils.formatSmallNumber(timer/20, 2))
		}
		if (Settings.removeLabel) {
			msg = msg.split(" ")[1]
		}
		if (timer > 13) {
			msg = msg.replace("_", "a")
		} else if (timer > 6) {
			msg = msg.replace("_", "6")
		} else {
			msg = msg.replace("_", "c")
		}
		setLine(3, 0, msg)
	}

	if (!String(p).includes("S3EPacketTeams")) return
	if (!Settings.tick) return
	if (Utils.getDungeonFloor() == -1) {
		setShouldRender(3, false)
		return
	}
	if (getCurrentSplit() == "Enter") {
		setShouldRender(3, true)
		timer = 20
		if (!Settings.secretTick) {
			setShouldRender(3, false)
			return
		}
		setShouldRender(3, true)
		msg = "&7Secret: &_timeunit"
		if (Settings.useTicks) {
			msg = msg.replace("unit", "t")
			msg = msg.replace("time", Math.round(timer))
		} else {
			msg = msg.replace("unit", "s")
			msg = msg.replace("time", Utils.formatSmallNumber(timer/20, 2))
		}
		if (Settings.removeLabel) {
			msg = msg.split(" ")[1]
		}
		if (timer > 13) {
			msg = msg.replace("_", "a")
		} else if (timer > 6) {
			msg = msg.replace("_", "6")
		} else {
			msg = msg.replace("_", "c")
		}
		setLine(3, 0, msg)
		return
	}
	if (getCurrentSplit() != "Nothing") {
		setShouldRender(3, false)
		return
	}
})
