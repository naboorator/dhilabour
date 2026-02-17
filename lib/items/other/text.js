class TextItem extends BaseItem {

    text = '';

    constructor({abilities, skipGameId, onInteractCallBack, onLeaveCallback, text}) {
        super({abilities, skipGameId, onInteractCallBack, onLeaveCallback});
        this.text = text;
    }

}
