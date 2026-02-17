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
     * @type {GameActions | null}
     */
    actions: null,


    initialized: false,

    /**
     *
     * @param gameStore {GameStore}
     */
    isReady: (gameStore) => {
    },

    /**
     * @param gameActions {GameActions}
     */
    init(gameActions) {
        if (this.initialized) {
            console.log('Skipping init GameStore since was already initialized.')
            return
        }
        this.actions = gameActions;
        this.actions.onActions.subscribe((action) => {
            console.log('action triggerd =>', action)
        })
        this.initialized = true
        this.isReady(this);
    },


    onReady(callback) {
        this.isReady = callback
    },

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

    /**
     *
     * @returns {GameState}
     */
    getState() {
        return this._state
    },
}

class GameActions {

    onActions = new Subject();

    constructor(game) {

    }


    /**
     * @template {Action} T
     * @param action {T} action
     */
    triggerAction(action) {
        this.onActions.next(action)
    }
}

class Action {

    name = '';
    data = {}

    /**
     *
     * @param name {string}
     * @param data
     */
    constructor(name, data) {
        this.data = data
        this.name = name;
    }
}




