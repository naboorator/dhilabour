class MazeCompletedScreen {
    name = 'maze-completed';

    /*
     *
     * @var Game
     */
    game = null;

    mazeHandler = null;

    controller = null;

    updateScreen = true;

    html = `
<style>
.score-screen {
    margin-top: 100px;
    width: 500px;
    margin: 100px auto;
}
</style>
<div class="score-screen">
        <div class="hud">
            <h1> Level {{level}} completed </h1>
   
            <p>Total game score: {{score}}</p>
            <p>Moves spent {{moves}}</p>
        
        </div>
    </div>
    `

    data = {
        score: 0,
        level: 0,
        levelScore: 0,
        moves: 0,
        time: 0
    }


    displayTime = 500;
    time = 0;

    constructor(game, data) {
        this.game = game;
        this.data = data;
    }


    init() {

    }

    destroy() {

    }


    getController() {

    }

    render() {
        ++this.time
        if (this.updateScreen) {
            if (this.time > this.displayTime) {
                ++this.game.level
                this.game.levelLoaded = false;
                this.game.setGameScreen(new MazeScreen(this.game));
            }
            let tpl = this.html;

            const tkeys = {...this.data, time: this.time};
            Object.keys(tkeys).forEach((key) => {
                tpl = tpl.replace('{{' + key + '}}', tkeys[key]);
            })

            return tpl;
        }
    }

}
