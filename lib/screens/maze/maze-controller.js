function mazeHandleKeyPress(key, controller, avatar, mazeHandler) {
    let hasMoved = false
    switch (key) {
        case 'w':
        case 'ArrowUp':
            hasMoved = mazeHandler.moveItemUp(avatar)
            break;

        case 's':
        case 'ArrowDown':
            hasMoved = mazeHandler.moveItemDown(avatar)
            break;

        case 'a':
        case 'ArrowLeft':
            hasMoved = mazeHandler.moveItemLeft(avatar)
            break;

        case 'd':
        case 'ArrowRight':
            hasMoved = mazeHandler.moveItemRight(avatar)
            break;

        case 'q':

            mazeHandler.game.currentScreen.restartLevel();
            mazeHandler.game.currentScreen.levelReset();
            mazeHandler.game.setGameScreen(new MenuScreen(mazeHandler.game))

            break;

    }
    return hasMoved;
}
