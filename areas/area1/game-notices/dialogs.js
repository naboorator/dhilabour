const Area1Dialogs = {

    introDialog: () => {
        const notice = new GameNotice('Hello Antipatix!', 'where have you been all this time, I have been waiting for you. Listen I really need your help with finding some stuff.<br><br> Will you help me?');
        notice.avatar = './assets/images/peasant/south.png';
        notice.addAction('Yes');
        notice.addAction('No');
        return notice
    },

    firstTaskDialog: () => {
        const notice = new GameNotice('Oh.. so sweet', 'Listen travel to the south ofo here and meed Gavin. He is a .....');
        notice.avatar = './assets/images/peasant/south.png';
        notice.addAction('Ok Bye');
        return notice
    },

    firstTaskWaitingDialog: () => {
        const notice = new GameNotice('Back so Soon?', 'You already have my stuff?');
        notice.avatar = './assets/images/peasant/south.png';
        notice.addAction('Yes');
        notice.addAction('No');
        notice.addAction('what', 'What I need to do again?');
        return notice
    },

    doorLockedDialog: () => {
        const notice = new GameNotice('Oops, door are locked. ', 'I need to find a key to go trough here');
        notice.avatar = './assets/images/items/blue_door.png';
        notice.addAction('close');
        return notice;
    },

    doorUnLockedDialog: () => {
        const notice = new GameNotice('Yes!', 'It appears I have a correct key!');
        notice.avatar = './assets/images/items/blue_door.png';
        notice.addAction('unlock');
        notice.addAction('lock');
        return notice;
    }

}




