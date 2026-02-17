/**
 *
 * @param mazeTiles {Map<string, MazeTile>}
 * @param item {BaseItem}
 * @param radiusX {number}
 * @param radiusY {number}
 * @param fillEmptyTiles
 * @returns {MazeTile[]}
 */
function findNearByTiles(mazeTiles, item, radiusX, radiusY, fillEmptyTiles) {
    const mainY = item.position.y;
    const mainX = item.position.x;

    const checkTiles = [];
    let i = 0;
    checkTiles.push([mainY, mainX, i]);
    for (let y = mainY - radiusY; y <= mainY + radiusY; y++) {

        for (let x = mainX - radiusX; x <= mainX + radiusX; x++) {
            if (!(y === mainY && x === mainX)) {
                checkTiles.push([y, x, i]);
            }
        }
        i++;
    }

    let tmp = []

    checkTiles.forEach(coordinates => {
        const key = getGridKey(coordinates[0], coordinates[1]);
        let tile = mazeTiles.get(key);
        if (!tile && fillEmptyTiles) {
            tile = new MazeTile(coordinates[0], coordinates[1]);
        }

        if (tile) {
            tmp.push(tile);
        }

    })

    return tmp;

    /*
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

     */
}


function canBeMoved(itemToMove, item, movmentResolver, gameBoardGrid) {

    let canMove = !item.isBlocker;

    if (!canMove) {
        return false
    }
    if (item.hasAbility(ItemAbilities.CanInteract) && itemToMove.hasAbility(ItemAbilities.CanStartInteract)) {
        canMove = false;
        if (item.hasAbility(ItemAbilities.CanAutoInteract)) {
            item.onInteract(gameBoardGrid, itemToMove, true);
        }
    }


    if (item.hasAbility(ItemAbilities.CanStartInteract) && itemToMove.hasAbility(ItemAbilities.CanInteract)) {
        canMove = false;
        return canMove
    }

    if (item instanceof DoorItem && item.isOpen) {
        canMove = true;
    }

    if (item.hasAbility(ItemAbilities.canBePlaced) || item.hasAbility(ItemAbilities.CanBePicked)) {
        canMove = true;
    }

    if (itemToMove.hasAbility(ItemAbilities.CanPickItems) && item.hasAbility(ItemAbilities.CanBePicked)) {
        const hasPicked = itemToMove.pickItem(item);
        canMove = hasPicked;
        if (hasPicked && item.onPickUp) {
            item.onPickUp(gameBoardGrid, itemToMove);
            gameBoardGrid.removeItemFromTile(item)
        }
    }


    if (item.hasAbility(ItemAbilities.IsTrigger) && itemToMove.hasAbility(ItemAbilities.CanTriggerTriggers)) {
        canMove = true;
    }


    if (item instanceof BoxPlaceItem) {
        canMove = true;
    }

    if (item instanceof EnemyItem && !(itemToMove instanceof BoxItem)) {
        // When box moves to Place where box should be moved
        canMove = true;
    }

    if (item instanceof EnemyItem || item instanceof PlayerItem) {
        // When box moves to Place where box should be moved
        canMove = true;
    }

    if (item instanceof BoxItem) {
        canMove = false;
        if (itemToMove.hasAbility(ItemAbilities.MoveBoxes)) {
            canMove = movmentResolver.pushItemInDirectionOfMovingItem(itemToMove, item);
        }
    }

    if (item instanceof DoorItem && itemToMove instanceof BoxItem) {
        canMove = item.isOpen;
    }


    if (item instanceof EnemyItem || item instanceof PlayerItem) {
        if (itemToMove instanceof WallItem) {
            hasMoved = movmentResolver.pushItemInDirectionOfMovingItem(itemToMove, item);
            if (!hasMoved) {
                if (item instanceof EnemyItem) {
                    gameBoardGrid.destroyEnemy(item)
                } else {
                    gameBoardGrid.renderLostLife();
                }

            }
        }
    }


    // Player or enemy steps on tile where portalTile is Present
    if (item instanceof PortalItem) {
        let nextPortal = gameBoardGrid.portalPlaces.find((portal) => {
            return portal.id !== item.id
        })

        const prevNextY = nextPosY;
        const prevNextX = nextPosX;
        if (nextPortal) {
            nextPosY = nextPortal.position.y
            nextPosX = nextPortal.position.x

            let possibleItems = gameBoardGrid.getItemsOnPosition(nextPosY, nextPosX);

            if (possibleItems.size > 0) {
                canMove = false;
                possibleItems.forEach(possibleItem => {
                    if (possibleItem instanceof PortalItem || possibleItem instanceof EnemyItem) {
                        canMove = true;
                    }
                    if (possibleItem instanceof BoxItem && itemToMove instanceof BoxItem) {
                        nextPosX = prevNextX;
                        nextPosY = prevNextY;
                    }

                    if (possibleItem instanceof BoxItem && itemToMove.hasAbility(ItemAbilities.MoveBoxes)) {
                        canMove = movmentResolver.pushItemInDirectionOfMovingItem(itemToMove, possibleItem);
                        if (!canMoveToTile) {
                            nextPosX = prevNextX;
                            nextPosY = prevNextY;
                            canMoveToTile = true;
                        }
                    }
                })
            } else {
                canMove = true;
            }
        }
    }

    return canMove;
}
