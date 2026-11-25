import Player from '../Player';
import Warrior from '../Warrior';
import Archer from '../Archer';
import Mage from '../Mage';
import Dwarf from '../Dwarf';
import Crossbowman from '../Crossbowman';
import Demiurge from '../Demiurge';
import Arm from '../../weapons/Arm';
import Knife from '../../weapons/Knife';
import Sword from '../../weapons/Sword';
import Bow from '../../weapons/Bow';
import Staff from '../../weapons/Staff';
import Axe from '../../weapons/Axe';
import LongBow from '../../weapons/LongBow';
import StormStaff from '../../weapons/StormStaff';
import logger from '../../logger';

beforeEach(() => {
  logger.enabled = false;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Player', () => {
  test('создаётся с начальными характеристиками', () => {
    const player = new Player(10, 'Бэтмен');

    expect(player.life).toBe(100);
    expect(player.magic).toBe(20);
    expect(player.speed).toBe(1);
    expect(player.attack).toBe(10);
    expect(player.agility).toBe(5);
    expect(player.luck).toBe(10);
    expect(player.description).toBe('Игрок');
    expect(player.weapon).toBeInstanceOf(Arm);
    expect(player.position).toBe(10);
    expect(player.name).toBe('Бэтмен');
  });

  test('getLuck считает (случайное число + удача) / 100', () => {
    const player = new Player(10, 'Бэтмен');
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    expect(player.getLuck()).toBeCloseTo(0.6);
  });

  test('getDamage считает урон и учитывает дальность оружия', () => {
    const player = new Player(10, 'Человек паук');
    jest.spyOn(player, 'getLuck').mockReturnValue(0.5);

    expect(player.getDamage(1)).toBeCloseTo(5.5);
    expect(player.getDamage(2)).toBe(0);
    expect(player.getDamage(4)).toBe(0);
  });

  test('takeDamage уменьшает жизнь, но не ниже 0, isDead определяет смерть', () => {
    const player = new Player(10, 'Хоббит');

    player.takeDamage(10);
    expect(player.life).toBe(90);
    player.takeDamage(80);
    expect(player.life).toBe(10);
    expect(player.isDead()).toBe(false);
    player.takeDamage(90);
    expect(player.life).toBe(0);
    expect(player.isDead()).toBe(true);
  });

  test('движение ограничено скоростью', () => {
    const player = new Warrior(6, 'Алёша Попович');

    player.moveLeft(5);
    expect(player.position).toBe(4);
    player.moveRight(2);
    expect(player.position).toBe(6);
    player.moveRight(1);
    expect(player.position).toBe(7);
    player.move(-10);
    expect(player.position).toBe(5);
    player.move(10);
    expect(player.position).toBe(7);
  });

  test('isAttackBlocked и dodged зависят от удачи', () => {
    const player = new Player(0, 'Игрок');
    const luck = jest.spyOn(player, 'getLuck');

    luck.mockReturnValue(0.95);
    expect(player.isAttackBlocked()).toBe(true);
    expect(player.dodged()).toBe(true);

    luck.mockReturnValue(0.5);
    expect(player.isAttackBlocked()).toBe(false);
    expect(player.dodged()).toBe(false);
  });

  test('takeAttack: блок переносит урон на оружие', () => {
    const player = new Warrior(0, 'Воин');
    jest.spyOn(player, 'isAttackBlocked').mockReturnValue(true);

    player.takeAttack(30);
    expect(player.weapon.durability).toBe(470);
    expect(player.life).toBe(120);
  });

  test('takeAttack: уклонение отменяет урон', () => {
    const player = new Player(0, 'Игрок');
    jest.spyOn(player, 'isAttackBlocked').mockReturnValue(false);
    jest.spyOn(player, 'dodged').mockReturnValue(true);

    player.takeAttack(30);
    expect(player.life).toBe(100);
  });

  test('takeAttack: иначе игрок получает урон', () => {
    const player = new Player(0, 'Игрок');
    jest.spyOn(player, 'isAttackBlocked').mockReturnValue(false);
    jest.spyOn(player, 'dodged').mockReturnValue(false);

    player.takeAttack(30);
    expect(player.life).toBe(70);
  });

  test('checkWeapon меняет сломанное оружие: основное -> нож -> руки', () => {
    const player = new Warrior(0, 'Воин');

    player.checkWeapon();
    expect(player.weapon).toBeInstanceOf(Sword);

    player.weapon.takeDamage(500);
    player.checkWeapon();
    expect(player.weapon).toBeInstanceOf(Knife);

    player.weapon.takeDamage(300);
    player.checkWeapon();
    expect(player.weapon).toBeInstanceOf(Arm);

    player.weapon.takeDamage(1000);
    player.checkWeapon();
    expect(player.weapon).toBeInstanceOf(Arm);
  });

  test('tryAttack не срабатывает, если враг вне досягаемости', () => {
    const player = new Warrior(0, 'Алёша Попович');
    const archer = new Archer(2, 'Леголас');
    const takeAttack = jest.spyOn(archer, 'takeAttack');

    player.tryAttack(archer);
    expect(takeAttack).not.toHaveBeenCalled();
    expect(player.weapon.durability).toBe(500);
  });

  test('tryAttack изнашивает оружие и наносит урон', () => {
    const player = new Warrior(1, 'Алёша Попович');
    const archer = new Archer(2, 'Леголас');
    jest.spyOn(player, 'getLuck').mockReturnValue(0.5);
    const takeAttack = jest.spyOn(archer, 'takeAttack');

    player.tryAttack(archer);
    expect(player.weapon.durability).toBe(495);
    expect(takeAttack).toHaveBeenCalledWith(17.5);
    expect(archer.position).toBe(2);
  });

  test('tryAttack вплотную: враг отлетает и получает двойной урон', () => {
    const player = new Warrior(2, 'Алёша Попович');
    const archer = new Archer(2, 'Леголас');
    jest.spyOn(player, 'getLuck').mockReturnValue(0.5);
    const takeAttack = jest.spyOn(archer, 'takeAttack');

    player.tryAttack(archer);
    expect(takeAttack).toHaveBeenCalledWith(35);
    expect(archer.position).toBe(3);
  });

  test('chooseEnemy выбирает живого соперника с минимальным здоровьем', () => {
    const player = new Warrior(0, 'Воин');
    const weak = new Archer(5, 'Слабый');
    const strong = new Mage(3, 'Сильный');
    const dead = new Player(1, 'Павший');
    weak.life = 10;
    strong.life = 50;
    dead.life = 0;
    player.life = 5;

    expect(player.chooseEnemy([player, strong, weak, dead])).toBe(weak);
    expect(player.chooseEnemy([player, dead])).toBeNull();
  });

  test('moveToEnemy двигает игрока в сторону врага', () => {
    const player = new Warrior(5, 'Воин');

    player.moveToEnemy(new Archer(0, 'Слева'));
    expect(player.position).toBe(3);
    player.moveToEnemy(new Archer(10, 'Справа'));
    expect(player.position).toBe(5);
  });

  test('turn: выбор врага, движение и атака', () => {
    const player = new Warrior(0, 'Воин');
    const enemy = new Archer(3, 'Лучник');
    const tryAttack = jest.spyOn(player, 'tryAttack');

    player.turn([player, enemy]);
    expect(player.position).toBe(2);
    expect(tryAttack).toHaveBeenCalledWith(enemy);

    player.turn([player]);
    expect(tryAttack).toHaveBeenCalledTimes(1);
  });
});

