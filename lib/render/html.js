class RenderHtml {
    referenceEl = null;

    /**
     * @var game Game
     */
    game

    constructor(game) {
        this.game = game;
       this.referenceEl =  document.getElementById(game.refId);
       if(!this.referenceEl) {
           console.error("RenderHtml render failed");
       }
    }


    render() {
        this.referenceEl.innerHTML = ''
        this.game.levelGrid.forEach((row, rowIndex) => {
            row.forEach(( cell, cellIndex ) => {
                const item = this.game.getItemOnPosition(rowIndex,cellIndex);
                this.addGameItem(item);
            })
            this.addRow();
        })
        this.updateMoves(this.game.levelMoves);
    }

    addGameItem(item) {
        const el  = document.createElement('div');
        el.style.display = 'inline-block';
        el.style.backgroundColor = item.background;
        el.style.border = item.border ?? '';
        el.style.width = item.width  + 'px';
        el.style.height = item.height + 'px';

        el.style.margin = '=0.2px'
        el.style.marginBottom = '0'
        el.className = item.class ?? '';

        this.referenceEl.append(el)
    }

    addRow() {
        const el  = document.createElement('div');
        el.style.display = 'block';
        el.style.backgroundColor = 'red';
        el.style.width = '0px';
        el.style.height = '0px';
        this.referenceEl.append(el)
    }

    updateCompleted(num) {
        document.getElementById('completed').innerHTML = num;
    }

    showCompleted(text) {
        document.getElementById('success').innerHTML = text;
    }

    updateLevel(text) {
        document.getElementById('level').innerHTML = text;
    }

    updateScore(text) {
        document.getElementById('score').innerHTML = text;
    }

    updateMoves(text) {
        document.getElementById('moves').innerHTML = text;
    }
}
