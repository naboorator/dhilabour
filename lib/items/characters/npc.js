class NpcItem extends AIMovementCharacter {

    abilities = [ItemAbilities.CanInteract];

    hasBeenTriggered = false;

    bubble = null;

    bubbleTime = 50;


    onInteractCallBack = (gameBoardGrid, npc, item) => {
        // console.log('onInteractCallBack', gameBoardGrid, npc, item);
    }

    constructor({baseClass, speed, movementType, movements, abilities, onInteractCallBack}) {
        super({baseClass, speed, movementType, movements, abilities});
        this.onInteractCallBack = onInteractCallBack ?? this.onInteractCallBack;
    }


    update() {
        if (this.hasAbility(ItemAbilities.CanInteract) && !this.isTriggered()) {
            this.bubbleTime = this.bubbleTime - 1;
            if (this.bubbleTime <= 0) {
                if (this.bubble === null) {
                    this.addBubble();
                } else {
                    this.removeBubble();
                }
                this.bubbleTime = 50;
            }
        }

        this.handleAiMovements()
    }

    init() {

    }


    onInteract(gameBoardGrid, item) {
        this.onInteractCallBack(gameBoardGrid, this, item)
    }

    toggleTrigger() {
        this.hasBeenTriggered = !this.hasBeenTriggered;
        if (this.hasBeenTriggered) {
            this.removeBubble();
        }
    }

    isTriggered() {
        return this.hasBeenTriggered;
    }

    addBubble() {
        this.bubble = new ChatBubbleItem({
            baseClass: 'chat-bubble-tile'
        }, '?');
        this.bubble.visible = 1;
        this.bubble.position = this.position;
        this.addChildItem(this.bubble)
    }

    removeBubble() {
        this.clearChildItems();
        game.currentScreen.gameBoardGrid.removeItemFromTile(this.bubble);
        this.bubble = null;
    }


}





