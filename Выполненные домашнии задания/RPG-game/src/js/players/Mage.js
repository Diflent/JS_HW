import Player from './Player';
import Staff from '../weapons/Staff';

export default class Mage extends Player {
  constructor(position, name) {
    super(position, name);
    this.setStats({
      life: 70,
      magic: 100,
      attack: 5,
      agility: 8,
      description: 'Маг',
      weapon: new Staff(),
    });
  }

  // При мане больше 50% урон вдвое меньше, а мана уменьшается на 12
  takeDamage(damage) {
    if (this.magic > this.initMagic / 2) {
      super.takeDamage(damage / 2);
      this.magic = Math.max(0, this.magic - 12);
      return;
    }

    super.takeDamage(damage);
  }
}
