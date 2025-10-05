class PlayerItem extends BaseItem {
    BASE_CLASS = 'player-tile';

    class = this.BASE_CLASS;


    renderCollision() {
        this.class = this.class + ' rotate'
    }
}
