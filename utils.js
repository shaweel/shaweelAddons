let debugMode = FileLib.read("./config/ChatTriggers/modules/shaweelAddons/debugMode.txt")
debugMode = Number(debugMode)

//Define translations
let zombieTranslation = FileLib.read("./config/ChatTriggers/modules/shaweelAddons/translations/zombie.txt")
zombieTranslation = zombieTranslation.replaceAll(" ", "")

let translations = {zombie: []}
translations.zombie = zombieTranslation.split(",")

//Cache
let cachedDungeonClass = null
let cachedDungeonFloor = null
let cachedClassMilestone = null
let lastDungeonFloorCacheUpdate = 0
let lastDungeonClassCacheUpdate = 0
let lastClassMilestoneCacheUpdate = 0
let usedSounds = Object.create(null)

//Self-explanatory utility functions
class utils {
    getTranslation(word) {
        try {
            return translations[word]
        } catch (err) {
            return null
        }
    }
    debugLog(debugMessage) {
        if (debugMode == 1) {
            ChatLib.chat("&d[shaweelAddons] &e[DEBUG] &7"+debugMessage)
        }
    }

    pseudoDebugLog(debugMessage) {
        ChatLib.chat("&d[shaweelAddons] &e[DEBUG] &7"+debugMessage)
    }

    chatLog(chatMessage) {
        ChatLib.chat("&d[shaweelAddons] &7"+chatMessage)
    }

    errorLog(chatMessage) {
        ChatLib.chat("&d[shaweelAddons] &4[ERROR] &c"+chatMessage)
    }

    toggleDebugMode() {
        debugMode *= -1
        FileLib.write("./config/ChatTriggers/modules/shaweelAddons/debugMode.txt", String(debugMode))

        if (debugMode == 1) {
            ChatLib.chat("&d[shaweelAddons] &e[DEBUG] &aDebug mode activated.")
        } else {
            ChatLib.chat("&d[shaweelAddons] &e[DEBUG] &cDebug mode deactivated.")
        }
    }

    //Returns -1 if you aren't in a dungeon
    getDungeonFloor() {
        if (Date.now() - lastDungeonFloorCacheUpdate < 1000) {
            return cachedDungeonFloor
        }
        lastDungeonFloorCacheUpdate = Date.now()
        let floor = ""
        let lines = Scoreboard.getLines()
        for (let line of lines) {
            line = String(line)
            if (line.includes("Dragon")) {
                cachedDungeonFloor = 14
                return 14
            }
            if (line.includes("Healthy")) {
                return cachedDungeonFloor
            }
            if (line.includes("Cata")) {
                floor = line
            }
        }
        if (floor.includes("F")) {
            let floorNum = Number(floor.split("F")[1].replace(")", ""))
            cachedDungeonFloor = floorNum
            return floorNum
        }
        if (floor.includes("M")) {
            let floorNum = Number(floor.split("M")[1].replace(")", ""))
            cachedDungeonFloor = floorNum + 7
            return floorNum+7
        }
        cachedDungeonFloor = -1
        return -1
    }
    getDungeonClass() {
        if (Date.now() - lastDungeonClassCacheUpdate < 1000) {
            return cachedDungeonClass
        }
        //Return null if you're not in a dungeon
        lastDungeonClassCacheUpdate = Date.now()
        cachedDungeonClass = null
        if (this.getDungeonFloor() == -1) return null
        //Define all classes
        let tank = true
        let heal = true
        let mage = true
        let bers = true
        let arch = true

        //Set all classes that are in the scoreboard to false
        let lines = Scoreboard.getLines()
        for (let line of lines) {
            line = String(line)
            if (line.includes("[T]")) {
                tank = false
            }
            if (line.includes("[B]")) {
                bers = false
            }
            if (line.includes("[A]")) {
                arch = false
            }
            if (line.includes("[H]")) {
                heal = false
            }
            if (line.includes("[M]")) {
                mage = false
            }
        }

        //Return the correct class
        if (mage && tank && bers && heal && arch) {
            cachedDungeonClass = "Solo"
            return "Solo"
        } 
        if (mage) {
            cachedDungeonClass = "Mage"
            return "Mage"
        }
        if (tank) {
            cachedDungeonClass = "Tank"
            return "Tank"
        }
        if (bers) {
            cachedDungeonClass = "Berserker"
            return "Berserker"
        }
        if (heal) {
            cachedDungeonClass = "Healer"
            return "Healer"
        }
        if (arch) {
            cachedDungeonClass = "Archer"
            return "Archer"
        }
    }

