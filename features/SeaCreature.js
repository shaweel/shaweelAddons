import Settings from "../config.js"
import utils from "../utils.js"

const scaSound = new Sound({source: "shaweeladdons.seaCreature.ogg"})
const messages = ['A Squid appeared.', "Your Chumcap Bucket trembles, it's an Agarimoo.", 'You caught a Sea Walker.', 'Pitch darkness reveals a Night Squid.',
     'You stumbled upon a Sea Guardian.', "It looks like you've disrupted the Sea Witch's brewing session. Watch out, she's furious!",
     'You reeled in a Sea Archer.', 'The Rider of the Deep has emerged.', 'Huh? A Catfish!', "Is this even a fish? It's the Carrot King!",
     'Gross! A Sea Leech!', "You've discovered a Guardian Defender of the sea.", 'You have awoken the Deep Sea Protector, prepare for a battle!',
     'The Water Hydra has come to test your strength.', 'The Sea Emperor arises from the depths.', 'An Oasis Rabbit appears from the water.',
     'An Oasis Sheep appears from the water.', 'A Water Worm surfaces!', 'A Poisoned Water Worm surfaces!', 'An Abyssal Miner breaks out of the water!', 
     "Phew! It's only a Scarecrow.", 'You hear trotting from beneath the waves, you caught a Nightmare.', 'It must be a full moon, a Werewolf appears.',
     'The spirit of a long lost Phantom Fisher has come to haunt you.', "This can't be! The manifestation of death himself!", 
     'Frozen Steve fell into the pond long ago, never to resurface...until now!', "It's a snowman! He looks harmless.", 
     "The Grinch stole Jerry's Gifts...get them back!", 'What is this creature!?', 'You found a forgotten Nutcracker laying beneath the ice.', 
     'A Reindrake forms from the depths.', "A tiny fin emerges from the water, you've caught a Nurse Shark.", 
     "You spot a fin as blue as the water it came from, it's a Blue Shark.", 'A striped beast bounds from the depths, the wild Tiger Shark!', 
     'Hide no longer, a Great White Shark has tracked your scent and thirsts for your blood!', 'From beneath the lava appears a Magma Slug.', 
     'You hear a faint Moo from the lava... A Moogma appears.', 'Smells of burning. Must be a Fried Chicken.', 'A small but fearsome Lava Leech emerges.', 
     'You feel the heat radiating as a Pyroclastic Worm surfaces.', 'A Lava Flame flies out from beneath the lava.', 'A Fire Eel slithers out from the depths.', 
     'Taurus and his steed emerge.', 'WOAH! A Plhlegblast appeared.', 'You hear a massive rumble as Thunder emerges.', 
     'You have angered a legendary creature... Lord Jawbus has arrived.', 'A Flaming Worm surfaces from the depths!', 
     'A Lava Blaze has surfaced from the depths!', 'The Trash Gobbler is hungry for you!', 'A Dumpster Diver has emerged from the swamp!', 
     'The desolate wail of a Banshee breaks the silence.', 'A swampy mass of slime emerges, the Bayou Sludge!', 
     "A long snout breaks the surface of the water. It's an Alligator!", "A massive Titanoboa surfaces. It's body stretches as far as the eye can see.", 
     'A Lava Pigman arose from the depths!', "You've hooked a Bogged!", 'Look! A Wetwing emerges!', 'A gang of Liltads!', 
     "You've hooked an Ent, as ancient as the forest itself.", 'The Loch Emperor arises from the depths.']

register("chat", (message) => {
    if (!messages.includes(message)) return
    if (Settings.sctitle) {
        utils.debugLog("Showing sea creature title")
        Client.showTitle(Settings.sctext, "", "5", "20", "5")
    }

    if (Settings.scsound) {
        utils.debugLog("Playing sea creature sound")
        scaSound.play()
    }
}).setCriteria("${message}")