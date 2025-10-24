class BaseTrigger extends BaseItem {


    canBeTriggeredBy = [PlayerItem, EnemyItem]

    abilities = [ItemAbilities.IsTrigger]

    /**
     *
     * @param y
     * @param x
     */
    constructor({}, y, x) {
        super()

    }

    update() {

    }

    init() {
        console.log('Initiating triggers', this)
    }
}