    getClassMilestone() {
        if (Date.now() - lastClassMilestoneCacheUpdate < 1000) {
            return cachedClassMilestone
        }
        let names = TabList.getNames()
        for (let name of names) {
            if (!name.includes(" Your Milestone: ")) continue
            let ms = name.split(" Your Milestone: §r§e")[1]
            ms = ms.split("§r")[0]
            if (ms=="?") {
                ms="0"
            }
            let replaceMap = {"☠":"", "❤":"", "☄":"", "♦":"", "⓿":"0", "❶":"1", "❷":"2", "❸": "3", "❹": "4", "❺": "5", "❻": "6", "❼": "7", "❽": "8", "❾": "9"}
            ms = ms.replace(/./g, character => replaceMap[character] ?? character)
            cachedClassMilestone = ms
            return ms
        }
        cachedClassMilestone = null
        return null
    }

    roundToDecimals(num, amount) {
        let changer = 10**amount
        num = num*changer
        num = Math.round(num)
        num = num/changer
        return num
    }
    assignElementName(assignIndex) {
        if (assignIndex == 0) return "katanaHud"
        if (assignIndex == 1) return "Splits"
        if (assignIndex == 2) return "chestProfit"
        if (assignIndex == 3) return "tick"
        console.error("shaweel is stupid and forgot to asign a gui to the index, blame shaweel(assignElementName)("+assignIndex+")")
    }
    
    getIndexFromName(name) {
        if (name == "katanaHud") return 0
        if (name == "Splits") return 1
        if (name == "chestProfit") return 2
        if (name == "tick") return 3
        console.error("shaweel is stupid and forgot to asign a gui to the index, blame shaweel(getIndexFromName)("+name+")")
    }

    formatLargeNumber(num) {
        //Get the sign
        let sign = Math.sign(num)

        //Format the number's absolute to a String and get it's length
        num = Math.abs(num)
        num = String(num)
        numLen = num.length

        //Make an array of all characters in the number
        let numArray = []
        for (char of num) {
            numArray.push(char)
        }

        //Add the ","
        let amount = 0
        let index = 0
        for (char of num) {
            index += 1
            if (numLen % 3 == index % 3 && index != numLen) {
                numArray.splice(index+amount, 0, ",")
                amount++
            }
        }

        //Correct the sign
        if (sign == -1) {
            num = "-"
        } else {
            num = ""
        }

        //Make the final number
        for (char of numArray) {
            num += char
        }

        //Return the number
        return num
    }

    formatSmallNumber(num, decimals) {
        //Round the number
        num = String(this.roundToDecimals(num, decimals))

        //If there is no decimal point add . and then 0s based on the decimal amount to prevent flickering in timers, 1 will be changed to 1.0 or 1.00
        //or 1.000 etc... 2 to 2.0 or 2.00 or 2.000 etc... then return the number
        if (!num.includes(".")) {
            num = num+"."+"0".repeat(decimals)
            return num
        }

        //If there aren't as much 0s as the decimals the number is being rounded to, add 0s based on the decimal amount to prevent flickering in timers
        let numLength = num.split(".")[1].length
        if (numLength < decimals) {
            let difference = decimals - numLength
            num = num+"0".repeat(difference)
        }

        //Return the number
        return num
    }
    playSound(sound, soundVolume, soundPitch) {
        sound = sound+".ogg"
        sound = String(sound)
        let toPlay
        if (usedSounds[sound]) {
            toPlay = usedSounds[sound]
        } else {
            toPlay = new Sound({source: sound})
            usedSounds[sound] = toPlay
        }
        toPlay.stop()
        toPlay.setVolume(soundVolume)
        toPlay.setPitch(soundPitch)
        toPlay.setAttenuation(0)
        toPlay.play()
    }

    drawRoundedRect(color, x, y, width, height, radius) {
        Renderer.drawRect(color, x+radius, y, width - 2*radius, height)
        Renderer.drawRect(color, x, y+radius, width, height - 2*radius)
        Renderer.drawCircle(color, x+radius, y+radius, radius, 10*radius)
        Renderer.drawCircle(color, x+width-radius, y+radius, radius, 10*radius)
        Renderer.drawCircle(color, x+radius, y+height-radius, radius, 10*radius)
        Renderer.drawCircle(color, x-radius+width, y+height-radius, radius, 10*radius)
    }

    drawOutlinedRoundedRect(color, outlineColor, x, y, width, height, radius, thickness) {
        this.drawRoundedRect(outlineColor, x - thickness, y - thickness, width + 2 * thickness, height + 2 * thickness, radius)
        this.drawRoundedRect(color, x, y, width, height, radius)
    }
}

export default new utils() 
