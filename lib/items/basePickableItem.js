class BasePickableItem extends BaseItem {

    abilities = [ItemAbilities.CanBePicked];

    onPickupCallback = (gameBoardGrid, item) => {
        console.log('onPickupCallback', gameBoardGrid, item);
    }

    constructor({name, callbackOnPickup}) {
        super();
        this.BASE_CLASS = name;
        this.class = this.BASE_CLASS;
        this.onPickupCallback = callbackOnPickup;
    }
}
