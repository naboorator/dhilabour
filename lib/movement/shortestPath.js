function shortestPath(mapGrid, controller, avatar, target) {
    // Get tile matrix from grid
    let gridMatrix = this.levelGridToMatrix(mapGrid)
    return findPath(gridMatrix, [avatar.position.y, avatar.position.x], [target.position.y, target.position.x]);
}

function levelGridToMatrix(levelGrid) {
    let gridMatrix = []
    levelGrid.forEach((yItem, y) => {
        yItem.forEach((xItem, x) => {
            if ((xItem instanceof WallItem) || (xItem instanceof BoxItem)) {
                gridMatrix[y + '-' + x] = false
            } else {
                gridMatrix[y + '-' + x] = true
            }
        })

    });

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

    return null; // no path found
}
