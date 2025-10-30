class PlayerItem extends BaseItem {
    BASE_CLASS = 'player-tile';

    class = this.BASE_CLASS;

    abilities = [
        ItemAbilities.CanTriggerTriggers,
        ItemAbilities.LivesFootsteps,
        ItemAbilities.MoveBoxes,
        ItemAbilities.DestroyWalls,
        ItemAbilities.CanPickItems,
        ItemAbilities.CanStartInteract
    ];

    visible = 1;

    /**
     *
     * @type {ItemInventory}
     */
    inventory = new ItemInventory(2, []);


    idleEnergyReduceFactor = 0.3;
    idleWaterReduceFactor = 0.1;

    energy = 0;
    water = 0;

    update() {
        state = GameStore.getState();
        this.energy = state.player.energy;
        this.water = state.player.water;

        let newEnergy = this.energy - this.idleEnergyReduceFactor;
        let newWater = this.water - this.idleWaterReduceFactor;

        if (newEnergy < 0) {
            newEnergy = 0;
        }

        if (newWater < 0) {
            newWater = 0;
        }

        // If player is lost all
        if (!newWater || !newEnergy) {
            game.currentScreen.gameBoardGrid.renderLostLife()
        }

        GameStore.changeStates(state, {
            ...state,
            player: {
                ...state.player,
                energy: newEnergy,
                water: newWater,
            }
        });


    }

    beHappy(val) {
        if (val) {
            this.class = this.class + ' happy'
        } else {
            this.class = this.BASE_CLASS
        }
    }
}
