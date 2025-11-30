import {@Vigilant, @SwitchProperty, @TextProperty, @ButtonProperty} from "Vigilance"

@Vigilant("shaweelAddons", "shaweelAddons-ctjs-1.3.13", {
	getCategoryComparator: () => (a, b) => {
		const categories = ["General", "Dungeons", "Slayers", "Fishing", "Miscellaneous"]
		return categories.indexOf(a.name) - categories.indexOf(b.name)
	}
})

class Settings {
	// ------------------------------------------
	// General
	// ------------------------------------------
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




	// Low Health Alert
	@SwitchProperty({
		name: "Low Health Alert",
		description: "Alerts you with a title when you're below half health",
		subcategory: "Low Health Alert",
		category: "General"
	})
	lhtitle = false

	@TextProperty({
		name: "Low Health Text",
		description: "The text of the title that alerts you when you're below half health",
		subcategory: "Low Health Alert",
		category: "General"
	})
	lhtext = "&4&lLow health!"

	@SwitchProperty({
		name: "Play sound on low health",
		description: "Alerts you with a sound when you're below half health",
		subcategory: "Low Health Alert",
		category: "General"
	})
	lhsound = false

	// ------------------------------------------
	// Dungeons
	// ------------------------------------------

	//Extra Life Items
	@SwitchProperty({
		name: "Bonzo's Mask Alert",
		description: "Alerts you with a title when your Bonzo's Mask pops",
		subcategory: "Extra Life Items",
		category: "Dungeons"
	})
	bonzoTitle = false

	@TextProperty({
		name: "Bonzo's Mask Text",
		description: "The text of the title that alerts you when your Bonzo's Mask pops",
		subcategory: "Extra Life Items",
		category: "Dungeons"
	})
	bonzoText = "&cBonzo Mask Popped!"

	@SwitchProperty({
		name: "Bonzo's Mask Sound",
		description: "Alerts you with a sound when your Bonzo's Mask pops",
		subcategory: "Extra Life Items",
		category: "Dungeons"
	})
	bonzoSound = false



	@SwitchProperty({
		name: "Spirit Mask Alert",
		description: "Alerts you with a title when your Spirit Mask pops",
		subcategory: "Extra Life Items",
		category: "Dungeons"
	})
	spiritTitle = false

	@TextProperty({
		name: "Spirit Mask Text",
		description: "The text of the title that alerts you whenever your Spirit Mask pops",
		subcategory: "Extra Life Items",
		category: "Dungeons"
	})
	spiritText = "&cSpirit Mask Popped!"

	@SwitchProperty({
		name: "Spirit Mask Sound",
		description: "Alerts you with a sound when your Spirit Mask pops",
		subcategory: "Extra Life Items",
		category: "Dungeons"
	})
	spiritSound = false



	@SwitchProperty({
		name: "Phoenix Alert",
		description: "Alerts you with a title when your Phoenix dies",
		subcategory: "Extra Life Items",
		category: "Dungeons"
	})
	phoenixTitle = false

	@TextProperty({
		name: "Phoenix Text",
		description: "The text of the title that alerts you when your Phoenix dies",
		subcategory: "Extra Life Items",
		category: "Dungeons"
	})
	phoenixText = "&cPhoenix Died!"

	@SwitchProperty({
		name: "Phoenix Sound",
		description: "Alerts you with a sound whenever your Phoenix dies",
		subcategory: "Extra Life Items",
		category: "Dungeons"
	})
	phoenixSound = false




	//Floor 7
	@SwitchProperty({
		name: "Alert Class Milestone",
		description: "Alerts you to get class milestone in Maxor if you're playing Archer in F7",
		category: "Dungeons",
		subcategory: "Floor 7"
	})
	cmtitle = false



	@SwitchProperty({
		name: "Crystal Picked Up Alert",
		description: "Alerts you with a title when you pick up an Energy Crystal in Maxor",
		category: "Dungeons",
		subcategory: "Floor 7"
	})
	crystalTitle = false 

	@TextProperty({
		name: "Crystal Picked Up Text",
		description: "The text of the title that alerts you when you pick up an Energy Crystal in Maxor",
		category: "Dungeons",
		subcategory: "Floor 7"
	})
	crystalText = "&dCrystal Picked Up!" 

	@SwitchProperty({
		name: "Crystal Picked Up Sound",
		description: "Alerts you with a sound when you pick up an Energy Crystal in Maxor",
		category: "Dungeons",
		subcategory: "Floor 7"
	})
	crystalSound = false 


	@SwitchProperty({
		name: "Crystal Placed Alert",
		description: "Alerts you with a title when you place an Energy Crystal in Maxor",
		category: "Dungeons",
		subcategory: "Floor 7"
	})
	crystalPlaceTitle = false 

