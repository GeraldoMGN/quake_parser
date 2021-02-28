import express from 'express';
import GameLogParser from './gameLogParser.js';
import { readJSON, saveJSON } from './utils.js';

class GameAPI {
  constructor(games) {
    this.games = games;
  }

  readLog(filename) {
    const data = readJSON(filename);
    const parser = new GameLogParser(data);
    this.games = parser.parse();
    saveJSON(this.games, 'games');
  }

  // This is the solution to task 2
  printRanking() {
    if (!this.games) {
      throw Error('You need to read a game log before printing the player ranking');
    }

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

  // This is the solution to task 3
  startServer(port) {
    if (!this.games) {
      throw Error('You need to read a game log before starting game API server');
    }

    const app = express();

    // Get game information by id
    app.get('/gameByID/:gameID', (req, res) => {
      const { gameID } = req.params;
      if (gameID > 0 && gameID < this.games.length) {
        res.status(200).json(this.games[gameID]);
      } else {
        res.status(404).send('ID provided does not represent a game.');
      }
    });

    // Starts server
    app.listen(port, () => {
      console.log(`Game API server listening at http://localhost:${port}`);
    });
  }
}

export default GameAPI;
