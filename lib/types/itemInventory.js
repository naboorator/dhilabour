class ItemInventory {
    /**
     *
     * @type {number}
     */
    size = 0;
    /**
     *
     * @type {BaseItem[]}
     */
    stack = []

    lastItemIndex = -1;

    /**
     *
     * @param size {number}
     * @param startingStack {BaseItem[]}
     */
    constructor(size, startingStack) {
        this.size = size;
        this.stack = startingStack ?? [];
    }


    addItem(item) {
        if (this.size > this.stack.length) {
            this.stack.push(item);
            this.lastItemIndex++
            return true
        }
        return false
    }

    getItem(index) {
        if (this.stack[index]) {
            return this.stack[index];
        }
        return null;
    }

    /**
     *
     * @param item {BaseItem}
     */
    removeItem(item) {
        let tmp = [];

        this.stack.forEach((stackItem) => {
            if (item.id === stackItem.id) {
                this.lastItemIndex--;
            } else {
                tmp.push(stackItem);
            }
        });

        this.stack = tmp;
    }

    allItems() {
        return this.stack;
    }

    emptyStack() {
        this.lastItemIndex = -1;
        return this.stack = [];
    }

    hasItems() {
        return this.stack.length > 0
    }

}
