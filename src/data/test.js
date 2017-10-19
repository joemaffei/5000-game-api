import api from './api'
import { Game } from './schemas'

// api.player.create({ name: 'Joe' })
// api.player.read(playerId).then(console.log)

// var newGame = new Game()
// api.game.create(newGame)

var playerId = '-KwmVDHzBvYuD1Z-HGJA'
// var playerId = 'fakeId'

var gameId = '-Kwm_ZPhPM1Z-Oo1aCVs'
// var gameId = 'fakeId'

api.game.addPlayer(gameId, playerId).then(console.log)