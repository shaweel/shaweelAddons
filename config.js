import {@Vigilant, @SwitchProperty, @TextProperty, @ButtonProperty, @NumberProperty} from "Vigilance"

@Vigilant("shaweelAddons", "shaweelAddons", {
    getCategoryComparator: () => (a, b) => {
        const categories = ["General", "Dungeons", "Slayer", "Fishing"]
        return categories.indexOf(a.name) - categories.indexOf(b.name)
    }
})

class Settings {
    @SwitchProperty({
        name: "Show title on rat kill",
        description: "When enabled you will see a title whenever you kill a rat",
        subcategory: "Rats",
        category: "General",
    })
    ratTitle = false

    @TextProperty({
        name: "Rat kill text",
        description: "The text you will see whenever you kill a rat",
        subcategory: "Rats",
        category: "General",
    })
    ratText = "&aRat Killed!"

    @SwitchProperty({
        name: "Play sound on rat kill",
        description: "When enabled a sound, which you can change in the assets will play whenever you kill a rat",
        subcategory: "Rats",
        category: "General",
    })
    ratSound = false

    @SwitchProperty({
        name: "Purple Pad Alert",
        description: "When enabled you will see a title when you need to enter purple pad, and when you need to exit purple pad.",
        subcategory: "Floor 7",
        category: "Dungeons",
    })
    padTitle = false

    @SwitchProperty({
        name: "Purple Pad Sound",
        description: "When enabled a sound will play, when you need to enter purple pad, and when you need to exit purple pad.",
        subcategory: "Floor 7",
        category: "Dungeons",
    })
    padSound = false

    @SwitchProperty({
        name: "Tank only",
        description: "When enabled Purple Pad Alert and Sound will only work if you're playing tank.",
        subcategory: "Floor 7",
        category: "Dungeons",
    })
    padTank = false
    
    @SwitchProperty({
        name: "Alert blow gate",
        description: "When enabled you will see a title whenever you need to blow the gate in Floor 7",
        subcategory: "Floor 7",
        category: "Dungeons",
    })
    gateTitle = false

    @TextProperty({
        name: "Blow gate text",
        description: "The text you will see whenever you need to blow the gate in Floor 7",
        subcategory: "Floor 7",
        category: "Dungeons",
    })
    gateText = "&4Blow Gate!"

    @SwitchProperty({
        name: "Blow gate sound",
        description: "When enabled a sound will play whenever you need to blow the gate in Floor 7",
        subcategory: "Floor 7",
        category: "Dungeons",
    })
    gateSound = false

    @SwitchProperty({
        name: "Alert Bonzo Mask",
        description: "When enabled you will see a title whenever your Bonzo Mask pops",
        subcategory: "Extra Life Items",
        category: "Dungeons",
    })
    bonzoTitle = false

    @TextProperty({
        name: "Bonzo Mask text",
        description: "The text you will see whenever your Bonzo Mask pops",
        subcategory: "Extra Life Items",
        category: "Dungeons",
    })
    bonzoText = "&cBonzo Mask Popped!"

    @SwitchProperty({
        name: "Bonzo Mask sound",
        description: "When enabled a sound will play whenever your Bonzo Mask pops",
        subcategory: "Extra Life Items",
        category: "Dungeons",
    })
    bonzoSound = false

    @SwitchProperty({
        name: "Alert Spirit Mask",
        description: "When enabled you will see a title whenever your Spirit Mask pops",
        subcategory: "Extra Life Items",
        category: "Dungeons",
    })
    spiritTitle = false

    @TextProperty({
        name: "Spirit Mask text",
        description: "The text you will see whenever your Spirit Mask pops",
        subcategory: "Extra Life Items",
        category: "Dungeons",
    })
    spiritText = "&cSpirit Mask Popped!"

    @SwitchProperty({
        name: "Spirit Mask sound",
        description: "When enabled a sound will play whenever your Spirit Mask pops",
        subcategory: "Extra Life Items",
        category: "Dungeons",
    })
    spiritSound = false

    @SwitchProperty({
        name: "Alert Phoenix",
        description: "When enabled you will see a title whenever your Phoenix dies",
        subcategory: "Extra Life Items",
        category: "Dungeons",
    })
    phoenixTitle = false

