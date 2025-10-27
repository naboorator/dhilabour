class BasePickableItem extends BaseItem {

    abilities = [ItemAbilities.CanBePicked];

    /**
     *
     * @param gameBoardGrid {GameBoardGrid}
     * @param item {BaseItem}
     */
    onPickupCallback = (gameBoardGrid, item) => {
        console.log('onPickupCallback', gameBoardGrid, item);
    }

    constructor({baseClass, name, callbackOnPickup}) {
        super({baseClass});
        this.BASE_CLASS = name;
        this.class = this.BASE_CLASS;
        this.onPickupCallback = callbackOnPickup;
    }
}
