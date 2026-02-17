class AiController extends BaseController {
    static isListening = false;

    eventListenerFunction = (e) => {
        this.handleKeyPress(e.key, this.avatar);
    }

    constructor() {
        super();
    }

    setAvatar(avatar) {
        this.avatar = avatar;
    }

    handleKeyPress(key, avatar) {
        return this.gameScreen?.handleUserInput(key, avatar);
    }

}
