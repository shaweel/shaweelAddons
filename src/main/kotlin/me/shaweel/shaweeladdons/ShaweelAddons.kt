package me.shaweel.shaweeladdons

import net.fabricmc.api.ClientModInitializer

object ShaweelAddons : ClientModInitializer {
	override fun onInitializeClient() {
        commandsAndShitterlist.init()
	}
}
