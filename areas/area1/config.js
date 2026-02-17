/**
 * @type MazeConfigInterface
 */


area1Config = {
    backgroundTile: {
        item: GrassItem
    },
    backgroundMusic: '/assets/sounds/music/morning.mp3',


    r: {
        item: GrassItem,
        parameters: {
            tile: './assets/images/items/grass_1_rocks.png'
        }
    },
    m: {
        item: StepOnTrigger,
        parameters: {
            canRepeat: false,
            /**
             *
             * @param gameBoardGrid {GameBoardGrid}
             * @param triggerItem {BaseTrigger}
             * @param avatar {PlayerItem}
             */
            onStepCallback: (gameBoardGrid, triggerItem, avatar) => {
                if (shouldShowBoxCanBeLifted()) {
                    avatar.addChatBubble('I think I can lift this boxes!', 100);
                    updateArea1BoxLifted(true);
                    setTimeout(() => {
                        updateArea1BoxLifted(false);
                    }, 10000)
                }

            },

        }
    },
    n: {
        item: VilligerItem,
        parameters: {
            baseClass: 'peasant-tile',
            speed: 30,
            movementType: MovementTypes.randomList,
            movements: [],
            onInteractCallBack: (gameBoardGrid, npc, item) => {
                // First dialog
                const state = GameStore.getState();
                const game = gameBoardGrid.game;
                let gameNotice;

                if (!isGameArea1Task1Accepted()) {
                    gameNotice = Area1Dialogs.introDialog()
                    gameNotice.resolve((action) => {
                        if (action === 'Yes') {

                            game.actions.triggerAction(new Action(area1Actions.acceptIntoTask, true))
                            const gameNotice1 = Area1Dialogs.firstTaskDialog()

                            gameNotice1.resolve((action) => {
                                gameBoardGrid.game.closeCurrentScreen();
                                const sound = new Sound('./assets/sounds/stone_door.ogg');
                                const moveRepeatHelper = new MoveRepeatHelper(gameBoardGrid.movementResolver);

                                let tiles = gameBoardGrid.findTileByChar('z');

                                tiles.forEach((tile) => {
                                    if (!npc.isTriggered()) {
                                        moveRepeatHelper.repeatMoves([MoveDirection.Down, MoveDirection.Left], tile, 200)
                                    } else {
                                        moveRepeatHelper.repeatMoves([MoveDirection.Right, MoveDirection.Up], tile, 200)
                                    }

                                });

                                
                                sound.play();

                                npc.toggleTrigger();
                            });

                            gameBoardGrid.game.closeCurrentScreen().setGameScreenAndPreserveCurrent(new DialogScreeen(gameBoardGrid.game, gameNotice1));
                        } else {
                            gameBoardGrid.game.closeCurrentScreen();
                            return;
                        }


                    })
                } else {
                    gameNotice = Area1Dialogs.firstTaskWaitingDialog()
                    gameNotice.resolve((resp) => {
                        if (resp === 'what') {
                            gameBoardGrid.game.closeCurrentScreen();

                            const gameNotice1 = Area1Dialogs.firstTaskDialog()
                            gameNotice1.resolve((action) => {
                                gameBoardGrid.game.closeCurrentScreen();
                            })
                            gameBoardGrid.showNotice(item.position.y, item.position.x, gameNotice1);
                        } else {
                            gameBoardGrid.game.closeCurrentScreen();
                        }

                    })
                }

                gameBoardGrid.showNotice(item.position.y, item.position.x, gameNotice);
                gameBoardGrid.game.pause = true;
            }
        }

    },
    e: {
        item: EnemyItem,
        parameters: {
            baseClass: 'golem-tile',
            movementType: MovementTypes.leftRight
        }
    },
    S: {
        item: NextMazeTrigger,
        parameters: {
            baseClass: 'visible-trigger-tile',
            loadArea: 'area2',
            startTileChar: 'N',
            exitOrientation: Orientation.Down
        }
    },

    N: {
        item: NextMazeTrigger,
        parameters: {
            baseClass: 'visible-trigger-tile',
            loadArea: 'area2',
            startTileChar: 'S',
            exitOrientation: Orientation.Up
        }
    },


    i: {
        item: DynamiteItem
    },

    o: {
        item: WallItem,
        parameters: {
            baseClass: 'rocks-tile',
            abilities: [ItemAbilities.CanExplode, ItemAbilities.CanInteract, ItemAbilities.CanAutoInteract],
            onInteractCallBack: (gameBoardGrid, wallItem, avatar) => {
                avatar.addChatBubble('Hm this rocks could be destroyed...', 100)
            }
        }
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
            keyLockCode: 'sdvfrkd',
            abilities: [ItemAbilities.CanInteract, ItemAbilities.CanAutoInteract],
            /**
             /**
             *
             * @param gameBoardGrid {GameBoardGrid}
             * @param door {DoorItem}
             * @param avatar {BaseItem}
             * @param isAutoInteract {boolean}
             */
            onInteractCallBack: (gameBoardGrid, door, avatar, isAutoInteract) => {

                if (isAutoInteract && !door.isLocked()) {
                    return
                }

                let aMatchingKey = avatar.inventory.allItems().find((item) => {
                    if (item instanceof KeyItem) {
                        if (item.unlocksTileChar === door.tileChar && door.canUnlock(item.keyLockCode)) {
                            return item;
                        }
                    }
                });


                let gameNotice;

                if (aMatchingKey) {
                    gameNotice = Area1Dialogs.doorUnLockedDialog();
                } else {
                    gameNotice = Area1Dialogs.doorLockedDialog();
                }


                gameNotice.resolve((action) => {
                    if (action === 'unlock') {
                        door.setLocked(false)
                        door.open(aMatchingKey.keyLockCode);
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

    D: {
        item: DoorItem,
        parameters: {
            baseClass: 'door-tile gray',
            opened: true,
            abilities: [ItemAbilities.CanInteract, ItemAbilities.CanAutoInteract],
            /**
             *
             * @param gameBoardGrid
             * @param door {DoorItem}
             * @param avatar
             * @param isAutoInteraction {boolean}
             */
            onInteractCallBack: (gameBoardGrid, door, avatar, isAutoInteraction) => {
                door.setLocked(false);
                if (!door.isOpen) {
                    door.open(null);
                } else if (!isAutoInteraction) {
                    door.close();
                }


            }
        }
    },
    k: [
        {
            item: HouseFloorItem
        },
        {
            item: KeyItem,
            parameters: {
                baseClass: 'key-tile blue',
                unlocks: 'd',
                keyLockCode: 'sdvfrkd',
                /**
                 *
                 * @param gameBoardGrid {GameBoardGrid}
                 * @param item {BaseItem}
                 * @param avatar {PlayerItem}
                 */
                callbackOnPickup: (gameBoardGrid, item, avatar) => {
                    avatar.addChatBubble('Yeah found a key. It must open a door.', 100)
                }
            }
        }
    ],
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
             * @param avatar {BaseItem}
             */
            onStepCallback: (gameBoardGrid, triggerItem, avatar) => {
                const sound = new Sound('./assets/sounds/stone_door.ogg');
                // avatar.addChildItem(new ChatBubbleItem({}, 'Wow, I opened hidden door.', 50))
                triggerOnStepOnTriggerMovement(gameBoardGrid, triggerItem, [
                        MoveDirection.Down,
                        MoveDirection.Left,
                    ],
                    gameBoardGrid.findTileByChar('f'), 200);
                sound.play();
            },

            /**
             *
             * @param gameBoardGrid {GameBoardGrid}
             * @param triggerItem {BaseTrigger}
             */
            onLeaveCallback: (gameBoardGrid, triggerItem) => {
                const sound = new Sound('./assets/sounds/stone_door.ogg');
                triggerOnLeaveTriggerMovement(gameBoardGrid, triggerItem, [
                    MoveDirection.Right,
                    MoveDirection.Up,

                ], gameBoardGrid.findTileByChar('f'), 200);
                sound.play();
            }
        }
    },
    y: {
        item: HouseFloorItem
    }


}
