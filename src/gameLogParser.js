/*   The parser works breaking the input into tokens (strings with no spaces), then starts
 *  iterating through the tokens and consuming then, reading it's value to handle what should
 *  be added to the gameInfo object;
 */
class GameLogParser {
  constructor(log) {
    this.log = log;

    this.logTokenized = [];
    this.tokenIndex = 0;

    this.kills = [];

    this.parse();
  }

  get currentToken() {
    return this.logTokenized[this.tokenIndex];
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
    this.tokenIndex += 4;
    const killerPlayer = this.consumeTokensUntil('killed').join(' ');

    this.tokenIndex += 1;
    const killedPlayer = this.consumeTokensUntil('by').join(' ');

    this.kills.push({
      killer: killerPlayer,
      killed: killedPlayer,
    });
  }
}

export default GameLogParser;
