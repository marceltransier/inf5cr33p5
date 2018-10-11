module.exports = class Controller {

  constructor(options = {}) {
    this.options = options
  }

  clearDeadMemories() {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name]
            console.log('Clearing non-existing creep memory:', name)
        }
    }
  }

  updateInfoText() {
    let flag = Game.flags['Information']
    if (flag) flag.room.visual.text(`Worker: ${roleWorker.getAll().length}`, flag.pos.x, flag.pos.y + 1, {align: 'left', opacity: 1})
  }

  updateSpawnerText() {
    for (let spawn of Object.values(Game.spawns)) {
      if (spawn.spawning) spawn.room.visual.text(`🛠️ ${spawn.spawning.memory.role}`, spawn.pos.x + 1, spawn.pos.y, {align: 'left', opacity: 1})
    }
  }

  getMinWorkers() {
    return options.minWorkers || 10
  }

  getWorkersSkills() {
    return options.workersSkills || [WORK, CARRY, MOVE]
  }

  getWorkerTask(id) {
    let len = roleWorker.getAll().length
    let i = Math.round(id/len*100)
    if      (i < 50)  return roleWorker.activities.HARVEST
    else if (i < 70)  return roleWorker.activities.UPGRADE
    else if (i < 90)  return roleWorker.activities.BUILD //TODO: bedarf?
    else              return roleWorker.activities.REPAIR

  }

  getSpawn() {
    return Object.values(Game.spawns)[0]
  }

}
