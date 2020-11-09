const logger = require('../utilities/logger');
const { ROLE_TBA, STATE_SPAWNING, TASK_NONE, CREEPS: { NAME_COUNTER_LIMIT } } = require('../constants');
const { result } = require('lodash');

const _initOpts = (opts = {}) => {
    const creepsToMaintain = opts.creepsToMaintain || 0;
    return {
        creepsToMaintain,
    };
};

const _createCreepMemory = (spawn) => ({
    spawn: spawn.name,
    state: STATE_SPAWNING,
    role: ROLE_TBA,
    task: TASK_NONE,
    target: null,
});

const _spawn = (spawn, parts) => {
    if (!Memory.creepCounter) Memory.creepCounter = 0;
    const newName = `C${Memory.creepCounter}`;
    const spawnCode = spawn.spawnCreep(parts, newName, {
        memory: _createCreepMemory(spawn)
    }); 
    if (spawnCode == OK) {
        Memory.creepCounter++;
        if (Memory.creepCounter > NAME_COUNTER_LIMIT) {
            Memory.creepCounter = 1;
        }
        logger.log(`Spawning new creep: ${newName}`);
    }
    return spawnCode;
}

const _visualizeSpawning = (spawn) => {
    const spawningCreep = Game.creeps[spawn.spawning.name];
    spawn.room.visual.text(
        '🛠️' + spawningCreep.name,
        spawn.pos.x + 1, 
        spawn.pos.y, 
        { align: 'left', opacity: 0.8 }
    );
};

/**
 * @param {Object} options
 * @param {number} [options.harvesters=1]
 */
const run = (options) => {
    const opts = _initOpts(options);

    const spawn = Game.spawns['S1'] || Game.spawns['spawn_1'];
    if (spawn.spawning) { 
        _visualizeSpawning(spawn);
    } else {
        const currentCount = Object.keys(Game.creeps).length;
        const requestedCount = opts.creepsToMaintain;
        if (currentCount < requestedCount) {
            let partMultiplier = 5;
            let result = null;
            do {
                const parts = _.range(partMultiplier).reduce((acc) => {
                    acc.push(WORK, CARRY, MOVE);
                    return acc;
                }, []);
                partMultiplier--;
                result = _spawn(spawn, parts);
            } while(result === ERR_NOT_ENOUGH_ENERGY && partMultiplier > 0);
        }
    }
};

module.exports = {
    run,
};
