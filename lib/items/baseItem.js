class BaseItem {

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
     * @type {number} range 0  to 1
     */
    visible = 1;

    /**
     *
     * @type {ItemInventory}
     */
    inventory = new ItemInventory(0, []);

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
        console.log(this.inventory.lastItemIndex)
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
     * @param item {BaseItem}
     */
    addSubscriber(item) {
        this.subscribers.push(item)
    }

    /**
     *
     * @param abilitie {ItemAbilities}
     */
    hasAbility(abilitie) {
        return (this.abilities.indexOf(abilitie) > -1)
    }

    setPosition(y, x) {
        this.position = {
            y,
            x
        }
        return this;
    }

    /**
     * Called on every render
     */
    update() {

    }

}
