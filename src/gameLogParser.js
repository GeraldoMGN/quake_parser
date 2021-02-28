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

    this.gameInfos = [];

    this.parse();
  }

  currentToken() {
    return this.logTokenized[this.tokenIndex];
  }

  currentGameInfo() {
    return Object.values(this.gameInfos[this.gameInfos.length - 1])[0];
  }

  parse() {
    this.logTokenized = GameLogParser.tokenize(this.log);

    while (this.tokenIndex < this.logTokenized.length) {
      this.consumeToken();
    }
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

    // Adds empty gameInfo entry
    this.gameInfos.push({
      [`game_${this.gameInfos.length}`]: {
        total_kills: 0,
        players: {},
        kills: {},
      },
    });
  }

  // Consumes "ClientUserinfoChanged:"
  consumeUserInfoToken() {
    this.tokenIndex += 1;
    const playerID = this.currentToken();

    this.tokenIndex += 1;
    const playerInfo = this.consumeTokensUntilIncludes('\\t').join(' ');
    const playerUsername = playerInfo.match(/n\\([^\\]*)\\t/)[1];

    this.currentGameInfo().players[playerID] = playerUsername;
    this.currentGameInfo().kills[playerID] = this.currentGameInfo().kills[playerID] || 0;
  }
}

export default GameLogParser;
