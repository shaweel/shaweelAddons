package me.shaweel.shaweeladdons

import me.shaweel.shaweeladdons.commandsAndShitterlist.debugMode
import net.minecraft.client.MinecraftClient
import net.minecraft.client.gl.RenderPipelines
import net.minecraft.client.gui.DrawContext
import net.minecraft.client.gui.screen.Screen
import net.minecraft.text.Text
import net.minecraft.util.Identifier
import javax.crypto.Cipher

object utils {
    fun chatLog(message: String) {
        val player = MinecraftClient.getInstance().player

        if (player == null) return
        player.sendMessage(Text.literal("§d[shaweelAddons]§7 " + message), false)
    }

    fun debugLog(message: String) {
        val player = MinecraftClient.getInstance().player
        println(message)
        if (player == null) return
        if (debugMode == false) return
        player.sendMessage(Text.literal("§d[shaweelAddons]§e [DEBUG]§7 " + message), false)
    }

    fun drawRoundedRectangle(x1: Int, y1: Int, x2: Int, y2: Int, radius: Int, color: Int, context: DrawContext?) {
        context?.fill(x1 + radius, y1, x2 - radius, y2, color)
        context?.fill(x1, y1 + radius, x2, y2 - radius, color)
        drawCircle(x1, y1, radius, color, context)
        drawCircle(x2 - radius * 2, y1, radius, color, context)
        drawCircle(x1, y2 - radius * 2, radius, color, context)
        drawCircle(x2 - radius * 2, y2 - radius * 2, radius, color, context)
    }
    val CIRCLE_TEXTURE = Identifier.tryParse("shaweeladdons", "circle.png")
    fun drawCircle(x: Int, y: Int, radius: Int, color: Int, context: DrawContext?) {
        context?.drawTexture(RenderPipelines.GUI_TEXTURED, CIRCLE_TEXTURE, x, y, 0f, 0f,
            radius*2, radius*2, 2048, 2048, 2048, 2048, color)
    }
}