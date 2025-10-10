class GameBoardGrid {
    /**
     * WallItems, EmptyItems
     * @type {[[]]}
     */
    backgroundGrid = [[]];

    /**
     * Player, enemies, boxes, pickups...
     */
    movableItems = [];

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

    gravity = 1;


    onReady = () => {
        console.log('Board ready')
    }

    constructor(game) {
        this.game = game
    }

    parseMap(layout) {
        const rows = layout.trim().split("\n");

        for (let y = 0; y < rows.length; y++) {
            this.backgroundGrid[y] = [];
            this.movableItems[y] = [];
            for (let x = 0; x < rows[y].length; x++) {
                this.movableItems[y][x] = [];
                const char = rows[y][x]
                // This will create grid for the game
                this.backgroundGrid[y][x] = createGameItem('.', this.game, y, x);

                const gameItem = createGameItem(char, this.game, y, x);

                if (gameItem && !(gameItem instanceof EmptyItem)) {
                    this.assignItemToCorrectGrid(gameItem);
                }
            }
        }

        this.onReady();
    }

    /**
     *
     * @param item {BaseItem}
     */
    assignItemToCorrectGrid(item) {

        if (!this.movableItems[item.position.y]) {
            this.movableItems[item.position.y] = [];
        }

        if (!this.movableItems[item.position.y][item.position.x]) {
            this.movableItems[item.position.y][item.position.x] = [];
        }

        this.movableItems[item.position.y][item.position.x]?.push(item)

        if (item instanceof PlayerItem) {
            this.player = item;
        }

        if (item instanceof BoxPlaceItem) {
            this.boxPlaces.push(item);
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


    moveItemUp(item) {
        item.onMoveUp();
        const posX = item.position.x
        const posY = item.position.y
        let hasMoved = false;

        let nextPosY = posY - 1
        nextPosY = nextPosY < 0 ? this.movableItems.length - 1 : nextPosY

        let possibleItem = this.getItemOnPosition(nextPosY, posX);
        hasMoved = this.handleItemSwap(this.game.controller, 'moveItemUp', item, possibleItem, nextPosY, posX);
        //  }

        if (hasMoved && item instanceof PlayerItem) {
            ++this.levelMoves;
        }
        return hasMoved
    }

    moveItemDown(item) {
        item.onMoveDown();
        const posX = item.position.x
        const posY = item.position.y
        let hasMoved = false;

        let nextPosY = posY + 1
        nextPosY = nextPosY > this.movableItems.length - 1 ? 0 : nextPosY

        let possibleItems = this.getItemOnPosition(nextPosY, posX);

        hasMoved = this.handleItemSwap(this.game.controller, 'moveItemDown', item, possibleItems, nextPosY, posX);


        if (hasMoved && item instanceof PlayerItem) {
            ++this.levelMoves;
        }
        return hasMoved;

    }

    moveItemLeft(item) {
        item.onMoveLeft();
        const posX = item.position.x
        const posY = item.position.y
        let hasMoved = false;
        // if (posX) {

        let nextPosX = posX - 1
        nextPosX = nextPosX < 0 ? this.movableItems[posY].length - 1 : nextPosX

        let possibleItem = this.getItemOnPosition(posY, nextPosX)
        hasMoved = this.handleItemSwap(this.game.controller, 'moveItemLeft', item, possibleItem, posY, nextPosX);

        //  }
        if (hasMoved && item instanceof PlayerItem) {
            ++this.levelMoves;
        }
        return hasMoved;
    }

    moveItemRight(item) {
        item.onMoveRight();
        const posX = item.position.x
        const posY = item.position.y
        let hasMoved = false;


        let nextPosX = posX + 1
        nextPosX = nextPosX > this.movableItems[posY].length - 1 ? 0 : nextPosX

        let possibleItem = this.getItemOnPosition(posY, nextPosX);
        hasMoved = this.handleItemSwap(this.game.controller, 'moveItemRight', item, possibleItem, posY, nextPosX);
        //   }
        if (hasMoved && item instanceof PlayerItem) {
            ++this.levelMoves;
        }
        return hasMoved;
    }

    hitItem(item) {
        let nextPosX;
        let nextPosY;
        let possibleItems;
        switch (item.orientation) {
            case Orientation.Left:
                nextPosX = item.position.x - 1;
                possibleItems = this.getItemOnPosition(item.position.y, nextPosX);

                if (possibleItems.length > 0) {
                    this.handleHitItem(item, possibleItems)

                }

                break
            case Orientation.Right:
                nextPosX = item.position.x + 1;
                possibleItems = this.getItemOnPosition(item.position.y, nextPosX);

                if (possibleItems.length > 0) {
                    this.handleHitItem(item, possibleItems)


                }
                break

            case Orientation.Up:
                nextPosY = item.position.y - 1;
                possibleItems = this.getItemOnPosition(nextPosY, item.position.x)

                if (possibleItems) {
                    this.handleHitItem(item, possibleItems)
                }
                break
            case Orientation.Down:
                nextPosY = item.position.y + 1;
                possibleItems = this.getItemOnPosition(nextPosY, item.position.x)
                if (possibleItems) {
                    this.handleHitItem(item, possibleItems)

                }
                break
        }
    }

    getItemOnPosition(y, x) {
        if (this.movableItems[y] && this.movableItems[y][x]) {
            return this.movableItems[y][x];
        }
    }

    handleItemSwap(controller, controllerMethod, itemToMove, itemsOnAway, nextPosY, nextPosX) {
        var emptyTile = new EmptyItem();
        emptyTile.position = {
            y: Number(itemToMove.position.y),
            x: Number(itemToMove.position.x),
        };

        if (itemToMove instanceof BoxItem) {
            itemToMove.completed(false);
        }

        let hasMoved = false;

        if (itemsOnAway.length === 0) {
            this.removeItemFromTile(itemToMove)
            this.movableItems[nextPosY][nextPosX].push(itemToMove)
            itemToMove.position.y = nextPosY;
            itemToMove.position.x = nextPosX;
            hasMoved = true
        } else {
            if (itemsOnAway.length > 0) {

                let canMoveToTile = true
                // check if any of item is blocking item to be moved to this tile
                itemsOnAway.forEach((item) => {
                    if (item instanceof WallItem) {
                        canMoveToTile = false;
                        return
                    }

                    if (item instanceof BoxItem) {
                        if (itemToMove.hasAbility(ItemAbilities.MoveBoxes)) {
                            canMoveToTile = this.pushItemInDirectionOfMovingItem(itemToMove, item)
                        } else {
                            canMoveToTile = false;
                        }
                    }

                    if (item instanceof BoxPlaceItem) {
                        // When box moves to Place where box should be moved
                        if (itemToMove instanceof BoxItem) {
                            itemToMove.completed(true);
                        }
                    }

                    // Player or enemy steps on tile where portalTile is Present
                    if (item instanceof PortalItem) {
                        let moveToNextPortal = this.portalPlaces.find((portal) => {
                            return portal.id !== item.id
                        })

                        if (moveToNextPortal) {
                            nextPosY = moveToNextPortal.position.y
                            nextPosX = moveToNextPortal.position.x

                            let possibleItems = this.getItemOnPosition(nextPosY, nextPosX);

                            possibleItems.forEach(possibleItem => {
                                if (possibleItem instanceof BoxItem && itemToMove.hasAbility(ItemAbilities.MoveBoxes)) {
                                    canMoveToTile = this.pushItemInDirectionOfMovingItem(itemToMove, possibleItem)
                                }
                            })
                        }

                        hasMoved = true
                    }


                });

                if (canMoveToTile) {
                    this.removeItemFromTile(itemToMove);
                    itemToMove.position.y = nextPosY;
                    itemToMove.position.x = nextPosX;
                    this.movableItems[nextPosY][nextPosX].push(itemToMove);

                    if (this.movableItems[nextPosY][nextPosX].find(item => {
                        return item instanceof EnemyItem
                    }) && itemToMove instanceof PlayerItem) {
                        this.renderLostLife(itemToMove)
                    }

                    if (this.movableItems[nextPosY][nextPosX].find(item => {
                        return item instanceof PlayerItem
                    }) && itemToMove instanceof EnemyItem) {
                        console.log(this.player)

                        this.renderLostLife(this.player)
                    }

                    hasMoved = true
                }
            }
        }


        if (itemToMove.hasAbility(ItemAbilities.LivesFootsteps) && hasMoved) {
            this.effects.addEffect(new FootstepEffects(emptyTile, itemToMove.orientation));
        }
        return hasMoved;
    }

    pushItemInDirectionOfMovingItem(itemToMove, itemOnAway) {
        let hasMoved = false;
        if (itemToMove.orientation === Orientation.Right) {
            if (this.moveItemRight(itemOnAway)) {
                hasMoved = this.moveItemRight(itemToMove);
            }
        }
        if (itemToMove.orientation === Orientation.Left) {
            if (this.moveItemLeft(itemOnAway)) {
                hasMoved = this.moveItemLeft(itemToMove);
            }
        }
        if (itemToMove.orientation === Orientation.Up) {
            if (this.moveItemUp(itemOnAway)) {
                hasMoved = this.moveItemUp(itemToMove);
            }
        }
        if (itemToMove.orientation === Orientation.Down) {
            if (this.moveItemDown(itemOnAway)) {
                hasMoved = this.moveItemDown(itemToMove);
            }
        }

        return hasMoved
    }


    /**
     *
     * @param itemToRemove {BaseItem}
     */
    removeItemFromTile(itemToRemove) {
        this.movableItems[itemToRemove.position.y][itemToRemove.position.x].forEach((itemB, index) => {
            if (itemB === itemToRemove) {
                this.movableItems[itemToRemove.position.y][itemToRemove.position.x].splice(index, 1);
            }
        })
    }

    renderLostLife(avatar) {
        // this.effects.addEffect(new ExplodeEffect(avatar, true, 100, 1, 3))
        this.removeItemFromTile(avatar)
        this.effects.addEffect(new RotateEffect(avatar, 2));
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

    handleHitItem(avatar, possibleItems) {
        possibleItems.forEach(possItem => {
            if (possItem instanceof WallItem && avatar.hasAbility(ItemAbilities.DestroyWalls)) {
                this.effects.addEffect(new ExplodeEffect(possItem, true));
                this.removeItemFromTile(possItem);
            }
            if (possItem instanceof BoxItem) {
                switch (avatar.orientation) {
                    case  Orientation.Left:
                        this.moveItemLeft(possItem);
                        break;
                    case   Orientation.Right:
                        this.moveItemRight(possItem);
                        break;
                    case   Orientation.Up:
                        this.moveItemUp(possItem);
                        break;
                    case   Orientation.Down:
                        this.moveItemDown(possItem);
                        break;

                }

            }
        })
    }

    gravityUpdate = 10;
    time = 0;

    applyGravity(item) {
        return
        // console.group('frame', this.game.frame);
        if (this.time >= this.gravityUpdate) {

            if (this.gravity) {

                if (item.position.y < this.backgroundGrid.length) {
                    let itemsBelow = this.getItemOnPosition(item.position.y + 1, item.position.x);

                    if (itemsBelow && !itemsBelow.length) {
                        console.log('Moving down', item.BASE_CLASS, itemsBelow)

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

}
