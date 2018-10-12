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

  getMinWorkers() {
    return this.options.minWorkers || 10
  }

  getWorkersSkills() {
    return this.options.workersSkills || [WORK, CARRY, MOVE]
  }

  getWorkerTask(id, creep) {
    let len = roleWorker.getAll().length
    let neededEnergy = len < this.getMinWorkers() ? (this.getMinWorkers() - len) * this.getSkillCosts(this.getWorkersSkills()) : 0
    let energy = creep.room.energyAvailable
    let constructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES).length
    let repairables = creep.room.find(FIND_MY_STRUCTURES).filter(structure => structure.hits < structure.hitsMax && structure.hits < 2000).length // TODO: repairlimits

    let i = Math.round(id/len*100)
    if      (i < 50)  return roleWorker.activities.HARVEST //50% HARVEST
    else if (i < 70)  return (neededEnergy > energy) ? roleWorker.activities.HARVEST : roleWorker.activities.UPGRADE //20% UPGRADE || energy needed to spawn => 20% HARVEST
    else {
      if (neededEnergy > energy) return roleWorker.activities.HARVEST //energy needed to spawn => 30% HARVEST
      if (repairables + constructionSites === 0) return i%2==0 ? roleWorker.activities.HARVEST : roleWorker.activities.UPGRADE //no constructionSites or structures to repair => 15% HARVEST + 15% UPGRADE
      let shareConstructionSites = constructionSites / (constructionSites + repairables)
      if (i < (70 + shareConstructionSites * 30)) return roleWorker.activities.BUILD //20 constructionSites + 10 structures to repair => 20% BUILD + 10% REPAIR
      return roleWorker.activities.REPAIR
    }

  }

  getSpawn() {
    let spawns = Object.values(Game.spawns)
    return spawns[Math.floor(Math.random(spawns.length))]
  }



  claimSource(pos) {
    let room = Game.rooms[pos.roomName]
    let sources = room.find(FIND_SOURCES_ACTIVE)
    let distances = sources.map(source => {
      let add = this.claimedSources[source.id] || 0
      return {distance: pos.findPathTo(source).length + (add * 20), source: source}
    })
    let source = distances.sort((a, b) => a.distance - b.distance)[0].source
    this.claimedSources[source.id] = (this.claimedSources[source.id] || 0) + 1
    return source
  }
  releaseSource(id) {
    this.claimedSources[id] -= 1
  }

}
