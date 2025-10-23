function mazeHandleKeyPress(key, controller, avatar, mazeHandler) {
    let hasMoved = false
 
    switch (key) {
        case 'w':
        case 'ArrowUp':
            if (!mazeHandler.game.pause) {
                avatar.onMoveUp();
                hasMoved = avatar.isTurnDirection ? false : mazeHandler.movementResolver.moveItemUp(avatar);
            }

            break;

        case 's':
        case 'ArrowDown':
            if (!mazeHandler.game.pause) {
                avatar.onMoveDown();
                hasMoved = avatar.isTurnDirection ? false : mazeHandler.movementResolver.moveItemDown(avatar)
            }
            break;

        case 'a':
        case 'ArrowLeft':
            if (!mazeHandler.game.pause) {
                avatar.onMoveLeft();
                hasMoved = avatar.isTurnDirection ? false : mazeHandler.movementResolver.moveItemLeft(avatar)
            }

            break;

        case 'd':
        case 'ArrowRight':
            if (!mazeHandler.game.pause) {
                avatar.onMoveRight();
                hasMoved = avatar.isTurnDirection ? false : mazeHandler.movementResolver.moveItemRight(avatar);
            }
            break;

        case ' ':
            if (!mazeHandler.game.pause) {
                mazeHandler.movementResolver.hitItem(avatar);
            }
            break;
        case 'Meta':
        case 'Control':
            if (!mazeHandler.game.pause) {

                const item = avatar.getLastFromInventory();
                if (item) {
                    mazeHandler.movementResolver.useItem(avatar, item);
                }

            }
            break;

        case 'p':
            mazeHandler.game.pause = !mazeHandler.game.pause;
            break;

    }

    return hasMoved;
}
