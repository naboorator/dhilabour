class KeyboardController {
    listening = false;

    gameScreen = null;

    avatar = null;

    eventListenerFunction = (e) => {
        this.handleKeyPress(e.key, this.avatar);
    }

    constructor(gameScreen) {
        this.gameScreen = gameScreen;
    }

    listen(avatar) {
        if (this.listening) {
            return
        }
        document.addEventListener('keydown', this.eventListenerFunction)
        this.avatar = avatar;
        this.listening = true;
    }

    stopListening() {
        document.removeEventListener('keydown', this.eventListenerFunction)
        this.listening = false;
    }

    handleKeyPress(key, avatar) {
        this.gameScreen.handleKeyPress(key, avatar);
    }

}
