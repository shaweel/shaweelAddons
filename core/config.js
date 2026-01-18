import {@Vigilant, @SwitchProperty, @TextProperty, @ButtonProperty, @SelectorProperty} from "Vigilance"

const intDataType = Java.type("java.lang.Integer")

@Vigilant("shaweelAddons/config", "shaweelAddons-ctjs-1.3.14", {
	getCategoryComparator: () => (a, b) => {
		const categories = ["General", "Dungeons", "Slayers", "Fishing", "Trackers", "Miscellaneous"]
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
		name: "Low Health Sound",
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
	bonzoText = "&cBonzo's Mask Popped!"

	@SwitchProperty({
		name: "Send Bonzo's Mask",
		description: "Sends a chat message when your Bonzo's Mask pops",
		subcategory: "Extra Life Items",
		category: "Dungeons"
	})
	bonzoAnnounce = false

	@TextProperty({
		name: "Bonzo's Mask Message",
		description: "The chat message you send when your Bonzo's Mask pops",
		subcategory: "Extra Life Items",
		category: "Dungeons"
	})
	bonzoMessage = "Bonzo's Mask Popped!"

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
		name: "Send Spirit Mask",
		description: "Sends a chat message when your Spirit Mask pops",
		subcategory: "Extra Life Items",
		category: "Dungeons"
	})
	spiritAnnounce = false

	@TextProperty({
		name: "Spirit Mask Message",
		description: "The chat message you send when your Spirit Mask pops",
		subcategory: "Extra Life Items",
		category: "Dungeons"
	})
	spiritMessage = "Spirit Mask Popped!"

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

@	SwitchProperty({
		name: "Send Phoenix",
		description: "Sends a chat message when your Phoenix dies",
		subcategory: "Extra Life Items",
		category: "Dungeons"
	})
	phoenixAnnounce = false

	@TextProperty({
		name: "Phoenix Message",
		description: "The chat message you send when your Phoenix dies",
		subcategory: "Extra Life Items",
		category: "Dungeons"
	})
	phoenixMessage = "Phoenix Died!"

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
		name: "Compact Maxor",
		description: "An objectively better Maxor title system",
		category: "Dungeons",
		subcategory: "Floor 7"
	})
	compactMaxor = false



	@SwitchProperty({
		name: "Compact Storm",
		description: "An objectively better Storm title system",
		category: "Dungeons",
		subcategory: "Floor 7"
	})
	compactStorm = false



	@SwitchProperty({
		name: "Compact Terminals",
		description: "An objectively better terminals title system",
		category: "Dungeons",
		subcategory: "Floor 7"
	})
	compactTerms = false

	@SwitchProperty({
		name: "Show Names",
		description: "Show player names in Compact Terminals",
		category: "Dungeons",
		subcategory: "Floor 7"
	})
	showNames = false

	@SwitchProperty({
		name: "Show Classes",
		description: "Show player's classes in Compact Terminals",
		category: "Dungeons",
		subcategory: "Floor 7"
	})
	showClasses = false




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
	splits = false

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




	//Padding
	@SwitchProperty({
		name: "Purple Pad Alert",
		description: "Alerts you with titles exactly when you need to enter and exit Purple Pad when doing py",
		subcategory: "Padding",
		category: "Dungeons"
	})
	purplePadTitle = false

	@SwitchProperty({
		name: "Purple Pad Sound",
		description: "Alerts you with sounds exactly when you need to enter and exit Purple Pad when doing py",
		subcategory: "Padding",
		category: "Dungeons"
	})
	purplePadSound = false

	@SwitchProperty({
		name: "Purple Pad Healer",
		description: "Makes Purple Pad Alert and Purple Pad Sound work while playing Healer",
		subcategory: "Padding",
		category: "Dungeons"
	})
	purplePadHealer = false

	@SwitchProperty({
		name: "Purple Pad Mage",
		description: "Makes Purple Pad Alert and Purple Pad Sound work while playing Mage",
		subcategory: "Padding",
		category: "Dungeons"
	})
	purplePadMage = false

	@SwitchProperty({
		name: "Purple Pad Berserk",
		description: "Makes Purple Pad Alert and Purple Pad Sound work while playing Berserk",
		subcategory: "Padding",
		category: "Dungeons"
	})
	purplePadBerserk = false

	@SwitchProperty({
		name: "Purple Pad Archer",
		description: "Makes Purple Pad Alert and Purple Pad Sound work while playing Archer",
		subcategory: "Padding",
		category: "Dungeons"
	})
	purplePadArcher = false

	@SwitchProperty({
		name: "Purple Pad Tank",
		description: "Makes Purple Pad Alert and Purple Pad Sound work while playing Tank",
		subcategory: "Padding",
		category: "Dungeons"
	})
	purplePadTank = false



	@SwitchProperty({
		name: "Yellow Pad Alert",
		description: "Alerts you with titles exactly when you need to enter Yellow Pad when doing py",
		subcategory: "Padding",
		category: "Dungeons"
	})
	yellowPadTitle = false

	@SwitchProperty({
		name: "Yellow Pad Sound",
		description: "Alerts you with sounds exactly when you need to enter Yellow Pad when doing py",
		subcategory: "Padding",
		category: "Dungeons"
	})
	yellowPadSound = false

	@SwitchProperty({
		name: "Yellow Pad Healer",
		description: "Makes Yellow Pad Alert and Yellow Pad Sound work while playing Healer",
		subcategory: "Padding",
		category: "Dungeons"
	})
	yellowPadHealer = false

	@SwitchProperty({
		name: "Yellow Pad Mage",
		description: "Makes Yellow Pad Alert and Yellow Pad Sound work while playing Mage",
		subcategory: "Padding",
		category: "Dungeons"
	})
	yellowPadMage = false

	@SwitchProperty({
		name: "Yellow Pad Berserk",
		description: "Makes Yellow Pad Alert and Yellow Pad Sound work while playing Berserk",
		subcategory: "Padding",
		category: "Dungeons"
	})
	yellowPadBerserk = false

	@SwitchProperty({
		name: "Yellow Pad Archer",
		description: "Makes Yellow Pad Alert and Yellow Pad Sound work while playing Archer",
		subcategory: "Padding",
		category: "Dungeons"
	})
	yellowPadArcher = false

	@SwitchProperty({
		name: "Yellow Pad Tank",
		description: "Makes Yellow Pad Alert and Yellow Pad Sound work while playing Tank",
		subcategory: "Padding",
		category: "Dungeons"
	})
	yellowPadTank = false



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

	@SelectorProperty({
		name: "Tick Timers Time Unit",
		description: "The time unit to use in Tick Timers",
		options: ["Seconds", "Miliseconds", "Ticks"],
		subcategory: "Tick Timers",
		category: "Dungeons"
	})
	tickTimerTimeUnit = new intDataType(0)

	@SwitchProperty({
		name: "Show Label",
		description: "Whether to show the label saying which Tick Timer it is or not",
		subcategory: "Tick Timers",
		category: "Dungeons"
	})
	showLabel = true

	@SwitchProperty({
		name: "Show Time Unit",
		description: "Whether to show the time unit in Tick Timers",
		subcategory: "Tick Timers",
		category: "Dungeons"
	})
	showUnitTickTimer = true




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
	//Boss and Miniboss Spawn Alert
	@SwitchProperty({
		name: "Boss Spawn Alert",
		description: "Alerts you with a title when your boss starts spawning",
		subcategory: "Boss and Miniboss Spawn Alert",
		category: "Slayers"
	})
	bossSpawnAlert = false

	@TextProperty({
		name: "Boss Spawn Text",
		description: "The text of the title that alerts you when your boss starts spawning",
		subcategory: "Boss and Miniboss Spawn Alert",
		category: "Slayers"
	})
	bossSpawnText = "&cBoss Spawning!"

	@SwitchProperty({
		name: "Boss Spawn Sound",
		description: "Alerts you with a sound when your boss starts spawning",
		subcategory: "Boss and Miniboss Spawn Alert",
		category: "Slayers"
	})
	bossSpawnSound = false



	@SwitchProperty({
		name: "Miniboss Spawn Alert",
		description: "Alerts you with a title when your miniboss starts spawning",
		subcategory: "Boss and Miniboss Spawn Alert",
		category: "Slayers"
	})
	minibossSpawnAlert = false

	@TextProperty({
		name: "Miniboss Spawn Text",
		description: "The text of the title that alerts you when your miniboss starts spawning",
		subcategory: "Boss and Miniboss Spawn Alert",
		category: "Slayers"
	})
	minibossSpawnText = "&cMiniboss Spawning!"

	@SwitchProperty({
		name: "Miniboss Spawn Sound",
		description: "Alerts you with a sound when your miniboss starts spawning",
		subcategory: "Boss and Miniboss Spawn Alert",
		category: "Slayers"
	})
	minibossSpawnSound = false



	//Enderman Slayer
	@SwitchProperty({
		name: "Katana HUD",
		description: "When enabled there will be a HUD displaying whether the Enderman Slayer Katana's ability is currently enabled with a timer",
		category: "Slayers",
		subcategory: "Enderman Slayer"
	})
	katanaHud = false

	@SelectorProperty({
		name: "Katana Hud Time Unit",
		description: "The time unit to use in Tick Timers",
		options: ["Seconds", "Miliseconds", "Ticks"],
		subcategory: "Enderman Slayer",
		category: "Slayers"
	})
	katanaTimeUnit = new intDataType(0)

	@SwitchProperty({
		name: "Show Time Unit In Katana Hud",
		description: "Whether to show the time unit in the Katana Hud",
		subcategory: "Enderman Slayer",
		category: "Slayers"
	})
	showUnitKatana = true
	
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
		description: "Allows you to type stars in chat, for example <10star> will turn into ✪✪✪✪✪➎, there's more possible ways to type this syntax",
		category: "Miscellaneous",
		subcategory: "Miscellaneous"
	})
	stars = false



	@SwitchProperty({
		name: "Hide Action Bar",
		description: "Hides the action bar",
		category: "Miscellaneous",
		subcategory: "Miscellaneous"
	})
	hideActionBar = false




	//Russian Commands
	@SelectorProperty({
		name: "Russian Commands/Русские Команды",
		description: "Converts Russian Cyrillic letters to latin when sending commands/Изменяют русские кириллические буквы в латинские при отправке команды",
		subcategory: "Russian Commands/Русские Команды",
		category: "Miscellaneous",
		options: ["Off/Выключено", "ЙЦУКЕН", "ЯЖЕРТЫ", "ЯВЕРТЫ", "ЯШЕРТЫ"]
	})
	russianCommands = new intDataType(0)

	@SwitchProperty({
		name: "Ignore /msg/Iгнорировать /msg",
		description: "Ignore the second argument of the /msg command (the actual message) in Russian Commands/Игнорировать второй аргумент в команде /msg (само сообщение) в Русских Командах",
		subcategory: "Russian Commands/Русские Команды",
		category: "Miscellaneous"
	})
	ignoreMsg = true

	@SwitchProperty({
		name: "Ignore /pc, /cc, /ac, /gc, /oc/Iгнорировать /pc, /cc, /ac, /gc, /oc",
		description: "Ignore the only argument of the /pc, /cc, /ac, /gc and /oc commands (the actual message) in Russian Commands/Игнорировать второй аргумент в командах /pc, /cc, /ac, /gc и /oc (само сообщение) в Русских Командах",
		subcategory: "Russian Commands/Русские Команды",
		category: "Miscellaneous"
	})
	ignoreXc = true

	@SwitchProperty({
		name: "Sends command/Сказать команду",
		description: "Tells you the command the mod executes in chat/Сказать тебе команду, которую мод выполняет в чате",
		subcategory: "Russian Commands/Русские Команды",
		category: "Miscellaneous"
	})
	sendCommand = false



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
		this.addDependency("Boss Spawn Text", "Boss Spawn Alert")
		this.addDependency("Miniboss Spawn Text", "Miniboss Spawn Alert")
		this.addDependency("Rat Killed Text", "Rat Killed Alert")
		this.addDependency("Bonzo's Mask Text", "Bonzo's Mask Alert")
		this.addDependency("Bonzo's Mask Message", "Send Bonzo's Mask")
		this.addDependency("Spirit Mask Text", "Spirit Mask Alert")
		this.addDependency("Spirit Mask Message", "Send Spirit Mask")
		this.addDependency("Phoenix Text", "Phoenix Alert")
		this.addDependency("Phoenix Message", "Send Phoenix")
		this.addDependency("Mimic Killed Text", "Mimic Killed Alert")
		this.addDependency("Mimic Killed Message", "Send Mimic Killed")
		this.addDependency("Prince Killed Text", "Prince Killed Alert")
		this.addDependency("Prince Killed Message", "Send Prince Killed")
		this.addDependency("Show Time Unit In Katana Hud", "Katana HUD")
		this.addDependency("Katana Hud Time Unit", "Katana HUD")
		this.addDependency("Katana Ability Expired Sound", "Katana HUD")
		this.addDependency("Wished Text", "Wished Alert")
		this.addDependency("Wish Text", "Wish Alert")
		this.addDependency("Crystal Picked Up Text", "Crystal Picked Up Alert")
		this.addDependency("Crystal Placed Text", "Crystal Placed Alert")
		this.addDependency("Leap Announce", "Leap Overlay")
		this.addDependency("Leap Keybinds", "Leap Overlay")
		this.addDependency("Outbounds Tick Timer", "Tick Timers")
		this.addDependency("Secret Tick Timer", "Tick Timers")
		this.addDependency("Tick Timers Time Unit", "Tick Timers")
		this.addDependency("Show Label", "Tick Timers")
		this.addDependency("Show Time Unit", "Tick Timers")
		this.addDependency("Send Split Times", "Splits")
		this.addDependency("Bat Text", "Bat Alert")
		this.addDependency("Auto Party Finder Message Delay", "Auto Party Finder Message")
		this.addDependency("Auto Party Finder Message Message", "Auto Party Finder Message")
		this.addDependency("Show Names", "Compact Terminals")
		this.addDependency("Show Classes", "Compact Terminals")
	}
}

export default new Settings()
