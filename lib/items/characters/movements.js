class AIMovementCharacter extends BaseItem {
    currentPath = [];

    speed = 5;

    movedTime = 0;

    isRecalculating = false;

    movementType = 'attackPlayer';

    movements = [];

    lastMove = null;

    controller = null;

    constructor({baseClass, speed, movementType, movements, abilities, controller}) {
        super({baseClass, speed, movementType, movements, abilities});
        this.game = game;
        this.BASE_CLASS = baseClass ?? this.BASE_CLASS;
        this.class = this.BASE_CLASS;
        this.speed = speed ?? this.speed;
        this.movementType = movementType ?? this.movementType;
        this.movements = movements ?? this.movements;
        this.abilities = abilities ?? this.abilities;
        this.controller = new KeyboardController();

        this.controller.setGameScreen(this.game.currentScreen)
    }

    recalculateClosestPathToTarget() {
        if (this.movementType === MovementTypes.shortestPath) {
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

    handleAiMovements() {
        if (this.movedTime > this.speed) {
            switch (this.movementType) {
                case MovementTypes.random:
                    randomMovement(this, this.controller);
                    break;

                case MovementTypes.shortestPath:
                    this.currentPath = moveToPlayer(this, this.controller);
                    this.shortestRouteToTarget();
                    break;

                case MovementTypes.leftRight:
                    movementLeftRight(this, this.controller)
                    break;

                case MovementTypes.upDown:
                    movementUpDown(this, this.controller)
                    break;

                case MovementTypes.randomList:
                    if (this.movements.length > 0) {
                        variousMovement(this, this.controller, this.movements, 5000)
                    }
                    break;
            }
            this.movedTime = 0
        } else {
            ++this.movedTime;
        }

    }
}
