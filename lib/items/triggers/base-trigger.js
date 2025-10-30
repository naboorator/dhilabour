class BaseTrigger extends BaseItem {

    BASE_CLASS = 'base-trigger-tile'

    class = this.BASE_CLASS;

    canBeTriggeredBy = [PlayerItem, EnemyItem]

    abilities = [ItemAbilities.IsTrigger];

    canRepeat = false;

    hasBeenTriggered = false;


    onTriggered = new Subject()

    _isMoving = false;

    /**
     *
     * @param gameBoardGrid {GameBoardGrid}
     * @param item {BaseItem}
     */
    onStepCallback = (gameBoardGrid, item) => {
        // console.log('onStepCallback', gameBoardGrid, item);
    }

    /**
     *
     * @param gameBoardGrid {GameBoardGrid}
     * @param item {BaseItem}
     */
    onLeaveCallback = (gameBoardGrid, item) => {
        // console.log('onLeaveCallback', gameBoardGrid, item);
    }

    /**
     * @type Subscription
     */
    onLeaveSubscription

    /**
     * @type Subscription
     */
    onStepSubscription;

    /**
     *
     * @param baseClass {string}
     * @param onStepOnCallback {(boarGrid: GameBoardGrid, item: BaseTrigger) => boolean} callback
     * @param canRepeat {boolean}
     * @param y {number}
     * @param x {number}
     */
    constructor({baseClass, onStepCallback, onLeaveCallback, canRepeat}, y, x) {
        super({baseClass})
        this.position.y = y;
        this.position.x = x;
        this.onStepCallback = onStepCallback ?? this.onStepCallback
        this.onLeaveCallback = onLeaveCallback ?? this.onLeaveCallback
        this.canRepeat = canRepeat ?? this.canRepeat;
    }

    onTrigger(gameBoard, item) {
        this.onStepCallback(gameBoard, item);
        if (this.onLeaveSubscription) {
            this.onLeaveSubscription.unsubscribe();
        }
     
        if (this.canRepeat === false) {
            gameBoardGrid.removeItemFromTile(this)
        }
    }

    onLeave(gameBoard, item) {
        this.onLeaveCallback(gameBoard, item);
        if (this.onStepSubscription) {
            this.onStepSubscription.unsubscribe();
        }

    }

    update() {

    }

    init() {
        // console.log('Initiating triggers', this)
    }

    /**
     *
     * @param gameBoardGrid {GameBoardGrid}
     * @param item {BaseItem}
     */
    onDestroy(gameBoardGrid, item) {
        if (this.canRepeat === false) {
            gameBoardGrid.removeItemFromTile(this)
        }
    }

    toggleTrigger(bool) {
        this.hasBeenTriggered = bool;
        this.onTriggered.next(this.hasBeenTriggered)
    }

    isTriggered() {
        return this.hasBeenTriggered;
    }

    setMoving(bool) {
        this._isMoving = bool
    }

    isMoving() {
        return this._isMoving;
    }
}
