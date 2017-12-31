const _ = require('lodash')
const readlineSync = require('readline-sync')

var state

const showScore = require('./showScore')
const showInstructions = require('./showInstructions')
const handleCtrlC = require('./handleCtrlC')
const rollDice = require('./rollDice')
const { countRolled, countHeld } = require('./count')

function handleRoll() {

  var activePlayer = state.players[state.activePlayer];

  activePlayer.dice.stashScore += activePlayer.dice.heldScore;
  activePlayer.dice.stash = activePlayer.dice.stash.concat(activePlayer.dice.held);

  if (activePlayer.dice.stash.length === 6) activePlayer.dice.stash = [];

  var numberOfDiceToRollNext = activePlayer.dice.stash.length === 6 ? 6 : 6 - activePlayer.dice.stash.length;

  var roll = rollDice(numberOfDiceToRollNext)
  var score = countRolled(roll)
  activePlayer.dice.rolled = roll.dice
  activePlayer.dice.held = []

  process.stdout.write('\033c')
  showCurrentState()

  if (activePlayer.dice.rolledScore === 0) {
    var key = readlineSync.keyIn('BAD ROLL! Press any key.');
    if (key === 'q') {
      process.exit();
    }
    else {
      activePlayer.dice.stashScore = 0;
      activePlayer.dice.heldScore = 0;
      handleDone();
    }
  }
  else {
    waitForKey();
  }
}

function handleDone() {

  var activePlayer = state.players[state.activePlayer];

  activePlayer.score += activePlayer.dice.heldScore + activePlayer.dice.stashScore;
  activePlayer.dice.rolled = [];
  activePlayer.dice.held = [];
  activePlayer.dice.stash = [];
  activePlayer.dice.stashScore = 0;

  state.activePlayer = +!state.activePlayer;
    
  handleRoll();

}

function displayInfo() {
  process.stdout.write('\033c')
  showCurrentState()
  waitForKey()
}

function showCurrentState() {
  console.log(JSON.stringify(state.players[0], (key, value) => {
    return Array.isArray(value) ? JSON.stringify(value) : value
  }, 2))
  console.log(JSON.stringify(state.players[1], (key, value) => {
    return Array.isArray(value) ? JSON.stringify(value) : value
  }, 2))
}

function waitForKey() {

  var ignoreKey = key => {
    waitForKey()
  }

  var key = readlineSync.keyIn('[R]oll [D]one [Q]uit', { limit: 'rdq123456!@#$%^' })
  
  const shifted = {
    '!': 1,
    '@': 2,
    '#': 3,
    '$': 4,
    '%': 5,
    '^': 6
  }
  
  switch (key) {
    case 'q':
      handleCtrlC()
      break;
    case 'r':
      handleRoll()
      break;
    case 'd':
      handleDone()
      break;
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
      holdDie(key);
      displayInfo();
      break;
    case '!':
    case '@':
    case '#':
    case '$':
    case '%':
    case '^':
      dropDie(shifted[key]);
      displayInfo();
      break;
    default:
      ignoreKey(key);
  }
  
}

function holdDie(die) {
  die = +die
  if (isNaN(die) || die < 1 || die > 6) return

  var diceRolled = state.players[state.activePlayer].dice.rolled
  var diceHeld = state.players[state.activePlayer].dice.held

  if (_.includes(diceRolled, die)) {
    diceHeld.push(diceRolled.splice(diceRolled.indexOf(die), 1)[0])
  }
}

function dropDie(die) {
  die = +die
  if (isNaN(die) || die < 1 || die > 6) return

  var diceRolled = state.players[state.activePlayer].dice.rolled
  var diceHeld = state.players[state.activePlayer].dice.held

  if (_.includes(diceHeld, die)) {
    diceRolled.push(diceHeld.splice(diceHeld.indexOf(die), 1)[0])
  }
}

function Player(name) {
  this.name = name || '';
  this.score = 0;
  this.dice = {
    rolled: [],
    get rolledScore() {
      return countRolled(this.rolled)
    },
    held: [],
    get heldScore() {
      return countHeld(this.held)
    },
    stash: [],
    stashScore: 0
  }
}

function initGame() {
  state = {
    activePlayer: 0,
    players: [
      new Player('Carlos'),
      new Player('Deb')
    ]
  }

  handleRoll()

}

initGame()