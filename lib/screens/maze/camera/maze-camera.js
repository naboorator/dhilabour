class MazeCamera {
    /**
     * MazeTile
     * @type {[]}
     */
    tiles = []

    /**
     * How many tiles s=ti render
     * @type {number}
     */
    tilesY = 4;
    tilesX = 7;

    /**
     *
     * @type {null}
     * @private
     */
    _followItem = null;

    /**
     *
     * @type {MazeTile}
     * @private
     */
    _viewTile = null;

    _visibleTiles = []
    /**
     *
     * @type {Map<number, MazeTile>}
     * @private
     */
    _gameBoardGrid = null

    constructor(gameBoardGrid) {
        this._gameBoardGrid = gameBoardGrid;
    }

    /**
     *
     * @param visibleTiles MazTile
     */
    setVisible(visibleTiles) {

    }


    setCameraSize(width, height) {
        this.tilesY = height;
        this.tilesX = width;
    }

    followItem(item) {
        this._followItem = item
    }

    getCameraWidth() {
        // size 2 means  2 tiles left 2 tiles right + tileSize of item beeing centered + padding?
        const numTilesInRow = 2 * (this.tilesX) + 1;
        return numTilesInRow * (TileSize)
    }

    getCameraHeight() {
        // size 2 means  2 tiles left 2 tiles right + tileSize of item beeing centered + padding?
        const numTilesInRow = 2 * (this.tilesY) + 1;
        return numTilesInRow * (TileSize)
    }

    /**
     *
     * @returns {MazeTile[]}
     */
    getCameraTiles() {
        this._visibleTiles = this.getTiles(this._followItem);
        return this._visibleTiles;
    }

    getTiles(item) {
        const tiles = findNearByTiles(this._gameBoardGrid, item, this.tilesX, this.tilesY, true);

        // Important tiles needs to be correctly sorted so they are displayed correctly!!!
        let tilesSortedY = tiles.sort((a, b) => {
            if (a.y > b.y) {
                return 1;
            } else if (a.y < b.y) {
                return -1;
            } else {
                return 0;
            }
        })

        return tilesSortedY.sort((a, b) => {
            if (a.y !== b.y) {
                return 0;
            }

            if (a.x > b.x) {
                return 1
            } else if (a.x < b.x) {
                return -1;
            } else {
                return 0
            }
        });

    }

    getVisibleTiles() {
        return this._visibleTiles;
    }
}