	@TextProperty({
		name: "Crystal Placed Text",
		description: "The text of the title that alerts you when you place an Energy Crystal in Maxor",
		category: "Dungeons",
		subcategory: "Floor 7"
	})
	crystalPlaceText = "&dCrystal Placed!" 

	@SwitchProperty({
		name: "Crystal Placed Sound",
		description: "Alerts you with a sound when you place an Energy Crystal in Maxor",
		category: "Dungeons",
		subcategory: "Floor 7"
	})
	crystalPlaceSound = false 



	@SwitchProperty({
		name: "Purple Pad Alert",
		description: "Alerts you with titles exactly when you need to enter and exit Purple Pad when doing py",
		subcategory: "Floor 7",
		category: "Dungeons"
	})
	padTitle = false

	@SwitchProperty({
		name: "Purple Pad Sound",
		description: "Alerts you with sounds exactly when you need to enter and exit Purple Pad when doing py",
		subcategory: "Floor 7",
		category: "Dungeons"
	})
	padSound = false

	@SwitchProperty({
		name: "Tank only",
		description: "Makes Purple Pad Alert and Purple Pad Sound only work when you're playing Tank",
		subcategory: "Floor 7",
		category: "Dungeons"
	})
	padTank = false



	@SwitchProperty({
		name: "Compact Terminals",
		description: "An objectively better terminals title system",
		category: "Dungeons",
		subcategory: "Floor 7"
	})
	compactTerms = false



	@SwitchProperty({
		name: "Blow Gate Alert",
		description: "Alerts you with a title when you need to blow the gate in terminals",
		subcategory: "Floor 7",
		category: "Dungeons"
	})
	gateTitle = false

	@TextProperty({
		name: "Blow Gate Text",
		description: "The text of the title that alerts you when you ned to blow the gate in terminals",
		subcategory: "Floor 7",
		category: "Dungeons"
	})
	gateText = "&4Blow Gate!"

	@SwitchProperty({
		name: "Blow Gate Sound",
		description: "Alerts you with a sound when you need to blow the gate in terminals",
		subcategory: "Floor 7",
		category: "Dungeons"
	})
	gateSound = false




	//General
	@SwitchProperty({
		name: "Bat Alert",
		description: "Alerts you with a title when you kill a secret Bat",
		category: "Dungeons",
		subcategory: "General"
	})
	batAlert = false

	@TextProperty({
		name: "Bat Text",
		description: "The text of the title that alerts you when you kill a secret Bat",
		category: "Dungeons",
		subcategory: "General"
	})
	batText = "&aBat Killed"


	
	@SwitchProperty({
		name: "Auto Party Finder Message",
		description: "Automatically sends a message when someone joins the Party Finder party",
		category: "Dungeons",
		subcategory: "General"
	})
	pfMsg = false

	@TextProperty({
		name: "Auto Party Finder Message Message",
		description: "The message you automatically send when someone joins the Party Finder party",
		category: "Dungeons",
		subcategory: "General"
	})
	pfMsgMsg = "I'm AFK!"

	@TextProperty({
		name: "Auto Party Finder Message Delay",
		description: "The delay in miliseconds before you automatically send a message when someone joins the Party Finder party",
		category: "Dungeons",
		subcategory: "General"
	})
	pfMsgDelay = "500"



	@SwitchProperty({
		name: "Splits",
		description: "Dungeon splits with a ton of information",
		category: "Dungeons",
		subcategory: "General"
	})
	Splits = false

	@SwitchProperty({
		name: "Send Split Times",
		description: "Sends Dungeon split times in Party chat",
		category: "Dungeons",
		subcategory: "General"
	})
	sendSplits = false



	@SwitchProperty({
		name: "Dungeon Chest Profit",
		description: "Calculates profit in Dungeon chests and the Croesus menu",
		category: "Dungeons",
		subcategory: "General"
	})
	chestProfit = false




