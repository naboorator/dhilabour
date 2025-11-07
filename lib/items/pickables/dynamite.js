class DynamiteItem extends BasePickableItem {
    BASE_CLASS = 'dynamite-tile';

    class = this.BASE_CLASS;

    detonateTime = 2000;

    abilities = [ItemAbilities.IsInventoryItem, ItemAbilities.CanBePicked, ItemAbilities.CanExplode]

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

        let tilesNearBy = findNearByTiles(gameBoard, this, 1, 1, false)
        gameBoard.effects.addEffect(new ExplodeEffect(item, true, 100))
        new Sound('/assets/sounds/dynmite.wav').volume(3).setOffset(1.5).play();
        gameBoard.removeItemFromTile(this);

        tilesNearBy.forEach((tile) => {
            Array.from(tile.getAllItems().values()).forEach((gameBoardItem) => {
                if (gameBoardItem instanceof PlayerItem) {
                    gameBoard.renderLostLife();
                }

                if (gameBoardItem instanceof EnemyItem) {
                    gameBoard.effects.addEffect(new ExplodeEffect(gameBoardItem, 20))
                }

                if (gameBoardItem.hasAbility(ItemAbilities.CanExplode)) {
                    gameBoard.effects.addEffect(new ExplodeEffect(gameBoardItem, 20))
                    gameBoard.removeItemFromTile(gameBoardItem);
                }

            })
        })

    }

}
