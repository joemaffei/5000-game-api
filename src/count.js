const _ = require('lodash')

function yahtzee(dice) {
  return dice.length === 6 && _.uniq(dice).length === 1
}

function sequence(dice) {
  return _.uniq(dice).length === 6
}

function threePairs(dice) {
  var diceCounts = _.countBy(dice)
  var values = _.values(diceCounts)
  var threeDifferentPairs = dice.length === 6 && values.length === 3 && _.isEqual(values, [2, 2, 2])
  var twoAndFourFullHouse = dice.length === 6 && values.length === 2 && _.isEqual(values.sort(), [2, 4])
  return threeDifferentPairs || twoAndFourFullHouse
}

function noTriplets(dice) {
  var hashMap = _.countBy(dice)
  var filler = function (n) { return Array(hashMap[n] % 3).fill(+n) }
  return _.flatten(_.keys(hashMap).map(filler))
}

function tripletScore(dice) {
  var diceCounts = _.countBy(dice)
  var countsAsPairs = _.toPairs(diceCounts)
  var filterTriplets = countsAsPairs.filter(group => group[1] / 3 >= 1)
  var keys = filterTriplets.map(arr => arr[0])
  return keys.reduce((acc, x) => (acc += x == 1 ? x * 1000 : x * 100), 0)
}

function countRemainingOnesAndFives(dice) {
  var hashMap = _.countBy(noTriplets(dice))
  return ~~hashMap[1] * 100 + ~~hashMap[5] * 50
}

function countRolled(dice) {
  if (yahtzee(dice)) return 5000
  if (sequence(dice)) return 2000
  if (threePairs(dice)) return 1200
  return tripletScore(dice) + countRemainingOnesAndFives(dice)
}

function noOnesOrFives(dice) {
  return _.pullAll(dice, [1, 5]);
}

function countHeld(dice) {
  if (yahtzee(dice)) return 5000
  if (sequence(dice)) return 2000
  if (threePairs(dice)) return 1200
  if (!noOnesOrFives(noTriplets(dice)).length) return tripletScore(dice) + countRemainingOnesAndFives(dice)
  return 0
}


module.exports = {
  countRolled,
  countHeld
}