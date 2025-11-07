class CreditsScreen extends BaseScreen {
    name = 'instructions-screen';

    html = `
           <style>                   
                   .instructions-screen{
                        position: relative;
                        display: inline-block;
                        width:100%;
                        height:100%;
                        min-heightL 100% !important; 
                        margin:auto auto;
                        
                        background: #0e1b2e url('../../assets/images/bg-intro.png') no-repeat center center;
                   
                   }
                    .instructions-screen .menu {
                        position: absolute;
                        left:0;
                        right:0;
                        top:200px;
                        width: 500px;
                        height:50%;
                        margin: auto auto;
                        color: var(--header-text-color) 
                   }
                   
                    .selected {
                    color: var(--secndary-color )
                   }
                   .btn {
                       position: absolute;
                       right: 20px;
                       bottom: 50px;
                         margin-top: 100px;
                         margin-bottom: 10px;
                         font-size: 24px;
                   }
            </style>
          <div class="instructions-screen">
                 
                <div class="menu">
                  <h1>About this game</h1>
                  <p>The whole goal of the game was to create a simple  game engine in javascript, without using any external library. Its made with javascript, HTML, Css technologies. Images were 
                  generated with chatGpt. To be honest I didn't pay much attention on a design more on a code architecture design. Not sure if 
                   it  will be ever finished. But still was fun learning and working on it.</p>
        
                    <p>
                       Developed by Zoran Bajraktareviċ. All right reserved 2025.
                   
                    
                       <button  class="btn" onclick="openMenuScreen()">Back</button>
                 </p>
                
                </div>
          </div>
`


    constructor(game) {
        super(game);
        this.game.controller.setGameScreen(this);
    }

    render() {
        if (this.updateScreen) {
            this.updateScreen = false;
            return this.html;
        }
    }


    handleUserInput(key, avatar) {
        CreditsScreenInputHandler(key)
    }
}

function openMenuScreen() {
    new Sound('assets/sounds/menu_click.flac').play()
    game.setGameScreen(new MenuScreen(game))
}


function CreditsScreenInputHandler(key, menuItems) {

    switch (key) {
        case 'Enter':
        case'Return':
            openMenuScreen();
            break;
        default:
    }

    return menuItems;
}



