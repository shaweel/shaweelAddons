import Settings from "../../core/config.js"
import { customRegister } from "../../lib/CustomTriggers.js"
import { setLine, setShouldRender } from "../../core/Gui.js"

let messageCounter = 0
const stormCompactor = register("renderTitle", (title, subtitle, e) =>  {
	subtitle = ChatLib.removeFormatting(subtitle)
	if (subtitle == "⚠ Storm is enraged! ⚠") {
		e.setCanceled(true)
		setLine("compactStorm", 0, "&eStorm enraged")
	}

})

register("chat", () => {
	messageCounter++
	if (messageCounter == 2) {
		messageCounter = 0
		setLine("compactStorm", 0, "&aSafe")
	}
}).setCriteria("Storm's Giga Lightning hit you for ${dmg} true damage.")

stormCompactor.unregister()


customRegister("splitChanged", (args) => {
	if (!Settings.compactStorm) return
	if (args.newSplit == "Storm") {
		stormCompactor.register()
		setShouldRender("compactStorm", true)
	}
	if (args.newSplit != "Storm") {
		stormCompactor.unregister()
		setShouldRender("compactStorm", false)
		setLine("compactStorm", 0, "")
	}
})