class BaseTrigger extends BasePickableItem {

    BASE_CLASS = 'base_trigger'

    class = this.BASE_CLASS;

    canBeTriggeredBy = [PlayerItem, EnemyItem]

    abilities = [ItemAbilities.IsTrigger]

    /**
     *
     * @param y
     * @param x
     */
    constructor({name, callbackOnPickup}, y, x) {
        super({name, callbackOnPickup})
        this.position.y = y;
        this.position.x = x;
    }

    onTrigger(gameBoard, item) {
        this.onPickupCallback(gameBoard, item)
    }

    update() {

    }

    init() {
        console.log('Initiating triggers', this)
    }
}
