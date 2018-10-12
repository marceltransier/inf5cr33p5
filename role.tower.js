module.exports = {
  run: (tower) => {
    let hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: creep => !controller.getFriends().includes(creep.owner)})

    if (hostile) tower.attack(hostile)
    else {
      let structure = tower.pos.findClosestByRange(FIND_STRUCTURES, {filter: s => s.hits < (s.hitsMax * .9) && s.hits < 20000}) //TODO repait limits
      if (structure) tower.repair(structure)
    }

  }
}
