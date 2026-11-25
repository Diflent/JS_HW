import Player from './Player';
import Bow from '../weapons/Bow';

export default class Archer extends Player {
  constructor(position, name) {
    super(position, name);
    this.setStats({
      life: 80,
      magic: 35,
      attack: 5,
      agility: 10,
      description: 'Лучник',
      weapon: new Bow(),
    });
  }

  getDamage(distance) {
    if (distance > this.weapon.range) {
      return 0;
    }

    const weaponDamage = this.weapon.getDamage();
    return ((this.attack + weaponDamage) * this.getLuck() * distance) / this.weapon.range;
  }
}
