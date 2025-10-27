//.Level.1.—.gentle.intro.(2.boxes)
// const level1 = `
// ########.####################
// #....e......#.........#.....#
// #.....b.#.####.#.....#...#..#
// #..######.#....#........##..#
// #...w..#.....#b..#####....S.#
// ###########.##....i..#......#
// #..t...#..#....i.....#......f
// #.b..###....#######..#t.p...#
// #..w..i...#..........#..ll.j#
// #############################
// `
// level1Config = () => {
//     return {
//         e: {
//             speed: 5,
//             movement: MovementTypes.randomList,
//             movements: [
//                 movementLeftRight,
//                 movementUpDown
//             ],
//         },
//         S:
//             {
//                 speed: 12,
//                 movement: MovementTypes.randomList,
//                 movements: [
//                     movementLeftRight
//                 ],
//                 switchTime: 5000,
//             },
//         i: {
//             item: DynamiteItem
//         },
//
//         t: {
//             item: GenericPickUpItem,
//             parameters: {
//                 name: 'heart-tile',
//                 callbackOnPickup: (gameBoardGrid, item) => {
//                     gameBoardGrid.game.playerLife = gameBoardGrid.game.playerLife + 1;
//                     gameBoardGrid.effects.addEffect(new JumpEffect(item, 20))
//                 }
//             }
//         },
//         f: {
//             item: WallItem,
//             parameters: {}
//         },
//
//         j: {
//             item: BaseTrigger,
//             parameters: {
//                 /**
//                  *
//                  * @param gameBoardGrid {GameBoardGrid}
//                  * @param item {BaseTrigger}
//                  */
//                 callbackOnPickup: (gameBoardGrid, item) => {
//                     const gameNotice = new GameNotice('Welcome stranger', 'Hello strange and welcome to my world. <br> Be careful its very dangerous. You will find many hidden trasures and many dangerous creatures.<br> Are you ready to start?')
//                     gameNotice.avatar = 'assets/images/golem/south.png';
//                     gameNotice.addAction('Yes')
//                     gameNotice.addAction('No')
//
//                     gameNotice.resolve((action) => {
//                         if (action === 'Yes') {
//                             const gameNotice1 = new GameNotice('What!!', 'You shall pay for this')
//
//                             let tiles = gameBoardGrid.findTileByChar('f');
//
//                             tiles.forEach((tile) => {
//                                 gameBoardGrid.movementResolver.forceMoveLeft(tile, 3)
//                             })
//
//                             gameNotice1.addAction('Ok');
//                             gameNotice1.resolve((action) => {
//
//                                 gameBoardGrid.game.closeCurrentScreen();
//                             });
//
//                             gameBoardGrid.game.closeCurrentScreen().setGameScreenAndPreserveCurrent(new DialogScreeen(gameBoardGrid.game, gameNotice1));
//
//                         } else {
//                             gameBoardGrid.game.closeCurrentScreen();
//                         }
//
//                     })
//                     gameBoardGrid.showNotice(item.position.y, item.position.y, gameNotice);
//                     gameBoardGrid.game.pause = true;
//                 }
//             }
//         }
//     }
// }
const levelX = `
######.#########
#.p.#.b.#...#.##
#.#.....b..w...#
#.#..##..#.##..#
.b..#...#...#...
#. #.w..#......#
#....#....#..l.#
######.#########
`


//.Level.2.—.corridors.(2.boxes)
const level2 = `
################
#...p....#.....#
#...###..#...l.#
#...b.......#..#
##.########.#. #
##.............#
################
.`

//.Level.3.—.first.forks.(3.boxes)
const level3 = `
#############.##
#..p...........#
#..........b...#
#......#l......#
#.....###..b...#
#.....l#l......#
#............b.#
#############.##
`

//.Level.4.—.U-turns.(3.boxes)
const level4 = `
################
#.....ll.p.....#
#..............#
w..............#
#......#.......#
################
#......#.......#
#..............w
#..............#
#.....bb.......#
#..............#
################
`

