class BaseController {


    /**
     * @type  {BaseScreen} type
     */
    gameScreen

    eventListenerFunction = (e) => {
        this.handleInput(e.key, this.avatar);
    }

    setGameScreen(screen) {
        this.gameScreen = screen;
    }

    setAvatar(avatar) {
        this.avatar = avatar
    }

    handleInput(key, avatar) {
        return this.gameScreen?.handleUserInput(key, avatar);
    }

    /**
     * When gameScreen is switch we stop listening to controller
     */
    destroy() {
        // stipe listening on what ever u listen
    }

}
