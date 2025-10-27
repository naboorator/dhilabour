class BoxPlaceItem extends BaseItem {
    BASE_CLASS = 'box-place-tile'

    class = this.BASE_CLASS


    completed = false;

    isCompleted = false;

    setCompleted(val) {
        if (val) {
            this.class = [this.BASE_CLASS, 'completed'].join(" ");
        } else {
            this.class = this.BASE_CLASS
        }

        this.isCompleted = val;

    }
}

