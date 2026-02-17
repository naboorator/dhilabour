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
     * @type GameBoardGrid
     * @private
     */
    _gameBoardGrid = null

    lockFocusTime = 0;

    constructor(gameBoardGrid) {
        this._gameBoardGrid = gameBoardGrid;
    }

    tileLock = {
        y: 0,
        x: 0
    }

    setCameraSize(width, height) {
        this.tilesY = height;
        this.tilesX = width;
    }

    followItem(item) {
        console.log('New follow item', item)
        if (!this.lockFocusTime) {
            this._followItem = item;
            this.tileLock = {
                x: item.position.x,
                y: item.position.y,
            }
            this.stackTileToFollow = [];
        }
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
        const itema = {
            position: {
                x: this.tileLock.x,
                y: this.tileLock.y
            }
        };
        const tiles = findNearByTiles(this._gameBoardGrid.mazeTiles, itema, this.tilesX, this.tilesY, true);

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

        let sortedTiles = tilesSortedY.sort((a, b) => {
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


        // Set internal camera Y-.x positions
        let currentY = null;
        let currentX = 0;
        let prevY = 0;
        sortedTiles.forEach((tile) => {
            if (currentY === null) {
                currentY = 0;
                currentX = 0;
                prevY = tile.y;
            }

            if (prevY !== tile.y) {
                currentY++
                prevY = tile.y;
                currentX = 0;
            }


            tile.cameraY = currentY;
            tile.cameraX = currentX;
            currentX = currentX + 1;
        })

        /**
         *
         * @type {Map<string, MazeTile>}
         */
        let visibleTilesMap = new Map()
        sortedTiles.forEach(tile => {
            visibleTilesMap.set(getGridKey(tile.y, tile.x), tile);
        });

        let tileAroundChar = findNearByTiles(visibleTilesMap, this._followItem, 2, 2, false);
        if (tileAroundChar.length < 25) {
            this.lockFocusTime = null;
            this.followItem(this._followItem);
        }
        return sortedTiles
    }


    stayFocused(tile, time, followItemAfterFocus) {
        if (!this.lockFocusTime) {
            this.followItem(tile);
            this.lockFocusTime = time;
            this.itemTofollowAfter = followItemAfterFocus
        }
    }

    /**
     *
     * @type {BaseItem[]}
     */
    stackTileToFollow = []

}
