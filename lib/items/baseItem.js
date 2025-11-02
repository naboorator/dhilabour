class BaseItem {
    tileChar = '';
    /**
     *
     * @type {string}
     */
    BASE_CLASS = 'base-item';

    class = this.BASE_CLASS;

    /**
     *
     * @type {number}
     */
    id = 0;

    /**
     *
     * @type {{x: number, y: number}}
     */
    position = {
        x: 0,
        y: 0
    };

    // @Todo remove from here
    border = 'none';

    /**
     *
     * @type {Orientation}
     */
    orientation = Orientation.Idle

    /**
     *
     * @type {BaseItem[]}
     */
    subscribers = [];

    /**
     *
     * @type {boolean}
     */
    isTurnDirection = false;

    /**
     *
     * @type {ItemAbilities[]}
     */
    abilities = [];

    /**
     *
     * @type {ItemInventory}
     */
    inventory = new ItemInventory(0, []);

    /**
     *
     * @type {BaseItem[]}
     */
    childItems = [];

    /**
     *
     * @type boolean
     */
    skipGameId = false;

    /**
     * When child item is added to this
     * @type {Subject}
     */
    onAddChildItem = new Subject(null);

    /**
     * when child item is removed
     * @type {Subject}
     */
    onRemoveChildItem = new Subject(null);

    _discovered = false;

    /**
     *
     * @type {boolean}
     */
    _visible = false;

    _renderable = false;

    constructor({baseClass, skipGameId, abilities}) {
        this.BASE_CLASS = baseClass ?? this.BASE_CLASS;
        this.class = this.BASE_CLASS;
        this.skipGameId = skipGameId ?? this.skipGameId;
        this.abilities = abilities ?? this.abilities;
        if (!this.skipGameId) {
            this.id = game.getNewItemId(this);
        }

    }

    setPosition(y, x) {
        this.position = {
            y, x
        }
    }


    setVisible(visible) {
        this._visible = visible;
        if (this._visible) {
            this._discovered = true;
        }
    }

    update() {

    }

    isVisible() {
        return this._visible;
    }

    addChildItem(childItem) {
        this.childItems.push(childItem);
        this.onAddChildItem.next(childItem);
    }

    clearChildItems() {
        this.onRemoveChildItem.next([...this.childItems]);
        this.childItems = []
    }

    /**
     * Notify observables about something
     * @param data {any}
     */
    notify(data) {
        this.subscribers.forEach((item) => {
            item.notify(data);
        })
    }

    init() {

    }

    pickItem(item) {
        if (item.hasAbility(ItemAbilities.IsInventoryItem)) {
            return this.inventory.addItem(item);
        }

        return true;

    }

    getLastFromInventory() {
        return this.inventory.getItem(this.inventory.lastItemIndex)
    }

    /**
     *
     * @param direction {Orientation}
     * @returns {boolean}
     */
    isTurning(direction) {
        this.isTurnDirection = direction !== this.orientation;
        this.orientation = direction
        return this.isTurnDirection;
    }


    onMoveUp() {
        this.class = this.BASE_CLASS + ' moveUp'
        this.isTurning(Orientation.Up);

        this.notify({
            moved: this.orientation
        })
    }

    onMoveDown() {
        this.class = this.BASE_CLASS + ' moveDown'
        this.isTurning(Orientation.Down);
        this.notify({
            moved: this.orientation
        })

    }

    onMoveLeft() {
        this.class = this.BASE_CLASS + ' moveLeft'
        this.isTurning(Orientation.Left);
        this.notify({
            moved: this.orientation
        })
    }

    onMoveRight() {
        this.class = this.BASE_CLASS + ' moveRight'
        this.isTurning(Orientation.Right);
        this.notify({
            moved: this.orientation
        })
    }

    /**
     *
     * @param abilitie {ItemAbilities}
     */
    hasAbility(abilitie) {
        return (this.abilities.indexOf(abilitie) > -1)
    }

    onDestroy() {

    }

    /**
     * Called on every render
     */
    update() {

    }
}
