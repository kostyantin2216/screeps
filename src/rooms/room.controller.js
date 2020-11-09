const logger = require('../utilities/logger');
const { ROOMS: { MAX_CONSTRUCTIONS } } = require('../constants');
const { createSimpleGridLayout } = require('../rooms/room.layout');

let _currentSpawns = [];
const controllers = {};

const run = () => {
    const currentSpawns = _.keys(Game.spawns);
    if (_currentSpawns.length !== currentSpawns.length) {
        const currentRooms = new Set();
        _currentSpawns = currentSpawns;
        currentSpawns.forEach((spawnName) => {
            const spawn = Game.spawns[spawnName];
            const room = spawn.room;
            let roomMemory = Memory.rooms[room.name];

            if (!roomMemory) {
                roomMemory = {
                    spawns: [
                        spawn.name,
                    ],
                };
                Memory.rooms[room.name] = roomMemory;
            }

            currentRooms.add(room.name);
            if (!roomMemory.spawns.includes(spawn.name)) {
                roomMemory.spawns.push(spawn.name);
            }
            if (!controllers[room.name]) {
                controllers[room.name] = new RoomController(room);
            }
        });

        const rooms = _.keys(Memory.rooms);
        rooms.filter(room => !currentRooms.has(room)).forEach((room) => delete Memory.rooms[room]);
    }

    _.values(controllers).forEach(controller => controller.run());
};

class RoomController {
    constructor(room) {
        this.room = room;
        this.memory = Memory.rooms[room.name];
        this.spawns = Memory.rooms[room.name].spawns.map(spawn => Game.spawns[spawn]);
        this.layout = createSimpleGridLayout(room, this.spawns[0].pos);
        this.finishedLayout = false;
    }

    run() {
        if (!this.finishedLayout) {
            const constructionSites = this.room.find(FIND_MY_CONSTRUCTION_SITES);

            if (constructionSites.length < MAX_CONSTRUCTIONS) {
                this.finishedLayout = !this.layout.placeNext();
            }
        }
    }
}

module.exports = {
    run,
}