    @TextProperty({
        name: "Phoenix text",
        description: "The text you will see whenever your Phoenix dies",
        subcategory: "Extra Life Items",
        category: "Dungeons",
    })
    phoenixText = "&cPhoenix Died!"

    @SwitchProperty({
        name: "Phoenix sound",
        description: "When enabled a sound will play whenever your Phoenix dies",
        subcategory: "Extra Life Items",
        category: "Dungeons",
    })
    phoenixSound = false

    @SwitchProperty({
        name: "Force yourself on rat kill",
        description: "Usually rat kill doesn't trigger if you're not close to it(15 blocks - X, Z and 5 blocks Y), when this is enabled it will trigger no matter how far you are, this could be helpful if you're sniping them from a long distance, but could also hurt you by triggering when someone else kills it, while you're minding your own bussiness.",
        subcategory: "Rats",
        category: "General",
    })
    forceRat = false

    @SwitchProperty({
        name: "Leap Overlay",
        description: "A better gui for leaping",
        subcategory: "Leaping",
        category: "Dungeons",
    })
    leapOverlay = false

    @SwitchProperty({
        name: "Leap Announce",
        description: "Announces who you leaped to in chat",
        subcategory: "Leaping",
        category: "Dungeons",
    })
    leapAnnounce = false

    @SwitchProperty({
        name: "Leap Keybinds",
        description: "Adds keybinds to the leap overlay",
        subcategory: "Leaping",
        category: "Dungeons",
    })
    leapKeybinds = false

    @NumberProperty({
        name: "Mage Keybind",
        description: "The keybind to leap to mage",
        subcategory: "Leaping",
        category: "Dungeons",
        min: 1,
        max: 5
    })
    mageKeybind = Number(1)

    @NumberProperty({
        name: "Archer Keybind",
        description: "The keybind to leap to archer",
        subcategory: "Leaping",
        category: "Dungeons",
        min: 1,
        max: 5
    })
    archerKeybind = Number(2)

    @NumberProperty({
        name: "Healer Keybind",
        description: "The keybind to leap to healer",
        subcategory: "Leaping",
        category: "Dungeons",
        min: 1,
        max: 5
    })
    healerKeybind = Number(3)

    @NumberProperty({
        name: "Tank Keybind",
        description: "The keybind to leap to tank",
        subcategory: "Leaping",
        category: "Dungeons",
        min: 1,
        max: 5
    })
    tankKeybind = Number(4)

    @NumberProperty({
        name: "Berserk Keybind",
        description: "The keybind to leap to berserk",
        subcategory: "Leaping",
        category: "Dungeons",
        min: 1,
        max: 5
    })
    berserkKeybind = Number(5)
    
    @SwitchProperty({
        name: "Announce mimic killed in chat",
        description: "When enabled you will send a chat message whenever mimic is killed",
        subcategory: "General",
        category: "Dungeons",
    })
    mimicAnnounce = false

    @TextProperty({
        name: "Mimic kill announcement",
        description: "The text you will send in chat whenever mimic is killed",
        subcategory: "General",
        category: "Dungeons",
    })
    mimicAnnounceText = "Mimic Killed!"

    @SwitchProperty({
        name: "Show title on mimic kill",
        description: "When enabled you will see a title whenever mimic is killed",
        subcategory: "General",
        category: "Dungeons",
    })
    mimicTitle = false

    @TextProperty({
        name: "Mimic kill text",
        description: "The text you will see whenever mimic is killed",
        subcategory: "General",
        category: "Dungeons",
    })
    mimicText = "&aMimic Killed!"

    @SwitchProperty({
        name: "Play sound on mimic kill",
        description: "When enabled a sound, which you can change in the assets will play whenever mimic is killed",
        subcategory: "General",
        category: "Dungeons",
    })
    mimicSound = false

    @SwitchProperty({
        name: "Announce prince killed in chat",
        description: "When enabled you will send a chat message whenever prince is killed",
        subcategory: "General",
        category: "Dungeons",
    })
    princeAnnounce = false

