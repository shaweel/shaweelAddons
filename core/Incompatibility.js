let checked = false
register("step", () => {
	if (checked) return
	checked = true
	const incompatibleMods = {
		"vanillahud": "highly interferes with titles, therefore breaking every feature that uses them"
	}

	const Loader = Java.type("net.minecraftforge.fml.common.Loader")
	const allMods = Loader.instance().getModList()

	let allModIds = []
	for (let mod of allMods) {
		allModIds.push(mod.getModId())
	}

	let installedIncompatibleMods = []
	for (let incompatibleMod in incompatibleMods) {
		if (!allModIds.includes(incompatibleMod)) continue
		installedIncompatibleMods.push(incompatibleMod)
	}

	if (installedIncompatibleMods.length !== 0) {
		ChatLib.chat("&d&l-------------------------------------------")
		ChatLib.chat("&4&l&ka&r&4&l EXTREMELY IMPORTANT WARNING &ka")
		ChatLib.chat("&c&l&ka&r&c&l INCOMPATIBLE MODS DETECTED &ka")
		ChatLib.chat("")
		ChatLib.chat("&cAll incompatible mods detected:")
		for (let installedIncompatibleMod of installedIncompatibleMods) {
			ChatLib.chat("&4&l- &r&7The mod &4&l"+installedIncompatibleMod+" &r&cseverely breaks &dshaweelAddons &7because it &4&l"+incompatibleMods[installedIncompatibleMod])
		}
		ChatLib.chat("")
		ChatLib.chat("&c&lIT IS VERY HIGHLY RECOMMENDED FOR YOU TO DELETE ALL THESE INCOMPATIBLE MODS")
		ChatLib.chat("")
		ChatLib.chat("&c&l&ka&r&c&l INCOMPATIBLE MODS DETECTED &ka")
		ChatLib.chat("&4&l&ka&r&4&l EXTREMELY IMPORTANT WARNING &ka")
		ChatLib.chat("&d&l-------------------------------------------")
	}
}).setFps(1000)