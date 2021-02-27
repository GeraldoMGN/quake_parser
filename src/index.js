import fs from 'fs';
import GameLogParser from './gameLogParser.js';

fs.readFile('games.log', 'utf8', (error, data) => {
  if (error) throw Error('Error reading log file!');

  GameLogParser.parse(data);
});
