class GenericPickUpItem extends BasePickableItem {

    /**
     *
     * @param gameBoardGrid
     * @param avatar
     */
    onPickUp(gameBoardGrid, avatar) {
        return this.onPickupCallback(gameBoardGrid, this, avatar)
    }


}
