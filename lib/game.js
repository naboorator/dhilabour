var GAME_INSTANCE = null;

class Game {
    refId = '';
    itemIds = 0;

    /**
     *
     * @type  RenderHtml
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

    /**
     * @type GameStore
     */
    gameStore = GameStore;

    constructor(renderId) {
        GAME_INSTANCE = this;

        this.refId = renderId;
        this.renderer = new RenderHtml(this);

        this.preloadArea('area1', area1, area1Config);

        // starting Area
        this.area = this.areas.get('area1');

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
