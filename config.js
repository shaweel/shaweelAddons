import { @Vigilant, @SwitchProperty, @TextProperty} from "Vigilance"

@Vigilant("shaweelAddons")
class Settings {
    @SwitchProperty({
        name: "Show title on low health",
        description: "When enabled you will see a title whenever you get below 50% hp",
        category: "General",
    })
    lhtitle = false

    @TextProperty({
        name: "Low health alert text",
        description: "The text you will see whenever you get below 50% hp",
        category: "General",
    })
    lhtext = "&4&lLow health!"

    @SwitchProperty({
        name: "Play sound on low health",
        description: "When enabled a sound, which you can change in the assets will play whenever you get below 50% hp",
        category: "General",
    })
    lhsound = false

    @SwitchProperty({
        name: "Show title when under class milestone 3",
        description: "When enabled you will see a title when you're below class milestone 3, useful for playing archer and clearing with a Hyperion",
        category: "​Dungeons",
        subcategory: "General"
    })
    cmtitle = false

    @TextProperty({
        name: "Milestone below 3 alert text",
        description: "The text you will see when you're below class milestone 3",
        category: "​Dungeons",
        subcategory: "General"
    })
    cmtext = "&4&lUnder class milestone 3!"

    @SwitchProperty({
        name: "Show title on SS Reset",
        description: "When enabled you will see a title whenever someone messess up SS(must be said in chat)",
        category: "​Dungeons",
        subcategory: "​Floor 7"
    })
    sstitle = false

    @TextProperty({
        name: "SS Reset alert text",
        description: "The text you will see whenever someone messess up SS(must be said in chat), good for archers doing ee2",
        category: "​Dungeons",
        subcategory: "​Floor 7"
    })
    sstext = "&4&lSS Reset!"

    @SwitchProperty({
        name: "Play sound on SS Reset",
        description: "When enabled a sound, which you can change in the assets will play whenever someone messess up SS(must be said in chat)",
        category: "​Dungeons",
        subcategory: "​Floor 7"
    })
    sssound = false

    @SwitchProperty({
        name: "Show title on sea creature catch",
        description: "When enabled you will see a title whenever you catch a sea creature",
        category: "​Fishing",
        subcategory: "Sea Creature Alert"
    })
    sctitle = false

    @TextProperty({
        name: "Sea creature alert text",
        description: "The text you will see whenever you catch a sea creature",
        category: "​Fishing",
        subcategory: "Sea Creature Alert"
    })
    sctext = "&aSea Creature!"

    @SwitchProperty({
        name: "Play sound on sea creature catch",
        description: "When enabled a sound, which you can change in the assets will play whenever you catch a sea creature",
        category: "​Fishing",
        subcategory: "Sea Creature Alert"
    })
    scsound = false

    constructor() {
        this.initialize(this)
        this.addDependency("Sea creature alert text", "Show title on sea creature catch")
        this.addDependency("SS Reset alert text", "Show title on SS Reset")
        this.addDependency("Milestone below 3 alert text", "Show title when under class milestone 3")
        this.addDependency("Low health alert text", "Show title on low health")
        this.setCategoryDescription("General", "General useful features")
        this.setCategoryDescription("​Fishing", "Useful features for all types of fishing")
        this.setCategoryDescription("​Dungeons", "Useful features for dungeons")
        this.setSubcategoryDescription("​Fishing", "Sea Creature Alert", "An alert for whenever you catch a sea creature")
        this.setSubcategoryDescription("​Dungeons", "​Floor 7", "Useful features for floor 7 runs")
    }
}

export default new Settings()
