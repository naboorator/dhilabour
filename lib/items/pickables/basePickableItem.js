class BasePickableItem extends BaseItem {

    abilities = [ItemAbilities.CanBePicked];

    /**
     *
     * @param gameBoardGrid {GameBoardGrid}
     * @param item {BaseItem}
     */
    onPickupCallback = (gameBoardGrid, item, avatar) => {
        console.log('onPickupCallback', gameBoardGrid, item, avatar);
    }

    constructor({baseClass, callbackOnPickup}) {
        super({baseClass});
        this.BASE_CLASS = baseClass;
        this.class = this.BASE_CLASS;
        this.onPickupCallback = callbackOnPickup;
    }
}