    @TextProperty({
        name: "Prince kill announcement",
        description: "The text you will send in chat whenever prince is killed",
        subcategory: "General",
        category: "Dungeons",
    })
    princeAnnounceText = "Prince Killed!"

    @SwitchProperty({
        name: "Show title on prince kill",
        description: "When enabled you will see a title whenever prince is killed",
        subcategory: "General",
        category: "Dungeons",
    })
    princeTitle = false

    @TextProperty({
        name: "Prince kill text",
        description: "The text you will see whenever prince is killed",
        subcategory: "General",
        category: "Dungeons",
    })
    princeText = "&aPrince Killed!"

    @SwitchProperty({
        name: "Play sound on prince kill",
        description: "When enabled a sound, which you can change in the assets will play whenever prince is killed",
        subcategory: "General",
        category: "Dungeons",
    })
    princeSound = false

    @ButtonProperty({
        name: "Move GUIs",
        description: "You can also do /shaweeladdons gui",
        category: "General",
        subcategory: "",
        placeholder: "Move"
    })
    Action() {
        ChatLib.command("shaweeladdons gui", true)
    }

    @SwitchProperty({
        name: "Katana HUD",
        description: "When enabled there will be a HUD displaying whether the enderman slayer katana's ability is currently enabled",
        category: "Slayer",
        subcategory: "Enderman Slayer"
    })
    katanaHud = false
    
    @SwitchProperty({
        name: "Katana Ability Expired Sound",
        description: "When enabled a sound will play whenever the Katana ability expires",
        category: "Slayer",
        subcategory: "Enderman Slayer"
    })
    expireSound = false

    @SwitchProperty({
        name: "Show title on low health",
        description: "When enabled you will see a title whenever you get below 50 percent hp",
        subcategory: "Low Health Alert",
        category: "General",
    })
    lhtitle = false

    @TextProperty({
        name: "Low health alert text",
        description: "The text you will see whenever you get below 50 percent hp",
        subcategory: "Low Health Alert",
        category: "General",
    })
    lhtext = "&4&lLow health!"

    @SwitchProperty({
        name: "Play sound on low health",
        description: "When enabled a sound, which you can change in the assets will play whenever you get below 50 percent hp",
        subcategory: "Low Health Alert",
        category: "General",
    })
    lhsound = false

    @SwitchProperty({
        name: "Show title when under class milestone 3",
        description: "When enabled you will see a title when you're below class milestone 3, useful for playing archer and clearing with a Hyperion",
        category: "Dungeons",
        subcategory: "General"
    })
    cmtitle = false

    @SwitchProperty({
        name: "Outside dungeon death tick timer",
        description: "A timer for death ticks when you leave the dungeon environment",
        category: "Dungeons",
        subcategory: "General"
    })
    tick = false

    @SwitchProperty({
        name: "Wished",
        description: "Shows a title when you wish.",
        category: "Dungeons",
        subcategory: "General"
    })
    wishedTitle = false 
    @TextProperty({
        name: "Wished Text",
        description: "The text that shows when you wish.",
        category: "Dungeons",
        subcategory: "General"
    })
    wishedText = "&aWished" 
    @SwitchProperty({
        name: "Wished Sound",
        description: "Plays a sound when you wish.",
        category: "Dungeons",
        subcategory: "General"
    })
    wishedSound = false 

    @SwitchProperty({
        name: "Wish Alert",
        description: "Shows a title when you're supposed to wish.",
        category: "Dungeons",
        subcategory: "General"
    })
    wishTitle = false 
    @TextProperty({
        name: "Wish Text",
        description: "The text that shows when you're supposed to wish.",
        category: "Dungeons",
        subcategory: "General"
    })
    wishText = "&4Wish!" 
    @SwitchProperty({
        name: "Wish Sound",
        description: "Plays a sound when you should wish.",
        category: "Dungeons",
        subcategory: "General"
    })
    wishSound = false 
    @SwitchProperty({
        name: "Crystal Alert",
        description: "Shows a title when you pick up a crystal in Maxor",
        category: "Dungeons",
        subcategory: "Floor 7"
    })
    crystalTitle = false 
    @TextProperty({
        name: "Crystal Text",
        description: "The text that shows when you pick up a crystal in Maxor",
        category: "Dungeons",
        subcategory: "Floor 7"
    })
    crystalText = "&dCrystal Picked Up!" 
    @SwitchProperty({
        name: "Crystal Sound",
        description: "Plays a sound when you pick up a crystal in Maxor",
        category: "Dungeons",
        subcategory: "Floor 7"
    })
    crystalSound = false 
    @TextProperty({
        name: "Milestone below 3 alert text",
        description: "The text you will see when you're below class milestone 3",
        category: "Dungeons",
        subcategory: "General"
    })
    cmtext = "&4&lUnder class milestone 3!"

