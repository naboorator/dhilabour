class MenuScreen extends BaseScreen {
    name = 'intro-screen';

    html = `
           <style>                   
                   .menu-screen {
                        width:100%;
                        height:100%;
                        margin:auto auto;
                        background: #0e1b2e url('./assets/images/bg-intro.png') no-repeat;
                        background-position: center center;
                     
                   }
                   .menu {
                        padding-top:300px;                      
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
