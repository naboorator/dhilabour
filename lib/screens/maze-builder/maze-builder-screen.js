class MazeBuilderScreen extends BaseScreen {
    /**
     *
     * @type {string}
     */
    name = 'maze-builder-screen';

    /**
     *
     * @type {GameEffects}
     */
    effects = new GameEffects();


    /**
     *
     * @type {GameBoardGrid}
     */
    gameBoardGrid = null;

    /**
     *
     * @type {boolean}
     */
    mazeLoaded = false;

    /**
     *
     * @type {KeyboardController}
     */
    controller = null;


    /**
     *
     * @type {number}
     */
    levelMoves = 0;

    /**
     *
     * @type {string}
     */
    mazeOutput = '';

    /**
     *
     * @type {string}
     */
    htmlLoading = 'Loading level...'

    /**
     *
     * @type {string}
     */
    html = `
<style>  
    .maze-builder-screen {
        width: auto;
        margin: 0 auto;
      
    }
    
    .maze-grid {
         overflow: scroll;
         height:500px
    }
    
    .toolbars {
    text-align: left;
        background: grey;
        padding: 10px;
    }
    
    .sidebar-section {
       padding:5px;
       border-bottom: 1px solid white;
       padding-bottom: 10px;
    }
    .sidebar-section-content {
        
    }
    
     .sidebar-section h2{
       font-size: 14px;
        text-align: left;
       color: white;
       border-bottom: 1px solid white;
       padding-bottom: 10px;
 
    }
    
    
    .tile-select {
        position: relative;
        max-height: 18px;
     
        background: white;
        padding: 2px;
        border:1px solid black;
        overflow: hidden;
    }    
    .tile-select:hover {
    overflow: visible;
    }   

    .tile-select:hover .tile-select-options {
        position:absolute;
        left:0;
        padding: 5px;
        max-height: 200px;
        background: white;
        width:100%;
        overflow: scroll;
     
    }
    
     .tile-select:hover .tile-select-option{
        border-bottom: 1px solid black;
        padding-bottom: 2px;
        margin-bottom: 5px;
    }


  
</style>
    <div class="maze-builder-screen">
        <div style="display: flex; align-content: flex-end;  justify-content: start;">
            <div style="width: 15%; text-align:center">
                <div class="sidebar-section">
                <h2>Maze screen</h2>
                <div class="sidebar-section-content">
                <div style="display:flex"> 
                    <label>
                     Num rows
                       <input id="sizeY" 
                       type="number"  
                       aria-label="Maze-y-cells"
                       maxlength="4"
                       size="4" 
                       value="{{mazeTilesX}}" 
                       style="width:50px"
                       />
                    </label>
               
                    <label>
                        Num lines
                        <input id="sizeX"
                            type="number"
                            aria-label="Maze-x-cells"  
                            maxlength="4"
                            size="4"
                            value="{{mazeTilesY}}"
                             style="width:50px"
                        /> 
                    </label>
                
                  
                    <button type="submit" onclick="setMazeSize()">Set</button>  
                    </div>            
                </div>
                </div>
                
                 @if(numberOfSelectedTiles === 1)
                 <div class="sidebar-section">
                    <h2>Selected tile</h2>
                    <div class="sidebar-section-content"> 
                        <div class="tile-select" >
                         Apply tile
                        <div class="tile-select-options">
                          @foreach(availableTiles as tile)
                            <div class="tile-select-option" style="display: flex;" onclick="changeTile({{tile.id}})">
                             
                                @if(tile.image) 
                                <img src="{{tile.image}}" width="20" height="20" />
                                @endIf
                                
                                @if(!tile.image) 
                                    <img src="/" width="20" height="20" />
                                @endIf
                                <div> - {{tile.name}} </div>
                              
                           </div>
                           @endForeach
                        </div>
                        
                        </div>
                     </div> 
                     
                      @foreach(selectedTiles as tile)
                      <div>{{tile.id}}</div>
                      @endForeach        
                 </div>
                 @endIf
                 
               
            </div>  
           
           <div style="width: 100%">
                 <div class="toolbars">
                        <button onclick="selectAll()">Select all</button>
                    @if(numberOfSelectedTiles > 0)
                        <button onclick="invertSelection()">Select invert</button>
                        <button onclick="deselectAll()">Deselect  all</button>
                    @endIf
                 </div>
                 <div class="maze-grid" style=" position:relative; text-align: center">{{mazeTiles}}</div>
           </div>
          
           <div style="width: 15%"> 
              
                <div>
                    Total tiles: {{mazeTilesSize}}
                    @if(numberOfSelectedTiles > 0)
                        Selected tiles:  {{numberOfSelectedTiles}}
                    @endIf
                </div>
               
            </div>
          
    </div>
    
    `;

    mazeBoundaries = {
        y: 0,
        x: 0
    }

    mazeBoundariesSet = false;

    renderedHtml = '';

    tplVars = {
        mazeTilesX: 0,
        mazeTilesY: 0,
        mazeTiles: [],
        numberOfSelectedTiles: 0,
        mazeTilesSize: 0,
        availableTiles: [
            {
                id: 1,
                name: 'Empty',
                image: this.getTileImage(1)
            },
            {
                id: 2,
                name: 'Wall',
                image: this.getTileImage(2)
            },
            {
                id: 3,
                name: 'Grass floor',
                image: this.getTileImage(3)
            }
        ],
        selectedTiles: []

    }

    /**
     *
     * @type {Map<string,MazeTile>}
     */
    mazeTiles = null;


    /**
     *
     * @type {Map<string,boolean>}
     */
    selectedTiles = new Map();

    templateParser = new TemplateParser();

    constructor(game) {
        super(game);
        window.setMazeSize = this.setMazeSize.bind(this);
        window.toggleTileSelection = this.toggleTileSelection.bind(this);
        window.invertSelection = this.invertSelection.bind(this);
        window.changeTile = this.changeTile.bind(this);
        window.deselectAll = this.deselectAll.bind(this);
        window.selectAll = this.selectAll.bind(this);
        window.getTileImage = this.getTileImage.bind(this);
    }

    destroy() {
        this.stopListenToController();
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
        }
    }

    render() {
        if (!this.mazeBoundariesSet) {
            this._initMaze(10, 10)
            this.mazeBoundariesSet = true
        } else {
            if (this.updateScreen) {
                this.tplVars.mazeTilesX = this.mazeBoundaries.x;
                this.tplVars.mazeTilesY = this.mazeBoundaries.y;

                this.tplVars.mazeTiles = this.getMazeTilesHtml(this.mazeTiles);
                this.tplVars.numberOfSelectedTiles = this.selectedTiles.size;
                this.tplVars.selectedTiles = this.getSelectedTiles()
                this.tplVars.mazeTilesSize = this.mazeTiles?.size ?? 0;
                this.tplVars.selectedTiles = this.mazeTiles?.size ?? 0;

                let tpl = this.html;

                tpl = this.templateParser.parse(tpl, this.tplVars);


                console.log(tpl);
                this.renderedHtml = tpl;

                this.updateScreen = false
            } else {
                return this.renderedHtml
            }
        }

        return this.renderedHtml;
    }

    getSelectedTiles() {

        let tmp = [];
        this.selectedTiles.forEach((tile, index) => {
            const existTile = this.mazeTiles.has(index);
            if (existTile) {
                tmp.push(this.mazeTiles.get(index));
            }
        })

        return tmp;
    }

    getMazeTilesHtml(mazeTiles) {
        let html = '';
        if (mazeTiles) {
            mazeTiles.forEach(mazeTile => {
                html += this.createHtmlTile(mazeTile)
            })
        }

        return html;
    }

    toggleTileSelection(tileKey) {
        if (this.selectedTiles.has(tileKey)) {
            this.selectedTiles.delete(tileKey);
        } else {
            this.selectedTiles.set(tileKey, true);
        }
        this.updateScreen = true;
    }

    _getTileById(id) {
        /**
         * @type BaseItem
         */
        let tileType;

        switch (Number(id)) {
            case 1:
                tileType = new EmptyItem({})
                break;
            case 2:
                tileType = new WallItem({});
                break;
            case 3:
                tileType = new GrassItem({});
                break;
            default:
        }

        return tileType;
    }

    changeTile(selected) {
        let tileType = this._getTileById(selected);

        this.selectedTiles.forEach((tile, index) => {
            tileType.init();
            if (this.mazeTiles.has(index)) {
                const currentTile = this.mazeTiles.get(index);
                if (currentTile.getAllItems().size > 0) {
                    // if (confirm("Tile %s already has items on it clear those?", index)) {
                    currentTile.clearTile();
                    currentTile.addItem(tileType);
                    //}
                } else {
                    currentTile.addItem(tileType);
                }


            }

        })


        this.updateScreen = true;

    }

    deselectAll() {
        this.selectedTiles.clear();
        this.updateScreen = true;
    }

    selectAll() {
        let newSelection = new Map();
        this.mazeTiles.forEach(tile => {
            newSelection.set(getGridKey(tile.y, tile.x), true)
        })

        this.selectedTiles = newSelection;
        this.updateScreen = true;
    }

    getTileImage(tileId) {
        const mazeTile = this._getTileById(tileId)
        return mazeTile.getSprite()?.image();
    }

    invertSelection() {
        let newSelection = new Map();
        this.mazeTiles.forEach(tile => {
            const key = getGridKey(tile.y, tile.x);
            if (!this.selectedTiles.has(key)) {
                newSelection.set(key, tile)
            }

        })

        this.selectedTiles = newSelection;
        this.updateScreen = true;
    }

    createHtmlTile(mazeTile) {
        let style = [
            'position: absolute',
            'left: ' + mazeTile.x * TileSize + 'px',
            'top: ' + mazeTile.y * TileSize + 'px',
            'background: white',
            'vertical-align: center'
        ]

        if (this.selectedTiles.has(getGridKey(mazeTile.y, mazeTile.x))) {
            const borderThicknes = 1;
            style.push('border: ' + borderThicknes + 'px dashed orange')
            style.push('height: ' + (TileSize - borderThicknes * 2) + 'px')
            style.push('width: ' + (TileSize - borderThicknes * 2) + 'px')
        } else {
            style.push('height: ' + (TileSize) + 'px')
            style.push('width: ' + (TileSize) + 'px')
        }
        const bgItem = mazeTile.getBackgroundItem();
        let html = '<div onclick="toggleTileSelection(`' + getGridKey(mazeTile.y, mazeTile.x) + '`)" class="cell-wrapper" style="' + style.join(';') + '"  title="' + getGridKey(mazeTile.y, mazeTile.x) + '">';

        if (bgItem) {
            bgItem.setVisible(true);
            html += this.game.renderer.addGameItem(bgItem).outerHTML
        }

        mazeTile.getAllItems().forEach(item => {
            item.setVisible(true);
            html += this.game.renderer.addGameItem(item).outerHTML
        });
        html += getGridKey(mazeTile.y, mazeTile.x)
        html += '</div>';

        return html;
    }

    handleUserInput(key, avatar) {
        return mazeHandleKeyPress(key, this.game.controller, avatar, this.gameBoardGrid)
    }

    setMazeSize() {
        const sizeX = parseInt(document.getElementById('sizeX').value, 10);
        const sizeY = parseInt(document.getElementById('sizeY').value, 10);

        this._initMaze(sizeY, sizeX);

        // flag for rerender
        this.updateScreen = true;
    }

    _initMaze(sizeY, sizeX) {
        if (this.mazeTiles) {
            if (confirm('Are you sure you want to reset current tiles?')) {

                this.mazeBoundaries.x = sizeX;
                this.mazeBoundaries.y = sizeY;

                this.createMazeGrid(this.mazeBoundaries.y, this.mazeBoundaries.x);
            } else {
                alert('aborted')
            }
        } else {

            this.mazeBoundaries.x = sizeX;
            this.mazeBoundaries.y = sizeY;

            this.createMazeGrid(this.mazeBoundaries.y, this.mazeBoundaries.x);
        }

    }

    createMazeGrid(y, x) {
        let tmp = []

        for (let i = 0; i < y; i++) {
            tmp[i] = [];
            for (let j = 0; j < x; j++) {
                tmp[i].push([]);
            }
        }

        let mazeTiles = new Map();
        tmp.forEach((row, y) => {
            row.forEach((tile, x) => {
                const mazeTile = new MazeTile(y, x)
                mazeTiles.set(getGridKey(y, x), mazeTile);
            })
        })
        this.mazeTiles = mazeTiles;
    }


    onFocus() {
        this.game.pause = false;
        if (this.gameBoardGrid) {
            this.game.controller.setAvatar(this.game.player);
        }

        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
        }

    }


}
