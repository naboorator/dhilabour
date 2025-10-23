class ExplodeEffect extends BaseEffect {
    name = 'ExplodeEffect';

    /**
     * @type BaseItem
     */
    itemToExplode;

    lifeTime = 25;

    particles = 30;

    minSpeed = 3
    maxSpeed = 8;


    ready = false;
    isRoot = true;

    yMovingUp = '';
    xMovingLeft = '';

    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     *
     * @param item {BaseItem}
     * @param isRoot {boolean}
     */
    constructor(item, isRoot = true, particles, minSpeed, maxSpeed) {
        super(item);

        this.minSpeed = minSpeed ? minSpeed : this.minSpeed;
        this.maxSpeed = maxSpeed ? maxSpeed : this.maxSpeed;
        this.particles = particles ? particles : this.particles;
        this.isRoot = isRoot;
        this.attributes.position = {
            top: Math.floor(Math.random() * 15),
            left: Math.floor(Math.random() * 15)
        }


        const randY = Math.floor(Math.random() * 10);
        if (randY > 0 && randY < 4) {
            this.yMovingUp = 'up'
        } else if (randY > 4 && randY < 7) {
            this.yMovingUp = ''
        } else {
            this.yMovingUp = 'down'
        }

        const randX = Math.floor(Math.random() * 10);
        if (randX > 0 && randX < 4) {
            this.xMovingLeft = 'left'
        } else if (randX > 4 && randX < 7) {
            this.xMovingLeft = ''
        } else {
            this.xMovingLeft = 'right'
        }

        this.attributes.size = {
            w: Math.floor(Math.random() * 15),
            h: Math.floor(Math.random() * 15)
        }

        this.particleSpeed = this.getRandomArbitrary(this.minSpeed, this.maxSpeed);

    }

    prepareEffect() {
        if (this.isRoot && this.particles > 0) {
            let i = 1;
            while (i <= this.particles) {
                this.addEffect(new ExplodeEffect(this.item, false))
                i++;
            }
        }

        this.ready = true;
    }

    runEffect() {
        let newX
        let newY


        if (this.xMovingLeft === 'right') {
            newX = this.attributes.position.left + this.particleSpeed
        } else if (this.xMovingLeft === 'left') {
            newX = this.attributes.position.left - this.particleSpeed
        } else {
            newX = this.attributes.position.left
        }

        if (this.yMovingUp === 'up') {
            newY = this.attributes.position.top - this.particleSpeed
        } else if (this.yMovingUp === 'down') {
            newY = this.attributes.position.top + this.particleSpeed
        } else {
            newY = this.attributes.position.top
        }

        this.attributes.position.top = newY
        this.attributes.position.left = newX
        const opacity = (Math.floor(this.lifeTime / this.alive)) / 10;
        this.attributes.opacity = opacity < 0.3 ? opacity : 1
    }
}
