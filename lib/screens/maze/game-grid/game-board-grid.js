class GameBoardGrid {
    /**
     * Number of visible tiles around player
     * @type {number}
     */
    fogRadius = 20;

    /**
     * Background tiles
     * @type {Map<string, Map<number, BaseItem>>}
     */
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
     * @type GameEffects
     */
    effects = new GameEffects();

    /**
     *
     * @type {PlayerItem}
     */
    player = null;

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

    /**
     *
     * @type {BaseItem[]}
     */
    visibleTiles = []

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
     * @param game {Game}
     */
    constructor(game) {
        this.game = game
        this.movementResolver = new MazeMovementResolver(this.game, this);
    }

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
                const emptyTile = new EmptyItem({});
                emptyTile.position = {
                    y, x
                }
                this.backgroundGridMap.set(this.gridKey(y, x), new Map().set(0, emptyTile));

                const char = rows[y][x]
                const gameItems = generateGameItemsByConfig(char, this.game.area.config, y, x);

                gameItems.forEach((gameItem) => {
                    if (gameItem && !(gameItem instanceof EmptyItem)) {
                        this.assignItemToCorrectGrid(gameItem);
                        this.subscribeToItemEssentials(gameItem);
                    }
                })
                maxX = x;
            }
            // set the max number of X tiles
            this.maxLineLengths[y] = maxX;
        }

        if (!this.player) {
            throw 'No player defined in map cant start the map';
        }

        if (this.fogRadius) {
            let nearByTiles = this.findNearByTiles(this.player, this.fogRadius);
            if (nearByTiles) {
                this.makeVisible(nearByTiles);
            }
        }

        this.onReady.next(true);
    }

    subscribeToItemEssentials(item) {
        var gameBoardGrid = this;


        this.subscriptions.push(item.onAddChildItem.subscribe((item) => {
            if (this.visibleTiles.find(visibleTile => {
                return visibleTile.position.x === item.position.x && visibleTile.position.y === item.position.y;
            })) {
                this.visibleTiles.push(item)
            }
            gameBoardGrid.setPlayableItemPosition(item.position.y, item.position.x, item);

        }))

        this.subscriptions.push(item.onRemoveChildItem.subscribe((items) => {
            // Removing childs
            items.forEach(item => {
                gameBoardGrid.removeItemFromTile(item);
            })
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
     * @param item {baseItem}
     */
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
        if (item.childItems.length > 0) {
            item.childItems.forEach((childItem) => {
                this.removeItemFromTile(childItem);
                this.setPlayableItemPosition(y, x, childItem);
            })
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
        itemToRemove.onDestroy();
    }

    destroyEnemy(avatar) {
        this.removeItemFromTile(avatar)
        this.effects.addEffect(new RotateEffect(avatar, 40));
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
        return;
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
            this.visibleTiles.push(tile);
            tile.visible = 1;
        })

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

    findTileByChar(char) {
        let tmp = [];
        this.playableItemsMap.forEach((items) => {
            items.forEach(tile => {
                if (tile.tileChar === char) {
                    tmp.push(tile);
                }
            })
        })

        return tmp
    }
}

class GameNotice {

    avatar = '';

    title = "title of notice"

    content = "content of notice"

    /**
     *
     * @type {[key:string]: () => {}}
     */
    actions = {}

    onResolve = (action) => {
        console.log('Game action  reolved')
    }

    constructor(title, content) {
        this.title = title;
        this.content = content
    }

    addAction(action, callback) {
        this.actions[action] = callback;
    }

    resolve(callback) {
        this.onResolve = callback
    }
}
