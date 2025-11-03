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
        this.camera = new MazeCamera();
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

                const char = rows[y][x];

                let item = new EmptyItem({})
                if (char === ' ') {
                    item = null
                }
                let mazeTile = new MazeTile(y, x, item);

                this.mazeTiles.set(this.gridKey(mazeTile.y, mazeTile.x), mazeTile);

                const gameItems = generateGameItemsByConfig(char, this.game.area.config, y, x);

                gameItems.forEach((gameItem) => {
                    if (gameItem && !(gameItem instanceof EmptyItem)) {
                        mazeTile.addItem(gameItem);
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

        // Init camera needs to have all tiles of the map
        this.camera = new MazeCamera(this);
        this.camera.setCameraSize(4, 4);
        this.camera.followItem(this.player);

        //  notify parent this is ready
        this.onReady.next(true);
    }

    // filterVisibleTiles(player, nearbyTiles, mazeWidth, mazeHeight, isWallFn, viewAngleDeg) {
    //     const px = player.position.x;
    //     const py = player.position.y;
    //     // const halfAngle = (viewAngleDeg / 2) * (Math.PI / 180); // degrees → radians
    //
    //
    //     // Create a quick lookup for wall positions
    //     const isWall = (x, y) => {
    //         if (x < 0 || y < 0 || x >= mazeWidth || y >= mazeHeight) return true;
    //         return isWallFn(x, y); // delegate to your own check (e.g., check in your item list)
    //     };
    //
    //     function* bresenhamLine(x0, y0, x1, y1) {
    //         let dx = Math.abs(x1 - x0);
    //         let dy = Math.abs(y1 - y0);
    //         let sx = x0 < x1 ? 1 : -1;
    //         let sy = y0 < y1 ? 1 : -1;
    //         let err = dx - dy;
    //
    //         while (true) {
    //             yield [x0, y0];
    //             if (x0 === x1 && y0 === y1) break;
    //             let e2 = 2 * err;
    //             if (e2 > -dy) {
    //                 err -= dy;
    //                 x0 += sx;
    //             }
    //             if (e2 < dx) {
    //                 err += dx;
    //                 y0 += sy;
    //             }
    //         }
    //     }
    //
    //     const visibleTiles = [];
    //
    //     for (const tile of nearbyTiles) {
    //         const tx = tile.position.x;
    //         const ty = tile.position.y;
    //
    //         // Cast a "line of sight" ray from player to tile
    //         let blocked = false;
    //         for (const [x, y] of bresenhamLine(px, py, tx, ty)) {
    //             if (isWall(x, y) && !(x === tx && y === ty)) {
    //                 blocked = true;
    //                 break;
    //             }
    //         }
    //
    //         if (!blocked) {
    //             tile.setVisible(true)
    //             tile.setRenderable(true)
    //         } else {
    //             tile.setRenderable(true);
    //             tile.setVisible(false)
    //         }
    //
    //         visibleTiles.push(tile);
    //     }
    //
    //     return visibleTiles;
    // }

    subscribeToItemEssentials(item) {
        var gameBoardGrid = this;

        this.subscriptions.push(item.onAddChildItem.subscribe((item) => {
            // gameBoardGrid.setPlayableItemPosition(item.position.y, item.position.x, item);
        }))

        this.subscriptions.push(item.onRemoveChildItem.subscribe((items) => {
            // Removing child
            items.forEach(item => {
                //  gameBoardGrid.removeItemFromTile(item);
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
     * @param item {BaseItem}
     */
    setPlayableItemPosition(y, x, item) {
        item.position = {
            y,
            x
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
    assignItemToCorrectGrid(item) {

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

        const avatar = this.player;
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
}



