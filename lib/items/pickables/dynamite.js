class DynamiteItem extends BasePickableItem {
    BASE_CLASS = 'dynamite-tile';

    class = this.BASE_CLASS;

    detonateTime = 2000;

    abilities = [ItemAbilities.IsInventoryItem, ItemAbilities.CanBePicked]

    /**
     *
     * @param gameBoardGrid {GameBoardGrid}
     */
    onPickUp(gameBoardGrid) {
        gameBoardGrid.effects.addEffect(new RotateEffect(this, 15))
        this.abilities = [ItemAbilities.canBePlaced];
    }

    /**
     *
     * @param gameBoard {GameBoardGrid}
     */
    onPlaceDown(gameBoard) {
        this.class = [this.BASE_CLASS, 'on'].join(' ');
        gameBoard.setPlayableItemPosition(this.position.y, this.position.x, this);
        setTimeout(() => {
            this.explode(this, gameBoard)
        }, this.detonateTime)

    }

    explode(item, gameBoard) {
        let itemsNearBy = gameBoard.findNearByTiles(this, 1);
        gameBoard.effects.addEffect(new ExplodeEffect(item, true, 100))
        gameBoard.removeItemFromTile(this);

        itemsNearBy.forEach(gameBoardItem => {
            if (gameBoardItem instanceof PlayerItem) {
                gameBoard.renderLostLife();
            }

            if (gameBoardItem instanceof EnemyItem) {
                gameBoard.effects.addEffect(new RotateEffect(gameBoardItem, 20))
                gameBoard.removeItemFromTile(gameBoardItem);
            }

            if (gameBoardItem instanceof WallItem || gameBoardItem instanceof BoxItem) {
                gameBoard.effects.addEffect(new ExplodeEffect(gameBoardItem, true, 20))
                gameBoard.removeItemFromTile(gameBoardItem);
            }

            if (gameBoardItem instanceof DynamiteItem) {
                gameBoardItem.explode(gameBoardItem, gameBoard)
                gameBoard.removeItemFromTile(gameBoardItem);
            }


        })
    }

}
