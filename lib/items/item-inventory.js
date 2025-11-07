class ItemWithInventory extends BaseItem {

    /**
     *
     * @type {ItemInventory}
     */
    inventory = new ItemInventory(0, []);

    lastIndex = -1

    pickItem(item) {
        if (item.hasAbility(ItemAbilities.IsInventoryItem)) {
            return this.inventory.addItem(item);
        }
        return true;
    }

    getLastFromInventory() {
        this.lastIndex = this.inventory.lastItemIndex;
        return this.inventory.getItem(this.lastIndex)
    }

    getNextItem() {
        if (this.lastIndex < 0) {
            this.lastIndex = this.inventory.lastItemIndex;
        }

        return this.inventory.getItem(this.lastIndex)

    }
}
