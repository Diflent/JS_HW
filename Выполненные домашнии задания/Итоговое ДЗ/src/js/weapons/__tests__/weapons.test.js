import Weapon from '../Weapon';
import Arm from '../Arm';
import Bow from '../Bow';
import Sword from '../Sword';
import Knife from '../Knife';
import Staff from '../Staff';
import LongBow from '../LongBow';
import Axe from '../Axe';
import StormStaff from '../StormStaff';

describe('Weapon', () => {
  test('создаёт оружие с заданными характеристиками', () => {
    const weapon = new Weapon('Старый меч', 20, 10, 1);

    expect(weapon).toEqual({
      name: 'Старый меч',
      attack: 20,
      durability: 10,
      initDurability: 10,
      range: 1,
    });
  });

  test('takeDamage уменьшает прочность, но не ниже 0', () => {
    const weapon = new Weapon('Старый меч', 20, 10, 1);

    weapon.takeDamage(5);
    expect(weapon.durability).toBe(5);

    weapon.takeDamage(50);
    expect(weapon.durability).toBe(0);
  });

  test('getDamage возвращает полный урон при прочности от 30% и выше', () => {
    const weapon = new Weapon('Тестовое оружие', 10, 100, 1);

    expect(weapon.getDamage()).toBe(10);

    weapon.takeDamage(70);
    expect(weapon.durability).toBe(30);
    expect(weapon.getDamage()).toBe(10);
  });

  test('getDamage возвращает половину урона при прочности ниже 30%', () => {
    const weapon = new Weapon('Тестовое оружие', 10, 100, 1);

    weapon.takeDamage(71);
    expect(weapon.getDamage()).toBe(5);
  });

  test('getDamage возвращает 0 у сломанного оружия', () => {
    const weapon = new Weapon('Тестовое оружие', 10, 100, 1);

    weapon.takeDamage(100);
    expect(weapon.getDamage()).toBe(0);
  });

  test('isBroken показывает, сломано ли оружие', () => {
    const weapon = new Weapon('Тестовое оружие', 10, 100, 1);

    expect(weapon.isBroken()).toBe(false);

    weapon.takeDamage(99);
    expect(weapon.isBroken()).toBe(false);

    weapon.takeDamage(1);
    expect(weapon.isBroken()).toBe(true);
  });

  test('пример из задания: износ лука', () => {
    const bow = new Bow();

    expect([bow.getDamage(), bow.durability]).toEqual([10, 200]);

    bow.takeDamage(100);
    expect([bow.getDamage(), bow.durability]).toEqual([10, 100]);

    bow.takeDamage(50);
    expect([bow.getDamage(), bow.durability]).toEqual([5, 50]);

    bow.takeDamage(150);
    expect([bow.getDamage(), bow.durability]).toEqual([0, 0]);
  });
});

describe('Классы оружия', () => {
  test.each([
    [Arm, 'Рука', 1, Infinity, 1],
    [Bow, 'Лук', 10, 200, 3],
    [Sword, 'Меч', 25, 500, 1],
    [Knife, 'Нож', 5, 300, 1],
    [Staff, 'Посох', 8, 300, 2],
    [LongBow, 'Длинный лук', 15, 200, 4],
    [Axe, 'Секира', 27, 800, 1],
    [StormStaff, 'Посох Бури', 10, 300, 3],
  ])('%p имеет корректные характеристики', (WeaponClass, name, attack, durability, range) => {
    const weapon = new WeaponClass();

    expect(weapon).toBeInstanceOf(Weapon);
    expect(weapon).toEqual({
      name,
      attack,
      durability,
      initDurability: durability,
      range,
    });
  });

  test('улучшенное оружие наследуется от базового', () => {
    expect(new LongBow()).toBeInstanceOf(Bow);
    expect(new Axe()).toBeInstanceOf(Sword);
    expect(new StormStaff()).toBeInstanceOf(Staff);
  });

  test('рука не изнашивается', () => {
    const arm = new Arm();

    arm.takeDamage(20);
    expect(arm.durability).toBe(Infinity);
    expect(arm.isBroken()).toBe(false);
    expect(arm.getDamage()).toBe(1);
  });

  test('меч изнашивается от ударов', () => {
    const sword = new Sword();

    sword.takeDamage(20);
    expect(sword.durability).toBe(480);

    sword.takeDamage(100);
    expect(sword.durability).toBe(380);
  });

  test('секира учитывает свою изначальную прочность', () => {
    const axe = new Axe();

    axe.takeDamage(560);
    expect(axe.getDamage()).toBe(27);

    axe.takeDamage(1);
    expect(axe.getDamage()).toBe(13.5);
  });
});
