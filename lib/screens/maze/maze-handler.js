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
        var replaceTile = new EmptyItem();
        replaceTile.position = {
            y: itemOnAway.position.y,
            x: itemOnAway.position.x,
        };

        switch (controllerMethod) {
            case 'moveItemUp' :
                replaceTile.class = 'footsteps-up';
                break;
            case 'moveItemDown' :
                replaceTile.class = 'footsteps-down';
                break;
            case 'moveItemLeft' :
                replaceTile.class = 'footsteps-left';
                break;
            case 'moveItemRight' :
                replaceTile.class = 'footsteps-right';
                break;
        }

        setTimeout(() => {
            replaceTile.class = replaceTile.BASE_CLASS
        }, Math.random() * 1000)

        if (itemToMove instanceof BoxItem) {
            itemToMove.completed(false);
        }

        let hasMoved = false;


        if (itemOnAway instanceof EmptyItem) {
            this.mapGrid[itemToMove.position.y][itemToMove.position.x] = replaceTile;
            this.mapGrid[nextPosY][nextPosX] = itemToMove;
            itemToMove.position.y = nextPosY;
            itemToMove.position.x = nextPosX;
            hasMoved = true
        }

        if (itemOnAway instanceof BoxItem && !(itemToMove instanceof BoxItem)) {
            // Let see it item can be pushed
            const moved = this[controllerMethod](itemOnAway);
            if (moved) {
                this.mapGrid[itemToMove.position.y][itemToMove.position.x] = replaceTile;
                this.mapGrid[nextPosY][nextPosX] = itemToMove;

                itemToMove.position.y = nextPosY;
                itemToMove.position.x = nextPosX;
                hasMoved = true
            }
        }

        if (itemOnAway instanceof BoxPlaceItem) {
            // When box moves to Place where box should be moved
            if (itemToMove instanceof BoxItem) {
                this.mapGrid[itemToMove.position.y][itemToMove.position.x] = replaceTile;
                this.mapGrid[nextPosY][nextPosX] = itemToMove;
                itemToMove.position.y = nextPosY;
                itemToMove.position.x = nextPosX;
                itemToMove.completed(true);
                hasMoved = true
            }

            // When player moves to Place where box should be moved
            if (itemToMove instanceof PlayerItem || itemToMove instanceof EnemyItem) {
                this.mapGrid[itemToMove.position.y][itemToMove.position.x] = replaceTile;
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
                const tilesAround = this.findRandomAvalableEmptyTile(boxItem, this.mapGrid[0].length, this.mapGrid.length);
                const availableEmptyTiles = tilesAround.filter(item => item instanceof EmptyItem);
                const item = this.getRandomItem(availableEmptyTiles);
                // here  boxItem will be moved
                this.mapGrid[item.position.y][item.position.x] = boxItem;
                boxItem.position.y = item.position.y;
                boxItem.position.x = item.position.x;
            }

            // Current position should be replaced with empty tile...
            this.mapGrid[itemToMove.position.y][itemToMove.position.x] = replaceTile;

            this.mapGrid[nextPosY][nextPosX] = itemToMove;
            // new position of item is where position of portal is
            itemToMove.position.y = nextPosY;
            itemToMove.position.x = nextPosX;


            hasMoved = true
        }


        if (itemOnAway instanceof EnemyItem && itemToMove instanceof PlayerItem) {
            // Enemy bumps into Player
            this.mapGrid[itemToMove.position.y][itemToMove.position.x] = replaceTile;

            this.mapGrid[nextPosY][nextPosX] = itemToMove;


            itemToMove.position.y = nextPosY;
            itemToMove.position.x = nextPosX;

            this.renderLostLife(itemToMove)

            hasMoved = true
        }

        if (itemOnAway instanceof PlayerItem && itemToMove instanceof EnemyItem) {
            // Player bumps into enemy
            this.mapGrid[nextPosY][nextPosX] = itemOnAway;

            this.mapGrid[itemToMove.position.y][itemToMove.position.x] = replaceTile;

            this.renderLostLife(itemOnAway)

            hasMoved = true
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

    getItemOnPosition(rowIndex, cellIndex) {
        if (this.mapGrid[rowIndex] && this.mapGrid[rowIndex][cellIndex]) {
            return this.mapGrid[rowIndex][cellIndex];
        }
    }

    renderLostLife(avatar) {
        this.onLostLifeCallback(avatar);
    }

    getRandomItem(arr) {
        if (arr.length === 0) return null; // handle empty array
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }


    moveItemUp(item) {
        item.onMoveUp();
        const posX = item.position.x
        const posY = item.position.y
        let hasMoved = false;
        if (posY != 0) {
            // What is above player?
            let nextPosY = posY - 1
            let possibleItem = this.getItemOnPosition(nextPosY, posX);
            hasMoved = this.handleItemSwap(this.game.controller, 'moveItemUp', item, possibleItem, nextPosY, posX);
        }

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
        if (posY != 0) {
            // What is above player?
            let nextPosY = posY + 1
            let possibleItem = this.getItemOnPosition(nextPosY, posX);
            hasMoved = this.handleItemSwap(this.game.controller, 'moveItemDown', item, possibleItem, nextPosY, posX);
        }

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
        if (posX) {

            let nextPosX = posX - 1;
            let possibleItem = this.getItemOnPosition(posY, nextPosX)
            hasMoved = this.handleItemSwap(this.game.controller, 'moveItemLeft', item, possibleItem, posY, nextPosX);

        }
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
        if (posX) {
            let nextPosX = posX + 1;
            let possibleItem = this.getItemOnPosition(posY, nextPosX);
            hasMoved = this.handleItemSwap(this.game.controller, 'moveItemRight', item, possibleItem, posY, nextPosX);
        }
        if (hasMoved && item instanceof PlayerItem) {
            ++this.levelMoves;
        }
        return hasMoved;
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
