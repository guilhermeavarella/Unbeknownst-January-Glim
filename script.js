const adjLen = 28479
const advLen = 6276
const nounLen = 141596
const nounLen2 = 90963 
const verbLen = 9759
const determinerLen = 4


async function readCSV(fileName, line) {
    const response = await fetch(`./data/${fileName}.csv`)
    const text = await response.text()

    const lines = text.trim().split("\n")

    return lines[line]?.trim()
}

function hashSeed(str) {
    var hash = 0
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i)
        hash = ((hash << 6) - hash) + char
        hash = hash & hash
    }

    return Math.abs(hash)
}

async function buildPhrase(input) {
    const seed = hashSeed(input)

    const adjective = await readCSV("adjectives", seed % adjLen)
    const noun1 = await readCSV("nouns", seed % nounLen)
    const noun2 = await readCSV("plural-nouns", (seed * seed) % nounLen2)
    const verb = await readCSV("verbs", seed % verbLen)
    const adverb = await readCSV("adverbs", seed % advLen)
    const determiner = await readCSV("determiner", seed % determinerLen)

    return `${determiner} ${adjective} ${noun1} ${verb} the ${noun2} ${adverb}.`
}

const input = document.getElementById("input")
const output = document.getElementById("output")
const post = document.getElementById("post")

input.addEventListener("input", async () => {
    if (!input.value) {
        output.innerHTML = "‎"
        post.innerText = "‎"
        return
    }
    output.innerHTML = await buildPhrase(input.value)
    post.innerText = "Do you agree?"
})