const toggleHarvesting = (creep, action, label) => {
    if(creep.memory[action] && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory[action] = false;
        creep.say('🔄 harvest');
    }
    if(!creep.memory[action] && creep.store.getFreeCapacity() === 0) {
        creep.memory[action] = true;
        creep.say(label);
    }
}

const harvest = (creep) => {
    const source = pickClosest(creep, creep.room.find(FIND_SOURCES));
    if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {
            visualizePathStyle: {
                stroke: '#ffaa00'
            }
        });
    }
}

const recycle = (creep) => {
    const spawn = Game.spawns[creep.memory.spawn]
    if (spawn.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn);
    }
};

const sortByDistance = (creep, targets) => _.sortBy(targets, t => creep.pos.getRangeTo(t));

const pickClosest = (creep, targets) => _.head(sortByDistance(creep, targets));

const findFreeEnergyStoreStructures = (creep) => {
    return creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && 
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
}

const findBestSourceForHarvesting = (creep) => {
    const targets = sortByDistance(creep, creep.room.find(FIND_SOURCES));

    creep.setTask(TASK_HARVEST, creepUtils.pickClosest(creep, creep.room.find(FIND_SOURCES)));
}

module.exports = {
    toggleHarvesting,
    harvest,
    recycle,
    sortByDistance,
    pickClosest,
    findFreeEnergyStoreStructures,
};
