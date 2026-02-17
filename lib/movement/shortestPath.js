function moveToPlayer(avatar, controller) {
    if (avatar.currentPath.length === 0) {

        avatar.currentPath = shortestPath(avatar, controller, avatar.game.player, this.game.currentScreen.gameBoardGrid);
    }


    if (Math.floor(Math.random() * 10) > 7) {
        avatar.currentPath = shortestPath(avatar, controller, game.player, this.game.currentScreen.gameBoardGrid);
    }


    if (avatar.currentPath.length > 0) {

        let next = avatar.currentPath.shift();
        let hasMoved = false;

        if (next) {

            if (next[0] < avatar.position.y) {
                avatar.onMoveUp();
                hasMoved = controller.handleKeyPress('w', avatar);
            } else if (next[0] > avatar.position.y) {
                avatar.onMoveDown();
                hasMoved = controller.handleKeyPress('s', avatar);
            } else if (next[1] > avatar.position.x) {
                avatar.onMoveRight();
                hasMoved = controller.handleKeyPress('d', avatar);
            } else if (next[1] < avatar.position.x) {
                avatar.onMoveLeft();
                hasMoved = controller.handleKeyPress('a', avatar);
            }
        } else {
            avatar.currentPath = null;
            avatar.recalculateClosestPathToTarget();
        }

    } else {
        avatar.recalculateClosestPathToTarget();
    }
}

/**
 *
 * @param mapGrid GameBoardGrid
 * @param controller
 * @param avatar
 * @param target
 * @returns {*[]}
 */
function shortestPath(avatar, controller, target, mapGrid) {
    // Get tile matrix from grid
    console.log('mapGrid', mapGrid)
    if (!mapGrid) {
        return [];
    }
    let gridMatrix = this.levelGridToMatrix(mapGrid.mazeTiles)

    const path = findPath(gridMatrix, [avatar.position.y, avatar.position.x], [target.position.y, target.position.x]);

    return path;
}

/**
 *
 * @param mazeTiles {MazeTile[]}
 * @returns {*[]}
 */
function levelGridToMatrix(mazeTiles) {
    let gridMatrix = []

    mazeTiles.forEach((tile, index) => {

        let isBlocked = true
        tile.getAllItems().values().forEach(item => {
            let hasBlockables = item.isBlocker;
            if (hasBlockables) {
                isBlocked = true
            }
        })

        gridMatrix[index] = isBlocked
    })

    return gridMatrix
}

function findPath(grid, start, goal) {
    const directions = [
        [1, 0],  // down
        [-1, 0], // up
        [0, 1],  // right
        [0, -1]  // left
    ];

    const queue = [[...start]];
    const visited = new Set();
    const cameFrom = {};

    function key(y, x) {
        return `${y}-${x}`;
    }

    visited.add(key(...start));
    while (queue.length > 0) {
        const [y, x] = queue.shift();
        if (y === goal[0] && x === goal[1]) {
            // reconstruct path
            let path = [];
            let current = key(y, x);
            while (current !== key(...start)) {
                path.push(current.split("-").map(Number));
                current = cameFrom[current];
            }
            path.push(start);
            return path.reverse();
        }

        for (const [dy, dx] of directions) {
            const ny = y + dy;
            const nx = x + dx;

            if (
                grid[ny + '-' + nx] &&
                !visited.has(key(ny, nx))
            ) {
                visited.add(key(ny, nx));
                cameFrom[key(ny, nx)] = key(y, x);
                queue.push([ny, nx]);
            }
        }
    }

    return []; // no path found
}
