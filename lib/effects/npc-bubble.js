class NpcBubble extends BaseEffect {

    lifeTime = 10000;

    /**
     *
     * @param item {BaseItem}
     * @param speed{number}
     */
    constructor(item, speed = 1) {
        super(item);

        this.ready = true
        this.speed = speed ? speed : 1;
        this.item = item;
    }

    runEffect() {
        this.addMoveUp(5);
        this.addOpacity();
        this.addResize(50, 300, 300);
    }
}
