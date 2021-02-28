import fs from 'fs';
import GameLogParser from './gameLogParser.js';

const saveJSON = (object, filename) => {
  fs.writeFile(`${filename}.json`, JSON.stringify(object, null, 2), (err) => {
    if (err) throw err;
    console.log('Game information saved.');
  });
};

fs.readFile('games.log', 'utf8', (error, data) => {
  if (error) throw Error('Error reading log file!');

  const parser = new GameLogParser(data);
  const handledGames = parser.parse();
  saveJSON(handledGames, 'games');
});
