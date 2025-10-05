class LoadScreen extends BaseScreen {
    name = 'intro-screen';
    
    assetsLoader = new AssetsLoader();

    html = `
           <style>
                   .container {
                        position: absolute;
                        background: white;
                        width:100%;
                        height: 100%;
                        padding-top: 120px;
                        color: #ffa523;
                   }
                   
                   .container.bg {
                        background: url('./assets/images/bg-intro.png');
                   }
                   
                   .loading-wrapper {
                        margin: 50px;
                   }
                   .loader {
                      
                       padding-top:5px;
                       padding-bottom:5px;
                       
                       text-align: left;
                       background: green;
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
          <div class="container bg">
                <div class="loading-wrapper">
                loading ...
                <div class="loader" style="width:{{percent}}%"/>
                {{percent}}%
                </div>
                
          </div>
`

    render() {
        if (!this.assetsLoader.prepared) {
            this.gatherAssets();
            this.assetsLoader.onLoadAll = () => {
                setTimeout(() => {
                    this.updateScreen = false;
                    this.game.setGameScreen(new MenuScreen(this.game));
                }, 1000)
            }

            this.assetsLoader.loadAll();
        }
        if (this.updateScreen) {
            const percentage = Math.floor((this.assetsLoader.numOfLoaded / this.assetsLoader.totalItems) * 100)
            return this.html.replaceAll('{{percent}}', percentage)
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
        this.assetsLoader.prepared = true;

    }
}
