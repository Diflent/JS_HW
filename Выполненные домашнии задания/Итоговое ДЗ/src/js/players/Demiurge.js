import Mage from './Mage';
import StormStaff from '../weapons/StormStaff';

export default class Demiurge extends Mage {
  constructor(position, name) {
    super(position, name);
    this.setStats({
      life: 80,
      magic: 120,
      attack: 6,
      luck: 12,
      description: 'Демиург',
      weapon: new StormStaff(),
    });
  }

  // При мане > 0 и удаче > 0.6 урон в 1.5 раза выше
  getDamage(distance) {
    const damage = super.getDamage(distance);

    if (this.magic > 0 && this.getLuck() > 0.6) {
      return damage * 1.5;
    }

    return damage;
  }
}
