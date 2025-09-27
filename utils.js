let debugMode = FileLib.read("./config/ChatTriggers/modules/shaweelAddons/debugMode.txt")
debugMode = Number(debugMode)

//Define translations
let zombieTranslation = FileLib.read("./config/ChatTriggers/modules/shaweelAddons/translations/zombie.txt")
while (true) {
    if (!zombieTranslation.includes(" ")) break
    zombieTranslation = zombieTranslation.replace(" ", "")
}

let translations = {zombie: []}
translations.zombie = zombieTranslation.split(",")

//Self-explanatory utility functions
class utils {
    getTranslation(word) {
        try {
            return translations[word]
        } catch (error) {
            return null
        }
    }
    debugLog(debugMessage) {
        if (debugMode) {
            ChatLib.chat("&d[shaweelAddons] &e[DEBUG] &7"+debugMessage)
        }
    }

    chatLog(chatMessage) {
        ChatLib.chat("&d[shaweelAddons] &7"+chatMessage)
    }

    toggleDebugMode() {
        if (debugMode == 0) {
            ChatLib.chat("&d[shaweelAddons] &e[DEBUG] &aDebug mode activated.")
            debugMode = 1
            FileLib.write("./config/ChatTriggers/modules/shaweelAddons/debugMode.txt", String(debugMode))
            return
        }
        if (debugMode == 1) {
            ChatLib.chat("&d[shaweelAddons] &e[DEBUG] &cDebug mode deactivated.")
            debugMode = 0
            FileLib.write("./config/ChatTriggers/modules/shaweelAddons/debugMode.txt", String(debugMode))
            return
        }
    }

    //Returns -1 if you aren't in a dungeon
    getDungeonFloor() {
        let floor = ""
        let lines = Scoreboard.getLines()
        for (let line of lines) {
            line = String(line)
            if (line.includes("Dragon")) {
                return 14
            }
            if (line.includes("Cata")) {
                floor = line
            }
        }
        if (floor.includes("F")) {
            floorNum = Number(floor.split("F")[1].replace(")", ""))
            return floorNum
        }
        if (floor.includes("M")) {
            floorNum = Number(floor.split("M")[1].replace(")", ""))
            return floorNum+7
        }
        return -1
    }

    getDungeonClass() {
        //Return null if you're not in a dungeon

        if (this.getDungeonFloor == -1) return null
        //Define all classes
        let tank = true
        let heal = true
        let mage = true
        let bers = true
        let arch = true

        //Set all classes that are in the scoreboard to false
        let lines = Scoreboard.getLines()
        for (let line of lines) {
            line = String(cline)
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
        if (mage && tank && bers && heal && arch) return "Solo"
        if (mage) return "Mage"
        if (tank) return "Tank"
        if (bers) return "Berserker"
        if (heal) return "Healer"
        if (arch) return "Archer"
    }

    getClassMilestone() {
        let names = TabList.getNames()
        for (let name of names) {
            if (!name.includes(" Your Milestone: ")) continue
            let ms = name.split(" Your Milestone: §r§e")[1]
            ms = ms.split("§r")[0]
            if (ms=="?") {
                ms="0"
            }
            ms = ms.replace("☠", "")
            ms = ms.replace("❤", "")
            ms = ms.replace("☄", "")
            ms = ms.replace("♦", "")
            ms = ms.replace("⓿", "0")
            ms = ms.replace("❶", "1")
            ms = ms.replace("❷", "2")
            ms = ms.replace("❸", "3")
            ms = ms.replace("❹", "4")
            ms = ms.replace("❺", "5")
            ms = ms.replace("❻", "6")
            ms = ms.replace("❼", "7")
            ms = ms.replace("❽", "8")
            ms = ms.replace("❾", "9")
            return ms
        }
        return null
    }

    roundToDecimals(num, amount) {
        changer = 10**amount
        num = num*changer
        num = Math.round(num)
        num = num/changer
        return num
    }
    assignElementName(assignIndex) {
        if (assignIndex == 0) return "katanaHud"
        if (assignIndex == 1) return "Splits"
        if (assignIndex == 2) return "chestProfit"
        console.error("shaweel is stupid and forgot to asign a gui to the index, blame shaweel(assignElementName)("+assignIndex+")")
    }
    
    getIndexFromName(name) {
        if (name == "katanaHud") return 0
        if (name == "Splits") return 1
        if (name == "chestProfit") return 2
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
        let numLength = num.split(".")[1].length()
        if (numLength < decimals) {
            let difference = decimals - numLength
            num = num+"0".repeat(difference)
        }

        //Return the number
        return num
    }
}

export default new utils() 