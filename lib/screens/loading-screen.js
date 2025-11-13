class LoadScreen extends BaseScreen {
    name = 'intro-screen';

    assetsLoader = new AssetsLoader();

    html = `
           <style>
                
             
                   .end-screen {
                        color:white;
                        width:100%;
                        height:100%;
                        margin:auto auto;
                        background: #0e1b2e url('./assets/images/bg-intro.png') no-repeat;
                        background-position: center center;
                   }
                   
                   .loading-wrapper {
                        padding-top:280px;
                        margin: auto auto;
                        width: 300px;
                        //margin: 150px 50px 50px;
                   }
                   .loader {
                      
                       padding-top:5px;
                       padding-bottom:5px;
                       
                       text-align: left;
                       background: var(--primary-color);
                   }
                   
                   .warning {
                
                   color: yellow;
                   padding 5px;
                   font-size: 22px;
                   }
                 
                 .btn {
                   padding: 15px;
                   background-color: var(--primary-color);
                   border-color: var(--secndary-color);
                 }
            </style>
          <div class="end-screen">
                <div class="loading-wrapper">
                loading ...
                <div class="loader" style="width:{{percent}}%"/>
                {{percent}}%
                </div>
                {{error}}  
                
                {{button}}
          </div>
`
    complete = false;

    button = '' +
        '<p class="warning">Game is using sound, Turn down volume just in case.</p>' +
        '<button  class="btn" onclick="iAgree()">Okay!</button>';

    error = '';


    render() {
        if (!this.assetsLoader.prepared) {
            this.gatherAssets();
            this.assetsLoader.onLoadAll = () => {
                setTimeout(() => {
                    this.updateScreen = true;
                    this.complete = true;
                    // this.game.setGameScreen(new MenuScreen(this.game));
                }, 1000)
            }

            this.assetsLoader.onError = (error) => {
                this.error = error
                this.updateScreen = true;
            }

            this.assetsLoader.loadAll();
        }

        if (this.updateScreen) {
            const percentage = Math.floor((this.assetsLoader.numOfLoaded / this.assetsLoader.totalItems) * 100)
            let html = this.html.replaceAll('{{percent}}', percentage);
            html = html.replaceAll('{{error}}', this.error)
            if (this.complete) {
                html = html.replaceAll('{{button}}', this.button)
                this.updateScreen = false;
            } else {
                html = html.replaceAll('{{button}}', '')
            }

            return html;

        }
    }

    gatherAssets() {
        this.assetsLoader.addImage([
            './assets/images/bg-intro.png',
            './assets/images/sprites.png',
            './assets/images/box.png',
            './assets/images/steps.png',
            './assets/images/wall.png',
            './assets/images/walls-floors.png',
        ]);

        this.assetsLoader.addSound([
            './assets/sounds/stepdirt_1.wav',
            './assets/sounds/dynmite.wav',

            './assets/sounds/menu_select.wav',
            './assets/sounds/menu_click.flac',
            './assets/sounds/stone_door.ogg',
            './assets/sounds/door.wav',
            './assets/sounds/stairs.ogg',
            './assets/sounds/music/showdown.mp3',
            './assets/sounds/music/morning.mp3',
        ]);
        this.assetsLoader.prepared = true;

    }
}

function iAgree() {
    //music = new Sound('./assets/sounds/music/showdown.mp3');
    // music.volume(0.1).play();
    game.setGameScreen(new MenuScreen(game));
}
