package me.shaweel.shaweeladdons

import com.google.gson.JsonObject
import com.mojang.brigadier.Command
import com.mojang.brigadier.CommandDispatcher
import me.shaweel.shaweeladdons.utils.chatLog
import me.shaweel.shaweeladdons.utils.debugLog
import net.fabricmc.fabric.api.client.command.v2.ClientCommandRegistrationCallback
import net.fabricmc.fabric.api.client.command.v2.FabricClientCommandSource
import net.minecraft.client.MinecraftClient
import net.fabricmc.fabric.api.client.command.v2.ClientCommandManager
import net.fabricmc.loader.api.FabricLoader
import net.minecraft.text.Text
import java.io.File
import java.nio.file.Files
import kotlin.io.path.Path
import kotlin.io.path.exists
import com.google.gson.JsonParser
import com.mojang.brigadier.arguments.StringArgumentType
import com.mojang.brigadier.builder.LiteralArgumentBuilder
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

object commandsAndShitterlist {
    val configFolder = FabricLoader.getInstance().configDir
    var shaConfigFolder = Path(configFolder.toString()+"/shaweelAddons")
    lateinit var debugModeFile: File
    lateinit var shitterListFile: File
    lateinit var shitterList: JsonObject
    var removing = false
    var debugMode = false
    val debugModeLiteral = ClientCommandManager.literal("debugmode").executes { context ->
        val player = MinecraftClient.getInstance().player
        debugMode = !debugMode
        debugModeFile.writeText(debugMode.toString())
        if (debugMode) {
            player?.sendMessage(Text.literal("§d[shaweelAddons]§e [DEBUG]§a Debug mode activated"), false)
        } else {
            player?.sendMessage(Text.literal("§d[shaweelAddons]§e [DEBUG]§c Debug mode deactivated"), false)
        }
        Command.SINGLE_SUCCESS
    }
    val gui = ClientCommandManager.literal("gui").executes { context ->
        debugLog("Opening the gui editor(I haven't made that yet)")
        openGuiEditor()
        Command.SINGLE_SUCCESS
    }
    val config = ClientCommandManager.literal("config").executes { context ->
        debugLog("Opening the ClickGui(I haven't made that yet)")
        openConfig()
        Command.SINGLE_SUCCESS
    }
    private fun help(alias: String): LiteralArgumentBuilder<FabricClientCommandSource?>? {
        return ClientCommandManager.literal("help").executes { context ->
            val helpMessage = """
                    Available commands:
                    §a/$alias config §7- Opens the config.
                    §a/$alias gui §7- Opens the gui editor.
                    §a/$alias shitterlist §7- The local shitterlist, do §a/$alias shitterlist help §7to learn more.
                    §a/$alias debugmode §7- Toggles debugmode which gives extra information, that is useless if you're not working on the mod and just using it.
                    §a/$alias help §7- Prints this help message.
                    """.trimIndent()
            chatLog(helpMessage)
            Command.SINGLE_SUCCESS
        }
    }
    private fun shitterList(alias: String, slAlias: String): LiteralArgumentBuilder<FabricClientCommandSource?>? {
        return ClientCommandManager.literal(slAlias).executes { context ->
            chatLog(getShitterHelpMessage(alias, slAlias))
            Command.SINGLE_SUCCESS
        }.then(ClientCommandManager.literal("help").executes {
            chatLog(getShitterHelpMessage(alias, slAlias))
            Command.SINGLE_SUCCESS
        }).then(ClientCommandManager.literal("list").executes {
            var msg = """§c[Shitter List] §7All players on your shitter list: """
            for ((name, reason) in shitterList.entrySet()) {
                msg+="\n§e$name§7: ${reason.asString}"
            }
            chatLog(msg)
            Command.SINGLE_SUCCESS
        }).then(ClientCommandManager.literal("removeall").executes {
            chatLog("§4§lTHIS ACTION IS IRREVERSIBLE§7, type §c/sha $slAlias confirm§7 in the next §a5 seconds to proceed.")
            removing = true
            GlobalScope.launch {
                delay(5000)
                removing = false
            }
            Command.SINGLE_SUCCESS
        }).then(ClientCommandManager.literal("confirm").executes {
            if (removing) {
                shitterList = JsonParser.parseString("{}").asJsonObject
                shitterListFile.writeText(shitterList.toString())
                chatLog("Successfully wiped the shitter list.")
            }
            Command.SINGLE_SUCCESS
        }).then(ClientCommandManager.literal("add")
            .then(ClientCommandManager.argument("username", StringArgumentType.string()).executes { context ->
                val username = StringArgumentType.getString(context, "username")
                val reason = "No reason provided."
                addToShitterlist(username, reason)
                Command.SINGLE_SUCCESS
            }.then(ClientCommandManager.argument("reason", StringArgumentType.greedyString()).executes { context ->
                val username = StringArgumentType.getString(context, "username")
                val reason = StringArgumentType.getString(context, "reason")
                addToShitterlist(username, reason)
                Command.SINGLE_SUCCESS
            })).executes {
                chatLog("§c[Shitter List] §7Usage: §a/$alias $slAlias add <username> <reason(optional)>")
                Command.SINGLE_SUCCESS
            }).then(ClientCommandManager.literal("reason")
            .then(ClientCommandManager.argument("username", StringArgumentType.string()).executes { context ->
                chatLog("§c[Shitter List] §7Usage: §a/$alias $slAlias reason <username> <reason>")
                Command.SINGLE_SUCCESS
            }.then(ClientCommandManager.argument("reason", StringArgumentType.greedyString()).executes { context ->
                val username = StringArgumentType.getString(context, "username")
                val reason = StringArgumentType.getString(context, "reason")
                if (!shitterList.entrySet().any { it.key.lowercase() == username.lowercase() }) {
                    chatLog("§c[Shitter List] §a$username §7is not on your shitter list.")
                    return@executes Command.SINGLE_SUCCESS
                }
                shitterList.addProperty(username, reason)
                shitterListFile.writeText(shitterList.toString())
                chatLog("§c[Shitter List] §7Successfully changed to reason of §a$username §7being on your shitter list to: §a$reason")
                Command.SINGLE_SUCCESS
            }))
            .executes {
                chatLog("§c[Shitter List] §7Usage: §a/$alias $slAlias reason <username> <reason>")
                Command.SINGLE_SUCCESS
            }
        ).then(ClientCommandManager.literal("remove")
            .then(ClientCommandManager.argument("username", StringArgumentType.string()).executes { context ->
                val username = StringArgumentType.getString(context, "username")
                val entry = shitterList.entrySet().find { it.key.lowercase() == username.lowercase() }
                if (entry == null) {
                    chatLog("§c[Shitter List] §a$username §7is not on your shitter list.")
                    return@executes Command.SINGLE_SUCCESS
                }
                shitterList.remove(entry.key)
                shitterListFile.writeText(shitterList.toString())
                chatLog("§c[Shitter List] §7Successfully removed §a$username §7from your shitter list.")
                Command.SINGLE_SUCCESS
            })
            .executes {
                chatLog("§c[Shitter List] §7Usage: §a/$alias $slAlias remove <username>")
                Command.SINGLE_SUCCESS
            }
        )
    }

