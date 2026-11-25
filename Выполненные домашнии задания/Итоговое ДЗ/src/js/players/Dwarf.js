import Warrior from './Warrior';
import Axe from '../weapons/Axe';

export default class Dwarf extends Warrior {
  constructor(position, name) {
    super(position, name);
    this.setStats({
      life: 130,
      attack: 15,
      luck: 20,
      description: 'Гном',
      weapon: new Axe(),
    });
    this.hitCount = 0;
  }

  // Каждый шестой удар соперника при удаче > 0.5 наносит вдвое меньше урона
  takeDamage(damage) {
    this.hitCount += 1;

    if (this.hitCount % 6 === 0 && this.getLuck() > 0.5) {
      super.takeDamage(damage / 2);
      return;
    }

    super.takeDamage(damage);
  }
}
