import utils from "../../lib/Utils.js"
import Settings from "../../core/config.js"
import { getCurrentSplit } from "./Splits.js"
import { setLine, setShouldRender, startMovingGui } from "../../core/Gui.js"

let outboundsTimer = -1
let secretTimer = -1

function getTickTimerString(label, ticks) {
	let color = "COLOR"
	if (ticks > 13) color = "a"
	else if (ticks > 6) color = "6"
	else color = "c"

	let convertedTime = "AMOUNT OF TIME"
	let timeUnit = "TIME UNIT"
	if (Settings.tickTimerTimeUnit == 0) {
		timeUnit = "s"
		convertedTime = utils.formatSmallNumber(ticks/20, 2)
	} else if (Settings.tickTimerTimeUnit == 1) {
		timeUnit = "ms"
		convertedTime = Math.round(ticks*50)
	} else if (Settings.tickTimerTimeUnit == 2) {
		timeUnit = "t"
		convertedTime = Math.round(ticks)
	}

	if (!Settings.showUnitTickTimer) timeUnit = ""

	return label+": &"+color+convertedTime+timeUnit 
}

register("packetReceived", () => {
	if (secretTimer > 0) secretTimer--
	else secretTimer = 20

	if (outboundsTimer > 0) outboundsTimer--
	else {
		outboundsTimer = 40
		if (getCurrentSplit() == "Nothing" && Settings.outTick && utils.getDungeonFloor() != -1) utils.playSound("note.pling", 1, 2)
	}
}).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction)

register("packetReceived", (packet) => {
	outboundsTimer = (40 - (packet.func_149366_c()/*getTotalWorldTime()*/ % 40))
	if (getCurrentSplit() != "Nothing" || !Settings.outTick) return
	if (outboundsTimer == 40) utils.playSound("note.pling", 1, 2)
}).setFilteredClass(net.minecraft.network.play.server.S03PacketTimeUpdate)

register("packetReceived", () => {
	secretTimer = 20
}).setFilteredClass(net.minecraft.network.play.server.S3EPacketTeams)

register("step", () => {
	if (getCurrentSplit() == "Enter" && Settings.secretTick) {
		setShouldRender("tick", true)
		setLine("tick", 0, getTickTimerString("&7Secret", secretTimer))
		return
	}
	if (getCurrentSplit() == "Nothing" && Settings.outTick && utils.getDungeonFloor() != -1) {
		setShouldRender("tick", true)
		setLine("tick", 0, getTickTimerString("&8Outbounds", outboundsTimer))
		return
	}
	setShouldRender("tick", false)
}).setFps(20)