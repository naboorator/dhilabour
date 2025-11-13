class GameBoardGrid {
    /**
     * Number of visible tiles around player
     * @type {number}
     */
    fogRadius = 4;


    /**
     *
     * @type {Map<string, MazeTile>}
     */
    mazeTiles = new Map();

    /**
     *
     * @type {Map<string, Map<number, BaseItem>>}
     */
    allItemsMap = () => {
        return this.mazeTiles;
    }

    /**
     * @type GameEffects
     */
    effects = new GameEffects();

    /**
     *
     * @type {PlayerItem}
     */
    // player = null;

    /**
     * Number of player moves
     * @type {number}
     */
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
     * @type Game
     */
    game

    /**
     *
     * @type {number}
     */
    timeout;

    /**
     * Gets called when map is ready
     */
    onReady = new Subject(false);

    /**
     *
     * @type {MazeMovementResolver}
     */
    movementResolver = null;

    /**
     *
     * @type
     */
    gameStore = GameStore;

    startTile = ''

    /**
     *
     * @type {number[]}
     */
    maxLineLengths = []

    /**
     *
     * @type {Subscription[]}
     */
    subscriptions = []

    /**
     *
     * @param game {Game}
     */
    constructor(game, startTile) {
        this.game = game
        this.startTile = startTile;
        this.camera = new MazeCamera();
        this.movementResolver = new MazeMovementResolver(this.game, this);

    }


    /**
     * Asci map described
     * Simple map with walls and player
     * @example
     *  ##########
     *  #..p.....#
     *  ##########
     *
     *  p - player
     *  # - wall
     *
     * @param layout {string}
     */
    parseMap(layout) {

        const rows = layout.trim().split("\n");

        for (let y = 0; y < rows.length; y++) {
            let maxX = 0;
            for (let x = 0; x < rows[y].length; x++) {

                const char = rows[y][x];
                let item = null;
                if (this.game.area.config.backgroundTile) {
                    item = new this.game.area.config.backgroundTile.item({})
                } else {
                    item = new EmptyItem({})
                }

                if (char === ' ') {
                    item = null
                }
                let mazeTile = new MazeTile(y, x, item);

                this.mazeTiles.set(this.gridKey(mazeTile.y, mazeTile.x), mazeTile);

                const gameItems = generateGameItemsByConfig(char, this.game.area.config, y, x);

                gameItems.forEach((gameItem) => {
                    if (gameItem && !(gameItem instanceof EmptyItem)) {
                        this.assignItemToCorrectGrid(gameItem, mazeTile);
                        this.subscribeToItemEssentials(gameItem);
                    }
                })
                maxX = x;
            }
            // set the max number of X tiles
            this.maxLineLengths[y] = maxX;
        }


        if (!this.game.player) {
            throw 'No player defined in map cant start the map';
        }

        // Init camera needs to have all tiles of the map
        this.camera = new MazeCamera(this);
        this.camera.setCameraSize(4, 4);
        this.camera.followItem(this.game.player);

        //  notify parent this is ready
        this.onReady.next(true);
    }

    onFocus(startTile) {

        let item = this.findItemByChar(startTile);

        if (item) {

            let y = item.position.y;
            let x = item.position.x;

            this.game.player.position = {
                y, x
            }

            // Move player to starting position
            this.movementResolver.moveItemToTile(this.game.player, y, x)

        }

        this.onReady.next(true);
    }

    subscribeToItemEssentials(item) {
        var gameBoardGrid = this;

        this.subscriptions.push(item.onAddChildItem.subscribe((item) => {
            // gameBoardGrid.setPlayableItemPosition(item.position.y, item.position.x, item);
        }))

        this.subscriptions.push(item.onRemoveChildItem.subscribe((items) => {
            // Removing child
            // items.forEach(item => {
            //     gameBoardGrid.removeItemFromTile(item);
            // })
        }));
    }

    /**
     * Key under which tile is stored in BackgroundMap or playableItemsMap
     * @param y {number}
     * @param x {number}
     * @returns {string}
     */
    gridKey(y, x) {
        return y + '-' + x;
    }

    /**
     *
     * @param y {number}
     * @param x {number}
     * @param item {BaseItem}
     */
    setPlayableItemPosition(y, x, item) {
        item.position = {
            y,
            x
        }

        item.nextPosition = {
            y, x
        }

        const tile = this.mazeTiles.get(this.gridKey(y, x));

        if (tile) {
            tile.addItem(item);
            //this.mazeItems.set(this.gridKey(y, x) + "-" + item.id, item);
            // if (item.childItems) {
            //     item.childItems.forEach((childItem) => {
            //         this.removeItemFromTile(childItem);
            //         this.setPlayableItemPosition(y, x, childItem);
            //     })
            // }
        }
    }

    /**
     *
     * @param item {BaseItem}
     */
    assignItemToCorrectGrid(item, mazeTile) {


        if (item instanceof BoxPlaceItem) {
            this.boxPlaces.push(item);
        }

        if (item instanceof BoxItem) {
            this.boxItems.push(item);
        }

        if (item instanceof PortalItem) {
            this.portalPlaces.push(item);
        }

        if (item instanceof PlayerItem) {
            console.log(item)
            this.game.player = item;
        }

        if (!(item instanceof PlayerItem) || !this.game.player) {
            mazeTile.addItem(item);
        }

        if (item.tileChar === this.startTile) {
            // const playerItem = new PlayerItem({});
            // playerItem.position.y = item.position.y;
            // playerItem.position.x = item.position.x;
            // this.player = playerItem;
            // this.movementResolver.moveItemToTile(this.player, item.position.y, item.position.x);
            this.movementResolver.moveItemToTile(this.game.player, item.position.y, item.position.x)
            // this.setPlayableItemPosition(item.position.y, item.position.x, this.game.player);
        }
    }

    saveState() {
        let state = this.gameStore.getState();
        // Before saving state remove
        let newState = {
            ...state,
            areas: {
                ...state.areas,
            }
        };

        newState.areas[this.game.area.name] = {
            ...newState.areas[this.game.area.name],
            mazeTiles: this
        };

        console.log(newState.areas)

        GameStore.changeStates(state, newState);
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
        let tile = this.mazeTiles.get(this.gridKey(y, x));
        if (tile) {
            return tile.getAllItems();
        }
    }

    /**
     *
     * @param y {number}
     * @param x {number}
     * @returns {Map | null}
     */
    getBackgroundItemsOnPosition(y, x) {
        let tile = this.mazeTiles.get(this.gridKey(y, x));
        if (tile) {
            return tile.getBackgroundItem();
        }
    }


    /**
     *
     * @param itemToRemove {BaseItem}
     */
    removeItemFromTile(itemToRemove) {
        const key = this.gridKey(itemToRemove.position.y, itemToRemove.position.x);
        const tile = this.mazeTiles.get(key);
        if (tile) {
            tile.removeItem(itemToRemove);
            //this.mazeItems.delete(this.gridKey(itemToRemove.position.y, itemToRemove.x) + "-" + itemToRemove.id);
            // itemToRemove.onDestroy();
        }

    }

    destroyEnemy(avatar) {
        this.removeItemFromTile(avatar)
        this.effects.addEffect(new RotateEffect(avatar, 10));
    }

    renderLostLife() {

        const avatar = this.game.player;
        this.removeItemFromTile(avatar)
        this.effects.addEffect(new RotateEffect(avatar, 10));
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
        return;
    }

    _findNearByTilesDeprecated(item, radius, foo = true) {
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


        if (foo) {
            const isBlocker = (x, y) => {
                // return false;
                const tiles = this.getItemsOnPosition(y, x)?.values();

                return tiles && tiles.some((tile) => {
                    if (tile instanceof WallItem) {
                        return true;
                    }

                    if (tile instanceof DoorItem) {
                        return !tile.isOpen;
                    }

                    if (tile instanceof BoxItem) {
                        return true;
                    }
                    return false;

                });

            };

            //tmp = this.filterVisibleTiles(item, tmp, 100, 100, isBlocker);
        }


        return tmp;
    }

    checkIfBothItemsOnSameTile(itemA, itemB) {
        return (itemA.position.y === itemB.position.y &&
            itemA.position.x === itemB.position.x)
    }

    /**
     *
     * @param y
     * @param x
     * @param notice {GameNotice}
     */
    showNotice(y, x, notice) {
        this.game.setGameScreenAndPreserveCurrent(new DialogScreeen(this.game, notice));
    }

    /**
     *
     * @param char {string}
     * @returns {BaseItem[]}
     */
    findTileByChar(char) {
        let tmp = [];
        this.mazeTiles.forEach((tile) => {
            tile.getAllItems().forEach(gameItem => {
                if (gameItem.tileChar === char) {
                    tmp.push(gameItem);
                }
            });
        });
        return tmp;
    }


    /**
     *
     * @param char {string}
     * @returns {BaseItem[]}
     */
    findItemByChar(char) {

        let item = null;
        this.mazeTiles.forEach((tile) => {
            tile.getAllItems().forEach(gameItem => {
                console.log(gameItem.tileChar)
                if (gameItem.tileChar === char) {
                    item = gameItem
                }
            });
        });
        return item;
    }
}



