class PlayerItem extends BaseItem {
    BASE_CLASS = 'player'
    class = this.BASE_CLASS

    subscribers = [];

    addSubscriber(item) {
        this.subscribers.push(item)
    }

    onMoveUp() {
        this.class = this.BASE_CLASS + ' moveUp'
        this.notify({
            moved: 'up'
        })
    }

    onMoveDown() {
        this.class = this.BASE_CLASS + ' moveDown'
        this.notify({
            moved: 'down'
        })
    }

    onMoveLeft() {
        this.class = this.BASE_CLASS + ' moveLeft'
        this.notify({
            moved: 'left'
        })
    }

    onMoveRight() {
        this.class = this.BASE_CLASS + ' moveRight'
        this.notify({
            moved: 'right'
        })
    }

    notify(data) {
        this.subscribers.forEach((item) => {
            item.notify(data);
        })
    }
    

    renderCollision() {
        this.class = this.class + ' rotate'
    }
}
