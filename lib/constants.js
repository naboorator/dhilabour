const GameScreenId = 'main-screen'
const BlockSize = 30
const RowSpace = 1

const ItemAbilities = {
    MoveBoxes: 'canMoveBoxes',
    DestroyWalls: 'canDestroyWalls',
    LivesFootsteps: 'livesFootsteps',
    CanBePicked: 'canBePicked',
    CanPickItems: 'canPickItems',
    canBePlaced: 'canBePlaced',
    IsInventoryItem: 'isInventoryItem',
    IsTrigger: 'isTrigger',
    CanTriggerTriggers: 'canTriggerTriggers',
    CanInteract: 'canInteract',
    CanStartInteract: 'CanStartInteract',
}

const Orientation = {
    Idle: 'idle',
    Up: 'up',
    Down: 'down',
    Left: 'left',
    Right: 'right',
}

const MoveDirection = {
    Left: 'moveItemLeft',
    Right: 'moveItemRight',
    Up: 'moveItemUp',
    Down: 'moveItemDown',
}
