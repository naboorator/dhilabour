class MenuScreen extends BaseScreen {
    name = 'intro-screen';
    
    html = `
           <style>
                   .container {
                    background: url('../../assets/images/bg-intro.png');
                    background-position-y: -20px;
                    position: absolute;
                    width:500px;
                        height: 100%;
                     padding-top: 70px;
               
                   }
                   .menu {
                        margin-top: 120px;   
                        color: var(--header-text-color) 
                   }
                   .btn {
                     margin-bottom: 10px;
                     font-size: 24px;
                   }
            </style>
          <div class="container">
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
