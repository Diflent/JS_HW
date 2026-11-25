import Warrior from './players/Warrior';
import Archer from './players/Archer';
import Mage from './players/Mage';
import Dwarf from './players/Dwarf';
import Crossbowman from './players/Crossbowman';
import Demiurge from './players/Demiurge';

export default function play() {
  return [
    new Warrior(),
    new Archer(),
    new Mage(),
    new Dwarf(),
    new Crossbowman(),
    new Demiurge(),
  ];
}
