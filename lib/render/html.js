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

    addGameItem(item) {
        const el = document.createElement('div');
        el.style.display = 'inline-block';
        el.style.backgroundColor = item.background;
        el.style.border = item.border ?? '';
        el.style.width = item.width + 'px';
        el.style.height = item.height + 'px';
        el.style.top = 0;
        el.style.left = 0;

        el.style.marginBottom = '0'
        el.className = item.class ?? '';
        el.style.position = 'absolute';

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

        if (effect.attributes?.position) {
            el.style.top = effect.attributes.position.top + 'px'
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

        el.style.zIndex = 1000 + effect.zindex ?? 0
        el.innerHTML = '&nbsp;'
        return el;
    }

    addRow() {
        const el = document.createElement('div');
        el.style.display = 'block';
        el.style.backgroundColor = 'red';
        el.style.width = '0px';
        el.style.height = '0px';
        return el;
    }


    updateMoves(text) {
        let el = document.getElementById('moves');
        el.innerHTML = text;
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
}
