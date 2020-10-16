const { readFile } = require("torpor")

module.exports = readFile("./state.json", "utf8")
