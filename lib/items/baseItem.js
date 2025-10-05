class BaseItem {
    BASE_CLASS = 'baseItem'
    id = 0;

    position = {
        x: 0,
        y: 0
    };

    // width = BlockSize;
    //
    // height = BlockSize;

    border = 'none';

    orientation = 'idle';

    subscribers = [];

    isTurnDirection = false;

    notify(data) {
        this.subscribers.forEach((item) => {
            item.notify(data);
        })
    }

    isTurning(direction) {
        this.isTurnDirection = direction !== this.orientation;
        this.orientation = direction

        return this.isTurnDirection;
    }

    onMoveUp() {
        this.class = this.BASE_CLASS + ' moveUp'
        this.isTurning('up');

        this.notify({
            moved: this.orientation
        })
    }

    onMoveDown() {
        this.class = this.BASE_CLASS + ' moveDown'
        this.isTurning('down');
        this.notify({
            moved: this.orientation
        })

    }

    onMoveLeft() {
        this.class = this.BASE_CLASS + ' moveLeft'
        this.isTurning('left');
        this.notify({
            moved: this.orientation
        })
    }

    onMoveRight() {
        this.class = this.BASE_CLASS + ' moveRight'
        this.isTurning('right');
        this.notify({
            moved: this.orientation
        })
    }

    addSubscriber(item) {
        this.subscribers.push(item)
    }

}
