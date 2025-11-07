class RenderHtml {
    referenceEl = null;
    
    constructor(renderId) {
        this.referenceEl = document.getElementById(renderId);
        if (!this.referenceEl) {
            console.error("RenderHtml render failed");
        }
    }

    render(gameScreen) {
        if (gameScreen && gameScreen.updateScreen) {
            this.referenceEl.innerHTML = gameScreen.render();
        }
    }

    /**
     *
     * @param item {BaseItem}
     * @param absolute {boolean}
     * @returns {HTMLDivElement}
     */
    addGameItem(item, absolute = true) {
        const el = document.createElement('div');
        el.style.display = 'none';
        el.style.backgroundColor = item.background;
        el.style.width = item.width + 'px';
        el.style.height = item.height + 'px';
        el.style.top = '0';
        el.style.left = '0';

        el.style.marginBottom = '0'
        el.className = item.class ?? '';
        el.style.position = absolute ? 'absolute' : 'relative';

        this.handleItemAttributes(el, item)

        if (item.isVisible()) {
            el.style.opacity = '1';
            el.style.display = 'inline-block';
        } else {
            el.style.display = 'inline-block';
            el.style.opacity = '0.2'
        }

        if (item.text) {
            el.innerHTML = item.text;
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

        this.handleItemAttributes(el, effect)
        el.style.zIndex = 1000 + effect.zindex ?? 0
        el.innerHTML = '&nbsp;'
        return el;
    }

    /**
     *
     * @param el {HTMLDivElement}
     * @param effect {BaseItem | BaseEffect}
     */
    handleItemAttributes(el, effect) {

        if (effect.attributes?.opacity) {
            el.style.opacity = effect.attributes.opacity.toString()
        }

        if (effect.attributes?.position?.top) {
            el.style.top = effect.attributes.position.top + 'px'
        }

        if (effect.attributes?.position?.left) {
            el.style.left = effect.attributes.position.left + 'px'
        }
        if (effect.attributes?.size?.w) {
            el.style.width = effect.attributes.size.w + 'px'
        }
        if (effect.attributes?.size?.h) {
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
            let i = 0
            while (i <= inventory.size - 1) {
                let item = inventory.getItem(i);
                if (!item) {
                    item = new EmptyItem({baseClass: 'empty-tile', skipGameId: true});
                }
                html += '<div class="cell-wrapper">';
                html += this.addGameItem(new EmptyItem({baseClass: 'empty-tile', skipGameId: true}), true).outerHTML
                html += this.addGameItem(item, false).outerHTML
                html += '</div>'
                ++i;
            }

        } else {
            let i = 0
            while (i <= inventory.size - 1) {
                html += '<div class="cell-wrapper">';
                html += this.addGameItem(new EmptyItem({skipGameId: true}), false).outerHTML
                html += '</div>'
                ++i;
            }

        }
        return html;
    }

    getEnergyBar(value, maxValue) {
        const percentage = Math.floor((value / maxValue) * 100);

        const el = document.createElement('div');
        el.className = 'energy-bar';
        el.style.height = percentage + '%';

        return el
    }

    getWaterBar(value, maxValue) {
        const percentage = Math.floor((value / maxValue) * 100);

        const el = document.createElement('div');
        el.className = 'water-bar';
        el.style.height = percentage + '%';


        return el
    }

}
