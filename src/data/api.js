import crudify from './crudify'
import { Game, Player } from './schemas'
import merge from 'deepmerge'


const api = {
  player: crudify('players'),
  game: crudify('games')
}

api.game.addPlayer = async (gameId, playerId) => {

  let gameData = await api.game.read(gameId)
  let playerData = await api.player.read(playerId)

  // validate ids
  let gameDoesntExist = gameData === null
  let playerDoesntExist = playerData === null

  if (gameDoesntExist) return {
    error: `Game not found.`,
    gameId
  }
  if (playerDoesntExist) return {
    error: `Player not found.`,
    playerId
  }

  // check if player is already in the game
  if (gameData.players) {
    let playerIsAlreadyPlaying = gameData.players.filter(player => player.playerId === playerId).length
    if (playerIsAlreadyPlaying) return {
      error: `Player is already playing this game.`,
      playerId,
      gameId
    }
  }

  let gameSchema = new Game()
  let playerSchema = new Player()

  let game = merge(gameSchema, gameData)
  let player = { playerId, name: playerData.name }

  game.players.push(player)

  await api.game.update(gameId, game)

  return {
    success: `Player added to game`,
    playerId,
    gameId
  }

}


export default api