	//Leaping
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
		description: "Adds keybinds to the leap overlay, configure these in your controls, if you're facing issues with conflicting keybinds, install the Modern Keybinding mod and enable Non-conflicting keybinds",
		subcategory: "Leaping",
		category: "Dungeons",
	})
	leapKeybinds = false




	//Mimic and Prince
	@SwitchProperty({
		name: "Mimic Killed Alert",
		description: "Alerts you with a title when Mimic gets killed",
		subcategory: "Mimic and Prince",
		category: "Dungeons"
	})
	mimicTitle = false

	@TextProperty({
		name: "Mimic Killed Text",
		description: "The text of the title that alerts you when Mimic gets killed",
		subcategory: "Mimic and Prince",
		category: "Dungeons"
	})
	mimicText = "&aMimic Killed!"

	@SwitchProperty({
		name: "Mimic Killed Sound",
		description: "Alerts you with a sound when Mimic gets killed",
		subcategory: "Mimic and Prince",
		category: "Dungeons"
	})
	mimicSound = false

	@SwitchProperty({
		name: "Send Mimic Killed",
		description: "Sends a chat message when Mimic gets killed",
		subcategory: "Mimic and Prince",
		category: "Dungeons"
	})
	mimicAnnounce = false

	@TextProperty({
		name: "Mimic Killed Message",
		description: "The chat message you send when Mimic gets killed",
		subcategory: "Mimic and Prince",
		category: "Dungeons"
	})
	mimicAnnounceText = "Mimic Killed!"



	@SwitchProperty({
		name: "Prince Killed Alert",
		description: "Alerts you with a title when Prince gets killed",
		subcategory: "Mimic and Prince",
		category: "Dungeons"
	})
	princeTitle = false

	@TextProperty({
		name: "Prince Killed Text",
		description: "The text of the title that alerts you when Prince gets killed",
		subcategory: "Mimic and Prince",
		category: "Dungeons"
	})
	princeText = "&aPrince Killed!"

	@SwitchProperty({
		name: "Prince Killed Sound",
		description: "Alerts you with a sound when Prince gets killed",
		subcategory: "Mimic and Prince",
		category: "Dungeons"
	})
	princeSound = false

	@SwitchProperty({
		name: "Send Prince Killed",
		description: "Sends a chat message when Prince gets killed",
		subcategory: "Mimic and Prince",
		category: "Dungeons"
	})
	princeAnnounce = false

	@TextProperty({
		name: "Prince Killed Message",
		description: "The chat message you send when Prince gets killed",
		subcategory: "Mimic and Prince",
		category: "Dungeons"
	})
	princeAnnounceText = "Prince Killed!"




	//Tick Timers
