class NextMazeTrigger extends BaseTrigger {

    onStepCallback = (gameBoardGrid, item) => {
        console.log('onStepCallback', gameBoardGrid, item);


        let store = GameStore
        let state = {...store.getState()};
        const areaAme = this.loadArea;
        const startTile = this.startAtTile;

        let newState = {
            ...state,
            areas: {
                ...state.areas,
            }
        };

        if (newState.areas[areaAme]) {
            newState.areas[areaAme].gameBoardGrid = gameBoardGrid;
        } else {
            newState.areas[areaAme] = {
                gameBoardGrid: gameBoardGrid
            };
        }

        store.changeStates(state, newState);
       
        // Remember tile where user exited current maze.
        gameBoardGrid.game.setArea(this.loadArea)
        gameBoardGrid.game.setGameScreenAndPreserveCurrent(new MazeScreen(gameBoardGrid.game, startTile))
    }

    loadArea = '';

    startAtTile = ''

    constructor({
                    baseClass,
                    skipGameId,
                    abilities,
                    onInteractCallBack,
                    onStepCallback,
                    onLeaveCallback,
                    canRepeat,
                    loadArea,
                    startTileChar
                }) {
        super({
            baseClass,
            skipGameId,
            abilities,
            onInteractCallBack,
            onStepCallback,
            onLeaveCallback,
            canRepeat
        });
        this.loadArea = loadArea
        this.startAtTile = startTileChar
    }


    toggleTrigger(bool) {
        this.hasBeenTriggered = bool;
        this.onTriggered.next(this.hasBeenTriggered)
    }


}
