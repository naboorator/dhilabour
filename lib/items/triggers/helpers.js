function triggerOnStepOnTriggerMovement(gameBoardGrid, triggerItem, movesArray, tiles, speed) {
    let moveTiles = (gameBoardGrid) => {
        triggerItem.setMoving(true);
        const moveRepeatHelper = new MoveRepeatHelper(gameBoardGrid.movementResolver);

        tiles.forEach((tile) => {

            moveRepeatHelper.repeatMoves(movesArray, tile, speed).onError((error) => {
                triggerItem.toggleTrigger(false);
                triggerItem.setMoving(false);
            }).onSuccess((data) => {
                triggerItem.toggleTrigger(true);
                triggerItem.setMoving(false);
            });
        });
    }

    if (!triggerItem.isMoving()) {
        moveTiles(gameBoardGrid);
    } else {
        triggerItem.onStepSubscription = triggerItem.onTriggered.subscribe((triggeredState) => {
            if (!triggeredState) {
                moveTiles(gameBoardGrid);
                triggerItem.onStepSubscription.unsubscribe();
            }
        });
    }
}

function triggerOnLeaveTriggerMovement(gameBoardGrid, triggerItem, movesArray, tiles, speed) {
    let moveTiles = (gameBoardGrid) => {
        const moveRepeatHelper = new MoveRepeatHelper(gameBoardGrid.movementResolver);
        triggerItem.setMoving(true);
        tiles.forEach((tile) => {
            moveRepeatHelper.repeatMoves(movesArray, tile, speed).onError(() => {
                triggerItem.toggleTrigger(false);
                triggerItem.setMoving(false);
            }).onSuccess(() => {
                triggerItem.toggleTrigger(false);
                triggerItem.setMoving(false);
            });

        });
    }

    if (!triggerItem.isMoving()) {
        moveTiles(gameBoardGrid);
    } else {
        triggerItem.onLeaveSubscription = triggerItem.onTriggered.subscribe((triggeredState) => {
            if (triggeredState) {
                moveTiles(gameBoardGrid);
                triggerItem.onLeaveSubscription.unsubscribe();
            }
        });
    }
}
