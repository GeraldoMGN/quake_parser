const WORLD_ID = '1022';

/* This is the solution to task 1
 * The parser works breaking the input into tokens (strings with no spaces), then starts
 *  iterating through the tokens and consuming then, reading it's value to handle what should
 *  be added to the gameInfo object
 */
class GameLogParser {
  constructor(log) {
    this._log = log;

    this._logTokenized = [];
    this._tokenIndex = 0;

    // Contains the raw information of every game
    this._games = [];
  }

  /**
   * @param {string} rawLog
   */
  set log(rawLog) {
    this._log = rawLog;

    // Resets parsing attributes
    this._tokenIndex = 0;
    this._games = [];
  }

  get rawGameInfo() {
    return this._games;
  }

  _currentToken() {
    return this._logTokenized[this._tokenIndex];
  }

  _currentGameInfo() {
    return this._games[this._games.length - 1];
  }

  parse() {
    this._logTokenized = GameLogParser._tokenize(this._log);

    while (this._tokenIndex < this._logTokenized.length) {
      this._consumeToken();
    }

    return this._userIdsToUsernames();
  }

  // Transforms users IDs to usernames in the game information array
  _userIdsToUsernames() {
    return this._games.map((game, gameIndex) => ({
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

  static _tokenize(inputString) {
    return inputString.split(' ');
  }

  // Handles and consumes current token
  _consumeToken() {
    switch (this._currentToken()) {
      case 'InitGame:': {
        this._consumeInitGameToken();
        break;
      }
      case 'ClientUserinfoChanged:': {
        this._consumeUserInfoToken();
        break;
      }
      case 'Kill:': {
        this._consumeKillToken();
        break;
      }
      default: this._tokenIndex += 1;
    }
  }

  // Consumes tokens until finds endToken
  _consumeTokensUntil(endToken) {
    const consumedTokens = [];
    while (this._currentToken() !== endToken) {
      if (this._currentToken() !== endToken) {
        consumedTokens.push(this._currentToken());
        this._tokenIndex += 1;
      }
    }
    return consumedTokens;
  }

  // Consumes tokens until token contains string 'end'
  _consumeTokensUntilIncludes(end) {
    const consumedTokens = [];
    while (!this._currentToken().includes(end)) {
      consumedTokens.push(this._currentToken());
      this._tokenIndex += 1;
    }
    consumedTokens.push(this._currentToken());

    return consumedTokens;
  }

  // Consumes "Killed:"
  _consumeKillToken() {
    this._tokenIndex += 1;
    const killerPlayerID = this._currentToken();

    this._tokenIndex += 1;
    const killedPlayerID = this._currentToken();

    // Adds to total_kills
    this._currentGameInfo().total_kills += 1;

    if (killerPlayerID === WORLD_ID) {
      // If not killed by a player, subtract 1 kill of killed
      this._currentGameInfo().kills[killedPlayerID] -= 1;
    } else {
      // If killed by a player, adds 1 kill to killer
      this._currentGameInfo().kills[killerPlayerID] += 1;
    }
  }

  // Consumes "InitGame:"
  _consumeInitGameToken() {
    this._tokenIndex += 1;

    // Adds empty game information entry
    this._games.push({
      total_kills: 0,
      players: {},
      kills: {},
    });
  }

  // Consumes "ClientUserinfoChanged:"
  _consumeUserInfoToken() {
    this._tokenIndex += 1;
    const playerID = this._currentToken();

    this._tokenIndex += 1;
    const playerInfo = this._consumeTokensUntilIncludes('\\t').join(' ');
    // Uses regex to get username
    const playerUsername = playerInfo.match(/n\\([^\\]*)\\t/)[1];

    this._currentGameInfo().players[playerID] = playerUsername;
    // Defaults player kill to 0 if don't already exists
    this._currentGameInfo().kills[playerID] = this._currentGameInfo().kills[playerID] || 0;
  }
}

export default GameLogParser;
