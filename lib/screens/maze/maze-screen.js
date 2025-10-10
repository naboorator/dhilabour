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
     * @type {MazeHandler}
     */
    mazeHandler = null;

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
     * @type {{score: number, moves: number, completed: number, maze: string, life: number}}
     */
    tplVars = {
        life: 0,
        completed: 0,
        moves: 0,
        score: 0,
        maze: ''
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
        margin-top: 100px;
        width: auto;
        margin: 100px auto;
    }
    .cell-wrapper {
        margin-right:1px;
        margin-top:1px;
    }
</style>
    <div class="maze-screen">
        <div class="hud">
            Life: <span id="playerHp">{{life}}</span>
            Completed: <span id="completed">{{completed}}</span> Level: <span id="level">{{level}}</span> Moves: <span
            id="moves">{{moves}}</span>
            Score: <span id="score">{{score}}</span>
        </div>
        <div class="maze-bg">{{maze}}</div>
    </div>
    
    `

    destroy() {
        this.stopListenToController();
    }

    // listenToController() {
    //     this.game.controller.listen(this.mazeHandler.player)
    // }
    listenToController(player) {
        this.game.controller.listen(player)
    }

    stopListenToController() {
        this.game.controller.stopListening()
    }

    getController() {
        if (!this.controller) {
            this.controller = new KeyboardController(this);
        }
        return this.controller
    }

    render() {
        let tpl = this.htmlLoading;
        if (!this.mazeLoaded) {
            this.stopListenToController();
            this.parseLevel(this.game.level);

        } else {
            this.processLevel();
            this.mazeOutput = '';
            this.processLevel(this.game.level);
            this.tplVars.maze = this.mazeOutput;
            this.tplVars.score = this.game.totalScore;
            this.tplVars.moves = this.gameBoardGrid.playerMoves;
            this.tplVars.life = this.game.renderer.getHpHtml(this.game.playerLife);

            tpl = this.html;
            Object.keys(this.tplVars).forEach((key) => {
                tpl = tpl.replace('{{' + key + '}}', this.tplVars[key]);
            })

        }

        return tpl
    }

    processLevel() {
        // this.checkBoxPlaces();
        // this.mazeHandler.enemies.forEach((item) => {
        //     if (item instanceof EnemyItem) {
        //         item.update();
        //     }
        // })

        // this.mazeHandler.mapGrid.forEach((row, y) => {
        //     row.forEach((cell, x) => {
        //         const item = this.mazeHandler.getItemOnPosition(y, x);
        //         this.mazeOutput += '<div class="cell-wrapper">';
        //
        //
        //         this.mazeOutput += this.game.renderer.addGameItem(item).outerHTML;
        //         const effectList = this.mazeHandler.effects.findEffect(item.position.y, item.position.x);
        //         if (effectList) {
        //             effectList.forEach((effect) => {
        //                 effect.update();
        //                 this.mazeOutput += this.game.renderer.addEffect(effect).outerHTML;
        //             })
        //
        //
        //         }
        //         this.mazeOutput += '</div>';
        //     })
        //     this.mazeOutput += this.game.renderer.addRow().outerHTML;
        // })

        this.gameBoardGrid.backgroundGrid.forEach((row, y) => {
            row.forEach((bgItem, x) => {
                bgItem.update();

                // const item = this.gameBoardGrid.getBackgroundGridItem(y, x);
                this.mazeOutput += '<div class="cell-wrapper">';
                this.mazeOutput += this.game.renderer.addGameItem(bgItem).outerHTML;

                this.gameBoardGrid.movableItems[bgItem.position.y][bgItem.position.x].forEach(item => {

                    item.update();
                    // out put all possible items in the cell y,x usually only one is there but could be many
                    this.mazeOutput += this.game.renderer.addGameItem(item).outerHTML;
                    this.gameBoardGrid.applyGravity(item);
                })

                const effectList = this.gameBoardGrid.effects.findEffect(bgItem.position.y, bgItem.position.x);
                if (effectList) {
                    effectList.forEach((effect) => {
                        effect.update();
                        this.mazeOutput += this.game.renderer.addEffect(effect).outerHTML;
                    })
                }
                this.mazeOutput += '</div>';
            })
            this.mazeOutput += this.game.renderer.addRow().outerHTML;
        })

    }

    parseLevel(level) {

        try {
            this.levelReset();
            this.gameBoardGrid = new GameBoardGrid(this.game);
            this.gameBoardGrid.onReadyCallBack(() => {
                console.log('TERST')
                if (this.gameBoardGrid.player) {
                    this.listenToController(this.gameBoardGrid.player);
                }

                this.mazeLoaded = true;
            })
            this.gameBoardGrid.parseMap(this.game.levelList.get(level));
            // console.log(this.gameBoardGrid)
            // this.mazeHandler = new MazeHandler(this.game)
            // this.mazeHandler.onReady((mazeInstance) => {
            //     this.listenToController();
            //     this.mazeLoaded = true;
            // });
            //
            // this.mazeHandler.parseMap(this.game.levelList.get(level));
        } catch (error) {
            throw error;
        }
    }

    checkBoxPlaces() {

        this.mazeHandler.boxPlaces.forEach((boxPlace) => {
            let item = this.mazeHandler.getItemOnPosition(boxPlace.position.y, boxPlace.position.x);
            if (item instanceof EmptyItem) {
                this.mazeHandler.mapGrid[boxPlace.position.y][boxPlace.position.x] = new BoxPlaceItem();
            }
            boxPlace.complited = item instanceof BoxItem;
        })

        this.mazeHandler.portalPlaces.forEach((portalPlace) => {
            let item = this.mazeHandler.getItemOnPosition(portalPlace.position.y, portalPlace.position.x);
            if (item instanceof EmptyItem) {
                this.mazeHandler.mapGrid[portalPlace.position.y][portalPlace.position.x] = portalPlace;
            }
        })

        let totalCompleted = this.mazeHandler.boxPlaces.filter(item => item.complited).length;

        this.tplVars.complited = totalCompleted;


        if (totalCompleted === this.mazeHandler.boxPlaces.length) {
            this.game.pause = true;
            this.game.totalScore = this.game.totalScore + (this.mazeHandler.boxPlaces.length * 10);
            this.tplVars.score = this.game.totalScore;
            setTimeout(() => {
                this.game.setGameScreen(new MazeCompletedScreen(this.game,
                    {
                        moves: this.mazeHandler.levelMoves,
                        level: this.game.level,
                        score: this.game.totalScore,
                        levelScore: this.mazeHandler.levelScore,
                    }
                ))
                this.game.pause = false;
            }, 2000)
        }

    }


    levelReset() {

        this.game.levelMaxX = 0;
        this.game.levelMaxY = 0;

        this.tplVars.completed = 0;
        this.tplVars.level = this.game.level
    }

    handleKeyPress(key, avatar) {
        return mazeHandleKeyPress(key, this.controller, avatar, this.gameBoardGrid)
    }

    applyGravity(item) {
        this.gameBoardGrid.applyGravity(item);
    }

}