@SwitchProperty({
		name: "Tick Timers",
		description: "Tick Timers for dungeons",
		subcategory: "Tick Timers",
		category: "Dungeons"
	})
	tick = false
	
	@SwitchProperty({
		name: "Secret Tick Timer",
		description: "A Secret Tick Timer for when Bats, Items and Wither Essences spawn",
		subcategory: "Tick Timers",
		category: "Dungeons"
	})
	secretTick = false

	@SwitchProperty({
		name: "Outbounds Tick Timer",
		description: "A Tick timer for the death ticks before the dungeon starts",
		subcategory: "Tick Timers",
		category: "Dungeons"
	})
	outTick = false

	@SwitchProperty({
		name: "Use Ticks",
		description: "Uses ticks instead of seconds in the Tick Timers",
		subcategory: "Tick Timers",
		category: "Dungeons"
	})
	useTicks = false

	@SwitchProperty({
		name: "Remove Label",
		description: "Removes the label saying which Tick Timer it is",
		subcategory: "Tick Timers",
		category: "Dungeons"
	})
	removeLabel = false




	//Wishing
	@SwitchProperty({
		name: "Wish Alert",
		description: "Alerts you with a title when you're supposed to use the Wish ability when playing Healer",
		category: "Dungeons",
		subcategory: "Wishing"
	})
	wishTitle = false 

	@TextProperty({
		name: "Wish Text",
		description: "The text of the title that alerts you when you're supposed to use the Wish ability when playing Healer",
		category: "Dungeons",
		subcategory: "Wishing"
	})
	wishText = "&4Wish!" 

	@SwitchProperty({
		name: "Wish Sound",
		description: "Alerts you with a sound when you're supposed to use the Wish ability when playing Healer",
		category: "Dungeons",
		subcategory: "Wishing"
	})
	wishSound = false 



	@SwitchProperty({
		name: "Wished Alert",
		description: "Alerts you with a title when you use the Wish ability when playing Healer",
		category: "Dungeons",
		subcategory: "Wishing"
	})
	wishedTitle = false

	@TextProperty({
		name: "Wished Text",
		description: "The text of the title that alerts you when you use the Wish ability when playing Healer",
		category: "Dungeons",
		subcategory: "Wishing"
	})
	wishedText = "&aWished" 

	@SwitchProperty({
		name: "Wished Sound",
		description: "Alerts you with a sound when you use the Wish ability when playing Healer",
		category: "Dungeons",
		subcategory: "Wishing"
	})
	wishedSound = false 

	// ------------------------------------------
	// Slayers
	// ------------------------------------------

	//Enderman Slayer
	@SwitchProperty({
		name: "Katana HUD",
		description: "When enabled there will be a HUD displaying whether the Enderman Slayer Katana's ability is currently enabled with a timer",
		category: "Slayers",
		subcategory: "Enderman Slayer"
	})
	katanaHud = false
	
	@SwitchProperty({
		name: "Katana Ability Expired Sound",
		description: "When enabled a sound will play whenever the Katana ability expires",
		category: "Slayers",
		subcategory: "Enderman Slayer"
	})
	expireSound = false

	// ------------------------------------------
	// Fishing
	// ------------------------------------------

	//Sea Creature Alert
	@SwitchProperty({
		name: "Sea Creature Alert",
		description: "Alerts you with a title when you catch Sea Creature",
		category: "Fishing",
		subcategory: "Sea Creature Alert"
	})
	sctitle = false

	@TextProperty({
		name: "Sea Creature Text",
		description: "The text of the title that alerts you when you catch a Sea Creature",
		category: "Fishing",
		subcategory: "Sea Creature Alert"
	})
	sctext = "&aSea Creature!"

	@SwitchProperty({
		name: "Sea Creature Sound",
		description: "Alerts you with a sound when you catch Sea Creature",
		category: "Fishing",
		subcategory: "Sea Creature Alert"
	})
	scsound = false

	// ------------------------------------------
	// Miscellaneous
	// ------------------------------------------

	//Miscellaneous
	@SwitchProperty({
		name: "Chat Commands",
		description: "Party chat commands, for example !warp for warping !pt for party transfer etc...",
		subcategory: "Miscellaneous",
		category: "Miscellaneous"
	})
	chatCommands = false



	@SwitchProperty({
		name: "Chat Stars",
		description: "Allows you to type stars in chat, for example <10star> will turn into ✪✪✪✪✪➎, there's more possible ways to type this syntax.",
		category: "Miscellaneous",
		subcategory: "Miscellaneous"
	})
	stars = false




	//Rats
	@SwitchProperty({
		name: "Rat Killed Alert",
		description: "Alerts you with a title when you kill a rat",
		subcategory: "Rats",
		category: "Miscellaneous"
	})
	ratTitle = false

	@TextProperty({
		name: "Rat Killed Text",
		description: "The text of the title that alerts you when you kill a rat",
		subcategory: "Rats",
		category: "Miscellaneous"
	})
	ratText = "&aRat Killed!"

	@SwitchProperty({
		name: "Rat Killed Sound",
		description: "Alerts you with a sound when you kill a rat",
		subcategory: "Rats",
		category: "Miscellaneous"
	})
	ratSound = false

	@SwitchProperty({
		name: "Force Yourself",
		description: "Usually rat kill doesn't trigger if you're not close to it(15 blocks - X, Z and 5 blocks Y), when this is enabled it will trigger no matter how far you are, this could be helpful if you're sniping them from a long distance, but could also hurt you by triggering when someone else kills it, while you're minding your own bussiness",
		subcategory: "Rats",
		category: "Miscellaneous",
	})
	forceRat = false

	constructor() {
		this.initialize(this)
		this.addDependency("Sea Creature Text", "Sea Creature Alert")
		this.addDependency("Low Health Text", "Low Health Alert")
		this.addDependency("Rat Killed Text", "Rat Killed Alert")
		this.addDependency("Blow Gate Text", "Blow Gate Alert")
		this.addDependency("Bonzo's Mask Text", "Bonzo's Mask Alert")
		this.addDependency("Spirit Mask Text", "Spirit Mask Alert")
		this.addDependency("Phoenix Text", "Phoenix Alert")
		this.addDependency("Mimic Killed Text", "Mimic Killed Alert")
		this.addDependency("Mimic Killed Message", "Send Mimic Killed")
		this.addDependency("Prince Killed Text", "Prince Killed Alert")
		this.addDependency("Prince Killed Message", "Send Prince Killed")
		this.addDependency("Katana Ability Expired Sound", "Katana HUD")
		this.addDependency("Wished Text", "Wished Alert")
		this.addDependency("Wish Text", "Wish Alert")
		this.addDependency("Crystal Picked Up Text", "Crystal Picked Up Alert")
		this.addDependency("Crystal Placed Text", "Crystal Placed Alert")
		this.addDependency("Leap Announce", "Leap Overlay")
		this.addDependency("Leap Keybinds", "Leap Overlay")
		this.addDependency("Outbounds Tick Timer", "Tick Timers")
		this.addDependency("Secret Tick Timer", "Tick Timers")
		this.addDependency("Use Ticks", "Tick Timers")
		this.addDependency("Remove Label", "Tick Timers")
		this.addDependency("Send Split Times", "Splits")
		this.addDependency("Bat Text", "Bat Alert")
		this.addDependency("Auto Party Finder Message Delay", "Auto Party Finder Message")
		this.addDependency("Auto Party Finder Message Message", "Auto Party Finder Message")
	}
}

export default new Settings()
