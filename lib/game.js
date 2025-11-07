var GAME_INSTANCE = null;

class Game {
    itemIds = 0;

    /**
     *
     * @type  RenderHtml
     */
    renderer;

    gameOver = false;

    startingHp = 3

    level = 1;

    levelLoaded = false

    levelMaxX = 0;

    levelMaxY = 0;

    playerLife = this.startingHp;

    frame = 0

    pause = false;
    stop = false;

    totalScore = 0;

    /**
     *
     * @type {BaseController}
     */
    controller = null;

    /**
     *
     * @type {BaseScreen}
     *
     */
    currentScreen = null;

    /**
     *
     * @type {BaseScreen[]}
     */
    previousScreens = [];

    /**
     * Simple settings
     * @type {{sound: boolean}}
     */
    settings = {
        sound: true,

        /**
         * @param { 'keyboard' | 'touch' } type
         */
        controller: 'keyboard'
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

    constructor(elementId) {
        GAME_INSTANCE = this;

        this.renderer = new RenderHtml(elementId);

        // Available areas
        this.preloadArea('area1', area1, area1Config);
        this.area = this.areas.get('area1');

        this.setGameScreen(new LoadScreen(this));
        this.mainLoop();

    }

    a

    initController(gameScreen) {
        if (this.settings.controller === 'keyboard') {
            this.controller = new KeyboardController();
            this.controller.setGameScreen(gameScreen)
        } else if (this.settings.controller === 'touch') {

        }

    }

    mainLoop(timestamp) {
        const game = GAME_INSTANCE;

        // --- CONFIGURABLE FPS ---
        const FORCE_FPS = 30// ← set desired FPS here
        const FRAME_DURATION = 1000 / FORCE_FPS;

        // --- Initialize timing ---
        if (!game.lastFrameTime) game.lastFrameTime = timestamp;

        const delta = timestamp - game.lastFrameTime;

        if (delta >= FRAME_DURATION && !game.stop) {
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
            this.controller.destroy();
        }

        this.initController(gameScreen);
        this.currentScreen = gameScreen;

    }

    setGameScreenAndPreserveCurrent(gameScreen) {
        if (this.currentScreen) {
            this.controller.destroy();
            this.currentScreen.onSwitchToOtherScreen();
        }

        this.previousScreens.push(this.currentScreen);

        this.setGameScreen(gameScreen);

    }

    closeCurrentScreen() {
        if (this.currentScreen) {
            this.currentScreen.destroy();
            this.controller.destroy();
        }

        let currentScreen = this.previousScreens.pop();

        if (currentScreen) {
            this.setGameScreen(currentScreen);
            currentScreen.onFocus();
            return this;
        }

    }


    reset() {
        this.playerLife = this.startingHp;
        this.gameOver = false;
    }


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
