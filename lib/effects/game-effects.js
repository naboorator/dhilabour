class GameEffects {
    nextId = 1;
    /**
     *
     * @prop effectList {Effect[]}
     */
    effectList = new Map();

    /**
     *
     * @param effect {BaseEffect}
     */
    addEffect(effect) {
        const effectKey = this.getMapKey(effect.position.y, effect.position.x);
        let locationEffects = [];

        if (this.effectList.has(effectKey)) {
            locationEffects = this.effectList.get(effectKey);
        }

        effect.onDestroyCall(() => {
            this.effectList.delete(effectKey)
        });

        // Effects can  create new effects
        effect.onAddNewEffect = (effect) => {
            this.addEffect(effect);
        }

        locationEffects.push(effect);
        this.effectList.set(effectKey, locationEffects);
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

    /**
     *
     * @param y {number}
     * @param x {number}
     * @returns {Effect[]}
     */
    findEffect(y, x) {
        const key = this.getMapKey(y, x);
        if (this.effectList.has(key)) {
            return this.effectList.get(key)
        }
    }

    getId() {
        return this.nextId;
    }
}
