const logger = require('../utilities/logger');
const creepUtils = require('../utilities/creep.utils');
const { TASK_NAMES } = require('../constants');

// Properties

Object.defineProperty(Creep.prototype, 'target', {
    get: function() {
        if (!this._target) {
            const { target } = this.memory;
            if (target) {
                this._target = Game.getObjectById(target);
            }
        }
        return this._target;
    },
    set: function(target) {
        if (_.isString(target)) {
            this._target = Game.getObjectById(target);
        } else {
            this._target = target;
        }

        this.memory.target = this._target ? this._target.id : this._target;
    },
    enumerable: false,
    configurable: true
});

// Functions

Creep.prototype.setTask = function(task, target = null) {
    logger.log(`setting task ${TASK_NAMES[task]} ${target && target.id}`, { creep: this });
    this.memory.task = task;
    this.target = target;
}

Creep.prototype.moveToClosest = function(targets) {
    const target = creepUtils.pickClosest(this, targets);
    return this.moveTo(target);
}

Creep.prototype.findClosestSource = function() {
    return creepUtils.pickClosest(this, this.room.find(FIND_SOURCES));
}
