const Controller = require('controller')
global.roleWorker = require('roles/worker');
global.controller = new Controller({
  minWorkers: 20,
  workersSkills: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE]
})

module.exports.loop = () => {

  controller.clearDeadMemories()
  controller.updateInfoText()
  controller.updateSpawnerText()

  roleWorker.run()

}
