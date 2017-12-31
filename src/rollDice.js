const { countRolled } = require('./count')

function rollDie(sides) {
  return 1 + Math.floor(Math.random() * (sides || 6))
}

module.exports = function rollDice(num) {
  const dice = Array(num || 6).fill().map(rollDie)
  return {
    dice: dice,
    score: countRolled(dice)
  }
}