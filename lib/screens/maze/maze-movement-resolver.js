class MazeMovementResolver {
    /**
     *
     * @type {GameBoardGrid}
     */
    gameBoardGrid = null;


    aIController = new AiController();

    /**
     *
     * @param game {Game}
     * @param gamBoardGrid {GameBoardGrid}
     */
    constructor(game, gamBoardGrid) {
        this.gameBoardGrid = gamBoardGrid
        this.game = game
        this.aIController.setGameScreen(this.game.currentScreen)

    }

    /**
     *
     * @param item {BaseItem}
     * @returns {*|boolean}
     */
    moveItemUp(item) {
        if (item.isMoving()) {
            return
        }
        // item.onMoveUp();
        const posX = item.position.x
        const posY = item.position.y
        let hasMoved = false;

        let nextPosY = posY - 1
        // nextPosY = this.gameBoardGrid.maxLineLengths[nextPosY] ? nextPosY : this.gameBoardGrid.maxLineLengths.length - 1;

        let possibleItems = this.gameBoardGrid.getItemsOnPosition(nextPosY, posX) ?? []

        hasMoved = this.tryToMoveItem(item, possibleItems, nextPosY, posX);


        if (hasMoved && item instanceof PlayerItem) {
            ++this.levelMoves;
            item.onMoveUp();
        }
        return hasMoved
    }

    moveItemDown(item) {
        if (item.isMoving()) {
            return
        }
        if (this.game.pause) {
            return false;
        }

        const posX = item.position.x
        const posY = item.position.y
        let hasMoved = false;

        let nextPosY = posY + 1
        //nextPosY = this.gameBoardGrid.maxLineLengths[nextPosY] ? nextPosY : 0

        let possibleItems = this.gameBoardGrid.getItemsOnPosition(nextPosY, posX) ?? [];


        hasMoved = this.tryToMoveItem(item, possibleItems, nextPosY, posX);

        if (hasMoved && item instanceof PlayerItem) {
            ++this.levelMoves;
            item.onMoveDown();
        }
        return hasMoved;

    }

    moveItemRight(item) {
        if (item.isMoving()) {
            return
        }
        if (this.game.pause) {
            return false;
        }
        const posX = item.position.x
        const posY = item.position.y
        let hasMoved = false;


        let nextPosX = posX + 1
        //nextPosX = nextPosX > this.gameBoardGrid.maxLineLengths[posY] ? 0 : nextPosX;
        let possibleItems = this.gameBoardGrid.getItemsOnPosition(posY, nextPosX) ?? []


        hasMoved = this.tryToMoveItem(item, possibleItems, posY, nextPosX);

        if (hasMoved && item instanceof PlayerItem) {
            ++this.levelMoves;
            item.onMoveRight();
        }
        return hasMoved;
    }

    moveItemLeft(item) {
        if (item.isMoving()) {
            return
        }

        if (this.game.pause && !force) {
            return false;
        }
        const posX = item.position.x
        const posY = item.position.y

        let nextPosX = posX - 1

        let possibleItems = this.gameBoardGrid.getItemsOnPosition(posY, nextPosX) ?? []

        let hasMoved = this.tryToMoveItem(item, possibleItems, posY, nextPosX);
        if (hasMoved && item instanceof PlayerItem) {
            ++this.levelMoves;
            item.onMoveLeft();
        }

        return hasMoved;
    }


    tryToMoveItem(itemToMove, itemsOnAway, nextPosY, nextPosX) {
        if (this.game.pause) {
            return false;
        }

        let emptyTile = new EmptyItem({});
        emptyTile.setPosition(itemToMove.position.y, itemToMove.position.x);


        let canMoveToTile = false
        let hasMoved = false;
        let isAnyBlokcking = [];
        if (!itemsOnAway || itemsOnAway.size === 0) {

            // this.removeItemFromTile(itemToMove)
            // this.setPlayableItemPosition(nextPosY, nextPosX, itemToMove)
            let hasBackground = this.gameBoardGrid.getBackgroundItemsOnPosition(nextPosY, nextPosX);

            if (!hasBackground) {
                if (itemToMove instanceof PlayerItem) {
                    let texts = [
                        'Oh, I dont wanna go there',
                        'This seems scary for me',
                        'Why u keep pushing me there?'
                    ];
                    let randomSentance = Math.floor(Math.random() * texts.length);
                    const bubble = new ChatBubbleItem({}, texts[randomSentance], 100)
                    itemToMove.clearChildItems();
                    itemToMove.addChildItem(bubble);
                }
                isAnyBlokcking[0] = false;
            } else {
                isAnyBlokcking[0] = true;
            }
        } else {

            if (itemsOnAway.size > 0) {
                canMoveToTile = false;

                // check if any of item is blocking item to be moved to this tile
                itemsOnAway.forEach((item, index) => {
                    isAnyBlokcking.push(canBeMoved(itemToMove, item, this, this.gameBoardGrid));
                });
            }
        }

        canMoveToTile = isAnyBlokcking.some(bool => bool);
        console.log('canMoveToTile', canMoveToTile, isAnyBlokcking);
        if (canMoveToTile) {
            const playGridKey = getGridKey(nextPosY, nextPosX);
            this.moveItemToTile(itemToMove, nextPosY, nextPosX);

            // Detect if player or enemy are on the same tile
            if (this.gameBoardGrid.mazeTiles.get(playGridKey).hasItemOnTile(EnemyItem) &&
                this.gameBoardGrid.mazeTiles.get(playGridKey).hasItemOnTile(PlayerItem)) {
                this.gameBoardGrid.renderLostLife()
            }

            hasMoved = true;
        }


        if (itemToMove.hasAbility(ItemAbilities.LivesFootsteps) && hasMoved) {
            this.gameBoardGrid.effects.addEffect(new FootstepEffects(this.gameBoardGrid, itemToMove, itemToMove.orientation));

            let tile = this.gameBoardGrid.mazeTiles.get(getGridKey(itemToMove.position.y, itemToMove.position.x));
            if (tile.visible) {
                new Sound('./assets/sounds/stepdirt_1.wav').volume(0.1).play();
            }

        }

        //  @TODO Make view fog effect
        // if (this.gameBoardGrid.fogRadius) {
        //     // const tiles = this.gameBoardGrid.findNearByTiles(this.gameBoardGrid.player, this.gameBoardGrid.fogRadius);
        //     // this.gameBoardGrid.visibleTiles = tiles;
        //     // this.gameBoardGrid.makeVisible(tiles)
        // }

        console.log(hasMoved);
        return hasMoved;
    }

    moveItemToTile(item, y, x) {
        this.gameBoardGrid.removeItemFromTile(item);

        // Check if any of tile has  onLeaveTile callback
        let tiles = this.gameBoardGrid.getItemsOnPosition(item.position.y, item.position.x);
        if (tiles) {
            tiles.forEach(tile => {
                if (tile.id !== item.id) {
                    if (tile.onLeave || tile.hasAbility(ItemAbilities.IsTrigger) && item.hasAbility(ItemAbilities.CanTriggerTriggers)) {
                        tile.onLeave(this.gameBoardGrid, tile);
                    }
                }
            })
        }

        this.gameBoardGrid.setPlayableItemPosition(y, x, item)

        tiles = this.gameBoardGrid.getItemsOnPosition(y, x);
        if (tiles) {
            tiles.forEach(tile => {
                if (tile.id !== item.id) {
                    if (tile.hasAbility(ItemAbilities.IsTrigger) && item.hasAbility(ItemAbilities.CanTriggerTriggers)) {
                        tile.onTrigger(this.gameBoardGrid, item);
                    }
                }
            })
        }

    }

    pushItemInDirectionOfMovingItem(itemToMove, itemOnAway) {
        this.aIController.setGameScreen(this.game.currentScreen);

        if (itemToMove.orientation === Orientation.Right) {

            if (this.moveItemRight(itemOnAway)) {
                return true
            }
        }
        if (itemToMove.orientation === Orientation.Left) {

            if (this.moveItemLeft(itemOnAway)) {
                return true;
            }
        }
        if (itemToMove.orientation === Orientation.Up) {

            if (this.moveItemUp(itemOnAway)) {
                return true;

            }
        }
        if (itemToMove.orientation === Orientation.Down) {
            // return this.aIController.handleKeyPress('s', itemOnAway)
            if (this.moveItemDown(itemOnAway)) {
                return true;
            }
        }

        return false
    }

    useItem(avatar, item) {
        if (item.hasAbility(ItemAbilities.canBePlaced)) {
            avatar.inventory.removeItem(item);
            item.setPosition(avatar.position.y, avatar.position.x);
            this.gameBoardGrid.setPlayableItemPosition(avatar.position.y, avatar.position.x, item);
            item.onPlaceDown(this.gameBoardGrid);
            return true
        }
        return false
    }

    interactWithItem(avatar) {
        let nextPosX;
        let nextPosY;
        let possibleItems;
        switch (avatar.orientation) {
            case Orientation.Left:
                nextPosX = avatar.position.x - 1;

                if (avatar.getItemInHand()) {
                    this.handleItemInHand(avatar)
                } else {
                    possibleItems = this.gameBoardGrid.getItemsOnPosition(avatar.position.y, nextPosX);

                    if (possibleItems.size > 0) {
                        this.handleInteractWithItem(avatar, possibleItems)
                    }
                }


                break
            case Orientation.Right:
                nextPosX = avatar.position.x + 1;

                if (avatar.getItemInHand()) {
                    this.handleItemInHand(avatar)
                } else {
                    possibleItems = this.gameBoardGrid.getItemsOnPosition(avatar.position.y, nextPosX);

                    if (possibleItems.size > 0) {
                        this.handleInteractWithItem(avatar, possibleItems)
                    }
                }


                break

            case Orientation.Up:
                nextPosY = avatar.position.y - 1;

                if (avatar.getItemInHand()) {
                    this.handleItemInHand(avatar)
                } else {
                    possibleItems = this.gameBoardGrid.getItemsOnPosition(nextPosY, avatar.position.x)

                    if (possibleItems.size > 0) {
                        this.handleInteractWithItem(avatar, possibleItems)
                    }
                }


                break
            case Orientation.Down:
                nextPosY = avatar.position.y + 1;

                // check if avatar has somthing in his hands
                if (avatar.getItemInHand()) {
                    this.handleItemInHand(avatar)
                } else {
                    possibleItems = this.gameBoardGrid.getItemsOnPosition(nextPosY, avatar.position.x)

                    if (possibleItems.size > 0) {
                        this.handleInteractWithItem(avatar, possibleItems)
                    }
                }

                break
        }
    }

    handleItemInHand(avatar) {

        const itemInHand = avatar.getItemInHand();
        if (itemInHand) {
            if (itemInHand instanceof BoxItem) {
                // place item down
                // this.gameBoardGrid.setPlayableItemPosition(avatar.position.y, avatar.position.x, itemInHand);
                // itemInHand.attributes.position.top = 0;
                // itemInHand.attributes.position.left = 0;

                let hesBeenPlaced
                switch (avatar.orientation) {
                    case Orientation.Left:
                        hesBeenPlaced = this.moveItemLeft(itemInHand);
                        break;
                    case Orientation.Right:
                        hesBeenPlaced = this.moveItemRight(itemInHand);
                        break;
                    case Orientation.Up:
                        hesBeenPlaced = this.moveItemUp(itemInHand);
                        break;
                    default:
                        hesBeenPlaced = this.moveItemDown(itemInHand);

                }

                if (hesBeenPlaced) {
                    avatar.onDropDownItem(itemInHand);
                    itemInHand.resetOffsetPosition();
                    avatar.clearChildItems();
                    avatar._itemInHand = null;
                    return true
                }
            }
        }

        return false
    }

    /**
     *
     * @param avatar  {PlayerItem | BaseItem}
     * @param possibleItems
     */
    handleInteractWithItem(avatar, possibleItems) {
        possibleItems.forEach(possItem => {


            if (possItem.hasAbility(ItemAbilities.CanInteract) && avatar.hasAbility(ItemAbilities.CanStartInteract)) {
                possItem.onInteract(this.gameBoardGrid, avatar, false);
            }

            let hasBeenPicked = true

            if (possItem.hasAbility(ItemAbilities.CanBeLifted)) {
                if (avatar.getItemInHand()) {
                    hasBeenPicked = false
                    avatar.addChatBubble('I cant pick more items', 100)
                } else {
                    avatar.grabItem(possItem)
                    // possItem.attributes.position = {
                    //     top: -10,
                    //     left: -10
                    // }
                    // possItem.attributes.size = {
                    //     top: 25,
                    //     left: 25
                    // }
                    avatar.addChildItem(possItem);
                    this.gameBoardGrid.removeItemFromTile(possItem);
                    let tiles = this.gameBoardGrid.getItemsOnPosition(possItem.position.y, possItem.position.x);
                    if (tiles) {
                        tiles.forEach(tile => {
                            if (tile.id !== possItem.id) {
                                if (tile.onLeave || tile.hasAbility(ItemAbilities.IsTrigger) && possItem.hasAbility(ItemAbilities.CanTriggerTriggers)) {
                                    tile.onLeave(this.gameBoardGrid, tile);
                                }
                            }
                        })
                    }
                    hasBeenPicked = true
                    avatar.onLiftUp(possItem);
                    avatar.onPickUpItem(possItem);
                }
                return hasBeenPicked
            }
            if (possItem.hasAbility(ItemAbilities.CanBePushed) && !hasBeenPicked) {
                this.gameBoardGrid.removeItemFromTile(possItem);
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
}
