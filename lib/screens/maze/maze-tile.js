class MazeTile {
    y = 0;
    x = 0;

    id = 0;

    /**
     * Is tile visible
     * @type {boolean}
     */

    visible = false;

    /**
     * TileItems
     * @type { Map<number, BaseItem>}
     * @private
     */
    _items = new Map();

    /**
     *
     * @type {BaseItem}
     * @private
     */
    _backgroundItem;

    /**
     *
     * @param tileChanges {Subject<MazeTile>}
     */
    tileChanges = new Subject();

    /**
     *
     * @type tileBackgroundChanges {Subject}
     */
    tileBackgroundChanges = new Subject();

    constructor(y, x, backgroundItem) {
        this.x = x;
        this.y = y;
        this.id = y + '-' + x
        if (backgroundItem) {
            this._backgroundItem = backgroundItem;
            this._backgroundItem.setPosition(this.y, this.x);
        }

    }

    /**
     *
     * @param item {BaseItem}
     */
    addItem(item) {
        this._items.set(item.id, item);
        this.tileChanges.next(this);
    }

    getItem(item) {
        return this._items.get(item.id)
    }

    getAllItems() {
        return this._items
    }

    /**
     *
     * @param itemInstance
     * @returns {boolean}
     */
    hasItemOnTile(itemInstance) {
        return Array.from(this._items.values()).some((item) => {
            return item instanceof itemInstance
        })
    }

    removeItem(item) {
        this._items.delete(item.id);
        this.tileChanges.next(this);
    }

    clearTile() {
        this._items.clear();
        this.tileChanges.next(this);
    }

    isEmpty() {
        return this._items.size === 0;
    }

    /**
     * Background item which represents tile background
     *
     * @param item {BaseItem}
     */
    setBackgroundItem(item) {
        this._backgroundItem = item;
        this.tileChanges.next(this);
        this.tileBackgroundChanges.next(item);
    }

    getBackgroundItem() {
        return this._backgroundItem;
    }

    getKey() {
        return this.y + '-' + this.x
    }

}
