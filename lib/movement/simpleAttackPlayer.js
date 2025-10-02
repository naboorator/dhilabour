function simpleAttackPlayer(game, controller, avatar, previousMoves = [], lastMove) {
    let hasMoved = false
    if (lastMove) {
        lastMove = null;
        randomMovement(controller, avatar);
        return;
    }


    // Try getting closer to
    if (avatar.position.x < game.playerItem.position.x) {
        hasMoved = controller.handleKeyPress('d', avatar);
        previousMoves.push('r');
    } else if (avatar.position.x > game.playerItem.position.x) {
        hasMoved = controller.handleKeyPress('a', avatar);
        previousMoves.push('l');
    }

    if (!hasMoved) {
        if (avatar.position.y < game.playerItem.position.y) {
            hasMoved = controller.handleKeyPress('s', avatar);
            previousMoves.push('d');
        } else if (avatar.position.y > game.playerItem.position.y) {
            hasMoved = controller.handleKeyPress('w', avatar);
            previousMoves.push('u');
        }
    }


    if (!hasMoved) {
        const seed = Math.random() * 100
        if (seed < 50) {
            if (avatar.position.x < game.playerItem.position.x) {
                hasMoved = controller.handleKeyPress('d', avatar);
                previousMoves.push('r');
            } else if (avatar.position.x > game.playerItem.position.x) {
                hasMoved = controller.handleKeyPress('a', avatar);
                previousMoves.push('l');
            }
        } else {
            if (avatar.position.y < game.playerItem.position.y) {
                hasMoved = controller.handleKeyPress('s', avatar);
                previousMoves.push('d');
            } else if (avatar.position.y > game.playerItem.position.y) {
                hasMoved = controller.handleKeyPress('w', avatar);
                previousMoves.push('u');
            }
        }
    }


    lastMove = previousMoves[previousMoves.length - 1];
    const prevMove = previousMoves[previousMoves.length - 2];
    if (!hasMoved) {
        return simpleAttackPlayer(game, controller, avatar, previousMoves, lastMove);
    }


    return hasMoved
}
