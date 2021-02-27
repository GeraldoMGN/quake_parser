class GameLogParser {
  constructor(log) {
    this.log = log;
    this.tokenIndex = 0;
    this.logTokenized = [];
    this.kills = [];

    this.parse();
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

  consumeToken() {
    switch (this.logTokenized[this.tokenIndex]) {
      case 'Kill:': {
        this.consumeKillToken();
        break;
      }
      default: this.tokenIndex += 1;
    }
  }

  consumeTokenUntil(endToken) {
    const consumedTokens = [];
    while (this.logTokenized[this.tokenIndex] !== endToken) {
      if (this.logTokenized[this.tokenIndex] !== endToken) {
        consumedTokens.push(this.logTokenized[this.tokenIndex]);
        this.tokenIndex += 1;
      }
    }
    return consumedTokens;
  }

  consumeKillToken() {
    this.tokenIndex += 4;
    const killerPlayer = this.consumeTokenUntil('killed').join(' ');

    this.tokenIndex += 1;
    const killedPlayer = this.consumeTokenUntil('by').join(' ');

    this.kills.push({
      killer: killerPlayer,
      killed: killedPlayer,
    });
  }
}

export default GameLogParser;
