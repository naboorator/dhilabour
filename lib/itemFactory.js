/**
 *
 * @param char {string}
 * @param config {MazeConfig}
 * @param y {number}
 * @param x {number}
 * @returns {BaseItem}
 */
function createGameItem(char, config, y, x) {
    let item;
    const conf = getCharConfig(char, config);
    switch (char) {
        case '#' :
            item = new WallItem({});
            break;
        case 'p' :
            item = new PlayerItem({});

            break;

        case 'b' :
            item = new BoxItem({});
            break;

        case 'e' :
        case 'E' :
        case 'S' :


            // item = new EnemyItem(game);
            // const configSpeed = getConfig(char, 'speed', config);
            // const movementTypeSpeed = getConfig(char, 'movement', config);
            // const movementList = getConfig(char, 'movements', config);
            // item.speed = configSpeed ? configSpeed : item.speed
            // item.moveType = movementTypeSpeed ? movementTypeSpeed : item.moveType;
            // item.moveList = movementList;


            break;

        case 'l' :
            item = new BoxPlaceItem({});
            break;

        case 'w' :
            item = new PortalItem({});
            break;


        default:

            if (conf && conf.item) {
                let params = {};
                if (conf.parameters) {
                    params = conf.parameters
                }
                item = new conf.item(params, y, x);
                item.init();
            } else {
                item = new EmptyItem({})
                break;
            }

    }

    item.tileChar = char;
    item.position = {
        y, x
    }

    return item;
}


function getConfig(char, key, config) {
    if (!config) {
        return null;
    }

    if (config[char]) {
        if (config[char][key]) {
            return config[char][key];
        }
    }

    return null;
}

function getCharConfig(char, config) {
    if (!config) {
        return null;
    }

    if (config[char]) {
        return config[char]
    }

    return null;
}

function generateGameItemsByConfig(char, config, y, x) {
    const charConfig = getCharConfig(char, config);
    let items = [];
    if (charConfig) {
        if (Array.isArray(charConfig)) {
            charConfig.forEach((itemConfig) => {
                items.push(createItemFromConfig(char, itemConfig, y, x));
            })
        } else {
            items.push(createItemFromConfig(char, charConfig, y, x));
        }
    } else {
        items.push(createGameItem(char, config, y, x))
    }

    return items;
}

function createItemFromConfig(char, config, y, x) {
    let item;

    if (config.item) {
        let itemParameters = {};
        if (config.parameters) {
            itemParameters = config.parameters
        }
        item = new config.item(itemParameters, y, x);
        item.tileChar = char;
        item.position = {
            y, x
        }
        item.init();
        // item.id = ++game.itemIds;
    }

    // if (!item) {
    //     item = createGameItem(char, config, y, x);
    // }


    return item;
}

