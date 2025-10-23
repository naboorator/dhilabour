class BaseEffect {
    /**
     * @type GameEffects
     */
    gameEffects
    item;

    class;

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

    lifeTime = 10;

    alive = 0;

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

    onDestroyCallsStack = [];

    /**
     *
     * @param item {BaseItem}
     */
    constructor(item) {
        this.class = item.class
        this.item = item;
        this.position = item.position;
    }

    onDestroyCall(callback) {
        console.log('Adding on destroy call')
        this.onDestroyCallsStack.push(callback);
    }


    onAddNewEffect = (effect) => {
        console.log('add new effect', effect);
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


    destroyEffect(effect) {
        this.onDestroyCallsStack.forEach(callback => callback(effect));
    }

    addEffect(effect) {
        this.onAddNewEffect(effect);
    }


    destroyFunc
}
