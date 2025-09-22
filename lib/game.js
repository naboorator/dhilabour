var GAME_INSTANCE = null;

class Game {
    refId = '';

    renderer = null;

    levelList = new Map();
    level = 1;
    levelLoaded = false
    levelGrid = [];
    levelMoves = 0;
    levelGoals = [];
    boxPlaces = []


    /*
    * @var  PlayerItem
     */
    playerItem;

    frame = 0

    pause = false;

    totalScore =0;

    controller = (game) => {
        return new KeyboardController(game);

    }

    constructor(renderId) {
        GAME_INSTANCE = this;
        this.refId = renderId;
        this.renderer = new RenderHtml(this);

        this.levelList.set(1, level1)
        this.levelList.set(2, level2)
        this.levelList.set(3, level3)
        this.levelList.set(4, level4)
        this.levelList.set(5, level5)
        this.levelList.set(6, level6)
        this.levelList.set(7, level7)
        this.levelList.set(8, level8)
        this.levelList.set(9, level9)
        this.levelList.set(10, level10)
        this.levelList.set(11, level11)
        this.levelList.set(12, level12)
        this.levelList.set(13, level13)
        this.levelList.set(14, level14)
        this.levelList.set(15, level15)
        this.levelList.set(16, level16)
        this.levelList.set(17, level17)
        this.levelList.set(18, level18)
        this.levelList.set(19, level19)
        this.levelList.set(20, level20)

        if (!this.renderer) {
            alert('No Screen element found!')
        } else {
            this.listenToController();
            this.mainLoop()
        }

    }

    listenToController() {
        document.addEventListener('DOMContentLoaded', () => {
            this.controller(this).listen()
        })

    }

    stopListenToController() {
        this.controller(this).stopListening()
    }



    mainLoop() {
        var game = GAME_INSTANCE;
        if(!game.pause) {
            game.renderScoreScreen();
            game.processLevel(game, game.level);
            game.chekBoxPlaces();
        }

        ++game.frame
        requestAnimationFrame(game.mainLoop)
    }


    renderScoreScreen() {

    }

    processLevel(game, level) {
        if (!game.levelLoaded) {
            game.parseLevel(game,level);
        } else {

            this.renderer.render()
        }
    }

    chekBoxPlaces() {
        this.boxPlaces.forEach((boxPlace) => {
            let item = this.getItemOnPosition(boxPlace.position.y, boxPlace.position.x);
            if(item instanceof EmptyItem) {
                this.levelGrid[boxPlace.position.y][boxPlace.position.x] = new BoxPlaceItem();
            }

            if(item instanceof BoxItem) {
                boxPlace.complited = true
            } else {
                boxPlace.complited = false
            }
        })

        let totalCompleted =  this.boxPlaces.filter(item => item.complited).length;

        this.renderer.updateCompleted(totalCompleted);

        if(totalCompleted === this.boxPlaces.length) {
            this.renderer.showCompleted('Completed, going into next puzzle.');
            this.pause = true;

            this.totalScore =  this.totalScore + this.boxPlaces.length * 10;
            this.renderer.updateScore(this.totalScore);
            setTimeout(() => {
                this.levelLoaded = false
                this.levelMoves = 0;
                this.level = this.level + 1;
                this.pause = false
            },3000)
        }

    }

    parseLevel(game, level) {
        const levelAsMap = game.levelList.get(level);
        let char = 0;
        const rows = levelAsMap.trim().split("\n"); // trim removes leading/trailing blank lines
        let grid = [];

        for (let y = 0; y < rows.length; y++) {
            grid[y] = []
            for (let x = 0; x < rows[y].length; x++) {
                const char = rows[y][x];
                grid[y][x] = char;
            }
        }

        game.renderer.showCompleted('');
        game.renderer.updateCompleted(0);
        game.renderer.updateLevel(game.level);
        game.boxPlaces = [];
        game.levelGrid = [];
        game.itemsMap = new Map();
        grid.forEach((row, rowIndex) => {
            this.levelGrid[rowIndex] = [];
            row.forEach(( cell, cellIndex ) => {
                const item = game.toMapObject(cell);
                item.position.x = cellIndex;
                item.position.y = rowIndex;
                game.itemsMap.set(rowIndex + '-' + cellIndex, item);
                this.levelGrid[rowIndex][cellIndex] = item
                if(item instanceof  PlayerItem) {
                    this.playerItem = item;
                }

                if(item instanceof  BoxPlaceItem) {
                    item.position.x  = cellIndex;
                    item.position.y  = rowIndex;
                    this.boxPlaces.push(item);

                }
            })
        })
        game.levelLoaded = true
    }

    toMapObject(char) {
        let item = 'space';
        switch(char) {
            case '#' :
                item = new WallItem();

                break;
            case 'p' :
                item = new PlayerItem();

                break;

            case 'b' :
                item = new BoxItem();
                break;

            case 'l' :
                item = new BoxPlaceItem();
                break;

            default:
                item = new EmptyItem()
                break;

        }

        return item;
    }


    getItemOnPosition(rowIndex, cellIndex) {
        if(GAME_INSTANCE.levelGrid[rowIndex] && GAME_INSTANCE.levelGrid[rowIndex][cellIndex]) {
            return GAME_INSTANCE.levelGrid[rowIndex][cellIndex];
        }
    }

    restartLevel(){
        this.levelLoaded = false;
    }

    handleItemSwap(game,controller, controllerMethod, itemToMove, itemOnAway, nextPosY, nextPosX) {
        var replaceTile = new EmptyItem();
        replaceTile.position = {
            y:  itemOnAway.position.y,
            x:  itemOnAway.position.x,
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
            replaceTile.class =''
        },Math.random() * 1000)

        if(itemToMove instanceof BoxItem) {
            itemToMove.completed(false);
        }

        let hasMoved = false;

        if(itemOnAway instanceof EmptyItem) {
            game.levelGrid[itemToMove.position.y][itemToMove.position.x] = replaceTile;
            game.levelGrid[nextPosY][nextPosX] = itemToMove;
            itemToMove.position.y = nextPosY;
            itemToMove.position.x = nextPosX;
            hasMoved = true
        }

        if(itemOnAway instanceof BoxItem &&  !(itemToMove instanceof BoxItem)) {
                // Let see it item can be pushed
                const moved = controller[controllerMethod](itemOnAway);
                if(moved) {
                    game.levelGrid[itemToMove.position.y][itemToMove.position.x] = replaceTile;
                    game.levelGrid[nextPosY][nextPosX] = itemToMove;
                    itemToMove.position.y = nextPosY;
                    itemToMove.position.x = nextPosX;
                    hasMoved = true
                }
        }

        if(itemOnAway instanceof BoxPlaceItem)  {
            // When Bos moves to Place where box should be moved
            if(itemToMove instanceof BoxItem)  {
                game.levelGrid[itemToMove.position.y][itemToMove.position.x] = replaceTile;
                game.levelGrid[nextPosY][nextPosX] = itemToMove;
                itemToMove.position.y = nextPosY;
                itemToMove.position.x = nextPosX;
                itemToMove.completed(true);
                hasMoved = true
            }

            // When player moves to Place where box should be moved
            if(itemToMove instanceof PlayerItem)  {
                game.levelGrid[itemToMove.position.y][itemToMove.position.x] = replaceTile;
                game.levelGrid[nextPosY][nextPosX] = itemToMove;
                itemToMove.position.y = nextPosY;
                itemToMove.position.x = nextPosX;
                hasMoved = true
            }
        }

        return hasMoved;
    }
}

