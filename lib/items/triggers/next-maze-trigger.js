class NextMazeTrigger extends BaseTrigger {

    avatarSubscription = null;

    exitOrientation = 'down';

    onStepCallback = (gameBoardGrid, item, avatar) => {
        console.log('Player stepped on tirgger');
        if (this.avatarSubscription) {
            this.avatarSubscription.unsubscribe();
        }

        // When item enters on a tile subsribe to avatar moves
        this.avatarSubscription = avatar.onMoveChange.subscribe((orientation) => {
            console.log('avatarSubscription', this.startAtTile, orientation);

            if (orientation === this.exitOrientation) {
                this.avatarSubscription = this.avatarSubscription.unsubscribe();
                //  console.log('Going into ', this.loadArea, this.startAtTile)
                gameBoardGrid.removeItemFromTile(avatar);
                gameBoardGrid.saveState();
                avatar.onMoveChange.clearAllSubscribers();
                const newScreen = new MazeScreen(gameBoardGrid.game, this.startAtTile, avatar)
                gameBoardGrid.game.setArea(this.loadArea)
                gameBoardGrid.game.setGameScreen(newScreen)

            }
        })

        // console.log('subscribers', avatar.onMoveChange.numOfSubscribers());
    }

    onLeave(gameBoard, item) {
        super.onLeave(gameBoard, item);
        // console.log('Player leaving a trigger');
        if (this.avatarSubscription) {
            // console.log('onLeave usubscribing previous subscription');
            // console.log(this.avatarSubscription.subject);
            this.avatarSubscription.unsubscribe();
        }
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
                    startTileChar,
                    exitOrientation
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
        this.canRepeat = canRepeat ?? true;
        this.loadArea = loadArea
        this.startAtTile = startTileChar
        this.exitOrientation = exitOrientation
    }


    toggleTrigger(bool) {
        this.hasBeenTriggered = bool;
        this.onTriggered.next(this.hasBeenTriggered)
    }

}
