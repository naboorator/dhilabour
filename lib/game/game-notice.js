class GameNotice {

    avatar = '';

    title = "title of notice"

    content = "content of notice"

    /**
     *
     * @type { Object<string:callback> }
     */
    actions = {}

    onResolve = (action) => {
        console.log('Game action  resolved')
    }

    constructor(title, content) {
        this.title = title;
        this.content = content
    }

    addAction(action, callback) {
        this.actions[action] = callback;
    }

    resolve(callback) {
        this.onResolve = callback
    }
}
