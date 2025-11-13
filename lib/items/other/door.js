class DoorItem extends BaseItem {
    BASE_CLASS = 'door-tile blue'

    class = this.BASE_CLASS;

    locked = true

    isOpen = false

    initialLocked = false;

    keyLockCode = null


    onInteractCallBack = (gameBoardGrid, npc, item, isAutoInteract) => {
        // console.log('onInteractCallBack', gameBoardGrid, npc, item);
    }

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
        this.keyLockCode = keyLockCode ?? null;
        this.isOpen = isOpen ?? this.isOpen;
        this.locked = locked ?? this.locked;
        this.initialLocked = this.locked;
        this.onInteractCallBack = onInteractCallBack ?? this.onInteractCallBack;
    }

    update() {
        if (this.isOpen) {
            this.class = this.BASE_CLASS + ' is-open'
        } else {
            this.class = this.BASE_CLASS
        }
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

            return true
        }
        return false;
    }

    isLocked() {
        return this.locked;
    }

    onLeave(gameBoard, item) {
        this.onLeaveCallBack(gameBoard, item);
    }

    canUnlock(avatarKeyLockKey) {
        return this.keyLockCode === avatarKeyLockKey;
    }
}

