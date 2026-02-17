class Animation {
    /**
     *
     * @type {string}
     */
    animationName = ''

    /**
     *
     * @type {number}
     */
    length = 0

    /**
     * Start index
     * @type {number}
     */
    startFrame = 0;

    /**
     * Last frame index
     * @returns {number}
     */
    endFrame = () => {
        return this.length;
    }

    /**
     *
     * @type {number}
     */
    currentFrameIndexToPlay = this.startFrame;

    /**
     *
     * @type {string}
     */
    currentFrame;

    /**
     * How many time one frame lasts in milisecnds
     * @type {number}
     */
    animationSpeed = 100;

    /**
     * Frame Start Time
     * @type {number}
     */
    startTime = 0;

    /**
     * Frame Start Time
     * @type {number}
     */
    endTime() {
        return this.startTime + this.animationSpeed;
    }

    /**
     * @type {Map<number, string>}
     */
    animationStack = new Map();

    /**
     * IS animation looping or it ends at the last frame
     * @type {boolean}
     * @private
     */
    _loop = true;

    /**
     *
     * @type {Subject<Animation>}
     */
    onAnimationEnd = new Subject();

    /**
     *
     * @type {Subject<Animation>}
     */
    onAnimationLoopEnded = new Subject()

    constructor(name) {
        this.animationName = name
    }

    /**
     *
     * @param imageUrl
     * @returns {Animation}
     */
    addFrame(imageUrl) {
        this.animationStack.set(this.length, imageUrl);
        this.length = this.animationStack.size;
        return this;
    }

    /**
     *  Should loop
     * @param loop {boolean}
     */
    isLooping(loop) {
        this._loop = loop
    }

    /**
     *
     * @param speed {number}
     */
    setSpeed(speed) {
        this.animationSpeed = speed;
        return this;
    }

    /**
     *
     * @returns {string|null}
     */
    getFrame() {

        if (this.length === 0) {
            return null;
        }

        if (new Date().getTime() > this.endTime()) {

            const animationSprite = this.animationStack.get(this.currentFrameIndexToPlay);

            if (animationSprite) {
                this.currentFrame = animationSprite;
                this.startTime = new Date().getTime();
                this.currentFrameIndexToPlay = this.currentFrameIndexToPlay + 1;

                if (this.currentFrameIndexToPlay >= this.endFrame()) {
                    if (this._loop) {
                        this.currentFrameIndexToPlay = 0;
                        this.onAnimationLoopEnded.next(this);
                    } else {
                        this.currentFrameIndexToPlay = this.currentFrameIndexToPlay - 1;
                        this.onAnimationEnd.next(this);
                    }
                }
            } else {
                console.log('Could not find %i Frame within animation stack: %o', this.currentFrameIndexToPlay, this.animationStack)
            }
        }

        return pathToSprite(this.currentFrame);

    }
}


class ItemAnimations {

    /**
     *
     * @type {Map<string,Animation>}
     */
    animationsList = new Map();

    /**
     *
     * @param name
     * @param animation
     * @param forceOverride
     * @returns {ItemAnimations}
     */
    addAnimation(name, animation) {
        this.animationsList.set(name, animation);
        return this;
    }

    /**
     *
     * @param name
     * @returns {Animation}
     */
    getAnimation(name) {
        return this.animationsList.get(name);
    }

    /**
     *
     * @returns {IterableIterator<string>}
     */
    getAnimationsList() {
        return this.animationsList.keys()
    }
}

