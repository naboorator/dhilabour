class MenuScreen extends BaseScreen {
    name = 'intro-screen';

    html = `
           <style>                   
                   .menu-screen {
                        position: relative;
                        display: inline-block;
                        width:100%;
                        height:100%;
                        min-heightL 100% !important; 
                        margin:auto auto;
                        background: #0e1b2e url('../../assets/images/bg-intro.png') no-repeat center center;
                        border:1px solid red;
                       
                   }
                   .menu {
                       margin-top: 300px;
                        color: var(--header-text-color) 
                   }
                   
                    .selected {
                    color: var(--secndary-color )
                   }
                   .btn {
                     margin-bottom: 10px;
                     font-size: 24px;
                   }
            </style>
          <div class="menu-screen">
                <div class="menu">
                  {{menuList}}
                </div>
          </div>
`
    menuItems = [
        {
            id: 'menu_start_game',
            action: startGame,
            label: 'Start Game',
            selected: false
        },
        {
            id: 'menu_settings',
            action: instructions,
            label: 'Instructions',
            selected: false
        },
        {
            id: 'menu_credits',
            action: showCredits,
            label: 'Credits',
            selected: false
        }
    ]


    constructor(game) {
        super(game);
        this.game.controller.setGameScreen(this);
    }

    render() {
        if (this.updateScreen) {
            this.updateScreen = false;
            return this.html.replaceAll('{{menuList}}', this.menuListHtml(this.menuItems));
        }
    }

    menuListHtml() {
        let html = '';
        const menuHtml = '<div id="{{id}}" class="btn {{selected}}" onclick="{{action}}()">{{label}}</div>';
        this.menuItems.forEach((item) => {
            html += menuHtml
                .replaceAll('{{id}}', item.id)
                .replaceAll('{{action}}', item.action.name)
                .replaceAll('{{label}}', item.label)
                .replaceAll('{{selected}}', item.selected ? 'selected' : '');

        });
        return html
    }


    handleUserInput(key, avatar) {
        this.menuItems = menuScreenInputHandler(key, this.menuItems);
        this.updateScreen = true
    }
}

function startGame() {
    new Sound('assets/sounds/menu_click.flac').play()
    game.setGameScreen(new MazeScreen(game, 'p'))
}

function instructions() {
    new Sound('assets/sounds/menu_click.flac').play()
    game.setGameScreen(new InstructionsScreen(game))
}

function showCredits() {
    new Sound('assets/sounds/menu_click.flac').play()
    game.setGameScreen(new CreditsScreen(game))
}

function menuScreenInputHandler(key, menuItems) {
    console.log(key, menuItems)
    let itemSelected = menuItems.map((item, index) => {
        return {
            ...item,
            index: index
        }
    }).find((item) => {
        return item.selected
    })

    switch (key) {
        case 'w':
        case'ArrowUp':
            if (itemSelected) {
                menuItems[itemSelected.index].selected = false;
                if (menuItems[itemSelected.index - 1]) {
                    menuItems[itemSelected.index - 1].selected = true
                } else {
                    itemSelected = menuItems[menuItems.length - 1];
                    menuItems[menuItems.length - 1].selected = true;
                }
            } else {
                itemSelected = menuItems[0];
                menuItems[0].selected = true;
            }
            new Sound('assets/sounds/menu_select.wav').play()
            break;

        case 's':
        case'ArrowDown':

            if (itemSelected) {
                menuItems[itemSelected.index].selected = false;
                if (menuItems[itemSelected.index + 1]) {
                    menuItems[itemSelected.index + 1].selected = true
                } else {
                    itemSelected = menuItems[0];
                    menuItems[0].selected = true;
                }

            } else {
                itemSelected = menuItems[0];
                menuItems[0].selected = true;
            }
            new Sound('assets/sounds/menu_select.wav').play()

            break;
        case 'Enter':
        case'Return':
            let selected = menuItems.find((item) => item.selected);
            if (selected) {
                selected.action();
            }
            break;
        default:
    }

    return menuItems;
}

