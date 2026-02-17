class Sprite {
    /**
     * Path to sprite
     * @type {string}
     */
    source = '';

    offset = {
        x: 0,
        y: 0,
    }

    size = TileSize;

    /**
     *
     * @param imgUrl {string}
     */
    constructor(imgUrl) {
        this.source = imgUrl;
    }

    /**
     *
     * @returns {string}
     */
    image() {
        return this.source
    }

    /**
     *
     * @param y {number}
     * @param x  {number}
     */
    setOffset(y, x) {
        this.offset = {
            y, x
        }
        return this;
    }

    getOffsetX() {
        return this.offset.x
    }

    getOffsetY() {
        return this.offset.y
    }

    getSize() {
        return this.size
    }

    setSize(size) {
        this.size = size;
        return this;
    }
}


function pathToSprite(path) {
    return new Sprite(path);
}
