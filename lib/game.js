var GAME_INSTANCE = null;

class Game {
    refId = '';
    itemIds = 0;

    renderer = null;

    gameOver = false;
    startingHp = 2

    levelList = new Map();
    level = 1;
    levelLoaded = false
    levelGrid = [];
    levelMaxX = 0;
    levelMaxY = 0;
    levelMoves = 0;
    levelEnemies = [];

    boxPlaces = [];
    portalPlaces = [];


    playerItem;
    playerLife = this.startingHp;

    frame = 0

    pause = false;

    totalScore = 0;

    controller = null;

    currentScreen = null;

    constructor(renderId) {
        GAME_INSTANCE = this;
        this.refId = renderId;
        this.renderer = new RenderHtml(this);

        this.levelList.set(1, level1)
        this.levelList.set(2, level2)
        this.levelList.set(3, level3)
        this.levelList.set(4, level4)
        this.levelList.set(5, level5)
        this.levelList.set(6, level6)
        this.levelList.set(7, level7)
        this.levelList.set(8, level8)
        this.levelList.set(9, level9)
        this.levelList.set(10, level10)
        this.levelList.set(11, level11)
        this.levelList.set(12, level12)
        this.levelList.set(13, level13)
        this.levelList.set(14, level14)
        this.levelList.set(15, level15)
        this.levelList.set(16, level16)
        this.levelList.set(17, level17)
        this.levelList.set(18, level18)
        this.levelList.set(19, level19)
        this.levelList.set(20, level20)

        if (!this.renderer) {
            alert('No Screen element found!')
        } else {
            this.setGameScreen(new LoadScreen(this));
            this.mainLoop()
        }

    }

    mainLoop() {
        var game = GAME_INSTANCE;

        if (!game.pause) {
            game.renderer.render(game.currentScreen);
        }

        ++game.frame
        requestAnimationFrame(game.mainLoop)
    }

    setGameScreen(gameScreen) {
        if (this.currentScreen) {
            this.currentScreen.destroy();
        }
        this.currentScreen = gameScreen;
        this.controller = gameScreen.getController()
        this.currentScreen.init();
    }


}

