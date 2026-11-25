import Warrior from './players/Warrior';
import Archer from './players/Archer';
import Mage from './players/Mage';
import Dwarf from './players/Dwarf';
import Crossbowman from './players/Crossbowman';
import Demiurge from './players/Demiurge';
import logger from './logger';

const MAX_ROUNDS = 1000;

export function createPlayers() {
  return [
    new Warrior(0, 'Алёша Попович'),
    new Archer(4, 'Леголас'),
    new Mage(8, 'Гендальф'),
    new Dwarf(12, 'Гимли'),
    new Crossbowman(16, 'Вильгельм Телль'),
    new Demiurge(20, 'Саруман'),
  ];
}

const getAlivePlayers = (players) => players.filter((player) => !player.isDead());

export default function play(players = createPlayers()) {
  let alivePlayers = getAlivePlayers(players);
  let round = 0;

  const names = alivePlayers.map((player) => player.name).join(', ');
  logger.log(`Королевская битва! Участники: ${names}`);

  while (alivePlayers.length > 1 && round < MAX_ROUNDS) {
    round += 1;
    logger.log(`--- Раунд ${round} ---`);

    alivePlayers.forEach((player) => {
      if (!player.isDead()) {
        player.turn(getAlivePlayers(players));
      }
    });

    alivePlayers.forEach((player) => {
      if (player.isDead()) {
        logger.log(`${player.name} (${player.description}) выбывает из битвы`);
      }
    });

    alivePlayers = getAlivePlayers(players);
  }

  if (alivePlayers.length === 0) {
    logger.log('Победителей нет');
    return null;
  }

  // Если лимит раундов исчерпан, побеждает игрок с наибольшим запасом жизни
  const winner = alivePlayers.reduce((best, player) => (player.life > best.life ? player : best));
  const winnerLife = winner.life.toFixed(2);
  logger.log(`Победитель: ${winner.name} (${winner.description}), жизнь: ${winnerLife}`);
  return winner;
}
