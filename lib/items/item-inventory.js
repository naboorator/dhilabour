class ItemWithInventory extends BaseItem {

    /**
     *
     * @type {ItemInventory}
     */
    inventory = new ItemInventory(0, []);

    pickItem(item) {
        if (item.hasAbility(ItemAbilities.IsInventoryItem)) {
            return this.inventory.addItem(item);
        }
        return true;
    }

    getLastFromInventory() {
        return this.inventory.getItem(this.inventory.lastItemIndex)
    }
}
