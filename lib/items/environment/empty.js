class EmptyItem extends BaseItem {

    BASE_CLASS = 'empty-tile'

    constructor({baseClass, skipGameId, abilities, onInteractCallBack}) {
        if (!baseClass) {
            baseClass = 'empty-tile';
        }

        super({baseClass, skipGameId, abilities, onInteractCallBack});
    }

}


class GrassItem extends BaseItem {
    class = 'grass-tile';

    constructor({baseClass, skipGameId, abilities, onInteractCallBack}) {
        if (!baseClass) {
            baseClass = 'grass-tile';
        }
        super({baseClass, skipGameId, abilities, onInteractCallBack});
        this.class = baseClass;
    }
}
