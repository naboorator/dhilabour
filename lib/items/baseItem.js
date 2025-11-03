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

    /**
     * @type {{
     * opacity: number,
     * position: {top: number, left: number}
     * size: {
     *     w: string | number,
     *     h: string | number
     * },
     * background: {
     *     size: number
     * }
     *
     * }}
     */
    attributes = {}

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

    // /**
    //  *
    //  * @type {ItemInventory}
    //  */
    // inventory = new ItemInventory(0, []);

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

    destroyed = new Subject();

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
        if (this.hasChildItems()) {
            this.childItems.forEach((item) => {
                item.position = this.position;
                item.update();
            })
        }
    }

    isVisible() {
        return this._visible;
    }


    addChildItem(childItem) {
        this.childItems.push(childItem);
        // when child item is destroyed remove it from child list and unsubsribe
        let sub = childItem.destroyed.subscribe(item => {
            this.removeChildItem(item);
            sub.unsubscribe();
        });
        this.onAddChildItem.next(childItem);
    }

    removeChildItem(childItem) {
        let indexToRemove = null
        this.childItems.forEach((item, index) => {

            if (item.id === childItem.id) {
                indexToRemove = index;
            }
        })
        console.log('this.childItems', this.childItems);
        if (indexToRemove !== null) {
            this.childItems.splice(indexToRemove, 1);
            console.log('cleared', this.childItems);
        }

    }

    clearChildItems() {
        this.onRemoveChildItem.next([...this.childItems]);
        this.childItems = []
    }

    pickItem(item) {
        return false;
    }

    hasChildItems() {
        return this.childItems.length > 0;
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
        this.destroyed.next(this)
    }
}
