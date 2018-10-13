module.exports = {
  spawn: () => Game.spawns['Spawn1'].spawnCreep([ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],  'warrior' + Game.time, {memory: {role: 'warrior'}}),
  run: () => {

    let target = Game.getObjectById('5bbfcefcfb640a0a6e0b53c7')

    let flag = Game.flags['here']
    let attackFlag = Game.flags['attack!']
    for (let creep of Object.values(Game.creeps).filter(creep => creep.memory.role === 'warrior')) {
      if (flag) {
        creep.moveTo(flag, {visualizePathStyle: {stroke: '#ff0000'}})
      }
      if (attackFlag) {
        let hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {filter: (creep) => {
          if (controller.getFriends().includes(creep.owner)) return false
          for (let bodyPart of creep.body) if (bodyPart.type === ATTACK) return true
          return false
        }})
        if (hostile) if (creep.attack(hostile) === ERR_NOT_IN_RANGE) creep.moveTo(hostile, {visualizePathStyle: {stroke: '#ff0000'}})
        else if (creep.attack(target) === ERR_NOT_IN_RANGE) creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}})
      }

    }
  }
}
