class BaseItem {

    isBlocker = false;

    tileChar = '';
    /**
     *
     * @type {string}
     *
     BASE_CLASS = 'base-item';

     class = this.BASE_CLASS;
     */

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

    onMoveChange = new Subject();
    /**
     *
     * @type {BaseItem}
     * @private
     */
    _itemInHand = null;


    /**
     *
     * @type {string[]}
     */
    additionalClass = [];

    onInteractCallBack = (gameBoardGrid, npc, item, isAutoInteraction) => {
        // console.log('onInteractCallBack', gameBoardGrid, npc, item);
    }

    onLeaveCallBack = (gameBoardGrid, npc, item) => {
        // console.log('onInteractCallBack', gameBoardGrid, npc, item);
    }

    constructor({baseClass, skipGameId, abilities, onInteractCallBack, onLeaveCallback}) {
        this.BASE_CLASS = baseClass ?? this.BASE_CLASS;
        this.class = this.BASE_CLASS;
        this.skipGameId = skipGameId ?? this.skipGameId;
        this.abilities = abilities ?? this.abilities;
        this.onInteractCallBack = onInteractCallBack ?? this.onInteractCallBack
        this.onLeaveCallBack = onLeaveCallback ?? this.onLeaveCallBack
        if (!this.skipGameId) {
            this.id = game.getNewItemId(this);
        }
        this.init();
    }

    init() {

    }

    setPosition(y, x) {
        this.position = {
            y, x
        }
    }

    onInteract(gameBoardGrid, avatar, isAutoInteraction) {
        this.onInteractCallBack(gameBoardGrid, this, avatar, isAutoInteraction)
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

        if (this.orientation) {
            this.class = [this.BASE_CLASS, this.orientationClass(this.orientation), ...this.additionalClass].join(' ');

        }
    }

    orientationClass(orientation) {
        let className = 'moveIdle'
        switch (orientation) {
            case Orientation.Left:
                className = 'moveLeft';
                break
            case Orientation.Right:
                className = 'moveRight';
                break
            case Orientation.Down:
                className = 'moveDown';
                break
            case Orientation.Up:
                className = 'moveUp';
                break
        }

        return className;
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

    resetOffsetPosition() {
        this.attributes.position = {
            left: 0,
            right: 0
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


    grabItem(item) {
        this._itemInHand = item
    }

    getItemInHand() {
        return this._itemInHand
    }


    /**
     *
     * @param item {BaseItem}
     */
    onPickUpItem(item) {
        console.log(item)
    }

    /**
     *
     * @param item {BaseItem}
     */
    onDropDownItem(item) {

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
        this.class += " " + this.additionalClass.join(' ');
        this.isTurning(Orientation.Up);

        this.onMoveChange.next(Orientation.Up);
        this.notify({
            moved: this.orientation
        })
    }

    onMoveDown() {
        this.class = this.BASE_CLASS + ' moveDown';
        this.class += " " + this.additionalClass.join(' ')
        this.isTurning(Orientation.Down);
        this.notify({
            moved: this.orientation
        })
        this.onMoveChange.next(Orientation.Down);

    }

    onMoveLeft() {
        this.class = this.BASE_CLASS + ' moveLeft'
        this.class += " " + this.additionalClass.join(' ')
        this.isTurning(Orientation.Left);
        this.notify({
            moved: this.orientation
        })
        this.onMoveChange.next(Orientation.Left);
    }

    onMoveRight() {
        this.class = this.BASE_CLASS + ' moveRight';
        this.class += " " + this.additionalClass.join(' ');
        this.isTurning(Orientation.Right);
        this.notify({
            moved: this.orientation
        })
        this.onMoveChange.next(Orientation.Right);
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
