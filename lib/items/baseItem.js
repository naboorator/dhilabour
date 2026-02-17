class BaseItem {
    static nextItemId = 1;
    /**
     * Tels if other items can be moved
     * @type {boolean}
     */
    isBlocker = false;

    /**
     *
     */
    spriteAssetRoot = '/assets/images/';

    /**
     * Sprite image path
     *
     *  @type {string}
     */
    sprite;


    /**
     *
     * @type {ItemAnimations}
     */
    animations = new ItemAnimations();

    /**
     * Layer on which item is rendered higher is rendered more above then lower
     * @type {number}
     */
    zIndex = 1;

    /**
     *
     * @type {number}
     */
    width = TileSize;

    /**
     *
     * @type {number}
     */
    height = TileSize;

    /**
     * number in degreez
     * @type {number}
     */
    rotate = 0;

    /**
     *
     * @type {string}
     */
    backgroundColor = null

    borderRadius = 0;

    textColor = '#000'

    /**
     *
     * @type {Animation}
     */
    currentAnimation = null;

    /**
     * @type {Subscription}
     */
    currentAnimationSubscription;

    /**
     *
     * @type {number}
     */
    opacity = 1;

    /**
     *
     * @type {string}
     */
    text = '';

    /**
     *
     * @type {number}
     */
    id = 0;

    /**
     * Information about where item stands on grid tile
     * @type {{x: number, y: number}}
     */
    position = {
        x: 0,
        y: 0
    };

    /**
     * @TODO Consider about removing this
     * @type {{x: number, y: number}}
     */
    renderPosition = {
        y: 0,
        x: 0
    }

    /**
     *
     * @type {{x: number, y: number}}
     */
    positionOffset = {
        y: 0, x: 0
    }


    /**
     * @TODO Consider about removing this
     * @type {{}}
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

    /**
     * Has been already seen by player
     * @type {boolean}
     * @private
     */
    _discovered = false;

    /**
     *
     * @type {boolean}
     */
    _visible = false;

    /**
     *
     * @type {Subject}
     */
    onDestroy = new Subject();

    /**
     *
     * @type {Subject}
     */
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

    _moving = false;

    _moveSpeed = 5;

    constructor({skipGameId, abilities, onInteractCallBack, onLeaveCallback}) {
        this.skipGameId = skipGameId ?? this.skipGameId;
        this.abilities = abilities ?? this.abilities;
        this.onInteractCallBack = onInteractCallBack ?? this.onInteractCallBack
        this.onLeaveCallBack = onLeaveCallback ?? this.onLeaveCallBack
        if (!this.skipGameId) {
            this.id = BaseItem.nextItemId;
            ++BaseItem.nextItemId
            // game.getNewItemId(this);
        }
        this.init();
    }


    init() {
    }


    update() {
        this._syncChildItemPositions();
        this._syncCssClasses();
        this._animateTransitions();
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


    _syncChildItemPositions() {
        if (this.hasChildItems()) {
            this.childItems.forEach((item) => {
                item.setPosition(this.position.y, this.position.x);
                item.positionOffset = {
                    x: this.positionOffset.x,
                    y: this.positionOffset.y
                }
                item.update();
            })
        }
    }

    _syncCssClasses() {
        this.class = [this.BASE_CLASS, this.orientationClass(this.orientation), ...this.additionalClass].join(' ');
    }

    /**
     *
     * @param orientation {Orientation}
     */
    setOrientation(orientation) {
        if (this.isMoving()) {
            return;
        }
        this.orientation = orientation;

        switch (orientation) {
            case Orientation.Left:
                this.onTurnLeft();
                break;
            case Orientation.Right:
                this.onTurnRight();
                break;
            case Orientation.Up:
                this.onTurnUp();
                break;
            case Orientation.Down:
                this.onTurnDown();
                break;
        }
    }

    setPosition(y, x) {
        // this.setIsMoving(true);

        this.position = {
            y, x
        }

        switch (this.orientation) {
            case Orientation.Right:
                this.positionOffset = {
                    y: 0,
                    x: -TileSize
                }
                break;

            case Orientation.Left:
                this.positionOffset = {
                    y: 0,
                    x: TileSize
                }
                break;

            case Orientation.Up:

                this.positionOffset = {
                    y: TileSize,
                    x: 0
                }

                break;

            case Orientation.Down:
                this.positionOffset = {
                    y: -TileSize,
                    x: 0
                }
                break;
        }


        return true;
    }


    _animateTransitions() {

        if (self instanceof BoxItem) {
            console.log(this.positionOffset);
        }

        if (!this.isMoving()) {
            return
        }

        if (this.orientation === Orientation.Right) {
            const nextX = this.positionOffset.x + this._moveSpeed;
            this.positionOffset.x = (nextX < 0) ? nextX : 0;
            if (this.positionOffset.x === 0) {
                this.setIsMoving(false)
            }
            return
        }

        if (this.orientation === Orientation.Left) {
            const nextX = this.positionOffset.x - this._moveSpeed
            this.positionOffset.x = (nextX <= 0) ? 0 : nextX;
            if (this.positionOffset.x === 0) {
                this.setIsMoving(false);
            }
            return
        }


        if (this.orientation === Orientation.Up) {
            const nextY = (this.positionOffset.y - this._moveSpeed);
            this.positionOffset.y = (nextY > 0) ? nextY : 0;
            if (this.positionOffset.y === 0) {
                this.setIsMoving(false)
            }
            return
        }

        if (this.orientation === Orientation.Down) {
            const nextY = (this.positionOffset.y + this._moveSpeed);
            this.positionOffset.y = (nextY <= 0) ? nextY : 0;
            if (this.positionOffset.y === 0) {
                this.setIsMoving(false)
            }
            return
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
        let sub = childItem.onDestroy.subscribe(item => {
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
        if (indexToRemove !== null) {
            this.childItems.splice(indexToRemove, 1);
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
    onLiftUp(item) {
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
        this.isTurnDirection = this.orientation !== direction;
        this.orientation = direction;

        return this.isTurnDirection
    }

    setIsMoving(bool) {
        this._moving = bool;
    }

    isMoving() {
        return this._moving;
    }

    onMoveUp() {
        this.setCurrentItemAnimation('walkUp', () => {
            this.setCurrentItemAnimation('idleUp');
        });

        return this.doMove(Orientation.Up);
    }

    onMoveDown() {
        this.setCurrentItemAnimation('walkDown', () => {
            this.setCurrentItemAnimation('idleDown');
        });

        return this.doMove(Orientation.Down);

    }

    onMoveLeft() {
        this.setCurrentItemAnimation('walkLeft', () => {
            this.setCurrentItemAnimation('idleLeft');
        });

        return this.doMove(Orientation.Left)

    }

    onMoveRight() {
        this.setCurrentItemAnimation('walkRight', () => {
            this.setCurrentItemAnimation('idleRight');
        });

        return this.doMove(Orientation.Right)

    }

    onTurnDown() {
        this.setCurrentItemAnimation('idleDown', () => {
            // this.setCurrentItemAnimation('Idle');
        });
    }

    onTurnUp() {
        this.setCurrentItemAnimation('idleUp', () => {
            // this.setCurrentItemAnimation('Idle');
        });
    }

    onTurnRight() {
        this.setCurrentItemAnimation('idleRight', () => {
            // this.setCurrentItemAnimation('Idle');
        });
    }

    onTurnLeft() {
        this.setCurrentItemAnimation('idleLeft', () => {
            // this.setCurrentItemAnimation('Idle');
        });
    }

    /**
     *
     * @param orientation {Orientation}
     * @returns {boolean}
     */
    doMove(orientation) {
        this.setIsMoving(true);
        // this.notify({
        //     moved: this.orientation
        // })
        // this.onMoveChange.next(orientation);

        return true;
    }

    /**
     *
     * @param abilitie {ItemAbilities}
     */
    hasAbility(abilitie) {
        return this.abilities.indexOf(abilitie) > -1
    }

    /**
     * Called when item should be destroyed before removing it from game
     */
    destroy() {
        this.onDestroy.next(this);
    }

    addAdditionalClass(className) {
        if (this.additionalClass.indexOf(className) === -1) {
            this.additionalClass.push(className);
        }
    }

    removeAdditionalClass(className) {
        let pos = this.additionalClass.indexOf(className);
        if (pos !== -1) {
            this.additionalClass.splice(pos, 1)
        }
    }

    setCurrentItemAnimation(name, onEndCallback) {

        if (this.currentAnimationSubscription) {
            this.currentAnimationSubscription.unsubscribe();
        }

        this.currentAnimation = this.animations.getAnimation(name);

        if (onEndCallback && this.currentAnimation) {
            this.currentAnimationSubscription = this.currentAnimation.onAnimationLoopEnded.subscribe((animation) => {
                onEndCallback(animation, this);
            })
        }

    }


    /**
     *
     * @returns {Sprite}
     */
    getSprite() {
        let sprite = this.currentAnimation?.getFrame();

        if (!sprite) {
            sprite = this.sprite;
        }

        if (!(sprite instanceof Sprite)) {
            sprite = pathToSprite(sprite);
        }
        return sprite;
    }
}


