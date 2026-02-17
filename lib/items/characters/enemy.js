class EnemyItem extends AIMovementCharacter {
    BASE_CLASS = 'golem-tile';

    class = this.BASE_CLASS;


    abilities = [ItemAbilities.LivesFootsteps]

    notify(data) {
        this.lastMove = data;
    }

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
        this.handleAiMovements();
        super.update();
        this._animateTransitions(5);
    }

}





