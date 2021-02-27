class GameLogParser {
  constructor(log) {
    this.log = log;
    this.tokenIndex = 0;
    this.logTokenized = [];

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
      default: this.tokenIndex += 1;
    }
  }
}

export default GameLogParser;
