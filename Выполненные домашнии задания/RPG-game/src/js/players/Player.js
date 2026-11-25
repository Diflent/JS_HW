import Arm from '../weapons/Arm';
import Knife from '../weapons/Knife';
import logger from '../logger';

export default class Player {
  constructor(position, name) {
    this.life = 100;
    this.magic = 20;
    this.speed = 1;
    this.attack = 10;
    this.agility = 5;
    this.luck = 10;
    this.description = 'Игрок';
    this.weapon = new Arm();
    this.position = position;
    this.name = name;
    this.initLife = this.life;
    this.initMagic = this.magic;
  }

  // Применяет характеристики класса-наследника и запоминает начальные жизнь и ману
  setStats(stats) {
    Object.assign(this, stats);
    this.initLife = this.life;
    this.initMagic = this.magic;
  }

  getLuck() {
    const randomNumber = Math.random() * 100;
    return (randomNumber + this.luck) / 100;
  }

  getDamage(distance) {
    if (distance > this.weapon.range) {
      return 0;
    }

    const weaponDamage = this.weapon.getDamage();
    return ((this.attack + weaponDamage) * this.getLuck()) / distance;
  }

  takeDamage(damage) {
    this.life = Math.max(0, this.life - damage);
  }

  isDead() {
    return this.life === 0;
  }

  moveLeft(distance) {
    this.position -= Math.min(Math.abs(distance), this.speed);
  }

  moveRight(distance) {
    this.position += Math.min(Math.abs(distance), this.speed);
  }

  move(distance) {
    if (distance < 0) {
      this.moveLeft(distance);
    } else {
      this.moveRight(distance);
    }
  }

  isAttackBlocked() {
    return this.getLuck() > (100 - this.luck) / 100;
  }

  dodged() {
    return this.getLuck() > (100 - this.agility - this.speed * 3) / 100;
  }

  takeAttack(damage) {
    if (this.isAttackBlocked()) {
      this.weapon.takeDamage(damage);
      logger.log(`${this.name} блокирует удар, оружие «${this.weapon.name}» получает урон`);
      this.checkWeapon();
      return;
    }

    if (this.dodged()) {
      logger.log(`${this.name} уклоняется от удара`);
      return;
    }

    this.takeDamage(damage);
    logger.log(`${this.name} получает ${damage.toFixed(2)} урона, жизнь: ${this.life.toFixed(2)}`);
  }

  // Сломанное оружие меняется по цепочке: основное -> нож -> руки
  checkWeapon() {
    if (!this.weapon.isBroken()) {
      return;
    }

    const brokenWeaponName = this.weapon.name;
    this.weapon = this.weapon instanceof Knife ? new Arm() : new Knife();
    logger.log(`${this.name}: «${brokenWeaponName}» сломан, теперь в руках «${this.weapon.name}»`);
  }

  tryAttack(enemy) {
    const distance = Math.abs(this.position - enemy.position);

    if (this.weapon.range < distance) {
      return;
    }

    this.weapon.takeDamage(10 * this.getLuck());
    this.checkWeapon();

    logger.log(`${this.name} (${this.description}) атакует ${enemy.name}`);

    if (distance === 0) {
      // Атакуемый отскакивает на 1 деление вправо и получает двойной урон
      enemy.moveRight(1);
      enemy.takeAttack(this.getDamage(1) * 2);
      return;
    }

    enemy.takeAttack(this.getDamage(distance));
  }

  chooseEnemy(players) {
    const enemies = players.filter((player) => player !== this && !player.isDead());

    if (enemies.length === 0) {
      return null;
    }

    return enemies.reduce((weakest, player) => (player.life < weakest.life ? player : weakest));
  }

  moveToEnemy(enemy) {
    this.move(enemy.position - this.position);
  }

  turn(players) {
    const enemy = this.chooseEnemy(players);

    if (!enemy) {
      return;
    }

    this.moveToEnemy(enemy);
    this.tryAttack(enemy);
  }
}
