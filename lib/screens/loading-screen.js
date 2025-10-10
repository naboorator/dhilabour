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
                 
            </style>
          <div class="end-screen">
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
