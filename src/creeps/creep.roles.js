const logger = require('../utilities/logger');
const creepUtils = require('../utilities/creep.utils');
const {
    CREEPS: {
        CREEPS_TO_MAINTAIN,
        ROLES_TO_MAINTAIN,
    },
    STATE_MOVING,
    STATE_IDLE,
    TASK_NONE,
    TASK_HARVEST,
    TASK_UPGRADE,
    TASK_BUILD,
    TASK_TRANSFER,
    ROLE_TBA,
    ROLE_HARVESTER,
    ROLE_UPGRADER,
    ROLE_BUILDER,
    ROLE_NAMES,
    STATE_SEARCHING,
} = require('../constants');

const _getCurrentRoles = () => {
    return Memory.currentRoles;
}

const _rolePerCreep = (() => {
    const currentRoles = _getCurrentRoles();
    if (!currentRoles) return {};

    return _.keys(currentRoles).reduce((acc, role) => {
        for (const creep of currentRoles[role]) {
            acc[creep.name] = role;
        }
        return acc;
    }, {});
})();

const _updateCurrentRoles = (newRole, creep) => {
    const currentRoles = _getCurrentRoles() || {};

    const oldRole = _rolePerCreep[creep.name];
    if (oldRole === undefined || oldRole !== newRole) {
        removeFromCurrentRoles(oldRole, creep.name);

        if (newRole !== ROLE_TBA) {
            if (!currentRoles[newRole]) {
                currentRoles[newRole] = [];
            }
            currentRoles[newRole].push(creep.name);
            _rolePerCreep[creep.name] = newRole;
        } else {
            delete _rolePerCreep[creep.name];
        }

        Memory.currentRoles = currentRoles;
    }
}

const _commonTaskSearch = (findTask) => {
    return (creep) => {
        if (creep.memory.task === TASK_NONE) {
            return findTask(creep);
        }

        creep.setTask(TASK_NONE);
        return STATE_IDLE;
    }
}

const _assignRole = (creep, role) => {
    creep.memory.role = role;
    _updateCurrentRoles(role, creep);
};

const removeFromCurrentRoles = (role, creepName) => {
    const {
        currentRoles
    } = Memory;
    if (currentRoles && currentRoles[role]) {
        currentRoles[role] = currentRoles[role].filter((_creepName) => _creepName !== creepName);

        if (currentRoles[role].length === 0) {
            delete currentRoles[role];
        }
    }
    if (_rolePerCreep[creepName]) {
        delete _rolePerCreep[creepName];
    }
}

const roleToBeAssigned = {
    searchForTask: (creep) => {
        const currentRoles = _getCurrentRoles() || {};
        logger.log(`searching for roles current: ${_.keys(_rolePerCreep).length} needed: ${CREEPS_TO_MAINTAIN}`, {
            creep
        });
        if (_.keys(_rolePerCreep).length < CREEPS_TO_MAINTAIN) {
            for (const role of _.keys(ROLES_TO_MAINTAIN)) {
                if (!currentRoles[role] || currentRoles[role].length < ROLES_TO_MAINTAIN[role]) {
                    _assignRole(creep, role);
                    return STATE_SEARCHING;
                } else {
                    logger.log(`role ${ROLE_NAMES[role]} does not suit`, {
                        creep
                    });
                }
            }
        } else {
            creep.say('I cannot find any suitable role :(');
        }

        creep.setTask(TASK_NONE);
        return STATE_IDLE;
    }
}

const roleHarvester = {
    searchForTask: _commonTaskSearch((creep) => {
        if (creep.store.getFreeCapacity() === 0) {
            const freeEnergyStoreStructures = creepUtils.findFreeEnergyStoreStructures(
                creep
            );
            if (freeEnergyStoreStructures.length > 0) {
                creep.setTask(
                    TASK_TRANSFER,
                    creepUtils.pickClosest(creep, freeEnergyStoreStructures)
                );
            } else {
                const constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);

                if (constructionSites.length > 0) {
                    creep.setTask(
                        TASK_BUILD,
                        creepUtils.pickClosest(creep, constructionSites)
                    );
                } else {
                    creep.setTask(TASK_UPGRADE, creep.room.controller);
                }
            }
        } else {
            const target = creep.findClosestSource();
            logger.log(`target ${target}`, {
                creep
            });
            creep.setTask(TASK_HARVEST, target);
        }
        return STATE_MOVING;
    }),
};

const roleUpgrader = {
    searchForTask: _commonTaskSearch((creep) => {
        if (creep.store.getFreeCapacity() === 0) {
            creep.setTask(TASK_UPGRADE, creep.room.controller);
        } else {
            creep.setTask(TASK_HARVEST, creepUtils.pickClosest(creep, creep.room.find(FIND_SOURCES)));
        }
        return STATE_MOVING;
    }),
};

const roleBuilder = {
    searchForTask: _commonTaskSearch((creep) => {
        if (creep.store.getFreeCapacity() === 0) {
            const constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (constructionSites.length > 0) {
                creep.setTask(TASK_BUILD, creepUtils.pickClosest(creep, constructionSites));
            } else {
                const freeEnergyStoreStructures = creepUtils.findFreeEnergyStoreStructures(creep);
                if (freeEnergyStoreStructures.length > 0) {
                    creep.setTask(TASK_TRANSFER, creepUtils.pickClosest(creep, freeEnergyStoreStructures));
                } else {
                    creep.setTask(TASK_UPGRADE, creep.room.controller);

                }
            }
        } else {
            creep.setTask(TASK_HARVEST, creepUtils.pickClosest(creep, creep.room.find(FIND_SOURCES)));
        }
        return STATE_MOVING;
    }),
};

module.exports = {
    removeFromCurrentRoles,
    [ROLE_TBA]: roleToBeAssigned,
    [ROLE_HARVESTER]: roleHarvester,
    [ROLE_UPGRADER]: roleUpgrader,
    [ROLE_BUILDER]: roleBuilder,
};