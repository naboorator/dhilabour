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
        let el;

        if (item instanceof TextItem) {
            el = document.createElement('div');
        } else {
            el = document.createElement('div');
        }

        el.style.willChange = 'background-image';
        el.style.imageRendering = 'pixelated';
        el.style.display = item.isVisible() ? 'inline-block' : 'none';
        el.style.position = absolute ? 'absolute' : 'relative';

        // control size & position , rotation, image
        el.style.width = item.width + 'px';
        el.style.height = item.height + 'px';
        el.style.rotate = item.rotate + 'deg'


        el.style.top = item.positionOffset.y + 'px';
        el.style.left = item.positionOffset.x + 'px';

        el.style.backgroundColor = item.backgroundColor ?? 'transparent';
        el.style.borderRadius = item.borderRadius ? item.borderRadius + 'px' : '0';
        el.style.fontColor = item.textColor ? item.textColor : '#000';

        el.style.zIndex = item.zIndex;

        const sprite = item.getSprite();
        if (sprite) {
            let path = sprite.image();
            if (path) {

                el.style.backgroundSize = item.width + 'px ' + item.height + 'px';
                el.style.backgroundPosition = 'center';
                el.style.backgroundImage = 'url( ' + path + ')';

                if (sprite.getOffsetY() || sprite.getOffsetX()) {
                    el.style.left = sprite.getOffsetX() + 'px';
                    el.style.top = sprite.getOffsetY() + 'px';
                }

            }
        }

        this.handleItemAttributes(el, item)

        if (item.isVisible()) {
            el.style.opacity = item.opacity ?? '1';
            el.style.display = 'inline-block';
        } else {
            el.style.display = 'inline-block';
            el.style.opacity = '0.2'
        }

        el.innerHTML = item.text;


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
        el.style.height = effect.height + 'px';
        el.style.width = effect.width + 'px';

        el.style.background = effect.background;
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
                html += '<div class="cell-wrapper">';
                html += this.addGameItem(new EmptyItem({baseClass: 'empty-tile', skipGameId: true}), true).outerHTML
                if (item) {
                    html += this.addGameItem(item, false).outerHTML
                }

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
