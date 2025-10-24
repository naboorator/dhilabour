class BaseTrigger {
    /**
     * type position {Position}
     */
    position = {
        x: 0,
        y: 0
    }

    canBeTriggeredBy = [PlayerItem, EnemyItem]

    /**
     *
     * @param tilePositionY
     * @param tilePositionX
     */
    constructor(tilePositionY, tilePositionX) {
        this.position.x = tilePositionX;
        this.position.y = tilePositionY;
    }
}
