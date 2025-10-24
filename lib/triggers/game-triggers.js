class GameTriggers {
    nextId = 1;
    /**
     *
     * @prop triggerList {Trigger[]}
     */
    triggerList = new Map();

    /**
     *
     * @param trigger {BaseTrigger}
     */
    addTrigger(trigger) {
        const triggerKey = this.getMapKey(trigger.position.y, trigger.position.x);
        let locationEffects = [];

        if (this.triggerList.has(triggerKey)) {
            locationEffects = this.triggerList.get(triggerKey);
        }

        locationEffects.push(trigger);

        this.triggerList.set(triggerKey, locationEffects);
        this.nextId++;
        return this;
    }

    /**
     *
     * @param y  {number}
     * @param x  {number}
     * @returns {string}
     */
    getMapKey(y, x) {
        return y + '-' + x
    }
    
}
