
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
                this.moveItemUp(player)
                break;

            case 's':
                this.moveItemDown(player)
                break;

            case 'a':
                this.moveItemLeft(player)
                break;

            case 'd':
                this.moveItemRight(player)
                break;

        }

    }

    moveItemUp(item) {
        const posX = item.position.x
        const posY = item.position.y
        if(posY != 0) {
            ++this.game.levelMoves
            // What is above player?
            let nextPosY = posY -1
            let possibleItem = this.game.getItemOnPosition(nextPosY, posX);
            return this.game.handleItemSwap(this.game,this,'moveItemUp',item,possibleItem, nextPosY, posX);
        }
    }

    moveItemDown(item) {
        const posX = item.position.x
        const posY = item.position.y
        if(posY != 0) {
            ++this.game.levelMoves
            // What is above player?
            let nextPosY = posY + 1
            let possibleItem = this.game.getItemOnPosition(nextPosY, posX);
            return this.game.handleItemSwap(this.game, this, 'moveItemDown', item, possibleItem, nextPosY, posX);
        }

    }

    moveItemLeft(item) {
        const posX = item.position.x
        const posY = item.position.y

        if(posX) {

            let nextPos = posX- 1;
            let possibleItem = this.game.getItemOnPosition(posY, nextPos);
           // return this.game.handleItemSwap(this.game, this, 'moveItemLeft', item, possibleItem, nextPosY, nextPosX);

            let hasMoved = false;

            if(possibleItem instanceof EmptyItem) {
                ++this.game.levelMoves
                this.game.levelGrid[posY][posX] = new EmptyItem();
                this.game.levelGrid[posY][nextPos] = item;
                item.position.x =  nextPos;
                hasMoved = true
            }

            if(possibleItem instanceof MineItem  && !(item instanceof MineItem))  {

                hasMoved= this.moveItemLeft(possibleItem);
                    if(hasMoved){
                        ++this.game.levelMoves
                        this.game.levelGrid[posY][posX] = new EmptyItem();
                        this.game.levelGrid[posY][nextPos] = item;
                        item.position.x =  nextPos
                        hasMoved = true
                    }

            }

            if(possibleItem instanceof BoxPlaceItem)  {
                if(item instanceof MineItem)  {
                    ++this.game.levelMoves
                    this.game.levelGrid[posY][nextPos] =  item
                    item.position.x =  nextPos
                    hasMoved = true
                }
                if(item instanceof PlayerItem)  {
                    ++this.game.levelMoves
                    this.game.levelGrid[posY][posX] = new EmptyItem();
                    this.game.levelGrid[posY][nextPos] = item;
                    item.position.x =  nextPos
                    hasMoved = true
                }
            }

            return hasMoved;
        }

    }

    moveItemRight(item) {
        const posX = item.position.x
        const posY = item.position.y
        let hasMoved = false;

        if(posX) {
            let nextPos = posX + 1;
            let possibleItem = this.game.getItemOnPosition(posY, nextPos);
            if (possibleItem instanceof EmptyItem) {
                ++this.game.levelMoves
                this.game.levelGrid[posY][posX] = new EmptyItem();
                this.game.levelGrid[posY][nextPos] = item
                item.position.x =  nextPos
                return true
            }
            if (possibleItem instanceof MineItem  && !(item instanceof MineItem)) {

                const haseMoved  =  this.moveItemRight(possibleItem);
                if(haseMoved) {
                    ++this.game.levelMoves
                    this.game.levelGrid[posY][posX] = new EmptyItem();
                    this.game.levelGrid[posY][nextPos] =  item
                    item.position.x =  nextPos
                    return true
                }
            }

            if(possibleItem instanceof BoxPlaceItem)  {
                if(item instanceof MineItem)  {
                    ++this.game.levelMoves
                    this.game.levelGrid[posY][nextPos] =  item
                    item.position.x =  nextPos
                    hasMoved = true
                }
                if(item instanceof PlayerItem)  {
                    ++this.game.levelMoves
                    this.game.levelGrid[posY][posX] = new EmptyItem();
                    this.game.levelGrid[posY][nextPos] = item;
                    item.position.x =  nextPos
                    hasMoved = true
                }
            }

            return hasMoved;
        }
    }
}
