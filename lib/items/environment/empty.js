class EmptyItem extends BaseItem {
    isBlocker = false;

    zIndex = 0;

    constructor({baseClass, skipGameId, abilities, onInteractCallBack}) {
        if (!baseClass) {
            baseClass = 'empty-tile';
        }

        super({baseClass, skipGameId, abilities, onInteractCallBack});
    }

}


class GrassItem extends BaseItem {
    isBlocker = false;

    // Default grass
    sprite = pathToSprite('./assets/images/items/grass_1.png');
    zIndex = 0;

    constructor({baseClass, skipGameId, abilities, onInteractCallBack, tile}) {
        if (!baseClass) {
            baseClass = 'grass-tile';
        }
        super({baseClass, skipGameId, abilities, onInteractCallBack});
        if (tile) {
            this.sprite = pathToSprite(tile);
        }
    }
}


class HouseFloorItem extends BaseItem {
    isBlocker = false;

    // Default floor
    sprite = pathToSprite('./assets/images/items/floor_wood_1.png');

    zIndex = 0;

    constructor({baseClass, skipGameId, abilities, onInteractCallBack, tile}) {
        if (!baseClass) {
            baseClass = 'house-floor-tile';
        }
        super({baseClass, skipGameId, abilities, onInteractCallBack});
        if (tile) {
            this.sprite = pathToSprite(tile);
        }
    }
}

