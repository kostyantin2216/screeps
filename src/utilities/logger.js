const { LOGGER } = require('../constants');
const { FILTER } = LOGGER;

const log = (message, options = {}) => {
    if (FILTER && FILTER.CREEP) {
        if (options.creep && options.creep.name !== FILTER.CREEP) return;
    }

    let msg = message;
    if (options.creep) {
        msg = `${options.creep.name}: ${msg}`;
    }
    msg = `${Game.time} - ${msg}`;
    console.log(msg);
}

module.exports = {
    log,
};
