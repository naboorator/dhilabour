const GameScreenId = 'main-screen'
// Must mach same size as
const TileSize = 30;

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
    CanAutoInteract: 'canAutoInteract',
    CanExplode: 'canExplode',
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

const PlayerStartingEnergy = 1000;
const PlayerStartingWater = 1000;
