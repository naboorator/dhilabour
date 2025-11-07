class WallItem extends BaseItem {
    constructor({baseClass, skipGameId, abilities, onInteractCallBack}) {
        if (!baseClass) {
            baseClass = 'wall-tile';
        }
        super({baseClass, skipGameId, abilities, onInteractCallBack});

    }
}
