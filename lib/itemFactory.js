/**
 *
 * @param char {string}
 * @param game {Game}
 * @param y {number}
 * @param x {number}
 * @returns {BaseItem}
 */
function createGameItem(char, game, y, x) {
    let item;
    let config = window['level' + game.level + 'Config']
    const conf = getCharConfig(char, config);
    switch (char) {
        case '#' :
            item = new WallItem();
            break;
        case 'p' :
            item = new PlayerItem();

            break;

        case 'b' :
            item = new BoxItem();
            break;

        case 'e' :
        case 'E' :
        case 'S' :


            item = new EnemyItem(game);
            const configSpeed = getConfig(char, 'speed', config);
            const movementTypeSpeed = getConfig(char, 'movement', config);
            const movementList = getConfig(char, 'movements', config);
            item.speed = configSpeed ? configSpeed : item.speed
            item.moveType = movementTypeSpeed ? movementTypeSpeed : item.moveType;
            item.moveList = movementList;


            break;

        case 'l' :
            item = new BoxPlaceItem();
            break;

        case 'w' :
            item = new PortalItem();
            break;


        default:

            if (conf && conf.item) {
                let params = {};
                if (conf.parameters) {
                    params = conf.parameters
                }
                item = new conf.item(params);
                item.init();
            } else {
                item = new EmptyItem()
                break;
            }

    }

    item.position = {
        y, x
    }
    item.id = ++game.itemIds;
    return item;
}


function getConfig(char, key, config) {
    if (!config) {
        return null;
    }

    if (config()[char]) {
        if (config()[char][key]) {
            return config()[char][key];
        }
    }

    return null;
}

function getCharConfig(char, config) {
    if (!config) {
        return null;
    }

    if (config()[char]) {
        return config()[char]
    }

    return null;
}

