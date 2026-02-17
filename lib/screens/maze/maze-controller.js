function mazeHandleKeyPress(key, controller, avatar, mazeHandler, forceMove = false) {
    let hasMoved = false
    avatar.onMoveChange.next(avatar.orientation)
    switch (key) {
        case 'w':
        case 'ArrowUp':
            if (!mazeHandler.game.pause) {

                if (avatar.orientation !== Orientation.Up && !forceMove) {
                    avatar.setOrientation(Orientation.Up);
                } else {
                    hasMoved = mazeHandler.movementResolver.moveItemUp(avatar);
                }

            }

            break;

        case 's':
        case 'ArrowDown':
            if (!mazeHandler.game.pause) {
                if (avatar.orientation !== Orientation.Down && !forceMove) {
                    avatar.setOrientation(Orientation.Down);
                } else {
                    hasMoved = mazeHandler.movementResolver.moveItemDown(avatar);
                    console.log('JHAs moveed ', hasMoved)
                }
            }
            break;

        case 'a':
        case 'ArrowLeft':
            if (!mazeHandler.game.pause) {
                if (avatar.orientation !== Orientation.Left && !forceMove) {
                    avatar.setOrientation(Orientation.Left);

                } else {
                    hasMoved = mazeHandler.movementResolver.moveItemLeft(avatar);
                }
            }

            break;

        case 'd':
        case 'ArrowRight':
            if (!mazeHandler.game.pause) {

                if (avatar.orientation !== Orientation.Right && !forceMove) {
                    avatar.setOrientation(Orientation.Right);

                } else {
                    hasMoved = mazeHandler.movementResolver.moveItemRight(avatar);
                }
            }
            break;

        case ' ':
            if (!mazeHandler.game.pause) {
                mazeHandler.movementResolver.interactWithItem(avatar);
            }
            break;
        case 'Meta':
        case 'Control':
            if (!mazeHandler.game.pause) {

                const item = avatar.getLastFromInventory();
                if (item) {
                    let used = mazeHandler.movementResolver.useItem(avatar, item);
                    if (!used) {
                        const item = avatar.getNextItem();
                        let used = mazeHandler.movementResolver.useItem(avatar, item);
                    }
                }

            }
            break;

        case 'p':
            mazeHandler.game.pause = !mazeHandler.game.pause;
            break;
        case 'o':
            mazeHandler.game.stop = !mazeHandler.game.stop;
            break;
    }

    return hasMoved;
}
