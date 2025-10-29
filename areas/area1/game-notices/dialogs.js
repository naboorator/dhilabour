let notice = new GameNotice('Hello Stranger', 'Let me guess ha?<br> you want me to open hidden door for you dont you?')
notice.avatar = 'assets/images/peasant/south.png';
notice.addAction('Yes')
notice.addAction('No');


gameState.areas.area1.dialogs.welcome = notice;

const gameNotice1 = new GameNotice('I knew it!', 'Ok let it be, now leave me alone please.');
gameNotice1.avatar = 'assets/images/peasant/south.png';
gameNotice1.addAction('Bye');

gameState.areas.area1.dialogs.what = gameNotice1;
