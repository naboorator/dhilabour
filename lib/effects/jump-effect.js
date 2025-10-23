class JumpEffect extends BaseEffect {

    lifeTime = 30;

    /**
     *
     * @param item {BaseItem}
     * @param speed{number}
     */
    constructor(item, speed = 1) {
        super(item);
        this.ready = true
        this.speed = speed ? speed : 1;
        this.top = 0;

    }

    runEffect() {
        this.top = this.top - 1;
    }
}
