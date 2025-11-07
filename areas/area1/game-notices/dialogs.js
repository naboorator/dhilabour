let store = GameStore
let state = {...store.getState()};

let notice = new GameNotice('Hello Stranger', 'Let me guess ha?<br> you want me to open hidden door for you dont you?')
notice.avatar = './assets/images/peasant/south.png';
notice.addAction('Yes')
notice.addAction('No');


const gameNotice1 = new GameNotice('I knew it!', 'Ok let it be, now leave me alone please.');
gameNotice1.avatar = './assets/images/peasant/south.png';
gameNotice1.addAction('Bye');


const noticeBlueDoorLocked = new GameNotice('Damn!', 'It appears doors are locked');
noticeBlueDoorLocked.avatar = './assets/images/items/blue_door.png';
noticeBlueDoorLocked.addAction('close');


const noticeBlueDoorUnLocked = new GameNotice('Yes!', 'It appears I have a correct key!');
noticeBlueDoorUnLocked.avatar = './assets/images/items/blue_doors.png';
noticeBlueDoorUnLocked.addAction('unlock');
noticeBlueDoorUnLocked.addAction('lock');

store.changeStates(state, {
    ...state, areas: {
        ...state.areas,
        area1: {
            ...state.areas.area1,
            dialogs: {
                welcome: notice,
                what: gameNotice1,
                blueDoorLocked: noticeBlueDoorLocked,
                blueDoorCanBeUnLocked: noticeBlueDoorUnLocked
            }
        }
    }
})
