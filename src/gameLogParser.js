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

    this.gameInfo = [];

    this.parse();
  }

  currentToken() {
    return this.logTokenized[this.tokenIndex];
  }

  currentGameInfo() {
    return Object.values(this.gameInfo[this.gameInfo.length - 1])[0];
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
}

export default GameLogParser;
