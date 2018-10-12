module.exports = {
  activities: {
    HARVEST: 'harvest',
    UPGRADE: 'upgrade',
    BUILD: 'build'
  },
  getAll: () => Object.values(Game.creeps).filter(creep => creep.memory.role === 'worker'),
  spawn: () => controller.getSpawn().spawnCreep(controller.getWorkersSkills(), 'Worker' + Game.time, {memory: {role: 'worker'}}),
  withdrawCreep: (creep) => {
    let energyStorage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType === STRUCTURE_EXTENSION ||
          structure.structureType === STRUCTURE_SPAWN) && structure.energy > 20;
      }
    })
    if (energyStorage === null) return creep.memory.activity = false
    if (creep.withdraw(energyStorage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) creep.moveTo(energyStorage, {visualizePathStyle: {stroke: '#ebff00'}})
  },
  tasks: {
    'harvest': {
      charge: (creep) => {
        let sourceId = creep.memory.srcid
        let source = sourceId ? Game.getObjectById(sourceId) : controller.claimSource(creep.pos)
        creep.memory.srcid = source.id
        if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ff00ff'}});
        }
      },
      charged: (creep) => {
        controller.releaseSource(creep.memory.srcid)
        creep.memory.srcid = false
      },
      use: (creep) => {
        let energyStorage = creep.pos.findClosestByPath(FIND_STRUCTURES, {//TODO: merken und mit isnear überprüfen. (high cpu costs)
          filter: (structure) => {
            return (structure.structureType === STRUCTURE_EXTENSION ||
              structure.structureType === STRUCTURE_SPAWN ||
              structure.structureType === STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
          }
        })
        if (energyStorage === null) return creep.memory.activity = false //zyklus beenden => neue aufgabe vom controller
        if (creep.transfer(energyStorage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) creep.moveTo(energyStorage, {visualizePathStyle: {stroke: '#ff00ff'}})
      }
    },
    'upgrade': {
      charge: (creep) => {
        roleWorker.withdrawCreep(creep)
      },
      use: (creep) => {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#0000ff'}});
      }
    },
    'build': {
      charge: (creep) => {
        roleWorker.withdrawCreep(creep)
      },
      use: (creep) => {
        let constructionSite = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES)
        if (constructionSite === null) return creep.memory.activity = false
        if(creep.build(constructionSite) == ERR_NOT_IN_RANGE) creep.moveTo(constructionSite, {visualizePathStyle: {stroke: '#0000ff'}})
      }
    }
  },
  run: () => {
    // console.log('run')
    if (roleWorker.getAll().length < controller.getMinWorkers()) roleWorker.spawn()
    let creeps = roleWorker.getAll()
    for (id in creeps) {
      let creep = creeps[id]
      // console.log(id, creep.name)
      if (!creep.memory.activity) creep.memory.activity = controller.getWorkerTask(id, creep)
      // console.log(creep.memory.activity, creep.memory.charging)
      if (creep.memory.charging) {
        if (roleWorker.tasks[creep.memory.activity].charge) roleWorker.tasks[creep.memory.activity].charge(creep)

        if (creep.carry.energy === creep.carryCapacity) {
          creep.memory.charging = false
          if (roleWorker.tasks[creep.memory.activity].charged) roleWorker.tasks[creep.memory.activity].charged(creep)

        }
      } else {
        if (roleWorker.tasks[creep.memory.activity].use) roleWorker.tasks[creep.memory.activity].use(creep)
        if (creep.carry.energy === 0) {
          creep.memory.charging = true
          if (roleWorker.tasks[creep.memory.activity].used) {//TODO: cannot read property used of undefined. aber creep.memory.activity = harvest
            roleWorker.tasks[creep.memory.activity].used(creep)
            creep.memory.activity = false
          }
        }
      }
    }
  }
}
