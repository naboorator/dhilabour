class EndScreen extends BaseScreen {
    name = 'intro-screen';

    html = `
           <style>
                  
                   .btn {
                     margin-bottom: 10px;
                     font-size: 24px;
                   }
            </style>
          <div class="container" >
            <h1 style="margin-top:0">Game over</h1>
            <p>Thank you for playing</p>
            <button onclick="restartGame()">Restart</button>
          </div>
`

    render() {
        if (this.updateScreen) {
            this.updateScreen = false;
            return this.html
        }
    }


}

function restartGame() {
    game.setGameScreen(new MenuScreen(game))
}
