export class Turn {
  constructor() {
    this.score = 0
    this.dice = []
  }
}

export class Game {
  constructor() {
    this.players = []
    this.currentTurn = {
      playerIndex: 0,
      rolled: new Turn(),
      held: new Turn(),
    }
    this.turnHistory = []
  }
}

export class Player {
  constructor() {
    this.name = ''
    this.gameHistory = []
  }
}

export class GamePlayer {
  constructor() {
    this.name = ''
    this.score = 0
  }
}