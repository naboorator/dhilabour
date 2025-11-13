class MazeMovementResolver {
    /**
     *
     * @type {GameBoardGrid}
     */
    gameBoardGrid = null;


    /**
     *
     * @param game {Game}
     * @param gamBoardGrid {GameBoardGrid}
     */
    constructor(game, gamBoardGrid) {
        this.gameBoardGrid = gamBoardGrid
        this.game = game

    }

    /**
     *
     * @param item {BaseItem}
     * @returns {*|boolean}
     */
    moveItemUp(item) {
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
        }
        return hasMoved
    }

    moveItemDown(item) {
        if (this.game.pause) {
            return false;
        }
        item.onMoveDown();
        const posX = item.position.x
        const posY = item.position.y
        let hasMoved = false;

        let nextPosY = posY + 1
        //nextPosY = this.gameBoardGrid.maxLineLengths[nextPosY] ? nextPosY : 0

        let possibleItems = this.gameBoardGrid.getItemsOnPosition(nextPosY, posX) ?? [];


        hasMoved = this.tryToMoveItem(item, possibleItems, nextPosY, posX);

        if (hasMoved && item instanceof PlayerItem) {
            ++this.levelMoves;
        }
        return hasMoved;

    }

    moveItemRight(item) {
        if (this.game.pause) {
            return false;
        }
        item.onMoveRight();
        const posX = item.position.x
        const posY = item.position.y
        let hasMoved = false;


        let nextPosX = posX + 1
        //nextPosX = nextPosX > this.gameBoardGrid.maxLineLengths[posY] ? 0 : nextPosX;
        let possibleItems = this.gameBoardGrid.getItemsOnPosition(posY, nextPosX) ?? []


        hasMoved = this.tryToMoveItem(item, possibleItems, posY, nextPosX);

        if (hasMoved && item instanceof PlayerItem) {
            ++this.levelMoves;
        }
        return hasMoved;
    }

    moveItemLeft(item) {
        if (this.game.pause && !force) {
            return false;
        }
        item.onMoveLeft();
        const posX = item.position.x
        const posY = item.position.y

        let nextPosX = posX - 1
        //nextPosX = nextPosX < 0 ? this.gameBoardGrid.maxLineLengths[posY] : nextPosX;

        let possibleItems = this.gameBoardGrid.getItemsOnPosition(posY, nextPosX) ?? []

        let hasMoved = this.tryToMoveItem(item, possibleItems, posY, nextPosX);

        //  }
        if (hasMoved && item instanceof PlayerItem) {
            ++this.levelMoves;
        }
        return hasMoved;
    }


    tryToMoveItem(itemToMove, itemsOnAway, nextPosY, nextPosX) {
        if (this.game.pause) {
            return false;
        }

        let emptyTile = new EmptyItem({});
        emptyTile.position = {
            y: Number(itemToMove.position.y),
            x: Number(itemToMove.position.x),
        };
        console.log('Try to move item');

        let canMoveToTile = false
        let hasMoved = false;

        if (!itemsOnAway || itemsOnAway.size === 0) {
            console.log('No ITems on a way');
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
                canMoveToTile = false;
            } else {
                canMoveToTile = true;
            }
        } else {

            if (itemsOnAway.size > 0) {

                // check if any of item is blocking item to be moved to this tile
                itemsOnAway.forEach((item) => {
                    canMoveToTile = false;

                    if (item.hasAbility(ItemAbilities.CanInteract) && itemToMove.hasAbility(ItemAbilities.CanStartInteract)) {
                        canMoveToTile = false;
                        if (item.hasAbility(ItemAbilities.CanAutoInteract)) {
                            item.onInteract(this.gameBoardGrid, itemToMove, true);
                        }
                    }

                    if (item.hasAbility(ItemAbilities.CanStartInteract) && itemToMove.hasAbility(ItemAbilities.CanInteract)) {
                        canMoveToTile = false;
                        return false
                    }

                    if (item instanceof DoorItem && item.isOpen) {
                        canMoveToTile = true;
                    }

                    if (item.hasAbility(ItemAbilities.canBePlaced) || item.hasAbility(ItemAbilities.CanBePicked)) {
                        canMoveToTile = true;
                    }

                    if (itemToMove.hasAbility(ItemAbilities.CanPickItems) && item.hasAbility(ItemAbilities.CanBePicked)) {
                        const hasPicked = itemToMove.pickItem(item);

                        if (hasPicked && item.onPickUp) {
                            item.onPickUp(this.gameBoardGrid);
                            this.gameBoardGrid.removeItemFromTile(item)
                        }
                    }


                    if (item instanceof BoxItem) {
                        if (itemToMove.hasAbility(ItemAbilities.MoveBoxes)) {
                            canMoveToTile = this.pushItemInDirectionOfMovingItem(itemToMove, item);
                        } else {
                            canMoveToTile = false;
                        }
                    }

                    if (item.hasAbility(ItemAbilities.IsTrigger) && itemToMove.hasAbility(ItemAbilities.CanTriggerTriggers)) {
                        canMoveToTile = true;
                    }


                    if (item instanceof BoxPlaceItem) {
                        canMoveToTile = true;
                    }

                    if (item instanceof EnemyItem && !(itemToMove instanceof BoxItem)) {
                        // When box moves to Place where box should be moved
                        canMoveToTile = true;
                    }

                    if (item instanceof EnemyItem || item instanceof PlayerItem) {
                        // When box moves to Place where box should be moved
                        canMoveToTile = true;
                    }


                    if (item instanceof EnemyItem || item instanceof PlayerItem) {
                        if (itemToMove instanceof WallItem) {
                            hasMoved = this.pushItemInDirectionOfMovingItem(itemToMove, item);
                            if (!hasMoved) {
                                if (item instanceof EnemyItem) {
                                    this.gameBoardGrid.destroyEnemy(item)
                                } else {
                                    this.gameBoardGrid.renderLostLife();
                                }

                            }
                        }
                    }


                    // Player or enemy steps on tile where portalTile is Present
                    if (item instanceof PortalItem) {
                        let nextPortal = this.gameBoardGrid.portalPlaces.find((portal) => {
                            return portal.id !== item.id
                        })

                        const prevNextY = nextPosY;
                        const prevNextX = nextPosX;
                        if (nextPortal) {
                            nextPosY = nextPortal.position.y
                            nextPosX = nextPortal.position.x

                            let possibleItems = this.gameBoardGrid.getItemsOnPosition(nextPosY, nextPosX);

                            if (possibleItems.size > 0) {
                                canMoveToTile = false;
                                possibleItems.forEach(possibleItem => {
                                    if (possibleItem instanceof PortalItem || possibleItem instanceof EnemyItem) {
                                        canMoveToTile = true;
                                    }
                                    if (possibleItem instanceof BoxItem && itemToMove instanceof BoxItem) {
                                        nextPosX = prevNextX;
                                        nextPosY = prevNextY;
                                    }

                                    if (possibleItem instanceof BoxItem && itemToMove.hasAbility(ItemAbilities.MoveBoxes)) {
                                        canMoveToTile = this.pushItemInDirectionOfMovingItem(itemToMove, possibleItem);
                                        if (!canMoveToTile) {
                                            nextPosX = prevNextX;
                                            nextPosY = prevNextY;
                                            canMoveToTile = true;
                                        }
                                    }
                                })
                            } else {
                                canMoveToTile = true;
                            }
                        }
                    }
                });
            }
        }
        console.log('canMoveToTile', canMoveToTile)
        if (canMoveToTile) {
            const playGridKey = this.gameBoardGrid.gridKey(nextPosY, nextPosX);
            this.moveItemToTile(itemToMove, nextPosY, nextPosX);

            // Detect if player or enemy are on the same tile
            if (this.gameBoardGrid.mazeTiles.get(playGridKey).hasItemOnTile(EnemyItem) &&
                this.gameBoardGrid.mazeTiles.get(playGridKey).hasItemOnTile(PlayerItem)) {
                this.gameBoardGrid.renderLostLife()
            }

            hasMoved = true;
        }


        if (itemToMove.hasAbility(ItemAbilities.LivesFootsteps) && hasMoved) {
            this.gameBoardGrid.effects.addEffect(new FootstepEffects(emptyTile, itemToMove.orientation));

            let tile = this.gameBoardGrid.mazeTiles.get(this.gameBoardGrid.gridKey(itemToMove.position.y, itemToMove.position.x));
            if (tile.visible) {
                new Sound('./assets/sounds/stepdirt_1.wav').volume(0.1).play();
            }

        }

        //  @TODO Make view fog effect
        if (this.gameBoardGrid.fogRadius) {
            // const tiles = this.gameBoardGrid.findNearByTiles(this.gameBoardGrid.player, this.gameBoardGrid.fogRadius);
            // this.gameBoardGrid.visibleTiles = tiles;
            // this.gameBoardGrid.makeVisible(tiles)
        }


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
        if (itemToMove.orientation === Orientation.Right) {
            if (this.moveItemRight(itemOnAway)) {
                return true
                //return this.moveItemRight(itemToMove);
            }
        }
        if (itemToMove.orientation === Orientation.Left) {
            if (this.moveItemLeft(itemOnAway)) {
                return true;
                //return this.moveItemLeft(itemToMove);
            }
        }
        if (itemToMove.orientation === Orientation.Up) {
            if (this.moveItemUp(itemOnAway)) {
                return true;
                //  return this.moveItemUp(itemToMove);
            }
        }
        if (itemToMove.orientation === Orientation.Down) {
            if (this.moveItemDown(itemOnAway)) {
                return true;
                // return this.moveItemDown(itemToMove);
            }
        }

        return false
    }

    useItem(avatar, item) {
        if (item.hasAbility(ItemAbilities.canBePlaced)) {
            avatar.inventory.removeItem(item);
            item.position = avatar.position;
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

            if (possItem.hasAbility(ItemAbilities.CanBePicked)) {
                if (avatar.getItemInHand()) {
                    console.log(avatar.getItemInHand());
                    hasBeenPicked = false
                    avatar.addChatBubble('I cant pick more items', 100)
                } else {
                    avatar.grabItem(possItem)
                    possItem.attributes.position = {
                        top: -10,
                        left: -10
                    }
                    possItem.attributes.size = {
                        top: 25,
                        left: 25
                    }
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
                    avatar.onPickUpItem(possItem);
                }
                return hasBeenPicked
            }
            if (possItem.hasAbility(ItemAbilities.CanBePushed) && !hasBeenPicked) {
                consoole.log('TADA');
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
