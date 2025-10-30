/**
 *
 * @type GameState
 */
const InitialState = {
    player: PlayerState,

    areas: {
        area1: Area1State
    }
}

/**
 *
 * @typedef { getState: function , changeState: function }
 */
const GameStore = {

    _state: new GameState(),

    /**
     *
     * @param state {GameState}
     * @param newState {GameState}
     * @returns {GameStore}
     */
    changeStates(state, newState) {
        this._state = {...state, ...newState};
        return this;
    },

    getState() {
        return this._state
    },
}




