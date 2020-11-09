const { VERSIONS } = require('./constants');

const checkForUpdate = (keyInMemory, newVersion, callback) => {
    const currentVersion = Memory[keyInMemory];
    if (!currentVersion || currentVersion < newVersion) {
        Memory[keyInMemory] = newVersion;
        if (callback) {
            callback(newVersion, currentVersion);
        }
    }
}

const watchForVersionUpdates = ({ onScriptsBuildChange, onMemoryVersionChange, onCreepsManagementVersionChange }) => {
    checkForUpdate('scriptsBuildVersion', VERSIONS.SCRIPTS_BUILD, onScriptsBuildChange);
    checkForUpdate('memoryVersion', VERSIONS.MEMORY, onMemoryVersionChange);
    checkForUpdate('creepsMangementVersion', VERSIONS.CREEPS, onCreepsManagementVersionChange);
};

module.exports = {
    watchForVersionUpdates,
};
