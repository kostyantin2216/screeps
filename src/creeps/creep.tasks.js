const logger = require('../utilities/logger');
const {
    STATE_SEARCHING,
    STATE_WORKING,
    STATE_IDLE,
    STATE_MOVING,
    TASK_NONE,
    TASK_HARVEST,
    TASK_UPGRADE,
    TASK_BUILD,
    TASK_TRANSFER,
    TASK_GET_RECYCLED
} = require("../constants");

const _handleResult = (result) => {
    if (result === ERR_NOT_IN_RANGE) {
        return STATE_MOVING;
    }

    if (result === ERR_NOT_ENOUGH_RESOURCES) {
        return STATE_SEARCHING;
    }
    
    if (result !== OK) {
        logger.log(`unhadled err ${result}`);
        return STATE_SEARCHING;
    }

    return STATE_WORKING;
}

const _commonTask = (creep, finishedTask, action) => {
    if (finishedTask) {
        creep.memory.task = TASK_NONE;
        return STATE_SEARCHING;
    }
    return _handleResult(action());
}

const harvest = (creep) => _commonTask(creep, creep.store.getFreeCapacity() === 0, () => creep.harvest(creep.target));

const upgrade = (creep) => _commonTask(creep, creep.store.getUsedCapacity() === 0, () => creep.upgradeController(creep.target));

const build = (creep) => _commonTask(creep, creep.store.getUsedCapacity() === 0, () => creep.build(creep.target));

const transfer = (creep) => _commonTask(creep, creep.store.getUsedCapacity() === 0, () => creep.transfer(creep.target, RESOURCE_ENERGY));

const idle = (creep) => {
    creep.say('Hey i am idle! Give me something to do!');
    return STATE_IDLE;
};

const getRecycled = (creep) => {
    const result = creep.target.recycleCreep(creep);

    if (result === ERR_NOT_IN_RANGE) {
        return STATE_MOVING;
    }
    return STATE_WORKING;
}
  
module.exports = {
    [TASK_NONE]: idle,
    [TASK_HARVEST]: harvest,
    [TASK_UPGRADE]: upgrade,
    [TASK_BUILD]: build,
    [TASK_TRANSFER]: transfer,
    [TASK_GET_RECYCLED]: getRecycled,
};