//.Level.5.—.side.rooms.(3.boxes)
level5Config = () => {
    return {
        e: {
            speed: 45,
            movement: MovementTypes.leftRight,
        },
        E: {
            speed: 30,
            movement: MovementTypes.upDown,
        },
    }
}
const level5 = `
################
#lllE..........#
#lll...........p
####...........#
#..............#
#####..e..######
#..............#
#..............#
#.....b........#
#.... b.b......#
#.....bbb......#
#####......#####
`

//.Level.6.—.gated.lanes.(3.boxes)
const level6 = `
################
#..p..##...ll..#
#..b..#........#
#.....#..b.....#
#..##########..#
#...l.....b....#
#..............#
################
`

//.Level.7.—.parking.&.pass-through.(4.boxes)
const level7 = `
################
#..p.....#...l.#
#..b...........#
#....###.#..b..#
#..l..#....###.#
#.....#..b.....#
#.......b......#
################
`

//.Level.8.—.two-stage.pushes.(4.boxes)
const level8 = `
################
#.p.....#..ll..#
#...b...#......#
#...#.###..b...#
#.l.#.....###..#
#...#..b....b..#
#..............#
################
`

//.Level.9.—.offset.goals.(4.boxes)
const level9 = `
################
#...p...##...l.#
#..b....#......#
#.......#..b...#
#.###...#...####
#...l.......b..#
#........b.....#
################
`

//.Level.10.—.tighter.hallways.(4.boxes)
const level10 = `
################
#.p...###...l..#
#...b...#......#
#.......#..b...#
#..###..###....#
#...l...b...b..#
#..............#
################
`

//.Level.11.—.ring.room.(5.boxes)
const level11 = `
################
#.p..###...l...#
#.b...#........#
#.....#..b.....#
#.###.#.###.####
#...l....b..b..#
#........l.....#
################
`

//.Level.12.—.staggered.blocks.(5.boxes)
const level12 = `
################
#.p.....#...l..#
#...b...#......#
#..###..###.b..#
#..l.......#...#
#...b...b..#...#
#........l..b..#
################
`

//.Level.13.—.center.churn.(5.boxes)
const level13 = `
################
#..p...##...l..#
#..b...#.......#
#......#..b....#
#.###..#..###..#
#..l..b...b..l.#
#........b.....#
################
`

//.Level.14.—.weaving.(5.boxes)
const level14 = `
################
#.p...###...l..#
#...b...#......#
#.......###.b..#
#..l..b...#....#
#...#..b..#....#
#.......l...b..#
################
`

//.Level.15.—.checkpoints.(5.boxes)
const level15 = `
################
#.p..##....l...#
#.b..#.........#
#....#..b......#
#.##########.b.#
#..l....b...l..#
#.........b....#
################
`

//.Level.16.—.split.wings.(5.boxes)
const level16 = `
################
#.p.....#...l..#
#...b...#......#
#.###.###..b...#
#...#...#...#..#
#.l...b...b.#..#
#.....l.....b..#
################
`

//.Level.17.—.funnel.(5.boxes)
const level17 = `
################
#.p...###...l..#
#...b...#......#
#...#.b.#..b...#
#.l.#...#.###..#
#...#..b...b.l.#
#..........l...#
################
`

//.Level.18.—.criss-cross.(5.boxes)
const level18 = `
################
#.p..#...#...l.#
#.b..#.b.#.....#
#....###.###...#
#..l...b...b...#
#......#...l...#
#..........l...#
################
`

//.Level.19.—.cascading.rooms.(5.boxes)
const level19 = `
################
#.p...##....l..#
#...b..#.......#
#......#..b....#
#.###..##..###.#
#.l..b...b...l.#
#.......b......#
################
`

//.Level.20.—.finale:.tight.&.tactical.(5.boxes)
const level20 = `
################
#.p...###...l..#
#...b...#..b...#
#..###..#..###.#
#.l...b....b...#
#...#...l...b..#
#.......l......#
################
`
