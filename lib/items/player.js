class PlayerItem  extends BaseItem{
    BASE_CLASS = 'player'
    class= this.BASE_CLASS

    onMoveUp() {
        this.class = this.BASE_CLASS + ' moveUp'
    }

    onMoveDown() {
        this.class = this.BASE_CLASS + ' moveDown'
    }

    onMoveLeft() {
        this.class = this.BASE_CLASS + ' moveLeft'
    }

    onMoveRight() {
        this.class = this.BASE_CLASS + ' moveRight'
    }

    onMoveIdle() {
        this.class = this.BASE_CLASS
    }
}
