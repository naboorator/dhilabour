class BoxItem extends BaseItem {
    DEFAULT_CLASS = 'box-tile';

    class = this.DEFAULT_CLASS

    completed(val) {
        if (val) {
            this.class = this.DEFAULT_CLASS + ' completed'
        } else {
            this.class = this.DEFAULT_CLASS
        }
    }
}
