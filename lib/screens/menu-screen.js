class MenuScreen extends BaseScreen {
    name = 'intro-screen';

    html = `
           <style>                   
                   .menu-screen {
                        position: relative;
                        display: inline-block;
                        width:100%;
                        height:100%;
                        min-heightL 100% !important; 
                        margin:auto auto;
                        background: #0e1b2e url('../../assets/images/bg-intro.png') no-repeat center center;
                        border:1px solid red;
                       
                   }
                   .menu {
                        margin-top: 300px;
                        height:100%;
                        color: var(--header-text-color) 
                   }
                   .btn {
                     margin-bottom: 10px;
                     font-size: 24px;
                   }
            </style>
          <div class="menu-screen">
                <div class="menu">
                    <div class="btn"  onclick="startGame()">Start Game</div>
                    <div class="btn" onclick="openSettings()">Instructions</div>
                    <div class="btn" onclick="showCredits()">Credits</div>
                </div>
          </div>
`


    constructor(props) {
        super(props);

    }

    render() {
        if (this.updateScreen) {
            this.updateScreen = false;
            return this.html
        }
    }


}

function startGame() {
    game.setGameScreen(new MazeScreen(game))
}

function openSettings() {
    game.setGameScreen(new SettingsScreen(game))
}

function showCredits() {
    game.setGameScreen(new CreditsScreen(game))
}
