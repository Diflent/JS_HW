import Player from './Player';
import Sword from '../weapons/Sword';

export default class Warrior extends Player {
  constructor(position, name) {
    super(position, name);
    this.setStats({
      life: 120,
      speed: 2,
      attack: 10,
      description: 'Воин',
      weapon: new Sword(),
    });
  }

  // При здоровье ниже 50% и удаче > 0.8 урон уходит в ману, пока она есть
  takeDamage(damage) {
    if (this.life < this.initLife / 2 && this.magic > 0 && this.getLuck() > 0.8) {
      const magicDamage = Math.min(this.magic, damage);
      this.magic -= magicDamage;
      super.takeDamage(damage - magicDamage);
      return;
    }

    super.takeDamage(damage);
  }
}
