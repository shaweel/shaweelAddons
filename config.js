import {@Vigilant, @SwitchProperty, @TextProperty, @ButtonProperty} from "Vigilance"

@Vigilant("shaweelAddons", "shaweelAddons", {
    getCategoryComparator: () => (a, b) => {
        const categories = ["General", "Dungeons", "Slayer", "Fishing"];
        return categories.indexOf(a.name) - categories.indexOf(b.name);
    },
    getSubcategoryComparator: () => (a, b) => {
        const subcategories = ["GUI", "General", "Extra Life Items", "Low Health Alert", "Rats", "Floor 7"]
        return subcategories.indexOf(a.getValue()[0].attributesExt.subcategory) - subcategories.indexOf(b.getValue()[0].attributesExt.subcategory)
    },
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

    @ButtonProperty({
        name: "Move GUIs",
        description: "You can also do /shaweeladdons gui",
        category: "General",
        subcategory: "GUI",
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
        description: "When enabled you will see a title whenever you get below 50% hp",
        subcategory: "Low Health Alert",
        category: "General",
    })
    lhtitle = false

    @TextProperty({
        name: "Low health alert text",
        description: "The text you will see whenever you get below 50% hp",
        subcategory: "Low Health Alert",
        category: "General",
    })
    lhtext = "&4&lLow health!"

    @SwitchProperty({
        name: "Play sound on low health",
        description: "When enabled a sound, which you can change in the assets will play whenever you get below 50% hp",
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
        this.addDependency("Katana Ability Expired Sound", "Katana HUD")
    }
}

export default new Settings()
