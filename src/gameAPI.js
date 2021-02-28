import GameLogParser from './gameLogParser.js';
import { readJSON, saveJSON } from './utils.js';

class GameAPI {
  constructor() {
    this.games = null;
  }

  readLog(filename) {
    const data = readJSON(filename);
    const parser = new GameLogParser(data);
    this.games = parser.parse();
    saveJSON(this.games, 'games');
  }

  // This is the solution to task 2
  printRanking() {
    this.games.forEach((game) => {
      console.log(`${Object.keys(game)[0]}, ranked by kills:`);

      // Ranks players by number of kills
      const { kills } = Object.values(game)[0];
      const rankedPlayers = Object.entries(kills).sort(
        (entry1, entry2) => entry2[1] - entry1[1],
      );

      // Prints ranking
      rankedPlayers.forEach((entry) => (
        console.log(`  ${entry[0]}: ${entry[1]} kills`)));
      console.log('');
    });
  }
}

export default GameAPI;
