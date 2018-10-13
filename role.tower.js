module.exports = {//TODO 500 reserve engergy für angriff
  run: (tower) => {
    let hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: creep => !controller.getFriends().includes(creep.owner)})

    if (hostile) {
      if (Game.flags['Information']) new RoomPosition(Game.flags['Information'].pos.x + 4, Game.flags['Information'].pos.y, Game.flags['Information'].pos.roomName).createFlag('underAttack', COLOR_RED)
      tower.attack(hostile)
    }
    else if (tower.energy > tower.energyCapacity * .6) {
      let structure = tower.pos.findClosestByRange(FIND_STRUCTURES, {filter: s =>  s.hits < (s.hitsMax * .8) && ( (!controller.getRepairLimits()[s.structureType]) || (s.hits < controller.getRepairLimits()[s.structureType]) )})
      if (structure) tower.repair(structure)
    }

  }
}
