module.exports = {
  activities: {
    HARVEST: 0,
    UPGRADE: 1,
    BUILD: 2,
    REPAIR: 3
  },
  getAll: () => Object.values(Game.creeps).filter(creep => creep.memory.role === 'worker'),
  spawn: () => controller.getSpawn().spawnCreep(controller.getWorkersSkills(), 'Worker' + Game.time, {memory: {role: 'worker'}}),
  run: () => {
    if (this.getAll().length < controller.getMinWorkers()) this.spawn(this.getNextId())
    let creeps = this.getAll()
    for (id in creeps) {
      let creep = creeps[id]
      if (!creep.memory.activity) creep.memory.activity = controller.getWorkerTask(id)
      
    }
  }
}
