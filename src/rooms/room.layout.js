const logger = require("../utilities/logger");

class RoomLayout {
    constructor(room) {
        this.room = room;
    }
    placeNext() {
        throw new Error('must override the placeNext method');
    }
}

// class PathLayout extends RoomLayout {

//     constructor(room, positions) {
//         super(room);
//         this.positions = positions;
//         this.paths = positions.map((location) => )
//     }

//     placeNext() {

//     }

// }

class GridLayout extends RoomLayout {

    constructor(room, layout, position) {
        super(room);
        this.position = position;
        this.layout = layout;
        const centerY = Math.floor(layout.length / 2);
        const centerX = Math.floor(layout[centerY].length / 2);
        this.layoutCenter = { x: centerX, y: centerY };
        this.roomDifference = { x: position.x - centerX, y: position.y - centerY };
        this.currentLocation = { x: 0, y: 0 };
    }

    _incrementCurrentLocation() {
        if (this.currentLocation.x < this.layout[this.currentLocation.y].length - 1) {
            this.currentLocation.x++;
            return true;
        }

        if (this.currentLocation.y < this.layout.length - 1) {
            this.currentLocation.y++;
            this.currentLocation.x = 0;
            return true;
        }

        return false;
    }

    _getCurrentLocationInRoom() {
        return {
            x: this.currentLocation.x + this.roomDifference.x,
            y: this.currentLocation.y + this.roomDifference.y,
        };
    }

    placeNext() {
        const value = this.layout[this.currentLocation.y][this.currentLocation.x];

        switch (value) {
            case 'E':
                const { x, y } = this._getCurrentLocationInRoom();
                logger.log(`placing extension in x:${x} y:${y}`);
                const result = this.room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
                if (result === OK) {
                    this._incrementCurrentLocation();
                    return true;
                }
            case '_':
            case 'S':
                if (this._incrementCurrentLocation()) {
                    return this.placeNext();
                }
                break;
        }

        return false;
    }
}

const createSimpleGridLayout = (room, position) => {
    const layout = [
        ['E','E','_','E','_','E','_'],
        ['E','E','_','E','_','E','E'],
        ['_','_','_','_','_','_','_'],
        ['E','E','_','S','_','E','E'],
        ['_','_','_','_','_','_','_'],
        ['E','E','_','E','_','E','E'],
        ['E','E','_','E','_','E','E'],
    ];

    return new GridLayout(room, layout, position);
}

module.exports = {
    createSimpleGridLayout,
};
