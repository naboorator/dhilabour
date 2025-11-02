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
                const gameNotice = GameStore.getState().areas.area1.dialogs.welcome
                gameNotice.resolve((action) => {
                    if (action === 'Yes') {
                        const gameNotice1 = GameStore.getState().areas.area1.dialogs.what
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
                movementLeftRight,
            ],
        }
    },

    i: {
        item: DynamiteItem
    },

    t: {
        item: GenericPickUpItem,
        parameters: {
            baseClass: 'heart-tile',
            callbackOnPickup: (gameBoardGrid, item) => {
                state = GameStore.getState();
                GameStore.changeStates(state, {
                    ...state, player: {
                        ...state.player,
                        energy: state.player.energy + 50
                    }
                })

                gameBoardGrid.effects.addEffect(new JumpEffect(item, 20))
            }
        }
    },
    d: {
        item: DoorItem,
        parameters: {
            baseClass: 'door-tile blue',
            opened: false,
            abilities: [ItemAbilities.CanInteract],
            onInteractCallBack: (gameBoardGrid, door, avatar) => {
                console.log(avatar)
                const doorLocked = GameStore.getState().areas.area1.doors.blue.locked;

                let hasKey = avatar.inventory.allItems().find((item) => {
                    if (item instanceof KeyItem) {
                        if (item.unlocksTileChar === door.tileChar) {
                            return item;
                        }
                    }
                });


                let gameNotice;

                if (hasKey) {
                    gameNotice = GameStore.getState().areas.area1.dialogs.blueDoorCanBeUnLocked;
                } else {
                    gameNotice = GameStore.getState().areas.area1.dialogs.blueDoorLocked
                }

                gameNotice.resolve((action) => {
                    if (action === 'unlock') {
                        door.setLocked(false)
                        door.open();
                    }
                    if (action === 'lock') {
                        door.close();
                        door.setLocked(true)
                    }
                    gameBoardGrid.game.closeCurrentScreen();
                })
                gameBoardGrid.showNotice(avatar.position.y, avatar.position.x, gameNotice);
                gameBoardGrid.game.pause = true;

            }
        }
    },
    k: {
        item: KeyItem,
        parameters: {
            baseClass: 'key-tile blue',
            unlocks: 'd'
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
        speed: 200,
        parameters: {
            baseClass: 'visible-trigger-tile',
            canRepeat: true,

            /**
             *
             * @param gameBoardGrid {GameBoardGrid}
             * @param triggerItem {BaseTrigger}
             */
            onStepCallback: (gameBoardGrid, triggerItem) => {
                triggerOnStepOnTriggerMovement(gameBoardGrid, triggerItem, [
                        MoveDirection.Down,
                        MoveDirection.Left,
                    ],
                    gameBoardGrid.findTileByChar('f'), 100);
            },

            /**
             *
             * @param gameBoardGrid {GameBoardGrid}
             * @param triggerItem {BaseTrigger}
             */
            onLeaveCallback: (gameBoardGrid, triggerItem) => {

                triggerOnLeaveTriggerMovement(gameBoardGrid, triggerItem, [
                    MoveDirection.Right,
                    MoveDirection.Up,

                ], gameBoardGrid.findTileByChar('f'), 100);
            }
        }
    }
}
