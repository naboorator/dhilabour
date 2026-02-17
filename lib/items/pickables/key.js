class KeyItem extends BasePickableItem {
    BASE_CLASS = 'key-tile';

    abilities = [ItemAbilities.IsInventoryItem, ItemAbilities.CanBePicked]

    unlocksTileChar = null;

    keyLockCode = null;

    constructor({baseClass, itemClass, abilities, unlocks, keyLockCode, callbackOnPickup}) {
        super({baseClass, itemClass, abilities, callbackOnPickup});
        this.BASE_CLASS = baseClass;
        this.unlocksTileChar = unlocks
        this.keyLockCode = keyLockCode ?? null
    }

    init() {
        const idleAnimation = new Animation();
        idleAnimation.addFrame('/assets/images/items/blue-key.png')
        this.animations.addAnimation('Idle', idleAnimation);
        this.setCurrentItemAnimation('Idle');
    }

    /**
     *
     * @param gameBoardGrid {GameBoardGrid}
     */
    onPickUp(gameBoardGrid, avatar) {
        gameBoardGrid.effects.addEffect(new RotateEffect(this, avatar, 15))
        this.onPickupCallback(gameBoardGrid, this, avatar)
    }

    /**
     *
     * @param gameBoard {GameBoardGrid}
     */
    onPlaceDown(gameBoard) {
        this.class = [this.BASE_CLASS, 'on'].join(' ');
        gameBoard.setPlayableItemPosition(this.position.y, this.position.x, this);

    }

}
