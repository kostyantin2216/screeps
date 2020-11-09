const logger = require('../utilities/logger');
const roles = require('../creeps/creep.roles');
const tasks = require('../creeps/creep.tasks');
const {
    CREEPS: { MAX_IDLE_TIME, IDLE_SEARCH_INTERVAL, IDLE_MESSAGE_WARN_AT },
    STATE_SPAWNING,
    STATE_SEARCHING,
    STATE_MOVING,
    STATE_WORKING,
    STATE_IDLE,
    TASK_GET_RECYCLED,
    STATE_NAMES,
    ROLE_NAMES,
    TASK_NAMES,
} = require('../constants');

const _runSpawning = (creep) => {
    if(!creep.spawning) {
        return STATE_SEARCHING;	
    }
    return STATE_SPAWNING;
};

const _runSearching = (creep) => {
    const role = roles[creep.memory.role];
    logger.log(`running role ${ROLE_NAMES[creep.memory.role]}`, { creep });
    return role.searchForTask(creep);
};

const _runMoving = (creep) => {
    const target = creep.target;

    if (target) {
        const neededRange = creep.memory.preferredTargetDistance || 1;
        
        if (creep.pos.inRangeTo(target, neededRange)) {
            return STATE_WORKING;
        }
            
        creep.moveTo(target);
    } else {
        logger.log(`INVALID TARGET ${target}`, { creep });
        return STATE_SEARCHING;
    }
    return STATE_MOVING;
};

const _runWorking = (creep) => {
    const task = tasks[creep.memory.task];
    logger.log(`running task ${TASK_NAMES[creep.memory.task]}`, { creep });
    return task(creep);
};

const _runIdle = (creep) => {
    const idleTime = creep.memory.idleTime || 0;

    if (idleTime % IDLE_SEARCH_INTERVAL === 0) {
        return STATE_SEARCHING;
    } else if (idleTime === MAX_IDLE_TIME) {
        creep.say('On my way to get recycled');
        creep.target = Game.spawns[creep.memory.spawn];
        creep.task = TASK_GET_RECYCLED;
        return STATE_WORKING;
    } else if ((MAX_IDLE_TIME - idleTime) < IDLE_MESSAGE_WARN_AT) {
        creep.say(`I will be recycled in ${MAX_IDLE_TIME - idleTime} ticks`);
    }

    creep.memory.idleTime = idleTime + 1;
    return STATE_IDLE;
}

const applyState = (creep) => {
    const { state } = creep.memory;
    logger.log(`applying state ${STATE_NAMES[state]}`, { creep })
    const prevState = state;
    let nextState = state;
    switch (state) {
        case STATE_SPAWNING:
            nextState = _runSpawning(creep);
            break;
        case STATE_SEARCHING:
            nextState = _runSearching(creep);
            break;
        case STATE_MOVING:
            nextState = _runMoving(creep);
            break;
        case STATE_WORKING:
            nextState = _runWorking(creep);
            break;
        case STATE_IDLE:
            nextState = _runIdle(creep);
            break;

        default:
            logger.log(`ILLEGAL STATE ${STATE_NAMES[creep.memory.state]}`, { creep });
    }

    creep.memory.state = nextState;

    if (nextState !== prevState && (
            prevState === STATE_SPAWNING || 
            prevState === STATE_SEARCHING || 
            prevState === STATE_MOVING
        )) {
        applyState(creep);
    }
};

module.exports = {
    applyState,
};