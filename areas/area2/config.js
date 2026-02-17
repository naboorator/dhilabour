/**
 * @type MazeConfig
 */

area2Config = {
    backgroundTile: {
        item: GrassItem
    },
    backgroundMusic: './assets/sounds/music/forest.mp3',
    N: {
        item: NextMazeTrigger,
        parameters: {
            loadArea: 'area1',
            startTileChar: 'S',
            exitOrientation: Orientation.Up
        }
    },

    h: {
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
    t: {
        item: HouseFloorItem,
        parameters: {}
    },
    e: {
        item: EnemyItem,
        parameters: {
            baseClass: 'golem-tile',
            movementType: MovementTypes.shortestPath
        }
    },

    d: [
        {
            item: HouseFloorItem
        },
        {
            item: DoorItem,
            parameters: {
                baseClass: 'door-tile blue',
                opened: false,
                abilities: [ItemAbilities.CanInteract, ItemAbilities.CanAutoInteract],
                onInteractCallBack: (gameBoardGrid, door, avatar, isAutoInteraction) => {
                    door.setLocked(false);
                    if (!door.isOpen) {
                        door.open(null);
                    } else if (!isAutoInteraction) {
                        door.close();
                    }
                }
            }
        }
    ],
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
