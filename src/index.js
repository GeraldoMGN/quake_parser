import GameAPI from './gameAPI.js';

const run = async () => {
  const gameAPI = new GameAPI();
  gameAPI.readLog('games.log');
  gameAPI.printRanking();
};

run();
