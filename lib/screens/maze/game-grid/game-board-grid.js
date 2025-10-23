class GameBoardGrid {
    fogRadius = 5;
    /**
     * WallItems, EmptyItems
     * @type {[[]]}
     */
    backgroundGrid = [[]];

    backgroundGridMap = new Map();

    /**
     * Player, enemies, boxes, pickups...
     * @type {Map<string, Map<number, BaseItem>>}
     */
    playableItemsMap = new Map();

    /**
     *
     * @type {Map<string, Map<number, BaseItem>>}
     */
    allItemsMap = () => {
        return new Map([...this.backgroundGridMap, ...this.playableItemsMap])
    }

    /**
     *
     */
    effects = new GameEffects();

    /**
     *
     * @type {PlayerItem}
     */
    player = null;


    playerMoves = 0;

    /**
     *
     * @type {BoxPlaceItem[]}
     */
    boxPlaces = []

    /**
     *
     * @type {[BoxItem]}
     */
    boxItems = []

    /**
     *
     * @type {PortalItem[]}
     */
    portalPlaces = []

    /**
     *
     * @type {EnemyItem[]}
     */
    enemies = []

    /**
     * @type Game
     */
    game

    /**
     *
     * @type {number}
     */
    timeout;

    gravity = 1;
    gravityUpdate = 10;
    time = 0

    visibleTiles = []

    onReady = () => {
        console.log('Board ready')
    }

    /**
     *
     * @type {MazeMovementResolver}
     */
    movementResolver = null;

    constructor(game) {
        this.game = game
        this.movementResolver = new MazeMovementResolver(this.game, this);
    }

    notify(data) {
        // const nearByTiles = this.findNearByTiles(this.player, 1);
        // this.makeVisible(nearByTiles);
    }

    /**
     *
     * @type {number[]}
     */
    maxLineLengths = []

    parseMap(layout) {
        const rows = layout.trim().split("\n");

        for (let y = 0; y < rows.length; y++) {
            // this.backgroundGrid[y] = [];
            // this.movableItems[y] = [];
            let maxX = 0;
            for (let x = 0; x < rows[y].length; x++) {
                const emptyTile = createGameItem('.', this.game, y, x);
                this.backgroundGridMap.set(this.gridKey(y, x), new Map().set(0, emptyTile));


                // this.movableItems[y][x] = [];
                const char = rows[y][x]
                // This will create grid for the game
                // this.backgroundGrid[y][x] = createGameItem('.', this.game, y, x);

                const gameItem = createGameItem(char, this.game, y, x);

                if (gameItem && !(gameItem instanceof EmptyItem)) {
                    // this.gridMap.set(this.gridKey(y, x))
                    this.assignItemToCorrectGrid(gameItem);
                }

                maxX = x;
            }

            this.maxLineLengths[y] = maxX;
        }

        if (!this.player) {
            throw 'No player defined in map cant start the map';
        }

        this.player.addSubscriber(this);
        if (this.fogRadius) {
            let nearByTiles = this.findNearByTiles(this.player, this.fogRadius);
            this.visibleTiles = nearByTiles;
            this.makeVisible(nearByTiles);
        }

        this.onReady();
    }

    gridKey(y, x) {
        return y + '-' + x;
    }

    setPlayableItemPosition(y, x, item) {
        item.position = {
            y,
            x
        }
        const key = this.gridKey(y, x);
        let existingItems = this.playableItemsMap.get(key);

        if (!existingItems) {
            this.playableItemsMap.set(key, new Map().set(item.id, item));
        } else {
            existingItems.set(item.id, item);
        }

    }

    /**
     *
     * @param item {BaseItem}
     */
    assignItemToCorrectGrid(item) {

        let key = this.gridKey(item.position.y, item.position.x);
        if (!this.playableItemsMap.has(key)) {
            this.playableItemsMap.set(key, new Map());
        }

        let existingItems = this.playableItemsMap.get(key);

        existingItems.set(item.id, item);
        this.playableItemsMap.set(key, existingItems);

        if (item instanceof PlayerItem) {
            this.player = item;
        }

        if (item instanceof BoxPlaceItem) {
            this.boxPlaces.push(item);
        }

        if (item instanceof EnemyItem) {
            this.enemies.push(item);
        }

        if (item instanceof BoxItem) {
            this.boxItems.push(item);
        }

        if (item instanceof PortalItem) {
            this.portalPlaces.push(item);
        }
    }

    /**
     *
     * @param callback {CallableFunction}
     */
    onReadyCallBack(callback) {
        this.onReady = callback
    }


    /**
     *
     * @param y {number}
     * @param x {number}
     * @returns {Map | null}
     */
    getItemsOnPosition(y, x) {
        const playableItems = this.playableItemsMap.get(this.gridKey(y, x));
        return playableItems ? playableItems : new Map();
    }

    /**
     *
     * @param y {number}
     * @param x {number}
     * @returns {Map | null}
     */
    getBackgroundItemsOnPosition(y, x) {
        const backgroundItems = this.backgroundGridMap.get(this.gridKey(y, x));
        return backgroundItems ? backgroundItems : new Map();
    }


    removeItemFromTile(itemToRemove) {
        const key = this.gridKey(itemToRemove.position.y, itemToRemove.position.x);
        let itemsMap = this.playableItemsMap.get(key);

        if (itemsMap && itemsMap.size > 0) {
            itemsMap.delete(itemToRemove.id);
        } else {
            this.playableItemsMap.delete(key);
        }
    }

    renderLostLife() {

        const avatar = this.player;
        this.removeItemFromTile(avatar)
        this.effects.addEffect(new RotateEffect(avatar, 40));
        this.game.playerLife = this.game.playerLife - 1;
        if (this.game.playerLife <= 0) {
            this.game.playerLife = 0;
            this.game.gameOver = true;
        }

        clearTimeout(this.timeout);
        if (this.game.gameOver) {
            this.timeout = setTimeout(() => {
                this.game.pause = false
                this.game.reset()
                this.game.setGameScreen(new EndScreen(this.game))
            }, 5000)
        } else {

            this.timeout = setTimeout(() => {
                this.game.pause = false
                this.game.currentScreen.mazeLoaded = false;

            }, 5000)
        }

        this.game.pause = true;
    }


    //@Todo thin how to apply gravity  like behavour!
    applyGravity(item) {
        return

        if (this.time >= this.gravityUpdate) {

            if (this.gravity) {

                if (item.position.y < this.backgroundGrid.length) {
                    let itemsBelow = this.getItemsOnPosition(item.position.y + 1, item.position.x);

                    if (itemsBelow && !itemsBelow.length) {
                        this.moveItemDown(item)
                        //this.game.pause = true
                    }

                }

            }
            this.time = 0;
        } else {
            ++this.time

        }

    }

    findNearByTiles(item, radius) {
        const mainY = item.position.y;
        const mainX = item.position.x;
        const checkTiles = [];
        let i = 0;
        checkTiles.push([mainY, mainX, i]);
        for (let y = mainY - radius; y <= mainY + radius; y++) {

            for (let x = mainX - radius; x <= mainX + radius; x++) {
                if (!(y === mainY && x === mainX)) {
                    checkTiles.push([y, x, i]);
                }
            }
            i++;
        }

        let tmp = []

        checkTiles.forEach(coordinates => {

            const bgTiles = this.getBackgroundItemsOnPosition(coordinates[0], coordinates[1]);
            const tiles = this.getItemsOnPosition(coordinates[0], coordinates[1]);

            if (tiles) {
                tiles.forEach((tile) => {
                    tmp.push(tile)
                })
            }
            if (bgTiles) {
                bgTiles.forEach((tile) => {
                    tmp.push(tile)
                })

            }
        })

        return tmp;
    }

    checkIfBothItemsOnSameTile(itemA, itemB) {
        return (itemA.position.y === itemB.position.y &&
            itemA.position.x === itemB.position.x)
    }


    makeVisible(tiles) {
        tiles.forEach(tile => {
            tile.visible = 1;
        })
    }
}
