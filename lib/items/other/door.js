class DoorItem extends BaseItem {
    locked = true

    isOpen = false

    initialLocked = false;

    keyLockCode = null


    onInteractCallBack = (gameBoardGrid, npc, item, isAutoInteract) => {
        // console.log('onInteractCallBack', gameBoardGrid, npc, item);
    }

    on

    /**
     *
     * @param baseClass {string}
     * @param abilities {ItemAbilities[]}
     * @param isOpen {boolean}
     * @param locked {boolean}
     * @param onInteractCallBack {callback}
     */
    constructor({baseClass, abilities, isOpen, locked, onInteractCallBack, keyLockCode}) {
        super({baseClass, abilities,});
        this.BASE_CLASS = baseClass ?? this.BASE_CLASS;
        this.keyLockCode = keyLockCode ?? null;
        this.isOpen = isOpen ?? this.isOpen;
        this.locked = locked ?? this.locked;
        this.initialLocked = this.locked;
        this.onInteractCallBack = onInteractCallBack ?? this.onInteractCallBack;
    }

    init() {
        const idleAnimation = new Animation();
        idleAnimation.addFrame('/assets/images/items/wooden_door_down.png')
        this.animations.addAnimation('Idle', idleAnimation);
        this.setCurrentItemAnimation('Idle');
    }


    update() {
    }

    onInteract(gameBoardGrid, avatar, isAutoInteract) {
        this.onInteractCallBack(gameBoardGrid, this, avatar, isAutoInteract)
    }


    setLocked(bool) {
        this.locked = bool;
    }

    open(key) {
        if (!this.locked && this.canUnlock(key)) {
            new Sound('./assets/sounds/door.wav').play();
            this.isOpen = true
            if (this.initialLocked) {
                //  this.abilities = [ItemAbilities.CanInteract]
            }

            this.width = 10;
            this.opacity = 0.2;
            //  this.positionOffset.x = -TileSize / 2

            return true
        }
        return false;
    }

    close() {
        if (!this.locked) {
            this.isOpen = false;
            new Sound('./assets/sounds/door.wav').play();
            if (this.initialLocked) {
                // this.abilities = [ItemAbilities.CanInteract]
            }
            this.opacity = 1;
            this.width = TileSize;
            //this.positionOffset.x = 0
            return true
        }
        return false;
    }

    isLocked() {
        return this.locked;
    }

    /**
     *
     * @param gameBoard {GameBoardGrid}
     * @param item {BaseItem}
     */

    onLeave(gameBoard, item) {
        if (item.hasAbility(ItemAbilities.CanAutoInteract)) {
            this.close();
        }
        this.onLeaveCallBack(gameBoard, item);
    }

    canUnlock(avatarKeyLockKey) {
        return this.keyLockCode === avatarKeyLockKey;
    }
}

