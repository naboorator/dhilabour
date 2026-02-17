class EmptyItem extends BaseItem {

    sprite = './assets/images/items/floor.png';

    constructor({baseClass, skipGameId, abilities, onInteractCallBack}) {
        if (!baseClass) {
            baseClass = 'empty-tile';
        }

        super({baseClass, skipGameId, abilities, onInteractCallBack});
    }


    init() {

    }

}


