import utils from "../../lib/Utils.js"
import Settings from "../../core/config.js"

const lowercaseCyrillicAlphabet = ["а","б","в","г","д","е","ё","ж","з","и","й","к","л","м","н","о","п","р","с","т","у","ф","х","ц","ч","ш","щ","ъ","ы","ь","э","ю","я"]
const ЯЖЕРТЫ = {
	"я": "q",  
	"ж": "w",  
	"е": "e",
	"р": "r",
	"т": "t",
	"ы": "y",
	"у": "u",
	"и": "i",
	"о": "o",
	"п": "p",
	"а": "a",
	"с": "s",
	"д": "d",
	"ф": "f",
	"г": "g",
	"ч": "h",  
	"й": "j",
	"к": "k",
	"л": "l",
	"з": "z",  
	"х": "x",
	"ц": "c",
	"в": "v",  
	"б": "b",
	"н": "n",
	"м": "m",
	"Я": "Q",
	"Ж": "W",
	"Е": "E",
	"Р": "R",
	"Т": "T",
	"Ы": "Y",
	"У": "U",
	"И": "I",
	"О": "O",
	"П": "P",
	"А": "A",
	"С": "S",
	"Д": "D",
	"Ф": "F",
	"Г": "G",
	"Ч": "H",
	"Й": "J",
	"К": "K",
	"Л": "L",
	"З": "Z",
	"Х": "X",
	"Ц": "C",
	"В": "V",
	"Б": "B",
	"Н": "N",
	"М": "M",
	"ш": "[",
	"щ": "]",
	"Ш": "{",
	"Щ": "}",
	"ъ": "%",
	"Ъ": "^",
	"ё": "#",
	"Ё": "$",
	"э": "\\",
	"Э": "|",
	"ю": "`",
	"Ю": "~",
	"ь": "=",
	"Ь": "+"
}

const ЯШЕРТЫ = {
	"я": "q",
	"ш": "w",
	"е": "e",
	"р": "r",
	"т": "t",
	"ы": "y",
	"у": "u",
	"и": "i",
	"о": "o",
	"п": "p",
	"а": "a",
	"с": "s",
	"д": "d",
	"ф": "f",
	"г": "g",
	"х": "h",
	"й": "j",
	"к": "k",
	"л": "l",
	"з": "z",
	"ж": "x",
	"ц": "c",
	"в": "v",
	"б": "b",
	"н": "n",
	"м": "m",
	"Я": "Q",
	"Ш": "W",
	"Е": "E",
	"Р": "R",
	"Т": "T",
	"Ы": "Y",
	"У": "U",
	"И": "I",
	"О": "O",
	"П": "P",
	"А": "A",
	"С": "S",
	"Д": "D",
	"Ф": "F",
	"Г": "G",
	"Х": "H",
	"Й": "J",
	"К": "K",
	"Л": "L",
	"З": "Z",
	"Ж": "X",
	"Ц": "C",
	"В": "V",
	"Б": "B",
	"Н": "N",
	"М": "M",
	":": "^",
	"№": "#",
	";": "$",
	"/": "|",
	"ъ": "`",
	"Ъ": "~"
}

const ЙЦУКЕН = {
	"й": "q",
	"ц": "w",
	"у": "e",
	"к": "r",
	"е": "t",
	"н": "y",
	"г": "u",
	"ш": "i",
	"щ": "o",
	"з": "p",
	"х": "[",
	"ъ": "]",
	"ф": "a",
	"ы": "s",
	"в": "d",
	"а": "f",
	"п": "g",
	"р": "h",
	"о": "j",
	"л": "k",
	"д": "l",
	"ж": ";",
	"э": "'",
	"я": "z",
	"ч": "x",
	"с": "c",
	"м": "v",
	"и": "b",
	"т": "n",
	"ь": "m",
	"б": ",",
	"ю": ".",
	"ё": "`",
	"Й": "Q",
	"Ц": "W",
	"У": "E",
	"К": "R",
	"Е": "T",
	"Н": "Y",
	"Г": "U",
	"Ш": "I",
	"Щ": "O",
	"З": "P",
	"Х": "{",
	"Ъ": "}",
	"Ф": "A",
	"Ы": "S",
	"В": "D",
	"А": "F",
	"П": "G",
	"Р": "H",
	"О": "J",
	"Л": "K",
	"Д": "L",
	"Ж": ":",
	"Э": "\"",
	"Я": "Z",
	"Ч": "X",
	"С": "C",
	"М": "V",
	"И": "B",
	"Т": "N",
	"Ь": "M",
	"Б": "<",
	"Ю": ">",
	"Ё": "~"
}

