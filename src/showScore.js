module.exports = function showScore(player, state) {
  console.log(`Player${player}: ${state.players[player].score}`)
}