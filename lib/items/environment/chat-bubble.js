class ChatBubbleItem extends BaseItem {
    /**
     *
     * @type {string}
     */
    BASE_CLASS = 'chat-bubble-tile';

    class = this.BASE_CLASS;

    text = '';

    visible = 1;

    life = 0;

    ttl = null;

    height = 0;

    constructor({baseClass}, text, ttl) {
        super({});
        this.text = text;
        this.ttl = ttl ?? this.ttl;

        // Approximate height calculation:
        const charsPerLine = 25; // adjust based on font/width
        const lineHeight = 20;   // px
        const lines = Math.ceil(text.length / charsPerLine);
        const height = lines * lineHeight;


        this.attributes = {
            size: {
                h: height,
                w: (this.text.length) * 7
            },
            position: {
                top: -height - 5
            }

        }
        console.log(this.attributes);
        this.setVisible(true)
    }

    update() {

        if (this.ttl && this.ttl < this.life) {
            this.onDestroy();
        } else {
            this.life++
        }
    }

    onDestroy() {
        super.onDestroy();
    }
}
