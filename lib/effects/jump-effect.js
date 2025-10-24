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

    }

    runEffect() {
        this.addMoveUp(5);
        this.addOpacity();
        this.addResize(50, 300, 300);
    }
}
