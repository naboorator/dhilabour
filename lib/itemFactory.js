function createGameItem(char, game) {
    let item = 'space';
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
            switch (char) {
                case 'e' :
                    item.moveType = 'random';
                    break;
                case 'E' :
                    item.moveType = 'attackPlayer';
                    break
                case 'S' :
                    item.moveType = 'shortestPath';
                    item.speed = 20;
                    break
            }

            break;

        case 'l' :
            item = new BoxPlaceItem();
            break;

        case 'w' :
            item = new PortalItem();
            break;

        default:
            item = new EmptyItem()
            break;

    }

    item.id = ++game.itemIds;
    return item;
}
