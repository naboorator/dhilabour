class RenderHtml {
    referenceEl = null;

    /**
     * @var game Game
     */
    game

    constructor(game) {
        this.game = game;
        this.referenceEl = document.getElementById(game.refId);
        if (!this.referenceEl) {
            console.error("RenderHtml render failed");
        }
    }

    render(gameScreen) {
        if (gameScreen && gameScreen.updateScreen) {
            this.referenceEl.innerHTML = gameScreen.render();
        }
    }

    addGameItem(item, absolute = true) {
        const el = document.createElement('div');
        el.style.display = 'inline-block';
        el.style.backgroundColor = item.background;
        el.style.width = item.width + 'px';
        el.style.height = item.height + 'px';
        el.style.top = '0';
        el.style.left = '0';

        el.style.marginBottom = '0'
        el.className = item.class ?? '';
        el.style.position = absolute ? 'absolute' : 'relative';

        if (item.visible) {
            el.style.opacity = item.visible;
        } else {
            el.style.opacity = 0;
        }


        return el;
    }

    /**
     *
     * @param effect
     */
    addEffect(effect) {
        const el = document.createElement('div');
        el.className = effect.class;
        el.style.position = 'absolute';
        el.style.display = 'block';
        el.style.height = '30px';
        el.style.width = '30px';
        el.style.top = 0;
        el.style.left = 0;


        if (effect.attributes?.opacity) {
            el.style.opacity = effect.attributes.opacity.toString()
        }

        if (effect.attributes?.position?.top) {
            el.style.top = effect.attributes.position.top + 'px'
        }

        if (effect.attributes?.position?.left) {
            el.style.left = effect.attributes.position.left + 'px'
        }
        if (effect.attributes?.size) {
            el.style.width = effect.attributes.size.w + 'px'
            el.style.height = effect.attributes.size.h + 'px'
        }
        if (effect.attributes?.angle) {
            el.style.rotate = effect.attributes.angle + 'deg'
        }

        if (effect.attributes?.size) {
            el.style.width = effect.attributes.size.w + 'px !important'
            el.style.height = effect.attributes.size.h + 'px !important'
        }

        if (effect.attributes?.background?.size) {
            el.style.backgroundSize = effect.attributes.background.size + 'px'
        }

        el.style.zIndex = 1000 + effect.zindex ?? 0
        el.innerHTML = '&nbsp;'
        return el;
    }

    addRow() {
        const el = document.createElement('div');
        el.style.display = 'block';
        el.style.width = '0px';
        el.style.height = '0px';

        return el;
    }


    getHpHtml(text) {
        let hp = Number(text);
        let i = 0;
        let harts = '';
        let hartsHtml = '<span>{{harts}}</span>';
        while (i < hp) {
            // heart emoji
            harts += '&#128420;';
            ++i;
        }
        if (hp < 1) {
            // ambulance &#128657;
            harts = '&#128657;'
        }
        let el = document.getElementById('playerHp');

        return hartsHtml.replace('{{harts}}', harts);
    }

    /**
     *
     * @param inventory ItemInventory
     * @returns {string}
     */
    getInventoryHtml(inventory) {
        let html = ''
        if (inventory.hasItems()) {
            let i = 0;
            while (i <= inventory.size) {
                let item = inventory.getItem(i);
                if (!item) {
                    item = new EmptyItem();
                }
                html += '<div class="cell-wrapper">';
                html += this.addGameItem(new EmptyItem(), true).outerHTML
                html += this.addGameItem(item, false).outerHTML
                html += '</div>'
                ++i;
            }

        } else {
            let i = 0
            while (i <= inventory.size) {
                html += '<div class="cell-wrapper">';
                html += this.addGameItem(new EmptyItem(), false).outerHTML
                html += '</div>'
                ++i;
            }

        }
        return html;
    }

}
