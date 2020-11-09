const ROLE_TBA = 0;
const ROLE_HARVESTER = 1;
const ROLE_UPGRADER = 2;
const ROLE_BUILDER = 3;

const STATE_SPAWNING = 0;
const STATE_SEARCHING = 1;
const STATE_MOVING = 2;
const STATE_WORKING = 3;
const STATE_IDLE = 4;

const TASK_NONE = 0;
const TASK_HARVEST = 1;
const TASK_UPGRADE = 2;
const TASK_BUILD = 3;
const TASK_TRANSFER = 4;
const TASK_GET_RECYCLED = 5;

module.exports = {

    LOGGER: {
        FILTER: {
            CREEP: 'C13'
        }
    },

    CREEPS: {
        MAX_IDLE_TIME: 100,
        IDLE_SEARCH_INTERVAL: 10,
        IDLE_MESSAGE_WARN_AT: 20,
        NAME_COUNTER_LIMIT: 1000,

        CREEPS_TO_MAINTAIN: 7,
        ROLES_TO_MAINTAIN: {
            [ROLE_HARVESTER]: 2,
            [ROLE_UPGRADER]: 3,
            [ROLE_BUILDER]: 2,
        }
    },

    ROOMS: {
        MAX_CONSTRUCTIONS: 4,
    },

    ROLE_TBA,
    ROLE_HARVESTER,
    ROLE_UPGRADER,
    ROLE_BUILDER,

    ALL_ROLES: [
        ROLE_TBA,
        ROLE_HARVESTER,
        ROLE_UPGRADER,
        ROLE_BUILDER,
    ],

    ROLE_NAMES: {
        [ROLE_TBA]: 'TBA',
        [ROLE_HARVESTER]: 'harvester',
        [ROLE_UPGRADER]: 'upgrader',
        [ROLE_BUILDER]: 'builder',
    },

    STATE_SPAWNING,
    STATE_SEARCHING,
    STATE_MOVING,
    STATE_WORKING,
    STATE_IDLE,

    ALL_STATES: [
        STATE_SPAWNING,
        STATE_SEARCHING,
        STATE_MOVING,
        STATE_WORKING,
        STATE_IDLE,
    ],

    STATE_NAMES: {
        [STATE_SPAWNING]: 'spawning',
        [STATE_SEARCHING]: 'searching',
        [STATE_MOVING]: 'moving',
        [STATE_WORKING]: 'working',
        [STATE_IDLE]: 'idle'
    },

    TASK_NONE,
    TASK_HARVEST,
    TASK_UPGRADE,
    TASK_BUILD,
    TASK_TRANSFER,
    TASK_GET_RECYCLED,

    ALL_TASKS: [
        TASK_NONE,
        TASK_HARVEST,
        TASK_UPGRADE,
        TASK_BUILD,
        TASK_TRANSFER,
        TASK_GET_RECYCLED,
    ],

    TASK_NAMES: {
        [TASK_NONE]: 'none',
        [TASK_HARVEST]: 'harvest',
        [TASK_UPGRADE]: 'upgrade',
        [TASK_BUILD]: 'build',
        [TASK_TRANSFER]: 'transfer',
        [TASK_GET_RECYCLED]: 'get_recycled',
    },

    VERSIONS: {
        SCRIPTS_BUILD: 0, // This will be overriden (see bottom of file)
        MEMORY: 1,
        CREEPS: 1,
    }

};

// Build version will be appended here by grunt during the build process.
// eg. module.exports.SCRIPTS_BUILD_VERSION = {current time}"
