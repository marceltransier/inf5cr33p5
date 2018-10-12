const Controller = require('controller')
global.roleWorker = require('role.worker');
global.controller = new Controller({
  minWorkers: 20,
  workersSkills: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
  friends: ['M4RC3L', 'RaisingAgent', 'Gnamly', 'GhostDog'], //COMMING SOON
  repairLimits: {
    constructedWall: 1000 //COMMING SOON
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
  if (flag) flag.room.visual.text(`Worker: ${roleWorker.getAll().length}`, flag.pos.x, flag.pos.y + 1, {align: 'left', opacity: 1})

  //update spawner text
  for (let spawn of Object.values(Game.spawns)) {
    if (spawn.spawning) spawn.room.visual.text(`🛠️ ${Game.creeps[spawn.spawning.name].memory.role}`, spawn.pos.x + 1, spawn.pos.y, {align: 'left', opacity: 1})
  }

  //let the workers do their work
  roleWorker.run()

}
