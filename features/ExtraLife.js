import Settings from "../config.js"

//Bonzo Mask
register("chat", () => {
    if (Settings.bonzoSound) {
        World.playSound("note.pling", 1, 2)
    }
    if (Settings.bonzoTitle) {
        Client.showTitle(Settings.bonzoText, "", "10", "10", "10")
    }
    
}).setCriteria("Your Bonzo's Mask saved your life!")

//Spirit Mask
register("chat", () => {
    if (Settings.spiritSound) {
        World.playSound("note.pling", 1, 2)
    }
    if (Settings.spiritTitle) {
        Client.showTitle(Settings.spiritText, "", "10", "10", "10")
    }
    
}).setCriteria("Second Wind Activated! Your Spirit Mask saved your life!")

//Phoenix
register("chat", () => {
    if (Settings.phoenixSound) {
        World.playSound("note.pling", 1, 2)
    }
    if (Settings.phoenixTitle) {
        Client.showTitle(Settings.phoenixText, "", "10", "10", "10")
    }
    
}).setCriteria("Your Phoenix Pet saved you from certain death!")