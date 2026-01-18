import Settings from "../../core/config.js"
import { customRegister } from "../../lib/CustomTriggers.js"
import { setLine, setShouldRender } from "../../core/Gui.js"


let lastSubtitle = ""
const maxorCompactor = register("renderTitle", (title, subtitle, e) =>  {
	subtitle = ChatLib.removeFormatting(subtitle)
	if (subtitle.endsWith("Energy Crystals are now active!")) {
		let howmanyeth = subtitle.split("")[0]
		let total = subtitle.split("")[2]
		let text = "&eEnergy Crystal&7 | &c"+howmanyeth+"&a/"+total
		e.setCanceled(true)
		setLine("compactMaxor", 0, text)
		lastSubtitle = text
	}
	if (subtitle == "The Energy Laser is charging up!") {
		let text = "&eEnergy Laser"
		e.setCanceled(true)
		setLine("compactMaxor", 0, text)
		lastSubtitle = text
	}
	if (subtitle == "⚠ Maxor is enraged! ⚠") {
		let text = "&eMaxor enraged"
		e.setCanceled(true)
		setLine("compactMaxor", 0, text)
		lastSubtitle = text
	}

})
maxorCompactor.unregister()


customRegister("splitChanged", (args) => {
	if (!Settings.compactMaxor) return
	if (args.newSplit == "Maxor") {
		maxorCompactor.register()
		setShouldRender("compactMaxor", true)
	}
	if (args.newSplit != "Maxor") {
		maxorCompactor.unregister()
		setShouldRender("compactMaxor", false)
		setLine("compactMaxor", 0, "")
	}
})