    private fun openConfig() {}
    private fun openGuiEditor() {}

    private fun addToShitterlist(username: String, reason: String) {
        if (shitterList.entrySet().any { it.key.lowercase() == username.lowercase() }) {
            chatLog("§c[Shitter List] §a$username §7is already on your shitter list. Use §a/sha shitterlist reason§7, if you want to change the reason.")
            return
        }
        shitterList.addProperty(username, reason)
        shitterListFile.writeText(shitterList.toString())
        chatLog("§c[Shitter List] §7Successfully added §a$username §7to your shitter list because of: §a$reason")
    }

    private fun getShitterHelpMessage(alias: String, slAlias: String): String {
        return """
        §c[Shitter List] §7Available commands:
        §a/$alias $slAlias add <username> <reason(optional)>§7 - Adds a player to your shitter list, with an optional reason.
        §a/$alias $slAlias reason <username> <reason>§7 - Adds/changes a player's reason for being on the shitter list..
        §a/$alias $slAlias remove <username>§7 - Removes a player from your shitter list.
        §a/$alias $slAlias removeall§7 - Removes all players from your shitter list, this action is irreversible.
        §a/$alias $slAlias list§7 - Lists every person on your shitter list, with the reason.
        §a/$alias $slAlias help§7 - Prints this help message.
        
        §7Every person on your shitter list will be auto kicked from your party whenever they join through party finder, when kicking it says that they got kicked and the reason for being on the shitter list in chat.
        """.trimIndent()
    }

    private fun registerCommand(dispatcher: CommandDispatcher<FabricClientCommandSource>) {
        val aliases = listOf("shaweeladdons", "shaweel", "sha")
        for (alias in aliases) {
            val command = ClientCommandManager.literal(alias)
                .executes { context ->
                    debugLog("Opening the ClickGui(I haven't made that yet)")
                    openConfig()
                    Command.SINGLE_SUCCESS
                }
                .then(debugModeLiteral)
                .then(gui)
                .then(config)
                .then(help(alias))
                .then(shitterList(alias, "shitterlist"))
                .then(shitterList(alias, "sl"))
                .then(shitterList(alias, "shitter"))
            dispatcher.register(command)
        }
    }

    fun init() {
        ClientCommandRegistrationCallback.EVENT.register { dispatcher, _ ->
            registerCommand(dispatcher)
        }
        if (!shaConfigFolder.exists()) {
            shaConfigFolder = Files.createDirectory(Path(configFolder.toString()+"/shaweelAddons"))
        }
        debugModeFile = File(shaConfigFolder.toString()+"/debugmode.txt")
        if (!debugModeFile.exists()) {
            Files.createFile(Path(shaConfigFolder.toString()+"/debugmode.txt"))
            debugModeFile = File(shaConfigFolder.toString()+"/debugmode.txt")
            debugModeFile.writeText("false")
        }
        shitterListFile = File(shaConfigFolder.toString()+"/shitterlist.json")
        if (!shitterListFile.exists()) {
            Files.createFile(Path(shaConfigFolder.toString()+"/shitterlist.json"))
            shitterListFile = File(shaConfigFolder.toString()+"/shitterlist.json")
            shitterListFile.writeText("[]")
        }
        debugMode = debugModeFile.readText().toBoolean()
        val shitterListStr = shitterListFile.readText()
        shitterList = JsonParser.parseString(shitterListStr).asJsonObject
    }
}