class GenericPickUpItem extends BasePickableItem {

    /**
     *
     * @param effects {GameEffects}
     */
    onPickUp(effects) {
        return this.onPickupCallback(effects, this)
    }


}
