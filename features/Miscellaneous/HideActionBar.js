import Settings from "../../core/config.js"

register("actionBar", (event) => {
	if (Settings.hideActionBar) event.setCanceled(true)
}) 