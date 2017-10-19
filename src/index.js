const _ = require('lodash')
const readlineSync = require('readline-sync')

var state

var showScore = require('./showScore')
var showInstructions = require('./showInstructions')
var handleCtrlC = require('./handleCtrlC')
var rollDice = require('./rollDice')
var countPoints = require('./countPoints')

function handleRoll() {
  var roll = rollDice(6)
  var score = countPoints(roll)
  state.players[0].dice.rolled = roll.dice
  state.players[0].dice.held = []
  displayInfo()
}

function displayInfo() {
  showCurrentState()
  showInstructions()
  waitForKey()
}

function showCurrentState() {
  console.log(JSON.stringify(state.players[0], (key, value) => {
    return Array.isArray(value) ? JSON.stringify(value) : value
  }, 2))
}

function waitForKey() {

  var ignoreKey = key => {
    //console.log(JSON.stringify(key))
    waitForKey()
  }

  var key = readlineSync.keyIn('[R]oll or [P]ass?', {limit:'rp123456'})
    switch (key) {
      case 'r':
        handleRoll()
        break;
      case 'p':
        handleCtrlC()
        break;
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
        // if (key.alt) {
        //   dropDie(key)
        // } else {
          holdDie(key)
        // }
        displayInfo()
        break
      default:
        ignoreKey(key)
    }
  // })

}

function holdDie(die) {
  die = +die
  if (isNaN(die) || die < 1 || die > 6) return

  var diceRolled = state.players[0].dice.rolled
  var diceHeld = state.players[0].dice.held

  if (_.includes(diceRolled, die)) {
    diceHeld.push(diceRolled.splice(diceRolled.indexOf(die), 1)[0])
  }
}

function dropDie(die) {
  die = +die
  if (isNaN(die) || die < 1 || die > 6) return

  var diceRolled = state.players[0].dice.rolled
  var diceHeld = state.players[0].dice.held

  if (_.includes(diceRolled, die)) {
    diceRolled.push(diceHeld.splice(diceHeld.indexOf(die), 1)[0])
  }
}

function initGame() {
  state = {
    players: [{
      score: 0,
      dice: {
        rolled: [],
        get rolledScore() {
          return countPoints(this.rolled)
        },
        held: [],
        get heldScore() {
          return countPoints(this.held)
        }
      }
    }]
  }

  process.stdout.write('\033c')

  console.log(`Let's play 5000!`)
  console.log('================')
  console.log('')

  displayInfo()

}

initGame()