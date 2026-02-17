/**
 * @typedef {Object.<string, MazeItemParameters|MazeItemParameters[]>} MazeConfig
 */

class MazeItemParameters {

    /**
     *  @type
     */
    item;
    /**
     *  @type Object
     */
    parameters
}


class MazeConfigInterface {
    /**
     * @type MazeItemParameters
     */
    backgroundTile

    /**
     * PAth to music  for the background
     * @type string
     */
    backgroundMusic


    /**
     *
     * @type {Object.<string, MazeItemParameters|MazeItemParameters[]>}
     */
    items
}
