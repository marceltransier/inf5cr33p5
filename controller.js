module.exports = class Controller {

  constructor(options = {}) {
    this.options = options
    this.claimedSources = {}
  }


  getSkillCosts(skills) {
    let costs = 0
    for (let skill of skills) costs += BODYPART_COST[skill]
    return costs
  }

  getFriends() {
    return this.options.friends || []
  }

  getMinWorkers() {
    return this.options.minWorkers || 10
  }

  getWorkersSkills() {
    return this.options.workersSkills || [WORK, CARRY, MOVE]
  }

  getRepairLimits() {
    return this.options.repairLimits || {}
  }

  getNeededEnergy(room) {
    let workers = roleWorker.getAll()
    let minWorkers = this.getMinWorkers()
    let neededEnergy = workers.length < minWorkers ? (minWorkers - workers.length) * this.getSkillCosts(this.getWorkersSkills()) : 0

    for (let tower of room.find(FIND_MY_STRUCTURES, {filter: structure => structure.structureType === STRUCTURE_TOWER})) {
      if (tower.energy < tower.energyCapacity * .7) neededEnergy += tower.energyCapacity * .8 - tower.energy
    }

    if (Game.flags['here']) neededEnergy += 1300

    return neededEnergy
  }

  isEnergyNeeded(room) {
    let energy = room.energyAvailable
    let neededEnergy = this.getNeededEnergy(room)
    return energy < neededEnergy
  }

  getWorkerTask(creep) {
    let workers = roleWorker.getAll()
    let minWorkers = this.getMinWorkers()

    let energyNeeded = this.isEnergyNeeded(creep.room)

    let constructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES).length
    let ids = workers.map(creep => parseInt(creep.id, 16)).sort((a, b) => a-b)
    let id = parseInt(creep.id, 16)
    let index = ids.indexOf(id)
    let i = (index+1) / ids.length

    if (i <= .5) return roleWorker.activities.HARVEST
    else if (i <= .7) {
      if (energyNeeded)
        return roleWorker.activities.HARVEST
      else
        return roleWorker.activities.UPGRADE
    } else {
      if (energyNeeded)
        return roleWorker.activities.HARVEST
      else if (constructionSites > 0)
        return roleWorker.activities.BUILD
      else
        return index%2==0 ? roleWorker.activities.UPGRADE
                          : roleWorker.activities.HARVEST
    }
  }



  getEnergyStorageToTransfer(creep) {
    let len = roleWorker.getAll().length
    let neededEnergy = len < this.getMinWorkers() ? (this.getMinWorkers() - len) * this.getSkillCosts(this.getWorkersSkills()) : 0
    let energy = creep.room.energyAvailable
    return creep.pos.findClosestByPath(FIND_STRUCTURES, {//TODO: merken und mit isnear überprüfen. (high cpu costs)
      filter: (structure) => {
        return (structure.structureType === STRUCTURE_EXTENSION ||
          structure.structureType === STRUCTURE_SPAWN ||
          (structure.structureType === STRUCTURE_TOWER && (this.isEnergyNeeded(structure.room) || structure.energy < structure.energyCapacity * .7))) && structure.energy < structure.energyCapacity
      }
    })
  }

  getSpawn() {
    let spawns = Object.values(Game.spawns)
    return spawns[Math.floor(Math.random(spawns.length))]
  }



  getSource(creep) {
    // let room = Game.rooms[pos.roomName]
    // let sources = room.find(FIND_SOURCES_ACTIVE)
    // let distances = sources.map(source => {
    //   let add = this.claimedSources[source.id] || 0
    //   return {distance: pos.findPathTo(source).length + (add * 20), source: source}
    // })
    // let source = (distances.sort((a, b) => a.distance - b.distance)[0] || {}).source
    // if (!source) return
    // this.claimedSources[source.id] = (this.claimedSources[source.id] || 0) + 1
    // return source
    let sources = creep.room.find(FIND_SOURCES_ACTIVE)
    if (!sources.length) return
    let distances = sources.map(source => ({distance: creep.pos.findPathTo(source).length + ((this.claimedSources[source.id] || 0) * 20), source: source}))
    let source = distances.sort((a, b) => a.distance - b.distance)[0].source
    this.claimedSources[source.id] = (this.claimedSources[source.id] || 0) + 1
    return source
  }
  releaseSource(id) {
    this.claimedSources[id] -= 1
  }

}
