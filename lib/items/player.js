class PlayerItem extends BaseItem {
    BASE_CLASS = 'player-tile';

    class = this.BASE_CLASS;

    abilities = [
        ItemAbilities.CanTriggerTriggers,
        ItemAbilities.LivesFootsteps,
        ItemAbilities.MoveBoxes,
        ItemAbilities.DestroyWalls,
        ItemAbilities.CanPickItems
    ];

    visible = 1;

    /**
     *
     * @type {ItemInventory}
     */
    inventory = new ItemInventory(2, []);


    beHappy(val) {
        if (val) {
            this.class = this.class + ' happy'
        } else {
            this.class = this.BASE_CLASS
        }

    }
}
