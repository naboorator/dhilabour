class EnemyItem extends BaseItem {
    BASE_CLASS = 'golem-tile';

    class = this.BASE_CLASS;

    controller = null;

    moveType = 'attackPlayer';

    speed = 5;

    movedTime = 0;

    isRecalculating = false;

    lastMove = null;

    currentPath = [];

    nextMove = null;

    constructor(game) {
        super();
        this.game = game;
        this.controller = new KeyboardController(this.game.currentScreen);
    }

    notify(data) {
        this.lastMove = data;
        if (!this.isRecalculating && !this.currentPath) {
            this.recalculateClosestPathToTarget();
        }
    }

    recalculateClosestPathToTarget() {
        if (this.moveType === MovementTypes.shortestPath) {
            this.isRecalculating = true;
            const target = this.game.currentScreen.mazeHandler.player;
            this.currentPath = shortestPath(this.game.currentScreen.mazeHandler.mapGrid, this.controller, this, target);

            if (!this.currentPath) {
                this.doRandomMove();
            }
        }

    }

    doRandomMove() {
        randomMovement(this.controller, this);
    }

    shortestRouteToTarget() {
        if (this.currentPath) {

            let next = this.currentPath.shift();
            let hasMoved = false;

            if (next) {
                if (next[0] < this.position.y) {
                    this.onMoveUp();
                    hasMoved = this.controller.handleKeyPress('w', this);
                } else if (next[0] > this.position.y) {

                    this.onMoveDown();
                    hasMoved = this.controller.handleKeyPress('s', this);
                } else if (next[1] > this.position.x) {
                    this.onMoveRight();
                    hasMoved = this.controller.handleKeyPress('d', this);
                } else if (next[1] < this.position.x) {
                    this.onMoveLeft();
                    hasMoved = this.controller.handleKeyPress('a', this);
                }
            } else {
                this.currentPath = null;
                this.recalculateClosestPathToTarget();
            }

        }
    }

    leftRight() {
        if (this.nextMove === null) {
            this.nextMove = 'a';
        }
        const hasMoved = this.controller.handleKeyPress(this.nextMove, this);
        if (!hasMoved && !this.isTurnDirection) {
            this.nextMove = (this.nextMove === 'd') ? 'a' : 'd'
        }
    }

    upDown() {
        if (this.nextMove === null) {
            this.nextMove = 'w';
        }
        const hasMoved = this.controller.handleKeyPress(this.nextMove, this);
        if (!hasMoved && !this.isTurnDirection) {
            this.nextMove = (this.nextMove === 'w') ? 's' : 'w'

        }
    }


    update() {

        if (this.movedTime > this.speed) {
            switch (this.moveType) {
                case MovementTypes.random:
                    this.doRandomMove();
                    break;

                case MovementTypes.shortestPath:
                    this.shortestRouteToTarget();
                    this.isRecalculating = false;
                    break;

                case MovementTypes.leftRight:
                    this.leftRight();
                    break;

                case MovementTypes.upDown:
                    this.upDown();
                    break;
            }
            this.movedTime = 0
        } else {
            ++this.movedTime;
        }

    }
}





