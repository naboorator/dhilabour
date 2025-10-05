function mazeHandleKeyPress(key, controller, avatar, mazeHandler) {
    let hasMoved = false

    switch (key) {
        case 'w':
        case 'ArrowUp':
            if (avatar.orientation !== 'up') {
                avatar.onMoveUp();
                hasMoved = false
            } else {
                hasMoved = mazeHandler.moveItemUp(avatar)
            }

            break;

        case 's':
        case 'ArrowDown':
            if (avatar.orientation !== 'down') {
                avatar.onMoveDown();
                hasMoved = false
            } else {
                hasMoved = mazeHandler.moveItemDown(avatar)
            }

            break;

        case 'a':
        case 'ArrowLeft':

            if (avatar.orientation !== 'left') {
                avatar.onMoveLeft();
                hasMoved = false
            } else {
                hasMoved = mazeHandler.moveItemLeft(avatar)
            }

            break;

        case 'd':
        case 'ArrowRight':
            if (avatar.orientation !== 'right') {
                avatar.onMoveRight();
                hasMoved = false
            } else {
                hasMoved = mazeHandler.moveItemRight(avatar)
            }

            break;

        case ' ':
            hasMoved = mazeHandler.hitItem(avatar)
            break;

    }
    return hasMoved;
}