const ЯВЕРТЫ = {
	"ё": "`",
	"1": "1",
	"2": "2",
	"3": "3",
	"4": "4",
	"5": "5",
	"6": "6",
	"7": "7",
	"8": "8",
	"9": "9",
	"0": "0",
	"-": "-",
	"я": "q",
	"в": "v",
	"е": "e",
	"р": "r",
	"т": "t",
	"ы": "y",
	"у": "u",
	"и": "i",
	"о": "o",
	"п": "p",
	"ш": "s",
	"щ": "d",
	"а": "a",
	"с": "s",
	"д": "d",
	"ф": "f",
	"г": "g",
	"х": "h",
	"й": "j",
	"к": "k",
	"л": "l",
	"ц": "c",
	"ж": "x",
	"б": "b",
	"н": "n",
	"м": "m",
	"ю": ",",
	"э": "'",
	"ъ": "`",
	"ь": "/",
	"Ё": "~",
	"!": "!",
	"@": "@",
	"#": "#",
	"$": "$",
	"%": "%",
	"^": "^",
	"&": "&",
	"*": "*",
	"(": "(",
	")": ")",
	"_": "_",
	"Я": "Q",
	"В": "V",
	"Е": "E",
	"Р": "R",
	"Т": "T",
	"Ы": "Y",
	"У": "U",
	"И": "I",
	"О": "O",
	"П": "P",
	"Ш": "S",
	"Щ": "D",
	"А": "A",
	"С": "S",
	"Д": "D",
	"Ф": "F",
	"Г": "G",
	"Х": "H",
	"Й": "J",
	"К": "K",
	"Л": "L",
	"Ц": "C",
	"Ж": "X",
	"Б": "B",
	"Н": "N",
	"М": "M",
	"Ю": "<",
	"Э": "\"",
	"Ъ": "~",
	"Ь": "?"
}

let sending = false
let sentRecently = false
register("messageSent", (msg, event) => {
	if (sending) {
		sending = false
		return
	}
	if (Settings.russianCommands == 0 || !msg.startsWith("/")) return
	let includesCyrillic = false
	for (let letter of lowercaseCyrillicAlphabet) {
		if (!msg.toLowerCase().includes(letter)) continue
		includesCyrillic = true
		break
	}
	if (!includesCyrillic) return
	let newMsg = msg
	if (Settings.russianCommands == 1) {
		for (let letter in ЙЦКУЕН) {
			newMsg = newMsg.replaceAll(letter, ЙЦКУЕН[letter])
		}
	} else if (Settings.russianCommands == 2) {
		for (let letter in ЯЖЕРТЫ) {
			newMsg = newMsg.replaceAll(letter, ЯЖЕРТЫ[letter])
		}
	} else if (Settings.russianCommands == 3) {
		for (let letter in ЯВЕРТЫ) {
			newMsg = newMsg.replaceAll(letter, ЯВЕРТЫ[letter])
		}
	} else if (Settings.russianCommands == 4) {
		for (let letter in ЯШЕРТЫ) {
			newMsg = newMsg.replaceAll(letter, ЯШЕРТЫ[letter])
		}
	}

	if (newMsg.startsWith("/msg") && Settings.ignoreMsg) {
		let tempMsg = newMsg.split(" ")
		newMsg = [tempMsg[0], tempMsg[1], ...msg.split(" ").slice(2)].join(" ")
	}
	if (Settings.ignoreXc && (
		newMsg.startsWith("/pc") ||
		newMsg.startsWith("/ac") ||
		newMsg.startsWith("/cc") ||
		newMsg.startsWith("/gc") ||
		newMsg.startsWith("/oc")
	)) {
		let tempMsg = newMsg.split(" ")
		newMsg = [tempMsg[0], ...msg.split(" ").slice(1)].join(" ")
	}

	event.setCanceled(true)
	sending = true
	sentRecently = true
	utils.clientSchedule(1000, () => sentRecently = false)
	if (Settings.sendCommand) utils.chatLog("Executed command/Выполненная команда: "+newMsg)
	ChatLib.command(newMsg.replace("/", ""), false)
	ChatLib.command(newMsg.replace("/", ""), true)
})

register("chat", (msg, event) => {
	msg = ChatLib.removeFormatting(msg)
	if (!msg.startsWith('Unknown command. Type "/help" for help. ') || !sentRecently) return
	event.setCanceled(true)
}).setCriteria("${msg}")