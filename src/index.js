import fs from 'fs';
import GameLogParser from './gameLogParser.js';

const saveJSON = (object, filename) => {
  fs.writeFile(`${filename}.json`, JSON.stringify(object, null, 2), (err) => {
    if (err) throw err;
    console.log('Game information saved.');
  });
};

const printRanking = (games) => games.forEach((game) => {
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

fs.readFile('games.log', 'utf8', (error, data) => {
  if (error) throw Error('Error reading log file!');

  const parser = new GameLogParser(data);
  const handledGames = parser.parse();
  saveJSON(handledGames, 'games');

  printRanking(handledGames);
});
