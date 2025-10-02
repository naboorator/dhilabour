class MenuScreen {
    name = 'intro-screen';

    updateScreen = true;

    html = `
           <style>
                   .container {
                    padding:20px;
                   }
                   .btn {
                     margin-bottom: 10px;
                     font-size: 24px;
                   }
            </style>
          <div class="container">
            <h1 style="margin-top:0">THE GAME</h1>
            <div class="btn"  onclick="startGame()">Start Game</div>
            <div class="btn" onclick="openSettings()">Settings</div>
            <div class="btn" onclick="showCredits()">Credits</div>
          </div>
`

    game = null;

    controller = null;

    constructor(game) {
        this.game = game
    }

    listenToController() {
        console.log('to do  implement listenToController')
    }

    stopListenToController() {
        console.log('to do  implement stopListenToController')
    }

    init() {

    }

    destroy() {

    }

    render() {
        if (this.updateScreen) {
            this.updateScreen = false;
            return this.html
        }
    }

    getController() {
        console.log('to do  implement getController')
    }


}

function startGame() {
    game.setGameScreen(new MazeScreen(game))
}
