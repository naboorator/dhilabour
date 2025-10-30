class PlayerState {
    energy = PlayerStartingEnergy;

    water = PlayerStartingWater;
}

class Area1State {
    dialogs = {
        welcome: null
    }

    doors = {
        blue: {
            locked: true
        }
    }
}


class GameState {
    /**
     * @type PlayerState
     */
    player = new PlayerState()

    /**
     *
     *
     */
    areas = {
        area1: new Area1State()
    }
}
