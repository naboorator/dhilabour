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
            movements: [
                movementLeftRight,
            ],
            onInteractCallBack: (gameBoardGrid, npc, item) => {
                // First dialog
                const gameNotice = gameState.areas.area1.dialogs.welcome;
                gameNotice.resolve((action) => {
                    if (action === 'Yes') {
                        const gameNotice1 = gameState.areas.area1.dialogs.what;
                        gameNotice1.resolve((action) => {
                            gameBoardGrid.game.closeCurrentScreen();

                            let tiles = gameBoardGrid.findTileByChar('z');

                            tiles.forEach((tile) => {
                                if (!npc.isTriggered()) {
                                    gameBoardGrid.movementResolver.forceMoveLeft(tile, 2)
                                } else {
                                    gameBoardGrid.movementResolver.forceMoveRight(tile, 2)
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
                gameBoardGrid.showNotice(item.position.y, item.position.y, gameNotice);
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
                movementLeftRight,
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
            name: 'heart-tile',
            callbackOnPickup: (gameBoardGrid, item) => {
                gameBoardGrid.game.playerLife = gameBoardGrid.game.playerLife + 1;
                gameBoardGrid.effects.addEffect(new JumpEffect(item, 20))
            }
        }
    },
    f: {
        item: WallItem,
        parameters: {}
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
        parameters: {
            name: 'visible-trigger-tile',
            canRepeat: true,
            /**
             *
             * @param gameBoardGrid {GameBoardGrid}
             * @param item {BaseTrigger}
             */
            onStepCallback: (gameBoardGrid, item) => {
                let tiles = gameBoardGrid.findTileByChar('f');
                tiles.forEach((tile) => {
                    if (!item.isTriggered()) {
                        gameBoardGrid.movementResolver.forceMoveDown(tile, 2)
                    } else {
                        gameBoardGrid.movementResolver.forceMoveUp(tile, 2)
                    }

                });

                item.toggleTrigger();

            },

            /**
             *
             * @param gameBoardGrid {GameBoardGrid}
             * @param item {BaseTrigger}
             */
            onLeaveCallback: (gameBoardGrid, item) => {
                alert('Leaving a trigger')

            }
        }
    }
}
