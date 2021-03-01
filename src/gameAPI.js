import express from 'express';
import GameLogParser from './gameLogParser.js';
import { readJSON, saveJSON } from './utils.js';

class GameAPI {
  constructor() {
    this._games = null;
    this._playerRanking = [];
  }

  get games() {
    return this._games;
  }

  get playerRanking() {
    return this._playerRanking;
  }

  readLog(filename) {
    const data = readJSON(filename);
    const parser = new GameLogParser(data);
    this._games = parser.parse();
    this._rankPlayers();

    saveJSON(this._games, 'games');
  }

  _rankPlayers() {
    this._games.forEach((game) => {
      // Ranks players by number of kills
      const { kills } = Object.values(game)[0];
      this.playerRanking.push(Object.entries(kills).sort(
        (entry1, entry2) => entry2[1] - entry1[1],
      ));
    });
  }

  // This is the solution to task 2
  printRanking() {
    if (!this._games) {
      throw Error('You need to read a game log before printing the player ranking');
    }

    this.playerRanking.forEach((gameRanking, gameIndex) => {
      console.log(`Game ${gameIndex}, ranked by kills:`);

      // Prints ranking
      gameRanking.forEach((entry) => (
        console.log(`  ${entry[0]}: ${entry[1]} kills`)));
      console.log('');
    });
  }

  // This is the solution to task 3
  startServer(port) {
    if (!this._games) {
      throw Error('You need to read a game log before starting game API server');
    }

    const app = express();

    // Get game information by id
    app.get('/gameByID/:gameID', (req, res) => {
      const { gameID } = req.params;
      if (gameID > 0 && gameID < this._games.length) {
        // Inserts the payer kill ranking to the response object
        const gameInfoWithRanking = {
          ...this._games[gameID],
          ranking: this.playerRanking[gameID],
        };

        res.status(200).json(gameInfoWithRanking);
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
