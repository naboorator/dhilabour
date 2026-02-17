class FootstepEffects extends BaseEffect {

    class = ''

    item;

    lifeTime = 40

    /**
     * @type Orientation
     */
    orientation

    background = '';

    width = 2;
    height = 2;

    /**
     *
     * @param gameBoardGrid {GameBoardGrid}
     * @param item {BaseItem}
     * @param orientation {Orientation}
     */
    constructor(gameBoardGrid, item, orientation) {
        super(item, gameBoardGrid);
        this.item = item;
        this.ready = false
        this.lifeTime = (Math.floor(Math.random() * this.lifeTime)) + this.lifeTime;
        this.opacity = 1;
        this.orientation = orientation;
        setTimeout(() => {
            this.ready = true
        }, 100)

    }

    runEffect() {

        // switch (this.orientation) {
        //     case 'up' :
        //         this.class = 'footsteps-up';
        //         break;
        //     case 'down' :
        //         this.class = 'footsteps-down';
        //         break;
        //     case 'left' :
        //         this.class = 'footsteps-left';
        //         break;
        //     case 'right' :
        //         this.class = 'footsteps-right';
        //         break;
        // }


        this.attributes.opacity = (Math.floor(this.lifeTime / this.alive)) / 10;


    }

}
