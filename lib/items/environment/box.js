class BoxItem extends BaseItem {

    abilities = [
        ItemAbilities.CanTriggerTriggers,
        ItemAbilities.CanExplode,
        ItemAbilities.CanBePushed,
        ItemAbilities.CanBeLifted
    ];


    init() {
        this.spriteAssetRoot = '/assets/images/items/';
        this.sprite = this.spriteAssetRoot + 'wooden-box.png'
    }

}
