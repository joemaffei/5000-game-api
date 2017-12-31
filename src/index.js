const readlineSync = require('readline-sync');
const rollDice = require('./rollDice');
const { countRolled, countHeld } = require('./count');

var state;

function handleQuit() {
  process.exit();
}

function clearConsole() {
  process.stdout.write("\033c");
}

function handleRoll() {

  var activePlayer = state.players[state.activePlayer];

  activePlayer.dice.stashScore += activePlayer.dice.heldScore;
  activePlayer.dice.stash = activePlayer.dice.stash.concat(activePlayer.dice.held);

  if (activePlayer.dice.stash.length === 6) activePlayer.dice.stash = [];

  var numberOfDiceToRollNext = activePlayer.dice.stash.length === 6 ? 6 : 6 - activePlayer.dice.stash.length;

  var roll = rollDice(numberOfDiceToRollNext);
  var score = countRolled(roll);
  activePlayer.dice.rolled = roll.dice;
  activePlayer.dice.held = [];

  clearConsole();
  showCurrentState();

  if (activePlayer.dice.rolledScore === 0) {
    var key = readlineSync.keyIn('BAD ROLL! Press any key.');
    if (key === 'q') {
      handleQuit();
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

  if (activePlayer.score >= 5000) {
    console.log(`${activePlayer.name} wins!`);
    handleQuit();
  }
  else {
    state.activePlayer = +!state.activePlayer;
    handleRoll();
  }
}

function displayInfo() {
  clearConsole();
  showCurrentState();
  waitForKey();
}

function showCurrentState() {
  console.log(JSON.stringify(state.players[0], (key, value) => {
    return Array.isArray(value) ? JSON.stringify(value) : value
  }, 2));
  console.log(JSON.stringify(state.players[1], (key, value) => {
    return Array.isArray(value) ? JSON.stringify(value) : value
  }, 2));
}

function waitForKey() {
  var key = readlineSync.keyIn('[R]oll [D]one [Q]uit', { limit: 'rdq123456!@#$%^' });
  var activePlayer = state.players[state.activePlayer];
  var diceRolled = activePlayer.dice.rolled;
  var diceHeld = activePlayer.dice.held;
  
  const unshifted = {
    '!': 1,
    '@': 2,
    '#': 3,
    '$': 4,
    '%': 5,
    '^': 6
  }  
  
  switch (key) {
    case 'q':
      handleQuit();
      break;
    case 'r':
      handleRoll();
      break;
    case 'd':
      handleDone();
      break;
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
      moveDie(key, diceRolled, diceHeld);
      displayInfo();
      break;
    case '!':
    case '@':
    case '#':
    case '$':
    case '%':
    case '^':
      dropDie(unshifted[key], diceHeld, diceRolled);
      displayInfo();
      break;
    default:
      waitForKey();
  }
  
}

function moveDie(die, diceFrom, diceTo) {
  die = +die;
  if (isNaN(die) || die < 1 || die > 6) return;

  if (diceFrom.includes(die)) {
    diceTo.push(diceFrom.splice(diceFrom.indexOf(die), 1)[0]);
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
  handleRoll();
}

initGame();