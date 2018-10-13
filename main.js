const Controller = require('controller')
global.roleWorker = require('role.worker')
global.roleWarrior = require('role.warrior')
global.roleTower = require('role.tower')
global.controller = new Controller({
  minWorkers: 20,
  workersSkills: [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
  friends: ['M4RC3L', 'RaisingAgent', 'Gnamly', 'GhostDog'],
  repairLimits: {
    constructedWall: 2000,
    rampart: 20000
  }
})

module.exports.loop = () => {

  //clear dead memories
  for (let name in Memory.creeps) {
      if (!Game.creeps[name]) {
          delete Memory.creeps[name]
          console.log('Clearing non-existing creep memory:', name)
      }
  }

  //update info text
  let flag = Game.flags['Information']
  if (flag) {
    flag.room.visual.text(`Energy: ${flag.room.energyAvailable}`, flag.pos.x, flag.pos.y + 2, {align: 'left', opacity: 1})
    flag.room.visual.text(`Worker: ${roleWorker.getAll().length}`, flag.pos.x, flag.pos.y + 3, {align: 'left', opacity: 1})
    let activities = {}
    for (let worker of roleWorker.getAll().filter(creep => !!creep.memory.activity)) {
      activities[worker.memory.activity] = (activities[worker.memory.activity] || 0) + 1
    }
    let i = 0
    for (let activity in activities) {
      i += 1
      flag.room.visual.text(`${activity}: ${activities[activity]}`, flag.pos.x, flag.pos.y + 3 + i, {align: 'left', opacity: 1})
    }

  }

  //update spawner text
  for (let spawn of Object.values(Game.spawns)) {
    if (spawn.spawning) spawn.room.visual.text(`🛠️ ${Game.creeps[spawn.spawning.name].memory.role}`, spawn.pos.x + 1, spawn.pos.y, {align: 'left', opacity: 1})
  }

  //let the workers do their work
  roleWorker.run()

  if (Game.flags['here']) roleWarrior.spawn()
  roleWarrior.run()


  for (let room of Object.values(Game.rooms)) {
    for (let tower of room.find(FIND_MY_STRUCTURES, {filter: structure => structure.structureType === STRUCTURE_TOWER})) {
      roleTower.run(tower)
    }
  }

}
