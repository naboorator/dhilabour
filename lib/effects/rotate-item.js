class RotateEffect extends BaseEffect {

    name = 'rotate-effect'

    lifeTime = 40

    /**
     * @type Orientation
     */
    orientation

    angle = 0;

    /**
     *
     * @param gameBoardGrid
     * @param item {BaseItem}
     * @param speed{number}
     */
    constructor(gameBoardGrid, item, speed = 1) {
        super(item, gameBoardGrid);
        this.ready = true
        this.speed = speed ? speed : 1;

    }

    runEffect() {
        this.angle = this.angle + this.speed;
        this.attributes.angle = this.angle;
        this.attributes.size.w = this.attributes.size.w + 10;
        this.attributes.size.h = this.attributes.size.h + 10;

    }

}
