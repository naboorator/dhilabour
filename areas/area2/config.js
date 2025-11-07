/**
 * @type MazeConfig
 */

area2Config = {
    n: [{
        item: NextMazeTrigger,
        parameters: {
            loadArea: 'area1',
            startTileChar: 's',
            canReset: true,
        }
    },
        {
            item: PlayerItem,
            parameters: {}
        }
    ],


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
            abilities: [ItemAbilities.CanInteract, ItemAbilities.CanAutoInteract],
            onInteractCallBack: (gameBoardGrid, door, avatar) => {

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
             * @param avatar {BaseItem}
             */
            onStepCallback: (gameBoardGrid, triggerItem, avatar) => {
                const sound = new Sound('./assets/sounds/stone_door.ogg');
                avatar.addChildItem(new ChatBubbleItem({}, 'Wow, I opened hidden door.', 50))
                triggerOnStepOnTriggerMovement(gameBoardGrid, triggerItem, [
                        MoveDirection.Down,
                        MoveDirection.Left,
                    ],
                    gameBoardGrid.findTileByChar('f'), 100);
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

                ], gameBoardGrid.findTileByChar('f'), 100);
                sound.play();
            }
        }
    }
}
