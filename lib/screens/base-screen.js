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

    /**
     *
     * @type {{[key:string]: any}}
     */
    tplVars = {}

    constructor(game) {
        this.game = game
    }

    init() {

    }

    destroy() {

    }

    listenToController() {
        //  console.log('to do  implement listenToController')
    }

    stopListenToController() {
        //  console.log('to do  implement stopListenToController')
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

    onSwitchToOtherScreen() {
        this.game.pause = true;
    }

    onFocus() {
        this.game.pause = false;
    }

    /**
     * Screen can react
     *
     * @param key
     * @param avatar
     */
    handleUserInput(key, avatar) {
    }

    parseVariables(tpl, tplVars) {
        // At the end replace what needs
        Object.keys(tplVars).forEach((key) => {
            tpl = tpl.replace('{{' + key + '}}', tplVars[key]);
        })

        return tpl;
    }
}

