class VilligerItem extends NpcItem {
    name = 'Viliger';

    constructor(props) {
        super(props);

    }

    init() {
        this.spriteAssetRoot = '/assets/images/peasant';
        this._moveSpeed = 5
        const IdleAnimation = new Animation();
        IdleAnimation.addFrame(this.spriteAssetRoot + '/south.png');
        IdleAnimation.setSpeed(100);

        this.animations.addAnimation('idleDown', IdleAnimation);


        this.setCurrentItemAnimation('idleDown')
    }
}
