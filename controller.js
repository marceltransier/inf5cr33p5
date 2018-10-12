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

  getWorkerTask(id, creep) {

// return roleWorker.activities.HARVEST

    let len = roleWorker.getAll().length
    let neededEnergy = len < this.getMinWorkers() ? (this.getMinWorkers() - len) * this.getSkillCosts(this.getWorkersSkills()) : 0
    let energy = creep.room.energyAvailable
    let constructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES).length
    console.log(constructionSites)

    let i = Math.round(id/len*100)

    if (i < 50) {                                       //  50%
      return roleWorker.activities.HARVEST              //    HARVEST
    } else if (i < 70) {                                //  20%
      if (neededEnergy > energy)                        //    not enough energy
        return roleWorker.activities.HARVEST            //      HARVEST
      else                                              //    enough engergy
        return roleWorker.activities.UPGRADE            //      UPGRADE
    } else {                                            //  30%
      if (neededEnergy > energy)                        //    not enough energy
        return roleWorker.activities.HARVEST            //      HARVEST
      else if (constructionSites > 0)                   //    constructionSite available
        return roleWorker.activities.BUILD              //      BUILD
      else                                              //    no constructionSite available
        return i%2==0 ? roleWorker.activities.UPGRADE   //      UPGRADE
                      : roleWorker.activities.HARVEST   //      HARVEST
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
