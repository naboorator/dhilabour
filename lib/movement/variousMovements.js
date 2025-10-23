function variousMovement(avatar, controller, movementList, switchMovementTime) {
    const randomMovmentIndex = Math.floor(Math.random() * movementList.length);
    return movementList[randomMovmentIndex](avatar, controller)
}
