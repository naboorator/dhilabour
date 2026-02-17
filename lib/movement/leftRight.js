function movementLeftRight(avatar, controller) {
    if (avatar.nextMove === null) {
        avatar.nextMove = 'a';
    }

    const hasMoved = controller.handleKeyPress(avatar.nextMove, avatar);
    console.log('Enemy has moved', hasMoved);
    if (!hasMoved && !avatar.isTurnDirection) {
        avatar.nextMove = (avatar.nextMove === 'd') ? 'a' : 'd'
    }
}
