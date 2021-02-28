import GameAPI from './gameAPI.js';

const run = async () => {
  const gameAPI = new GameAPI();
  gameAPI.readLog('games.log');
  gameAPI.printRanking();
  gameAPI.startServer(3000);
};

run();
