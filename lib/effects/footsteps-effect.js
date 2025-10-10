class FootstepEffects extends BaseEffect {

    class = ''
    item;

    lifeTime = 10

    /**
     * @type Orientation
     */
    orientation

    /**
     *
     * @param item {BaseItem}
     * @param orientation {Orientation}
     */
    constructor(item, orientation) {
        super();
        this.item = item;
        this.position = item.position;
        this.ready = true
        this.lifeTime = (Math.floor(Math.random() * 200)) + 50;
        this.opacity = 1;
        this.orientation = orientation
    }

    runEffect() {
        switch (this.orientation) {
            case 'up' :
                this.class = 'footsteps-up';
                break;
            case 'down' :
                this.class = 'footsteps-down';
                break;
            case 'left' :
                this.class = 'footsteps-left';
                break;
            case 'right' :
                this.class = 'footsteps-right';
                break;
        }
        this.attributes.opacity = (Math.floor(this.lifeTime / this.alive)) / 10;
    }

}
