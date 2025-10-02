class EnemyItem extends BaseItem {
    BASE_CLASS = 'golem'
    class = this.BASE_CLASS

    controller = null;

    moveType = 'attackPlayer'
    speed = 5;
    movedTime = 0
    gameScreen = null;

    isRecalculating = false;

    lastMove = null;


    notify(data) {
        this.lastMove = data;
        if (!this.isRecalculating && !this.currentPath) {
            this.recalculateClosestPathToTarget();
        }
    }

    currentPath = [];

    recalculateClosestPathToTarget() {

        if (this.moveType === 'shortestPath') {
            this.isRecalculating = true;
            const target = this.game.currentScreen.mazeHandler.player;
            this.currentPath = shortestPath(this.game.currentScreen.mazeHandler.mapGrid, this.controller, this, target);
        }

    }

    constructor(game) {
        super();
        this.game = game;
        this.controller = new KeyboardController(this.game.currentScreen);
    }

    doRandomMove() {
        randomMovement(this.controller, this);
    }

    shortestRouteToTarget() {
        if (this.currentPath) {
            const next = this.currentPath.shift();
            if (next) {
                if (next[0] < this.position.y) {
                    this.controller.handleKeyPress('w', this);
                } else if (next[0] > this.position.y) {
                    this.controller.handleKeyPress('s', this);
                } else if (next[1] > this.position.x) {
                    this.controller.handleKeyPress('d', this);
                } else if (next[1] < this.position.x) {
                    this.controller.handleKeyPress('a', this);
                }
            } else {
                this.currentPath = null;
                this.recalculateClosestPathToTarget();
            }
        }
    }

    onMoveUp() {
        this.class = this.BASE_CLASS + ' moveUp'
    }

    onMoveDown() {
        this.class = this.BASE_CLASS + ' moveDown'
    }

    onMoveLeft() {
        this.class = this.BASE_CLASS + ' moveLeft'
    }

    onMoveRight() {
        this.class = this.BASE_CLASS + ' moveRight'
    }

    onMoveIdle() {
        this.class = this.BASE_CLASS
    }

    update() {

        if (this.movedTime > this.speed) {
            switch (this.moveType) {
                case 'random':
                    this.doRandomMove();
                    break;
                case 'attackPlayer':
                    this.attackPlayerMove();
                    break;
                case 'shortestPath':
                    this.shortestRouteToTarget();
                    this.isRecalculating = false;
                    break;
            }
            this.movedTime = 0
        } else {
            ++this.movedTime;
        }

    }
}