describe('Классы персонажей', () => {
  test.each([
    [Warrior, Player, 120, 20, 2, 10, 5, 10, 'Воин', Sword],
    [Archer, Player, 80, 35, 1, 5, 10, 10, 'Лучник', Bow],
    [Mage, Player, 70, 100, 1, 5, 8, 10, 'Маг', Staff],
    [Dwarf, Warrior, 130, 20, 2, 15, 5, 20, 'Гном', Axe],
    [Crossbowman, Archer, 85, 35, 1, 8, 20, 15, 'Арбалетчик', LongBow],
    [Demiurge, Mage, 80, 120, 1, 6, 8, 12, 'Демиург', StormStaff],
  ])(
    '%p имеет характеристики из таблицы',
    (PlayerClass, Parent, life, magic, speed, attack, agility, luck, description, WeaponClass) => {
      const player = new PlayerClass(1, 'Тест');

      expect(player).toBeInstanceOf(Parent);
      expect(player.life).toBe(life);
      expect(player.magic).toBe(magic);
      expect(player.speed).toBe(speed);
      expect(player.attack).toBe(attack);
      expect(player.agility).toBe(agility);
      expect(player.luck).toBe(luck);
      expect(player.description).toBe(description);
      expect(player.weapon).toBeInstanceOf(WeaponClass);
    },
  );

  test('Archer.getDamage учитывает дистанцию и дальность оружия', () => {
    const archer = new Archer(0, 'Леголас');
    jest.spyOn(archer, 'getLuck').mockReturnValue(0.5);

    expect(archer.getDamage(3)).toBeCloseTo(7.5);
    expect(archer.getDamage(1)).toBeCloseTo(2.5);
    expect(archer.getDamage(4)).toBe(0);
  });

  test('Warrior.takeDamage: пример из задания', () => {
    const warrior = new Warrior(10, 'Алёша Попович');
    const luck = jest.spyOn(warrior, 'getLuck').mockReturnValue(0.5);

    warrior.takeDamage(50);
    expect([warrior.life, warrior.magic]).toEqual([70, 20]);
    warrior.takeDamage(20);
    expect([warrior.life, warrior.magic]).toEqual([50, 20]);

    luck.mockReturnValue(0.9);
    warrior.takeDamage(5);
    expect([warrior.life, warrior.magic]).toEqual([50, 15]);

    luck.mockReturnValue(0.5);
    warrior.takeDamage(7);
    expect([warrior.life, warrior.magic]).toEqual([43, 15]);
    warrior.takeDamage(30);
    expect([warrior.life, warrior.magic]).toEqual([13, 15]);
  });

  test('Warrior.takeDamage: остаток урона сверх маны идёт в здоровье', () => {
    const warrior = new Warrior(10, 'Алёша Попович');
    jest.spyOn(warrior, 'getLuck').mockReturnValue(0.9);
    warrior.life = 50;

    warrior.takeDamage(30);
    expect([warrior.life, warrior.magic]).toEqual([40, 0]);
    warrior.takeDamage(10);
    expect([warrior.life, warrior.magic]).toEqual([30, 0]);
  });

  test('Mage.takeDamage: пример из задания', () => {
    const mage = new Mage(10, 'Гендальф');
    const steps = [
      [50, 45, 88],
      [20, 35, 76],
      [10, 30, 64],
      [20, 20, 52],
      [20, 10, 40],
      [10, 0, 40],
    ];

    steps.forEach(([damage, life, magic]) => {
      mage.takeDamage(damage);
      expect([mage.life, mage.magic]).toEqual([life, magic]);
    });
  });

  test('Dwarf.takeDamage: каждый шестой удар при удаче вдвое слабее', () => {
    const dwarf = new Dwarf(0, 'Гимли');
    jest.spyOn(dwarf, 'getLuck').mockReturnValue(0.6);

    for (let hit = 1; hit <= 5; hit += 1) {
      dwarf.takeDamage(10);
    }
    expect(dwarf.life).toBe(80);

    dwarf.takeDamage(10);
    expect(dwarf.life).toBe(75);
  });

  test('Dwarf.takeDamage: без удачи шестой удар обычный', () => {
    const dwarf = new Dwarf(0, 'Гимли');
    jest.spyOn(dwarf, 'getLuck').mockReturnValue(0.4);

    for (let hit = 1; hit <= 6; hit += 1) {
      dwarf.takeDamage(10);
    }
    expect(dwarf.life).toBe(70);
  });

  test('Demiurge.getDamage усиливается при мане и удаче', () => {
    const demiurge = new Demiurge(0, 'Саруман');
    const luck = jest.spyOn(demiurge, 'getLuck').mockReturnValue(0.7);

    expect(demiurge.getDamage(1)).toBeCloseTo(16.8);

    luck.mockReturnValue(0.5);
    expect(demiurge.getDamage(1)).toBeCloseTo(8);

    demiurge.magic = 0;
    luck.mockReturnValue(0.7);
    expect(demiurge.getDamage(1)).toBeCloseTo(11.2);
  });
});
