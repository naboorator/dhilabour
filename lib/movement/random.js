function randomMovement(controller, avatar) {
    const keys = ['w','s','a','d'];
    controller.handleKeyPress(keys[Math.floor(Math.random()*keys.length)], avatar);
}
