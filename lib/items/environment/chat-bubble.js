class ChatBubbleItem extends BaseItem {
    /**
     *
     * @type {string}
     */
    BASE_CLASS = 'chat-bubble-tile';

    class = this.BASE_CLASS;

    text = '';

    visible = 1

    constructor({baseClass}, text) {
        super({});
        this.text = text;
    }

}
