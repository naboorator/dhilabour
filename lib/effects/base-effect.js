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
     * },
     * background: {
     *     size: number
     * }
     *
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
        this.attributes.size = {
            w: this.item.width,
            h: this.item.height,
        }
    }

    onDestroyCall(callback) {
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


    addOpacity() {
        const opacity = (Math.floor(this.lifeTime / this.alive)) / 10;
        this.attributes.opacity = opacity < 0.3 ? opacity : 1
    }

    addMoveUp(speed) {
        if (!this.attributes?.position?.top) {
            this.attributes.position = {
                ...this.attributes.position ?? {},
                top: 0
            }
        }
        this.attributes.position.top = this.attributes.position.top - speed;
    }

    addResize(speed, maxHeight, maxWidth) {
        if (!this.attributes?.size?.w) {
            this.attributes.size = {
                ...this.attributes.size ?? {},
                w: 0
            }
        }

        if (!this.attributes?.size?.h) {
            this.attributes.size = {
                ...this.attributes.size ?? {},
                h: 0
            }
        }

        if (this.attributes.size.w < maxHeight) {
            this.attributes.size.w = this.attributes.size.w + speed;
        }

        if (this.attributes.size.h < maxWidth) {
            this.attributes.size.h = this.attributes.size.h + speed;
        }

        this.attributes.background = {
            size: this.attributes.size.h
        }

    }
}
