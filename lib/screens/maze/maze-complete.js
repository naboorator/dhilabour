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
            <p>score {{score}} completed</p>
            <p>Level {{level}} completed</p>
            <p>Moves spent {{moves}}</p>
        
        </div>
    </div>
    `

    data = {
        score: 0,
        level: 0,
        moves: 0
    }

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
        if (this.updateScreen) {
            let tpl = this.html;

            Object.keys(this.data).forEach((key) => {
                tpl = tpl.replace('{{' + key + '}}', this.data[key]);
            })

            return tpl;
        }
    }

}
