require('./prototypes/index');
const logger = require('./utilities/logger');
const creepController = require('./creeps/creep.controller');
const roomContrller = require('./rooms/room.controller');
const { watchForVersionUpdates } = require('./version');

module.exports.loop = function () {
    watchForVersionUpdates({
        onScriptsBuildChange: (newVersion, oldVersion) => {
            logger.log(`scripts build changed! new version: ${newVersion} old version: ${oldVersion}`);
        },
        onMemoryVersionChange: (newVersion) => {
            if (newVersion === 1) {
                _.values(Game.creeps).forEach((creep) => {
                    creep.memory = {
                        spawn: creep.memory.spawn,
                        state: 1,
                        role: 0,
                        task: 0,
                        target: null,
                    };
                })
            }
        }
    })

    creepController.run();
    roomContrller.run();
}
