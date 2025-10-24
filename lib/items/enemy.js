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

    abilities = [ItemAbilities.LivesFootsteps]

    moveList = [];

    constructor(game) {
        super();
        this.game = game;
        this.controller = new KeyboardController(this.game.currentScreen);
    }

    notify(data) {
        this.lastMove = data;
    }

    recalculateClosestPathToTarget() {
        if (this.moveType === MovementTypes.shortestPath) {
            this.isRecalculating = true;
            const target = this.game.currentScreen.gameBoardGrid.player;
            this.currentPath = shortestPath(this, this.controller, target, this.game.currentScreen.gameBoardGrid);
        }

    }

    shortestRouteToTarget() {
        if (this.currentPath) {

            let next = this.currentPath.shift();
            let hasMoved = false;

            if (next) {
                console.log('Mooving', next)
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

        } else {
            this.recalculateClosestPathToTarget();
        }
    }


    update() {
        if (this.movedTime > this.speed) {
            switch (this.moveType) {
                case MovementTypes.random:
                    randomMovement(this, this.controller);
                    break;

                case MovementTypes.shortestPath:
                    this.currentPath = moveToPlayer(this, this.controller);
                    console.log(this.currentPath)
                    // this.currentPath = shortestPath(this, this.controller, this.game.currentScreen.gameBoardGrid.player, this.game.currentScreen.gameBoardGrid);
                    this.shortestRouteToTarget();
                    //shortestPath()
                    //this.isRecalculating = false;
                    break;

                case MovementTypes.leftRight:
                    movementLeftRight(this, this.controller)
                    break;

                case MovementTypes.upDown:
                    movementUpDown(this, this.controller)
                    break;

                case MovementTypes.randomList:
                    variousMovement(this, this.controller, this.moveList, 5000)
                    break;
            }
            this.movedTime = 0
        } else {
            ++this.movedTime;
        }

    }
}





