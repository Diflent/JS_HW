import play, { createPlayers } from '../game';
import Player from '../players/Player';
import Warrior from '../players/Warrior';
import Archer from '../players/Archer';
import logger from '../logger';

beforeEach(() => {
  logger.enabled = false;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('play', () => {
  test('createPlayers создаёт всех персонажей на разных позициях', () => {
    const players = createPlayers();
    const positions = players.map((player) => player.position);

    expect(players.length).toBe(6);
    expect(new Set(positions).size).toBe(6);
    players.forEach((player) => expect(player).toBeInstanceOf(Player));
  });

  test('битва продолжается, пока не останется один живой игрок', () => {
    const players = createPlayers();
    const winner = play(players);
    const alive = players.filter((player) => !player.isDead());

    expect(alive.length).toBe(1);
    expect(winner).toBe(alive[0]);
  });

  test('без аргументов играет стандартный состав', () => {
    expect(play()).toBeInstanceOf(Player);
  });

  test('если в битве один живой игрок, он и побеждает', () => {
    const warrior = new Warrior(0, 'Алёша Попович');
    const archer = new Archer(2, 'Леголас');
    archer.life = 0;

    expect(play([warrior, archer])).toBe(warrior);
  });

  test('если живых игроков нет, победителя нет', () => {
    const warrior = new Warrior(0, 'Алёша Попович');
    warrior.life = 0;

    expect(play([warrior])).toBeNull();
  });

  test('при исчерпании раундов побеждает игрок с наибольшей жизнью', () => {
    const first = new Player(0, 'Первый');
    const second = new Player(100, 'Второй');
    first.life = 30;
    jest.spyOn(Player.prototype, 'tryAttack').mockImplementation(() => {});
    jest.spyOn(Player.prototype, 'moveToEnemy').mockImplementation(() => {});

    expect(play([first, second])).toBe(second);
  });
});

describe('logger', () => {
  test('выводит сообщения, только когда включён', () => {
    const consoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

    logger.log('скрыто');
    expect(consoleLog).not.toHaveBeenCalled();

    logger.enabled = true;
    logger.log('видно');
    expect(consoleLog).toHaveBeenCalledWith('видно');
  });
});
