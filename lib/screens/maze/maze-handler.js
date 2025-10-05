class MazeHandler {
    game = null;
    enemies = [];
    asciGrid = [];
    mapMatrix = null;
    mapGrid = [];

    player = [];
    boxPlaces = [];
    portalPlaces = [];

    levelMoves = 0;

    playerSpawnPoint = null;

    onLostLifeCallback = (avatar) => {
        console.log('Avatar who lost life', avatar);
    }

    onMazeComplete = (avatar) => {
        console.log('Maze completed', avatar);
    }

    onReadyCallback = (obj) => {
    }

    constructor(game) {
        this.game = game;
    }

    onReady(callback) {
        this.onReadyCallback = callback;
    }

    parseMap(layout) {
        const rows = layout.trim().split("\n"); // trim removes leading/trailing blank lines
        this.asciGrid = [];
        this.mapMatrix = new Map();

        for (let y = 0; y < rows.length; y++) {
            this.asciGrid[y] = []
            for (let x = 0; x < rows[y].length; x++) {
                // Read a charater from a map
                this.asciGrid[y][x] = rows[y][x];
            }
        }
        this.createMatrix(this.asciGrid);
    }

    createMatrix(asciGrid) {
        this.mapGrid = [];

        asciGrid.forEach((row, rowIndex) => {
            this.mapGrid[rowIndex] = [];

            row.forEach((cell, cellIndex) => {
                const gameItem = createGameItem(cell, this.game);
                gameItem.position.x = cellIndex;
                gameItem.position.y = rowIndex;

                if (gameItem instanceof EnemyItem) {
                    this.enemies.push(gameItem);
                }

                this.mapMatrix.set(rowIndex + '-' + cellIndex, gameItem);

                this.mapGrid[rowIndex][cellIndex] = gameItem
                if (gameItem instanceof PlayerItem) {
                    this.player = gameItem;
                    this.playerSpawnPoint = {
                        y: rowIndex,
                        x: cellIndex,
                    }
                }

                if (gameItem instanceof BoxPlaceItem) {
                    this.boxPlaces.push(gameItem);

                }

                if (gameItem instanceof PortalItem) {
                    this.portalPlaces.push(gameItem);
                }
            })
        });

        this.enemies.forEach(enemy => {
            this.player.addSubscriber(enemy);
        })

        this.onReadyCallback(this);
    }

    findRandomAvalableEmptyTile(item, maxX, maxY) {
        // 8 possible directions (dx, dy)
        const directions = [
            [-1, -1], [0, -1], [1, -1], // top-left, top, top-right
            [-1, 0], [1, 0], // left,       right
            [-1, 1], [0, 1], [1, 1]  // bottom-left, bottom, bottom-right
        ];

        const neighbors = [];

        for (const [dx, dy] of directions) {
            const nx = item.position.x + dx;
            const ny = item.position.y + dy;

            // Only keep neighbors inside grid bounds
            if (nx >= 0 && nx < maxX && ny >= 0 && ny < maxY) {
                neighbors.push(this.getItemOnPosition(ny, nx));
            }
        }

        return neighbors;
    }

    handleItemSwap(controller, controllerMethod, itemToMove, itemOnAway, nextPosY, nextPosX) {
        var emptyTile = new EmptyItem();
        emptyTile.position = {
            y: itemOnAway.position.y,
            x: itemOnAway.position.x,
        };


        if (this.isItemWithFootSteps(itemToMove)) {

            switch (itemToMove.orientation) {
                case 'up' :
                    emptyTile.class = 'footsteps-up';
                    break;
                case 'down' :
                    emptyTile.class = 'footsteps-down';
                    break;
                case 'left' :
                    emptyTile.class = 'footsteps-left';
                    break;
                case 'right' :
                    emptyTile.class = 'footsteps-right';
                    break;
            }

            setTimeout(() => {
                emptyTile.class = emptyTile.BASE_CLASS
            }, Math.random() * 1000)
        }


        if (itemToMove instanceof BoxItem) {
            itemToMove.completed(false);
        }

        let hasMoved = false;

        if (itemOnAway instanceof EmptyItem) {
            //this.swapItems(itemToMove, itemOnAway);
            this.mapGrid[itemToMove.position.y][itemToMove.position.x] = emptyTile;
            this.mapGrid[nextPosY][nextPosX] = itemToMove;
            itemToMove.position.y = nextPosY;
            itemToMove.position.x = nextPosX;
            hasMoved = true
        }

        if (itemOnAway instanceof BoxItem && !(itemToMove instanceof BoxItem)) {
            // Let see it item can be pushed
            hasMoved = this.pushItemInDirectionOfMovingItem(itemToMove, itemOnAway)
        }

        if (itemOnAway instanceof BoxPlaceItem) {
            // When box moves to Place where box should be moved
            if (itemToMove instanceof BoxItem) {
                this.mapGrid[itemToMove.position.y][itemToMove.position.x] = emptyTile;
                this.mapGrid[nextPosY][nextPosX] = itemToMove;
                itemToMove.position.y = nextPosY;
                itemToMove.position.x = nextPosX;
                itemToMove.completed(true);
                hasMoved = true
            }

            // When player moves to Place where box should be moved
            if (itemToMove instanceof PlayerItem || itemToMove instanceof EnemyItem) {
                this.mapGrid[itemToMove.position.y][itemToMove.position.x] = emptyTile;
                this.mapGrid[nextPosY][nextPosX] = itemToMove;
                itemToMove.position.y = nextPosY;
                itemToMove.position.x = nextPosX;
                hasMoved = true
            }
        }

        // Handling portal
        if (itemOnAway instanceof PortalItem) {
            let moveToNextPortal = this.portalPlaces.find((item) => {
                return item.id !== itemOnAway.id
            })

            const nextPosX = moveToNextPortal.position.x;
            const nextPosY = moveToNextPortal.position.y;

            if (this.mapGrid[nextPosY][nextPosX] instanceof BoxItem) {
                let boxItem = this.mapGrid[nextPosY][nextPosX];
                hasMoved = this.pushItemInDirectionOfMovingItem(itemToMove, boxItem);
            }

            // Current position should be replaced with empty tile...
            this.mapGrid[itemToMove.position.y][itemToMove.position.x] = emptyTile;

            this.mapGrid[nextPosY][nextPosX] = itemToMove;
            // new position of item is where position of portal is
            itemToMove.position.y = nextPosY;
            itemToMove.position.x = nextPosX;


            hasMoved = true
        }


        if (itemOnAway instanceof EnemyItem && itemToMove instanceof PlayerItem) {
            // Player bumps into Player
            this.mapGrid[nextPosY][nextPosX] = itemToMove;
            this.mapGrid[itemToMove.position.y][itemToMove.position.x] = emptyTile;


            //itemToMove.position.y = nextPosY;
            // itemToMove.position.x = nextPosX;

            this.renderLostLife(itemToMove)

            hasMoved = true
        }

        if (itemOnAway instanceof PlayerItem && itemToMove instanceof EnemyItem) {
            // Enemy bumps into enemy
            this.mapGrid[nextPosY][nextPosX] = itemOnAway;

            this.mapGrid[itemToMove.position.y][itemToMove.position.x] = emptyTile;

            this.renderLostLife(itemOnAway)

            hasMoved = true
        }

        if (itemOnAway instanceof EnemyItem && itemToMove instanceof BoxItem) {
            hasMoved = this.pushItemInDirectionOfMovingItem(itemToMove, itemOnAway);
        }

        if (itemToMove instanceof PlayerItem) {
            this.game.portalPlaces.forEach((portal) => {
                const portalX = portal.position.x;
                const portalY = portal.position.y

                if (this.mapGrid[portalY][portalX] instanceof EmptyItem) {
                    this.mapGrid[portalY][portalX] = portal
                }
            })
        }
        return hasMoved;
    }

    isItemWithFootSteps(item) {
        return item instanceof PlayerItem || item instanceof EnemyItem
    }

    getItemOnPosition(rowIndex, cellIndex) {
        if (this.mapGrid[rowIndex] && this.mapGrid[rowIndex][cellIndex]) {
            return this.mapGrid[rowIndex][cellIndex];
        }
    }

    renderLostLife(avatar) {
        this.onLostLifeCallback(avatar);
    }

    moveItemUp(item) {
        item.onMoveUp();
        const posX = item.position.x
        const posY = item.position.y
        let hasMoved = false;

        let nextPosY = posY - 1
        nextPosY = nextPosY < 0 ? this.mapGrid.length - 1 : nextPosY

        let possibleItem = this.getItemOnPosition(nextPosY, posX);
        hasMoved = this.handleItemSwap(this.game.controller, 'moveItemUp', item, possibleItem, nextPosY, posX);
        //  }

        if (hasMoved && item instanceof PlayerItem) {
            ++this.levelMoves;
        }
        return hasMoved
    }

    moveItemDown(item) {
        item.onMoveDown();
        const posX = item.position.x
        const posY = item.position.y
        let hasMoved = false;
        // if (posY != 0) {
        // What is above player?
        let nextPosY = posY + 1
        nextPosY = nextPosY > this.mapGrid.length - 1 ? 0 : nextPosY

        let possibleItem = this.getItemOnPosition(nextPosY, posX);
        hasMoved = this.handleItemSwap(this.game.controller, 'moveItemDown', item, possibleItem, nextPosY, posX);
        //  }

        if (hasMoved && item instanceof PlayerItem) {
            ++this.levelMoves;
        }
        return hasMoved;

    }

    moveItemLeft(item) {
        item.onMoveLeft();
        const posX = item.position.x
        const posY = item.position.y
        let hasMoved = false;
        // if (posX) {

        let nextPosX = posX - 1
        nextPosX = nextPosX < 0 ? this.mapGrid[posY].length - 1 : nextPosX

        let possibleItem = this.getItemOnPosition(posY, nextPosX)
        hasMoved = this.handleItemSwap(this.game.controller, 'moveItemLeft', item, possibleItem, posY, nextPosX);

        //  }
        if (hasMoved && item instanceof PlayerItem) {
            ++this.levelMoves;
        }
        return hasMoved;
    }

    moveItemRight(item) {
        item.onMoveRight();
        const posX = item.position.x
        const posY = item.position.y
        let hasMoved = false;


        let nextPosX = posX + 1
        nextPosX = nextPosX > this.mapGrid[posY].length - 1 ? 0 : nextPosX

        let possibleItem = this.getItemOnPosition(posY, nextPosX);
        hasMoved = this.handleItemSwap(this.game.controller, 'moveItemRight', item, possibleItem, posY, nextPosX);
        //   }
        if (hasMoved && item instanceof PlayerItem) {
            ++this.levelMoves;
        }
        return hasMoved;
    }

    hitItem(item) {
        let nextPosX;
        let nextPosY;
        let possibleItem;
        switch (item.orientation) {
            case "left":
                nextPosX = item.position.x - 1;
                possibleItem = this.getItemOnPosition(item.position.y, nextPosX);

                if (possibleItem instanceof BoxItem) {
                    this.moveItemLeft(possibleItem);
                }
                break
            case "right":
                nextPosX = item.position.x + 1;
                possibleItem = this.getItemOnPosition(item.position.y, nextPosX);
                if (possibleItem instanceof BoxItem) {
                    this.moveItemRight(possibleItem);
                }
                break
            case "up":
                nextPosY = item.position.y - 1;
                possibleItem = this.getItemOnPosition(nextPosY, item.position.x)
                if (possibleItem instanceof BoxItem) {
                    this.moveItemUp(possibleItem);
                }
                break
            case "down":
                nextPosY = item.position.y + 1;
                possibleItem = this.getItemOnPosition(nextPosY, item.position.x)
                if (possibleItem instanceof BoxItem) {
                    this.moveItemDown(possibleItem);
                }
                break
        }
    }

    swapItems(itemToMove, itemOnAway) {
        this.mapGrid[itemToMove.position.y][itemToMove.position.x] = itemOnAway;
        this.mapGrid[itemOnAway.position.y][itemOnAway.position.x] = itemToMove;
        const newItemToMovePosition = {
            y: itemOnAway.position.y,
            x: itemOnAway.position.x,
        }
        const newItemOnWayPosition = {
            y: itemToMove.position.y,
            x: itemToMove.position.x,
        }

        itemToMove.position = newItemToMovePosition;
        itemOnAway.position = newItemOnWayPosition;

        if (this.isItemWithFootSteps(itemToMove)) {

            switch (itemToMove.orientation) {
                case 'up' :
                    itemOnAway.class = 'footsteps-up';
                    break;
                case 'down' :
                    itemOnAway.class = 'footsteps-down';
                    break;
                case 'left' :
                    itemOnAway.class = 'footsteps-left';
                    break;
                case 'right' :
                    itemOnAway.class = 'footsteps-right';
                    break;
            }

            setTimeout(() => {
                itemOnAway.class = itemOnAway.BASE_CLASS
            }, Math.random() * 1000)
        }


        return true
    }

    pushItemInDirectionOfMovingItem(itemToMove, itemOnAway) {
        let hasMoved = false;
        if (itemToMove.orientation === 'right') {
            if (this.moveItemRight(itemOnAway)) {
                hasMoved = this.moveItemRight(itemToMove);
            }
        }
        if (itemToMove.orientation === 'left') {
            if (this.moveItemLeft(itemOnAway)) {
                hasMoved = this.moveItemLeft(itemToMove);
            }
        }
        if (itemToMove.orientation === 'up') {
            if (this.moveItemUp(itemOnAway)) {
                hasMoved = this.moveItemUp(itemToMove);
            }
        }
        if (itemToMove.orientation === 'down') {
            if (this.moveItemDown(itemOnAway)) {
                hasMoved = this.moveItemDown(itemToMove);
            }
        }

        return hasMoved
    }


    restart() {
        this.enemies = [];
        this.asciGrid = [];
        this.mapMatrix = null;
        this.mapGrid = [];

        this.player = [];
        this.boxPlaces = [];
        this.portalPlaces = [];

        this.levelMoves = 0;
    }


}
