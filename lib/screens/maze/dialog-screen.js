class DialogScreeen extends BaseScreen {
    name = 'dialog-screen';

    html = `
           <style>
                         
                 
                 /* ===== Scroll-Themed Dialog ===== */
.dialog-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(20, 10, 0, 0.6); /* semi-transparent dark overlay */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.dialog-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(20, 10, 0, 0.6); /* semi-transparent dark overlay */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.dialog-container {
  background: #fdf5e6; /* parchment color */
  border: 3px solid #d2b48c;
  padding: 20px 30px;
  max-width: 600px;
  width: 80%;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  position: relative;
  background-image: radial-gradient(circle at top left, rgba(255, 255, 255, 0.3), transparent 70%), 
                    radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.1), transparent 70%), 
                    repeating-linear-gradient(0deg, #f5deb3 0px, #fdf5e6 3px, #f5deb3 6px);
  color: #3b2f2f;
  overflow: hidden;
}

/* Add curled paper effect */
.dialog-container::before,
.dialog-container::after {
  content: "";
  position: absolute;
  width: 50%;
  height: 20px;
  bottom: -10px;
  background: rgba(0, 0, 0, 0.15);
  filter: blur(5px);
  z-index: -1;
}
.dialog-container::before {
  left: 0;
  transform: rotate(-2deg);
}
.dialog-container::after {
  right: 0;
  transform: rotate(2deg);
}

/* Header */
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #c2a266;
  padding-bottom: 8px;
  margin-bottom: 15px;
}

.dialog-header h1 {
  font-size: 1.8rem;
  color: #5b4636;
  text-shadow: 1px 1px #f5e1a4;
  margin-bottom:0;
  padding-bottom: 0;
 
}

.dialog-header .dialog-avatar {
    width: 60px;
    height: 60px;
   
    vertical-align: baseline;
}

/* Icon close button (X) */
.dialog-header .icon {
  cursor: pointer;
  font-size: 1.2rem;
  background: #8b4513;
  color: #fdf5e6;
  padding: 3px 10px;
  border-radius: 50%;
  transition: all 0.3s ease;
}
.dialog-header .icon:hover {
  background: #a0522d;
  transform: scale(1.1);
}

/* Content */
.dialog-content {
  font-size: 1rem;
  text-align:left;  
  line-height: 1.6;
  color: #3b2f2f;
  margin-bottom: 20px;
  background: rgba(255, 250, 240, 0.7);
  padding: 15px;
  border-radius: 5px;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
}

/* Footer */
.dialog-footer {
  text-align: right;
}

.dialog-footer button {
  background: #c2a266;
  color: #3b2f2f;
  border: none;
  padding: 8px 20px;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  margin-left: 20px;
}
.dialog-footer button.selected {
  background: var(--primary-color);

}
.dialog-footer button:hover {
  background: #a8864c;
  transform: translateY(-2px);
}
            </style>
          <div class="dialog-screen" >
            <div class="dialog-container">
            

            <div class="dialog-header">
             
             <h1 style="margin-top:0">{{avatar}} {{title}}</h1>
             <span class="icon" onclick="closeScreen()">X</span>
            </div>
           
            <div class="dialog-content">
             {{content}}
            </div>
           
            <div class="dialog-footer">
               {{actions}}
            </div>
            </div>
          
          </div>
`
    data = {
        title: '',
        content: '',
        actions: {},
    };

    actionHtml = '<button class="{{selectedClass}}" onClick="dialogClose(\'{{action}}\')">{{label}}</button>';
    /**
     * @type GameNotice
     *
     */
    notice;


    /**
     *
     * @param game {Game}
     * @param notice {GameNotice}
     */
    constructor(game, notice) {
        super(game);
        this.notice = notice;
        this.data = {
            avatar: notice.avatar,
            title: notice.title,
            content: notice.content,
            actions: Object.keys(notice.actions).map(action => {
                return {
                    label: notice.actions[action] ?? action,
                    selected: false
                }
            }),
        }

        if (this.data.actions) {
            // First action is  preselected
            let firstAction = this.data.actions[0];
            firstAction.selected = true
        }
    }


    render() {
        if (this.updateScreen) {
            this.updateScreen = false;

            let output = this.html;

            if (this.data.avatar) {
                const imgAvatar = document.createElement('img');
                imgAvatar.src = this.data.avatar;
                imgAvatar.classList.add('dialog-avatar');
                output = output.replaceAll("{{avatar}}", imgAvatar.outerHTML);
            } else {
                output = output.replaceAll("{{avatar}}", '');
            }
            output = output.replaceAll("{{title}}", this.data.title);
            output = output.replaceAll("{{content}}", this.data.content);

            let actionsHtml = ''
            console.log('actions', this.data.actions);
            Object.keys(this.data.actions).forEach((action) => {

                actionsHtml += this.actionHtml.replaceAll('{{action}}', this.data.actions[action].label)
                    .replaceAll('{{label}}', this.data.actions[action].label)
                    .replaceAll('{{selectedClass}}', this.data.actions[action].selected ? 'selected' : '');
                //actionsHtml += '<button onclick="dialogClose(\'' + action + '\')">' + action + '</button>';
            })

            output = output.replaceAll("{{actions}}", actionsHtml);

            return output;
        }
    }

    dialogClose(action) {
        this.notice.onResolve(action);
    }

    handleUserInput(key, avatar) {
        this.menuItems = dialogScreenInputHandler(key, this.data.actions, this);
        this.updateScreen = true
    }


}

function dialogClose(action) {
    game.currentScreen.dialogClose(action)
}

function closeScreen() {
    game.currentScreen.dialogClose(null)
}

function dialogScreenInputHandler(key, menuItems, dialog) {
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
        case 'a':
        case'ArrowLeft':
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

        case 'd':
        case'ArrowRight':

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
                dialog.dialogClose(selected.label)
            }
            break;
        default:
    }

    return menuItems;
}


