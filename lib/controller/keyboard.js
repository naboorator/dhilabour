class KeyboardController extends BaseController {
    static isListening = false;

    eventListenerFunction = (e) => {
        this.handleKeyPress(e.key, this.avatar);
    }

    constructor() {
        super();
        if (!KeyboardController.isListening) {
            console.log('Adding listener')
            document.addEventListener('keydown', this.eventListenerFunction);
            KeyboardController.isListening = true;
        } else {
            console.log('Could not add listener')
            this.destroy();
        }
    }

    setAvatar(avatar) {
        this.avatar = avatar;
    }

    destroy() {
        super.destroy();
        KeyboardController.isListening = false;
        console.log('removing listener')
        document.removeEventListener('keydown', this.eventListenerFunction);

    }

    handleKeyPress(key, avatar) {
        return this.gameScreen?.handleUserInput(key, avatar);
    }

}