    @SwitchProperty({
        name: "Show title on SS Reset",
        description: "When enabled you will see a title whenever someone messess up SS(must be said in chat)",
        category: "Dungeons",
        subcategory: "Floor 7"
    })
    sstitle = false

    @TextProperty({
        name: "SS Reset alert text",
        description: "The text you will see whenever someone messess up SS(must be said in chat), good for archers doing ee2",
        category: "Dungeons",
        subcategory: "Floor 7"
    })
    sstext = "&4&lSS Reset!"

    @SwitchProperty({
        name: "Play sound on SS Reset",
        description: "When enabled a sound, which you can change in the assets will play whenever someone messess up SS(must be said in chat)",
        category: "Dungeons",
        subcategory: "Floor 7"
    })
    sssound = false

    @SwitchProperty({
        name: "Show title on sea creature catch",
        description: "When enabled you will see a title whenever you catch a sea creature",
        category: "Fishing",
        subcategory: "Sea Creature Alert"
    })
    sctitle = false

    @TextProperty({
        name: "Sea creature alert text",
        description: "The text you will see whenever you catch a sea creature",
        category: "Fishing",
        subcategory: "Sea Creature Alert"
    })
    sctext = "&aSea Creature!"

    @SwitchProperty({
        name: "Play sound on sea creature catch",
        description: "When enabled a sound, which you can change in the assets will play whenever you catch a sea creature",
        category: "Fishing",
        subcategory: "Sea Creature Alert"
    })
    scsound = false

    @SwitchProperty({
        name: "Splits",
        description: "Dungeon splits in dungeons.",
        category: "Dungeons",
        subcategory: "General"
    })
    Splits = false

    @SwitchProperty({
        name: "Dungeon Chest Profit",
        description: "Calculates profit in dungeon chests and the croesus menu.",
        category: "Dungeons",
        subcategory: "General"
    })
    chestProfit = false
    constructor() {
        this.initialize(this)
        this.addDependency("Sea creature alert text", "Show title on sea creature catch")
        this.addDependency("SS Reset alert text", "Show title on SS Reset")
        this.addDependency("Milestone below 3 alert text", "Show title when under class milestone 3")
        this.addDependency("Low health alert text", "Show title on low health")
        this.addDependency("Rat kill text", "Show title on rat kill")
        this.addDependency("Blow gate text", "Alert blow gate")
        this.addDependency("Bonzo Mask text", "Alert Bonzo Mask")
        this.addDependency("Spirit Mask text", "Alert Spirit Mask")
        this.addDependency("Phoenix text", "Alert Phoenix")
        this.addDependency("Mimic kill text", "Show title on mimic kill")
        this.addDependency("Mimic kill announcement", "Announce mimic killed in chat")
        this.addDependency("Prince kill text", "Show title on prince kill")
        this.addDependency("Prince kill announcement", "Announce prince killed in chat")
        this.addDependency("Katana Ability Expired Sound", "Katana HUD")
        this.addDependency("Wished Text", "Wished")
        this.addDependency("Wish Text", "Wish Alert")
        this.addDependency("Crystal Text", "Crystal Alert")
        this.addDependency("Leap Announce", "Leap Overlay")
        this.addDependency("Leap Keybinds", "Leap Overlay")
        this.addDependency("Mage Keybind", "Leap Keybinds")
        this.addDependency("Archer Keybind", "Leap Keybinds")
        this.addDependency("Healer Keybind", "Leap Keybinds")
        this.addDependency("Tank Keybind", "Leap Keybinds")
        this.addDependency("Berserk Keybind", "Leap Keybinds")
    }
}

export default new Settings()
