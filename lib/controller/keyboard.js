
 class KeyboardController {
    listening = false
    game = null;

    constructor(game) {
        this.game = game;
    }

    listen() {
        if(this.listening) {
            return
        }
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e.key);
        })
        this.listening =true;
    }

     stopListening() {
        document.removeEventListener('keydown', () => {
            this.handleKeyPress(e.key);
        })
     }

    handleKeyPress(key) {
        let player =  this.game.playerItem;

        switch(key) {
            case 'w':
            case 'ArrowUp':
                player.onMoveUp();
                this.moveItemUp(player)
                break;

            case 's':
            case 'ArrowDown':
                player.onMoveDown();
                this.moveItemDown(player)
                break;

            case 'a':
            case 'ArrowLeft':
                player.onMoveLeft();
                this.moveItemLeft(player)
                break;

            case 'd':
            case 'ArrowRight':
                player.onMoveRight();
                this.moveItemRight(player)
                break;

        }

    }

    moveItemUp(item) {
        const posX = item.position.x
        const posY = item.position.y
        let hasMoved = false;
        if(posY != 0) {
            // What is above player?
            let nextPosY = posY -1
            let possibleItem = this.game.getItemOnPosition(nextPosY, posX);
            hasMoved = this.game.handleItemSwap(this.game,this,'moveItemUp',item,possibleItem, nextPosY, posX);
        }

        if(hasMoved && item instanceof PlayerItem) {
            ++this.game.levelMoves;
        }
        return hasMoved
    }

    moveItemDown(item) {
        const posX = item.position.x
        const posY = item.position.y
        let hasMoved = false;
        if(posY != 0) {
            // What is above player?
            let nextPosY = posY + 1
            let possibleItem = this.game.getItemOnPosition(nextPosY, posX);
            hasMoved = this.game.handleItemSwap(this.game, this, 'moveItemDown', item, possibleItem, nextPosY, posX);
        }

        if(hasMoved && item instanceof PlayerItem) {
            ++this.game.levelMoves;
        }
        return hasMoved;

    }
     moveItemLeft(item){
         const posX = item.position.x
         const posY = item.position.y
         let hasMoved = false;
         if(posX) {

             let nextPosX = posX - 1;
             let possibleItem = this.game.getItemOnPosition(posY, nextPosX)
             hasMoved = this.game.handleItemSwap(this.game, this, 'moveItemLeft', item, possibleItem, posY, nextPosX);

         }
         if(hasMoved && item instanceof PlayerItem) {
             ++this.game.levelMoves;
         }
         return hasMoved;
     }

     moveItemRight(item) {
         const posX = item.position.x
         const posY = item.position.y
         let hasMoved = false;
         if (posX) {
             let nextPosX = posX + 1;
             let possibleItem = this.game.getItemOnPosition(posY, nextPosX);
             hasMoved = this.game.handleItemSwap(this.game, this, 'moveItemRight', item, possibleItem, posY, nextPosX);
         }
         if(hasMoved && item instanceof PlayerItem) {
             ++this.game.levelMoves;
         }
         return hasMoved;
     }

}
