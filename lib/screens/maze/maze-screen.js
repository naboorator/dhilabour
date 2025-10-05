class MazeScreen extends BaseScreen {
    name = 'maze-screen';

    mazeHandler = null;

    controller = null;

    levelMoves = 0;

    mazeOutput = '';

    renderedOutput = '';

    tplVars = {
        life: 0,
        completed: 0,
        moves: 0,
        score: 0,
        maze: ''
    }
    html = `
    <div id="score-screen">
        <div class="hud">
            Life: <span id="playerHp">{{life}}</span>
            Completed: <span id="completed">{{completed}}</span> Level: <span id="level">{{level}}</span> Moves: <span
            id="moves">{{moves}}</span>
            Score: <span id="score">{{score}}</span>
        </div>
    </div>
    <div class="maze-bg">{{maze}}</div>
    `

    destroy() {
        this.stopListenToController();
    }

    listenToController() {
        this.game.controller.listen(this.mazeHandler.player)
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
        if (this.updateScreen) {
            this.mazeOutput = '';
            this.processLevel(this.game.level);
            this.tplVars.maze = this.mazeOutput;
            this.tplVars.score = this.game.totalScore;
            this.tplVars.moves = this.mazeHandler.levelMoves;
            this.tplVars.life = this.game.renderer.getHpHtml(this.game.playerLife);
            let tpl = this.html;
            Object.keys(this.tplVars).forEach((key) => {
                tpl = tpl.replace('{{' + key + '}}', this.tplVars[key]);
            })

            this.renderedOutput = tpl
        }
        return this.renderedOutput;
    }

    processLevel(level) {
        if (!this.game.levelLoaded) {
            this.stopListenToController();
            this.parseLevel(level);
        } else {

            this.checkBoxPlaces();

            this.mazeHandler.enemies.forEach((item) => {
                if (item instanceof EnemyItem) {
                    item.update();
                }
            })

            this.mazeHandler.mapGrid.forEach((row, rowIndex) => {
                row.forEach((cell, cellIndex) => {
                    const item = this.mazeHandler.getItemOnPosition(rowIndex, cellIndex);
                    this.mazeOutput += this.game.renderer.addGameItem(item).outerHTML;
                })
                this.mazeOutput += this.game.renderer.addRow().outerHTML;
            })
        }
    }

    parseLevel(level) {

        try {
            this.levelReset();
            this.mazeHandler = new MazeHandler(this.game)
            this.mazeHandler.onReady((mazeInstance) => {
                this.listenToController();
                this.game.levelLoaded = true;

                // When player loose a life
                mazeInstance.onLostLifeCallback = (avatar) => {
                    this.renderLostLife(avatar);
                };

                mazeInstance.onMazeComplete = (avatar) => {

                };
            });

            this.mazeHandler.parseMap(this.game.levelList.get(level));
        } catch (error) {
            throw error;
        }

        console.log(this.mazeHandler);
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

            //
            this.game.pause = true;
            this.game.totalScore = this.game.totalScore + (this.mazeHandler.boxPlaces.length * 10);
            this.tplVars.score = this.game.totalScore;
            setTimeout(() => {
                this.game.setGameScreen(new MazeCompletedScreen(this.game,
                    {
                        moves: this.mazeHandler.levelMoves,
                        level: this.game.level
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

    startNewGame() {
        this.game.level = 1;
        this.game.playerLife = this.game.startingHp;
        this.game.gameOver = false;

        // trigger reload level
        this.game.levelLoaded = false;
        this.mazeHandler.restart()

        //  this.levelReset();
    }


    renderLostLife(avatar) {
        avatar.renderCollision();
        this.game.playerLife = this.game.playerLife - 1;
        if (this.game.playerLife <= 0) {
            this.game.playerLife = 0;
            this.game.gameOver = true;
        }

        this.tplVars.life = this.game.renderer.getHpHtml(this.game.playerLife);

        if (this.game.gameOver) {
            this.game.setGameScreen(new EndScreen(this.game))
        }
        this.game.pause = true

        setTimeout(() => {
            this.game.pause = false
            if (!this.game.gameOver) {
                this.levelReset();
            } else {
                this.startNewGame();
            }
        }, 1500)
    }

    handleKeyPress(key, avatar) {
        return mazeHandleKeyPress(key, this.controller, avatar, this.mazeHandler)
    }

}
