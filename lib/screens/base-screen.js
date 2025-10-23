class BaseScreen {
    name = 'some-screen-name';

    updateScreen = true;

    /**
     *
     * @type {Game}
     */
    game = null;

    html = `
           <style>
              
            </style>
          <div class="container" >
            <h1 style="margin-top:0">Base screen </h1>
            <p>This is base screen please overrride html</p>
          </div>
`

    constructor(game) {
        this.game = game
    }

    init() {

    }

    destroy() {

    }

    listenToController() {
        console.log('to do  implement listenToController')
    }

    stopListenToController() {
        console.log('to do  implement stopListenToController')
    }

    getController() {
        console.log('to do  implement getController')
    }

    render() {
        if (this.updateScreen) {
            this.updateScreen = false;
            return this.html
        }
    }
}
