class BaseEffect {
    /**
     * @type GameEffects
     */
    gameEffects

    zindex = 1;
    /**
     * @type {{x: number, y: number}}
     */
    position;

    /**
     * IS effect ready or not for rendering when yes rendering will happen
     * @type {boolean}
     */
    ready = true;

    lifeTime = 500;

    alive = 0;

    updateSpeed = 1;

    timeToUpdate = 0;

    multuplyTimes = 0;
    /**
     * @type {{
     * opacity: number,
     * position: {top: number, left: number}
     * size: {
     *     w: string | number,
     *     h: string | number
     * }
     * }}
     */
    attributes = {}
    

    onDestroy = (effect) => {
        console.log('Destroying effect', effect);
    }

    onAddNewEffect = (effect) => {
        console.log('add new effect', effect);
    }

    /**
     *
     * @param gameEffects {GameEffects}
     */
    attachedGameEffects(gameEffects) {
        this.gameEffects = gameEffects
    }

    /**
     * GameEffect is using this do not remove
     */
    update() {
        if (this.ready) {
            this.runEffect();
        } else {
            this.prepareEffect()
        }

        ++this.alive

        if (this.alive >= this.lifeTime) {
            this.destroyEffect(this);
        }
    }

    prepareEffect() {

    }

    runEffect() {

    }


    destroyEffect() {
        this.onDestroy(this);
    }

    addEffect(effect) {
        this.onAddNewEffect(effect);
    }
}
