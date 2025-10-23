function movementUpDown(avatar, controller) {
    if (avatar.nextMove === null) {
        avatar.nextMove = 'w';
    }

    const hasMoved = controller.handleKeyPress(avatar.nextMove, avatar);
    if (!hasMoved && !avatar.isTurnDirection) {
        avatar.nextMove = (avatar.nextMove === 'w') ? 's' : 'w'
    }
}
