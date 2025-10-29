/**
 * @type MazeConfig
 */

area1Config = {
    n: {
        item: NpcItem,
        parameters: {
            baseClass: 'peasant-tile',
            speed: 30,
            movementType: MovementTypes.randomList,
            movements: [],
            onInteractCallBack: (gameBoardGrid, npc, item) => {
                // First dialog
                const gameNotice = gameState.areas.area1.dialogs.welcome;
                gameNotice.resolve((action) => {
                    if (action === 'Yes') {
                        const gameNotice1 = gameState.areas.area1.dialogs.what;
                        gameNotice1.resolve((action) => {
                            gameBoardGrid.game.closeCurrentScreen();

                            const moveRepeatHelper = new MoveRepeatHelper(gameBoardGrid.movementResolver);

                            let tiles = gameBoardGrid.findTileByChar('z');

                            tiles.forEach((tile) => {
                                if (!npc.isTriggered()) {
                                    moveRepeatHelper.repeatMoves([MoveDirection.Left, MoveDirection.Left], tile, 200)
                                } else {
                                    moveRepeatHelper.repeatMoves([MoveDirection.Right, MoveDirection.Right], tile, 200)
                                }

                            });

                            npc.toggleTrigger();
                        });

                        gameBoardGrid.game.closeCurrentScreen().setGameScreenAndPreserveCurrent(new DialogScreeen(gameBoardGrid.game, gameNotice1));
                    } else {
                        gameBoardGrid.game.closeCurrentScreen();
                        return;
                    }


                })
                gameBoardGrid.showNotice(item.position.y, item.position.x, gameNotice);
                gameBoardGrid.game.pause = true;
            }
        }

    },
    e: {
        item: EnemyItem,
        parameters: {
            baseClass: 'golem-tile',
            speed: 30,
            movementType: MovementTypes.randomList,
            movements: [
                // movementLeftRight,
            ],
        }
    },
    S:
        {
            speed: 12,
            movement: MovementTypes.randomList,
            movements: [
                movementLeftRight
            ],
            switchTime: 5000,
        },
    i: {
        item: DynamiteItem
    },

    t: {
        item: GenericPickUpItem,
        parameters: {
            baseClass: 'heart-tile',
            callbackOnPickup: (gameBoardGrid, item) => {
                gameBoardGrid.game.playerLife = gameBoardGrid.game.playerLife + 1;
                gameBoardGrid.effects.addEffect(new JumpEffect(item, 20))
            }
        }
    },
    f: {
        item: WallItem,
        parameters: {
            abilities: [ItemAbilities.MoveBoxes],
        }
    },

    z: {
        item: WallItem,
        parameters: {}
    },

    p: {
        item: PlayerItem,
    },

    x: [
        {
            item: WallItem,
        }
    ],

    j: {
        item: StepOnTrigger,
        onLeaveSubscription: null,
        onStepSubscription: null,
        speed: 1000,
        parameters: {
            baseClass: 'visible-trigger-tile',
            canRepeat: true,

            /**
             *
             * @param gameBoardGrid {GameBoardGrid}
             * @param triggerItem {BaseTrigger}
             */
            onStepCallback: (gameBoardGrid, triggerItem) => {
                if (area1Config.j.onLeaveSubscription) {
                    area1Config.j.onLeaveSubscription.unsubscribe();
                }

                if (!triggerItem.isTriggered()) {
                    triggerItem.toggleTrigger(true);
                    const moveRepeatHelper = new MoveRepeatHelper(gameBoardGrid.movementResolver);

                    // Get tile to moves
                    let tiles = gameBoardGrid.findTileByChar('f');
                    const speed = area1Config.j.speed

                    tiles.forEach((tile) => {

                        moveRepeatHelper.repeatMoves([
                            MoveDirection.Down,
                            MoveDirection.Down
                        ], tile, speed).onError((error) => {
                            triggerItem.toggleTrigger(false);
                        }).onSuccess((data) => {
                            triggerItem.toggleTrigger(true);
                        });
                    });
                }


            },

            /**
             *
             * @param gameBoardGrid {GameBoardGrid}
             * @param triggerItem {BaseTrigger}
             */
            onLeaveCallback: (gameBoardGrid, triggerItem) => {

                let moveTiles = (gameBoardGrid) => {
                    const moveRepeatHelper = new MoveRepeatHelper(gameBoardGrid.movementResolver);

                    let tiles = gameBoardGrid.findTileByChar('f');
                    const speed = area1Config.j.speed
                    tiles.forEach((tile) => {
                        moveRepeatHelper.repeatMoves([
                            MoveDirection.Up,
                            MoveDirection.Up
                        ], tile, speed).onError(() => {
                            triggerItem.toggleTrigger(false);
                        }).onSuccess(() => {
                            triggerItem.toggleTrigger(false)
                        });

                    });
                }

                if (triggerItem.isTriggered()) {
                    moveTiles(gameBoardGrid);
                }

                area1Config.j.onLeaveSubscription = triggerItem.onTriggered.subscribe((triggeredState) => {
                    if (triggeredState) {
                        moveTiles(gameBoardGrid);
                    }
                });
            }
        }
    }
}
