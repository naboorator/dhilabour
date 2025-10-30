class DoorItem extends BaseItem {
    BASE_CLASS = 'door-tile blue'

    class = this.BASE_CLASS;

    locked = true

    isOpen = false

    onInteractCallBack = (gameBoardGrid, npc, item) => {
        // console.log('onInteractCallBack', gameBoardGrid, npc, item);
    }

    /**
     *
     * @param baseClass {string}
     * @param abilities {ItemAbilities[]}
     * @param isOpen {boolean}
     * @param onInteractCallBack {callback}
     */
    constructor({baseClass, abilities, isOpen, locked, onInteractCallBack}) {
        super({baseClass, abilities,});
        this.isOpen = isOpen ?? this.isOpen;
        this.locked = locked ?? this.locked;
        this.onInteractCallBack = onInteractCallBack ?? this.onInteractCallBack;
    }

    update() {
        if (this.isOpen) {
            this.class = this.BASE_CLASS + ' is-open'
        } else {
            this.class = this.BASE_CLASS
        }
    }

    onInteract(gameBoardGrid, avatar) {
        this.onInteractCallBack(gameBoardGrid, this, avatar)
    }

    setLocked(bool) {
        this.locked = bool;
    }

    open() {
        if (!this.locked) {
            this.isOpen = true
            this.abilities = [ItemAbilities.CanInteract]
            return true
        }
        return false;
    }

    close() {
        if (!this.locked) {
            this.isOpen = false;

            this.abilities = [ItemAbilities.CanInteract]
            return true
        }
        return false;
    }
}

