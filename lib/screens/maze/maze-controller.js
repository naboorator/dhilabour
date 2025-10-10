function mazeHandleKeyPress(key, controller, avatar, mazeHandler) {
    let hasMoved = false

    switch (key) {
        case 'w':
        case 'ArrowUp':
            if (!mazeHandler.game.pause) {
                if (avatar.orientation !== Orientation.Up) {
                    avatar.onMoveUp();
                    hasMoved = false
                } else {
                    hasMoved = mazeHandler.moveItemUp(avatar)
                }
            }

            break;

        case 's':
        case 'ArrowDown':
            if (!mazeHandler.game.pause) {
                if (avatar.orientation !== Orientation.Down) {
                    avatar.onMoveDown();
                    hasMoved = false
                } else {
                    hasMoved = mazeHandler.moveItemDown(avatar)
                }
            }
            break;

        case 'a':
        case 'ArrowLeft':
            if (!mazeHandler.game.pause) {
                if (avatar.orientation !== Orientation.Left) {
                    avatar.onMoveLeft();
                    hasMoved = false
                } else {
                    hasMoved = mazeHandler.moveItemLeft(avatar)
                }
            }

            break;

        case 'd':
        case 'ArrowRight':
            if (!mazeHandler.game.pause) {
                if (avatar.orientation !== Orientation.Right) {
                    avatar.onMoveRight();
                    hasMoved = false
                } else {
                    hasMoved = mazeHandler.moveItemRight(avatar)
                }
            }
            break;

        case ' ':
            if (!mazeHandler.game.pause) {
                hasMoved = mazeHandler.hitItem(avatar)
            }
            break;

        case 'p':
            mazeHandler.game.pause = !mazeHandler.game.pause;
            break;

    }
    return hasMoved;
}
