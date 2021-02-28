import fs from 'fs';

const WORLD_ID = '1022';

/*   The parser works breaking the input into tokens (strings with no spaces), then starts
 *  iterating through the tokens and consuming then, reading it's value to handle what should
 *  be added to the gameInfo object;
 */
class GameLogParser {
  constructor(log) {
    this.log = log;

    this.logTokenized = [];
    this.tokenIndex = 0;

    // Contains the raw information of every game
    this.games = [];

    this.parse();
    const handledGames = this.userIdsToUsernames();
    GameLogParser.saveJSON(handledGames);
  }

  currentToken() {
    return this.logTokenized[this.tokenIndex];
  }

  currentGameInfo() {
    return this.games[this.games.length - 1];
  }

  parse() {
    this.logTokenized = GameLogParser.tokenize(this.log);

    while (this.tokenIndex < this.logTokenized.length) {
      this.consumeToken();
    }
  }

  // Transforms users IDs to usernames in the game information array
  userIdsToUsernames() {
    return this.games.map((game, gameIndex) => ({
      [`game_${gameIndex}`]: {
        ...game,
        players: Object.values(game.players),
        kills: Object.entries(game.kills).reduce((kills, [userID, userKills]) => (
          { ...kills, [game.players[userID]]: userKills }
        ), {}),
      },
    }
    ));
  }

  static saveJSON(handledGames) {
    fs.writeFile('games.json', JSON.stringify(handledGames, null, 2), (err) => {
      if (err) throw err;
      console.log('Game information saved.');
    });
  }

  static tokenize(inputString) {
    return inputString.split(' ');
  }

  // Handles and consumes current token
  consumeToken() {
    switch (this.currentToken()) {
      case 'InitGame:': {
        this.consumeInitGameToken();
        break;
      }
      case 'ClientUserinfoChanged:': {
        this.consumeUserInfoToken();
        break;
      }
      case 'Kill:': {
        this.consumeKillToken();
        break;
      }
      default: this.tokenIndex += 1;
    }
  }

  // Consumes tokens until finds endToken
  consumeTokensUntil(endToken) {
    const consumedTokens = [];
    while (this.currentToken() !== endToken) {
      if (this.currentToken() !== endToken) {
        consumedTokens.push(this.currentToken());
        this.tokenIndex += 1;
      }
    }
    return consumedTokens;
  }

  // Consumes tokens until token contains end
  consumeTokensUntilIncludes(end) {
    const consumedTokens = [];
    while (!this.currentToken().includes(end)) {
      consumedTokens.push(this.currentToken());
      this.tokenIndex += 1;
    }
    consumedTokens.push(this.currentToken());

    return consumedTokens;
  }

  // Consumes "Killed:"
  consumeKillToken() {
    this.tokenIndex += 1;
    const killerPlayerID = this.currentToken();

    this.tokenIndex += 1;
    const killedPlayerID = this.currentToken();

    // Adds to total_kills
    this.currentGameInfo().total_kills += 1;

    if (killerPlayerID === WORLD_ID) {
      // If not killed by a player, subtract 1 kill of killed
      this.currentGameInfo().kills[killedPlayerID] -= 1;
    } else {
      // If killed by a player, adds 1 kill to killer
      this.currentGameInfo().kills[killerPlayerID] += 1;
    }
  }

  // Consumes "InitGame:"
  consumeInitGameToken() {
    this.tokenIndex += 1;

    // Adds empty game information entry
    this.games.push({
      total_kills: 0,
      players: {},
      kills: {},
    });
  }

  // Consumes "ClientUserinfoChanged:"
  consumeUserInfoToken() {
    this.tokenIndex += 1;
    const playerID = this.currentToken();

    this.tokenIndex += 1;
    const playerInfo = this.consumeTokensUntilIncludes('\\t').join(' ');
    // Uses regex to get username
    const playerUsername = playerInfo.match(/n\\([^\\]*)\\t/)[1];

    this.currentGameInfo().players[playerID] = playerUsername;
    // Defaults player kill to 0 if don't already exists
    this.currentGameInfo().kills[playerID] = this.currentGameInfo().kills[playerID] || 0;
  }
}

export default GameLogParser;
