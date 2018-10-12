module.exports = {
  spawn: () => Game.spawns['Spawn1'].spawnCreep([ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH],  'warrior' + Game.time, {memory: {role: 'warrior'}}),
  run: () => {

    let target = Game.getObjectById('5bbfcefcfb640a0a6e0b53c7')

    let flag = Game.flags['here']
    for (let creep of Object.values(Game.creeps).filter(creep => creep.memory.role === 'warrior')) {
      if (flag) {
        // console.log(target)
        creep.moveTo(flag, {visualizePathStyle: {stroke: '#ff0000'}})
        //creep.attack(target)
      }
    }
  }
}
