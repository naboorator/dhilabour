class PlayerItem extends BaseItem {
    BASE_CLASS = 'player-tile';

    class = this.BASE_CLASS;

    abilities = [ItemAbilities.MoveBoxes, ItemAbilities.DestroyWalls, ItemAbilities.LivesFootsteps];

    renderCollision() {
        this.class = this.class + ' rotate'
    }
}
