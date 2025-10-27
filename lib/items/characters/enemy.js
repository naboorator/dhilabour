class EnemyItem extends AIMovementCharacter {
    BASE_CLASS = 'golem-tile';

    class = this.BASE_CLASS;


    abilities = [ItemAbilities.LivesFootsteps]

    notify(data) {
        this.lastMove = data;
    }

    update() {
        this.handleAiMovements();
    }

}





