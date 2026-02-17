class PlayerState {
    energy = PlayerStartingEnergy;

    water = PlayerStartingWater;
}

class Area1State {
    tasks = {
        task1: {
            accepted: false
        }
    }

    dialogs = {
        welcome: null
    }

    boxCanBeLiftedNoticedShowed = false

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
