class KeyItem extends BasePickableItem {
    BASE_CLASS = 'key-tile';

    abilities = [ItemAbilities.IsInventoryItem, ItemAbilities.CanBePicked]

    unlocksTileChar = null;

    constructor({baseClass, itemClass, abilities, unlocks}) {
        super({baseClass, itemClass, abilities});
        this.unlocksTileChar = unlocks
    }

    /**
     *
     * @param gameBoardGrid {GameBoardGrid}
     */
    onPickUp(gameBoardGrid) {
        gameBoardGrid.effects.addEffect(new RotateEffect(this, 15))
        //this.abilities = [ItemAbilities.canBePlaced];
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
