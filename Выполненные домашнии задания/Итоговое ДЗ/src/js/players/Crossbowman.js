import Archer from './Archer';
import LongBow from '../weapons/LongBow';

export default class Crossbowman extends Archer {
  constructor(position, name) {
    super(position, name);
    this.setStats({
      life: 85,
      attack: 8,
      agility: 20,
      luck: 15,
      description: 'Арбалетчик',
      weapon: new LongBow(),
    });
  }
}
