var GAME_INSTANCE = null;

class Game {
    refId = '';
    itemIds = 0;

    /**
     *
     * @prop renderer {{RenderHtml}}
     */
    renderer;

    gameOver = false;
    startingHp = 3

    levelList = new Map();
    level = 1;
    levelLoaded = false

    levelMaxX = 0;
    levelMaxY = 0;
    levelMoves = 0;


    boxPlaces = [];
    portalPlaces = [];


    playerItem;
    playerLife = this.startingHp;

    frame = 0

    pause = false;

    totalScore = 0;

    controller = null;

    /**
     *
     * @type MazeScreen
     *
     */
    currentScreen = null;

    lastFrameTime = 0;

    previousScreens = [];

    constructor(renderId) {
        GAME_INSTANCE = this;
        this.refId = renderId;
        this.renderer = new RenderHtml(this);

        this.preloadArea('area1', area1, area1Config);

        this.area = this.areas.get('area1');
        // this.levelList.set(1, level1)
        // this.levelList.set(2, level2)
        // this.levelList.set(3, level3)
        // this.levelList.set(4, level4)
        // this.levelList.set(5, level5)
        // this.levelList.set(6, level6)
        // this.levelList.set(7, level7)
        // this.levelList.set(8, level8)
        // this.levelList.set(9, level9)
        // this.levelList.set(10, level10)
        // this.levelList.set(11, level11)
        // this.levelList.set(12, level12)
        // this.levelList.set(13, level13)
        // this.levelList.set(14, level14)
        // this.levelList.set(15, level15)
        // this.levelList.set(16, level16)
        // this.levelList.set(17, level17)
        // this.levelList.set(18, level18)
        // this.levelList.set(19, level19)
        // this.levelList.set(20, level20)

        if (!this.renderer) {
            alert('No Screen element found!')
        } else {
            this.setGameScreen(new LoadScreen(this));
            this.mainLoop()
        }

    }

    mainLoop(timestamp) {
        const game = GAME_INSTANCE;

        // --- CONFIGURABLE FPS ---
        const FORCE_FPS = 30 // ← set desired FPS here
        const FRAME_DURATION = 1000 / FORCE_FPS;

        // --- Initialize timing ---
        if (!game.lastFrameTime) game.lastFrameTime = timestamp;

        const delta = timestamp - game.lastFrameTime;

        if (delta >= FRAME_DURATION) {
            // --- Update timestamp ---
            game.lastFrameTime = timestamp - (delta % FRAME_DURATION);

            // --- Render frame ---
            // if (!game.pause) {
            game.renderer.render(game.currentScreen);
            // }

            ++game.frame;
        }

        // --- Loop again ---
        requestAnimationFrame(game.mainLoop.bind(game));
    }

    setGameScreen(gameScreen) {
        if (this.currentScreen) {
            this.currentScreen.destroy();
        }
        this.currentScreen = gameScreen;
        this.controller = gameScreen.getController()
        this.currentScreen.init();
    }

    setGameScreenAndPreserveCurrent(gameScreen) {
        if (this.currentScreen) {
            this.currentScreen.onSwitchToOtherScreen();
        }
        this.previousScreens.push(this.currentScreen);

        this.currentScreen = gameScreen;
        this.controller = gameScreen.getController()
        this.currentScreen.init();
    }

    closeCurrentScreen() {
        if (this.currentScreen) {
            this.currentScreen.destroy();
        }

        this.currentScreen = this.previousScreens.pop();
        ;
        this.currentScreen.onFocus();
        return this;
    }


    reset() {
        this.playerLife = this.startingHp;
        this.gameOver = false;
    }

    /**
     *
     * @type {Map<string, AreaData>}
     */
    areas = new Map();

    /**
     * @type AreaData
     */
    area

    preloadArea(areaName, map, config) {
        this.areas.set(areaName, new AreaData(areaName, map, config))
    }

    /**
     *
     * @param item {BaseItem}
     * @returns {number}
     */
    getNewItemId(item) {
        return this.itemIds++;
    }
}

class AreaData {
    name = ''

    map = '';

    config = ''

    constructor(name, map, config) {
        this.name = name;
        this.map = map;
        this.config = config;
    }
}
