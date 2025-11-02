/**
 *
 * @param gameBoardGrid {GameBoardGrid}
 * @param item {BaseItem}
 * @param radiusX {number}
 * @param radiusY {number}
 * @param foo {TODO}
 * @returns {MazeTile[]}
 */
function findNearByTiles(gameBoardGrid, item, radiusX, radiusY, fillEmptyTiles) {
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
        const key = gameBoardGrid.gridKey(coordinates[0], coordinates[1]);
        const tile = gameBoardGrid.mazeTiles.get(key);
        if (tile) {
            tmp.push(tile)
        } else {
            if (fillEmptyTiles) {
                // no tile found make empty one
                tmp.push(new MazeTile(coordinates[0], coordinates[1]));
            }
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
