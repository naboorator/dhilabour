class PlayerItem extends ItemWithInventory {


    abilities = [
        ItemAbilities.CanTriggerTriggers,
        ItemAbilities.LivesFootsteps,
        ItemAbilities.MoveBoxes,
        ItemAbilities.DestroyWalls,
        ItemAbilities.CanPickItems,
        ItemAbilities.CanStartInteract
    ];

    /**
     *
     * @type {ItemInventory}
     */
    inventory = new ItemInventory(3, []);


    idleEnergyReduceFactor = 0.08;
    idleWaterReduceFactor = 0.008;

    energy = 0;
    water = 0;


    init() {
        // Starting orentation

        this.spriteAssetRoot = '/assets/images/avatar/boy1/';

        this._moveSpeed = 5
        this.sprite = '/orientation/down.png';


        const walkSpeed = 100;
        const walkUpAnimation = new Animation();
        walkUpAnimation.addFrame(this.spriteAssetRoot + 'animations/walk/up/frame_000.png');
        walkUpAnimation.addFrame(this.spriteAssetRoot + 'animations/walk/up/frame_001.png');
        walkUpAnimation.addFrame(this.spriteAssetRoot + 'animations/walk/up/frame_002.png');
        walkUpAnimation.addFrame(this.spriteAssetRoot + 'animations/walk/up/frame_003.png');
        walkUpAnimation.setSpeed(walkSpeed);

        const walkDownAnimation = new Animation();
        walkDownAnimation.addFrame(this.spriteAssetRoot + 'animations/walk/down/frame_000.png');
        walkDownAnimation.addFrame(this.spriteAssetRoot + 'animations/walk/down/frame_001.png');
        walkDownAnimation.addFrame(this.spriteAssetRoot + 'animations/walk/down/frame_002.png');
        walkDownAnimation.addFrame(this.spriteAssetRoot + 'animations/walk/down/frame_003.png');
        walkDownAnimation.setSpeed(walkSpeed);


        const walkRightAnimation = new Animation();
        walkRightAnimation.addFrame(this.spriteAssetRoot + 'animations/walk/right/frame_000.png');
        walkRightAnimation.addFrame(this.spriteAssetRoot + 'animations/walk/right/frame_001.png');
        walkRightAnimation.addFrame(this.spriteAssetRoot + 'animations/walk/right/frame_002.png');
        walkRightAnimation.addFrame(this.spriteAssetRoot + 'animations/walk/right/frame_003.png');
        walkRightAnimation.setSpeed(walkSpeed);


        const walkLeftAnimation = new Animation();
        walkLeftAnimation.addFrame(this.spriteAssetRoot + 'animations/walk/left/frame_000.png');
        walkLeftAnimation.addFrame(this.spriteAssetRoot + 'animations/walk/left/frame_001.png');
        walkLeftAnimation.addFrame(this.spriteAssetRoot + 'animations/walk/left/frame_002.png');
        walkLeftAnimation.addFrame(this.spriteAssetRoot + 'animations/walk/left/frame_003.png');
        walkLeftAnimation.setSpeed(walkSpeed);


        const IdleAnimation = new Animation();
        IdleAnimation.addFrame(this.spriteAssetRoot + 'orientation/down.png');
        IdleAnimation.setSpeed(walkSpeed);

        this.animations.addAnimation('Idle', IdleAnimation);
        this.animations.addAnimation('walkUp', walkUpAnimation);
        this.animations.addAnimation('walkDown', walkDownAnimation);
        this.animations.addAnimation('walkLeft', walkLeftAnimation);
        this.animations.addAnimation('walkRight', walkRightAnimation);


        const idleRightAnimation = new Animation();
        idleRightAnimation.addFrame(this.spriteAssetRoot + 'orientation/right.png');
        idleRightAnimation.addFrame(this.spriteAssetRoot + 'orientation/right.png');
        idleRightAnimation.setSpeed(walkSpeed);

        const idleLeftAnimation = new Animation();
        idleLeftAnimation.addFrame(this.spriteAssetRoot + 'orientation/left.png');
        idleLeftAnimation.addFrame(this.spriteAssetRoot + 'orientation/left.png');
        idleLeftAnimation.setSpeed(walkSpeed);

        const idleUpAnimation = new Animation();
        idleUpAnimation.addFrame(this.spriteAssetRoot + 'orientation/up.png');
        idleUpAnimation.addFrame(this.spriteAssetRoot + 'orientation/up.png');
        idleUpAnimation.setSpeed(walkSpeed);

        const idleDownAnimation = new Animation();
        idleDownAnimation.addFrame(this.spriteAssetRoot + 'orientation/down.png');
        idleDownAnimation.addFrame(this.spriteAssetRoot + 'orientation/down.png');
        idleDownAnimation.setSpeed(walkSpeed);

        this.animations.addAnimation('idleRight', idleRightAnimation);
        this.animations.addAnimation('idleLeft', idleLeftAnimation);
        this.animations.addAnimation('idleUp', idleUpAnimation);
        this.animations.addAnimation('idleDown', idleDownAnimation);


        this.setCurrentItemAnimation('idleDown')


    }

    update() {

        state = GameStore.getState();
        this.energy = state.player.energy;
        this.water = state.player.water;

        let newEnergy = this.energy - this.idleEnergyReduceFactor;
        let newWater = this.water - this.idleWaterReduceFactor;

        if (newEnergy < 0) {
            newEnergy = 0;
        }

        if (newWater < 0) {
            newWater = 0;
        }

        // If player is lost all
        if (!newWater || !newEnergy) {
            game.currentScreen.gameBoardGrid.renderLostLife()
        }

        GameStore.changeStates(state, {
            ...state,
            player: {
                ...state.player,
                energy: newEnergy,
                water: newWater,
            }
        });

        super.update();
    }

    beHappy(val) {
        if (val) {
            this.class = this.class + ' happy'
        } else {
            this.class = this.BASE_CLASS
        }
    }

    addChatBubble(text, ttl) {
        const bubble = new ChatBubbleItem({}, text, ttl)
        // this.clearChildItems();
        this.addChildItem(bubble);
    }

    onLiftUp(item) {
        if (item instanceof BoxItem) {
            item.width = TileSize / 1.5;
            item.height = TileSize / 1.5;
        }
    }

    onDropDownItem(item) {
        if (item instanceof BoxItem) {
            item.width = TileSize;
            item.height = TileSize;
            item.positionOffset = {
                y: 0,
                x: 0
            };
        }
    }

    // isTurning(direction) {
    //     const isTurniing = super.isTurning(direction);
    //     // this.sprite = this.spriteAssetRoot + 'orientation/' + this.orientation + '.png';
    //     ///console.log('isTurninig', this.sprite);
    //     return isTurniing;
    // }

}
