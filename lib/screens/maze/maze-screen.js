class MazeScreen extends BaseScreen {
    /**
     *
     * @type {string}
     */
    name = 'maze-screen';

    /**
     *
     * @type {GameEffects}
     */
    effects = new GameEffects();


    /**
     *
     * @type {GameBoardGrid}
     */
    gameBoardGrid = null;

    /**
     *
     * @type {boolean}
     */
    mazeLoaded = false;

    /**
     *
     * @type {KeyboardController}
     */
    controller = null;


    /**
     *
     * @type {number}
     */
    levelMoves = 0;

    /**
     *
     * @type {string}
     */
    mazeOutput = '';

    /**
     *
     * @type {{life:string, water: string, score: number, moves: number, completed: number, maze: string, life: number}}
     */
    tplVars = {
        life: 0,
        water: 0,
        completed: 0,
        moves: 0,
        score: 0,
        maze: '',
        inventory: [],
        cameraWidth: 0,
        cameraHeight: 0,
    }

    /**
     *
     * @type {string}
     */
    htmlLoading = 'Loading level...'

    /**
     *
     * @type {string}
     */
    html = `
<style>  
    .maze-screen {
        width: auto;
        margin: 100px auto;
    }
    .cell-wrapper {
        margin-right:1px;
        margin-top:1px;
    }
    #inventory {
    position:relative;
    }
</style>
    <div class="maze-screen">
        <div style="display: flex; align-content: flex-end;  justify-content: center;">
            <div style="text-align:right; border:1px solid red;">
             {{life}}
            </div>  
            
            <div class="maze-bg" style="width:{{cameraWidth}}px; height: {{cameraHeight}}px; border:1px solid red; text-align: center">{{maze}}</div>
            
            <div style="border:1px solid red;">
             {{water}}   
             </div>
        </div>
       
    
       
        <div>Inventory</div>
        <span id="inventory" >{{inventory}}</span></div>
    </div>
    
    `

    constructor(game) {
        super(game);
    }

    destroy() {
        this.stopListenToController();
    }

    render() {
        let tpl = this.htmlLoading;
        if (!this.mazeLoaded) {
            this.stopListenToController();
            this.parseLevel(this.game.area);
        } else {
            this.checkMazeCompleted();
            this.processLevel(this.game.level);

            const state = GameStore.getState().player;

            this.tplVars.maze = this.mazeOutput;
            this.tplVars.score = this.game.totalScore;
            this.tplVars.moves = this.gameBoardGrid.playerMoves;
            this.tplVars.cameraWidth = this.gameBoardGrid.camera.getCameraWidth();
            this.tplVars.cameraHeight = this.gameBoardGrid.camera.getCameraHeight();
            this.tplVars.life = this.game.renderer.getEnergyBar(state.energy, PlayerStartingEnergy).outerHTML;
            this.tplVars.water = this.game.renderer.getWaterBar(state.water, PlayerStartingWater).outerHTML;
            this.tplVars.inventory = this.game.renderer.getInventoryHtml(this.gameBoardGrid.player.inventory);
            let tpl = this.html;
            Object.keys(this.tplVars).forEach((key) => {
                tpl = tpl.replace('{{' + key + '}}', this.tplVars[key]);
            })
            return tpl;
        }
    }

    checkMazeCompleted() {
        this.gameBoardGrid.boxPlaces.forEach((boxPlaceItem) => {
            boxPlaceItem.setCompleted(false);
        })

        this.gameBoardGrid.boxItems.forEach(boxItem => {
            boxItem.completed(false)
        })

        this.gameBoardGrid.boxPlaces.forEach((boxPlaceItem) => {
            this.gameBoardGrid.boxItems.forEach(boxItem => {
                if (this.gameBoardGrid.checkIfBothItemsOnSameTile(boxPlaceItem, boxItem)) {
                    boxPlaceItem.setCompleted(true);
                    boxItem.completed(true)
                }
            })
        })

        if (this.gameBoardGrid.boxPlaces.length === this.gameBoardGrid.boxItems.filter(item => item.isCompleted).length) {
            this.game.pause = true;
            this.gameBoardGrid.player.beHappy(true)
            setTimeout(() => {
                this.game.setGameScreen(new MazeCompletedScreen({
                    level: this.game.level,
                    score: this.score ?? 0,
                    moves: this.levelMoves
                }))
            }, 1500);
        }
    }

    processing = false;


    processLevel(level) {
        this.mazeOutput = '';
        this.processing = true
        this.gameBoardGrid.mazeTiles.forEach(tile => {
            tile.getAllItems().forEach((item) => {
                if (item instanceof ChatBubbleItem) {

                }
                item.update();
                item.setVisible(true)
            })

            // Render effect
            const effectList = this.gameBoardGrid.effects.findEffect(tile.y, tile.x);
            if (effectList) {
                effectList.forEach((effect) => {
                    effect.update();
                })
            }
        })

        this.gameBoardGrid.camera.getCameraTiles().forEach(cameraTile => {

            let style = 'font-size:8px;'
            cameraTile.visible = true

            this.mazeOutput += '<div class="cell-wrapper" style="' + style + '"  title="' + cameraTile.text + '">';
            const bgItem = cameraTile.getBackgroundItem();

            if (bgItem) {
                //bgItem.text = cameraTile.id
                bgItem.setVisible(true);
                this.mazeOutput += this.game.renderer.addGameItem(bgItem).outerHTML
            }

            cameraTile.getAllItems().forEach(item => {
                item.setVisible(true);
                this.mazeOutput += this.game.renderer.addGameItem(item).outerHTML;
                if (item.hasChildItems()) {
                    item.childItems.forEach(childItem => {
                        this.mazeOutput += this.game.renderer.addGameItem(childItem).outerHTML;
                    })
                }
            });

            // Render effect
            const effectList = this.gameBoardGrid.effects.findEffect(cameraTile.y, cameraTile.x);

            if (effectList) {
                effectList.forEach((effect) => {
                    effect.update();
                    if (bgItem && bgItem.isVisible()) {
                        this.mazeOutput += this.game.renderer.addEffect(effect).outerHTML;
                    }
                })
            }

            this.mazeOutput += '</div>';
        })

        return this.mazeOutput;
    }

    /**
     *
     * @param area {AreaData}
     */
    parseLevel(area) {
        try {
            this.levelReset();
            this.stopListenToController();
            this.gameBoardGrid = new GameBoardGrid(this.game);
            this.gameBoardGrid.onReady.subscribe((isReady) => {
                if (isReady) {
                    if (this.gameBoardGrid.player) {
                        //console.log(this.game.controller)
                        this.game.controller.setGameScreen(this)
                        this.game.controller.setAvatar(this.gameBoardGrid.player)
                    }
                }

                this.mazeLoaded = isReady
            })
            this.gameBoardGrid.parseMap(area.map);
        } catch (error) {
            throw error;
        }
    }


    levelReset() {
        this.game.levelMaxX = 0;
        this.game.levelMaxY = 0;

        this.tplVars.completed = 0;
        this.tplVars.level = this.game.level
    }

    handleUserInput(key, avatar) {
        return mazeHandleKeyPress(key, this.game.controller, avatar, this.gameBoardGrid)
    }

    applyGravity(item) {
        this.gameBoardGrid.applyGravity(item);
    }

    onFocus() {
        this.game.pause = false;
        this.game.controller.setAvatar(this.gameBoardGrid.player);
    }

}
