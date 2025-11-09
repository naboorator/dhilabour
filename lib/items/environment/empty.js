class EmptyItem extends BaseItem {

    BASE_CLASS = 'empty-tile'

    constructor({baseClass, skipGameId, abilities, onInteractCallBack}) {
        if (!baseClass) {
            baseClass = 'empty-tile';
        }
        console.log('baseClass', baseClass);
        super({baseClass, skipGameId, abilities, onInteractCallBack});
    }

}


class GrassItem extends BaseItem {
    class = 'grass-tile';

    constructor({baseClass, skipGameId, abilities, onInteractCallBack}) {
        if (!baseClass) {
            baseClass = 'grass-tile';
        }
        console.log('baseClass', baseClass);
        super({baseClass, skipGameId, abilities, onInteractCallBack});
        this.class = baseClass;
    }
}
