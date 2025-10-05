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

    html = `<div id="score-screen">
        <div class="hud">
            <h1> BRAVO </h1>
            <p>{{time}}</p>
            <p>score {{score}} completed</p>
            <p>Level {{level}} completed</p>
            <p>Moves spent {{moves}}</p>
        
        </div>
    </div>
    `

    data = {
        score: 0,
        level: 0,
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
