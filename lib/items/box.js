class BoxItem extends BaseItem {
    BASE_CLASS = 'box-tile';

    class = this.BASE_CLASS;

    /**
     *
     * @param val {boolean}
     */
    completed(val) {
        if (val) {
            this.class = this.BASE_CLASS + ' completed'
        } else {
            this.class = this.BASE_CLASS
        }
    }
}
