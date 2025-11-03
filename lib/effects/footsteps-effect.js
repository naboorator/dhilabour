class FootstepEffects extends BaseEffect {

    class = ''
    item;

    lifeTime = 40

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
        super(item);
        this.ready = true
        this.lifeTime = (Math.floor(Math.random() * this.lifeTime)) + this.lifeTime;
        this.opacity = 1;
        this.orientation = orientation;
        console.log('Effect created');
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
