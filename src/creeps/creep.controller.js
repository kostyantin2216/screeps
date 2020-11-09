const logger = require('../utilities/logger');
const creepFactory = require('../creeps/creep.factory');
const creepStates = require('../creeps/creep.states');
const { removeFromCurrentRoles } = require('../creeps/creep.roles');
const { CREEPS: { CREEPS_TO_MAINTAIN } } = require('../constants');

const handleCreepDeath = (creepName) => {
    const { role } = Memory.creeps[creepName];
    removeFromCurrentRoles(role, creepName);
    delete Memory.creeps[creepName];
    logger.log(`Clearing dead creeps memory, RIP ${creepName}`);
}

const run = () => {
    for(const name in Memory.creeps) {
        if(!Game.creeps[name]) {
            handleCreepDeath(name);
        }
    }

    creepFactory.run({ creepsToMaintain: CREEPS_TO_MAINTAIN });

    _.values(Game.creeps).forEach(creepStates.applyState);
};

module.exports = {
    run,
};
